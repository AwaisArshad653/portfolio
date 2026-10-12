import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

let mod;
before(async () => {
  // Bundle like wrangler does (JSON import inlined), then import the result.
  const here = dirname(fileURLToPath(import.meta.url));
  const out = join(mkdtempSync(join(tmpdir(), 'ask-')), 'worker.mjs');
  await build({ entryPoints: [join(here, '../src/index.js')], bundle: true, format: 'esm', platform: 'neutral', outfile: out, logLevel: 'silent' });
  mod = await import(pathToFileURL(out).href);
});

const env = { ALLOWED_ORIGINS: 'https://awaisarshad653.github.io,http://localhost:3000', ANTHROPIC_API_KEY: 'test-key', MODEL: 'claude-haiku-5-5' };
const ORIGIN = 'https://awaisarshad653.github.io';

function sse(events) {
  return events.map((e) => `event: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`).join('');
}

function streamOf(text, pieces = 7) {
  const bytes = new TextEncoder().encode(text);
  const size = Math.ceil(bytes.length / pieces);
  return new ReadableStream({
    start(c) {
      for (let i = 0; i < bytes.length; i += size) c.enqueue(bytes.slice(i, i + size));
      c.close();
    },
  });
}

async function readAll(stream) {
  return await new Response(stream).text();
}

test('sanitizeMessages accepts alternating turns ending with user', () => {
  const m = mod.sanitizeMessages([
    { role: 'user', content: ' hi ' },
    { role: 'assistant', content: 'hello' },
    { role: 'user', content: 'skills?' },
  ]);
  assert.deepEqual(m.map((x) => x.role), ['user', 'assistant', 'user']);
  assert.equal(m[0].content, 'hi');
});

test('sanitizeMessages rejects bad shapes', () => {
  assert.equal(mod.sanitizeMessages(null), null);
  assert.equal(mod.sanitizeMessages([]), null);
  assert.equal(mod.sanitizeMessages([{ role: 'system', content: 'x' }]), null);
  assert.equal(mod.sanitizeMessages([{ role: 'user', content: 'a' }, { role: 'user', content: 'b' }]), null);
  assert.equal(mod.sanitizeMessages([{ role: 'user', content: 'a' }, { role: 'assistant', content: 'b' }]), null);
  assert.equal(mod.sanitizeMessages([{ role: 'user', content: '   ' }]), null);
});

test('sanitizeMessages truncates long input and keeps only recent turns', () => {
  const long = 'x'.repeat(5000);
  const msgs = [];
  for (let i = 0; i < 20; i++) msgs.push({ role: i % 2 ? 'assistant' : 'user', content: `m${i}` });
  msgs.push({ role: 'user', content: long });
  const out = mod.sanitizeMessages(msgs);
  assert.ok(out.length <= 11);
  assert.equal(out[0].role, 'user');
  assert.equal(out.at(-1).content.length, 600);
});

test('corsHeaders only allows listed origins', () => {
  assert.equal(mod.corsHeaders('https://evil.example', env), null);
  assert.equal(mod.corsHeaders('', env), null);
  assert.equal(mod.corsHeaders(ORIGIN, env)['Access-Control-Allow-Origin'], ORIGIN);
});

test('sseToText extracts text deltas across chunk boundaries', async () => {
  const body = sse([
    { type: 'message_start', message: {} },
    { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } },
    { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'Hello ' } },
    { type: 'ping' },
    { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'from “Claude” ✓' } },
    { type: 'content_block_stop', index: 0 },
    { type: 'message_stop' },
  ]);
  for (const pieces of [1, 3, 17, 200]) {
    const text = await readAll(mod.sseToText(streamOf(body, pieces)));
    assert.equal(text, 'Hello from “Claude” ✓');
  }
});

test('system prompt carries the portfolio facts', () => {
  const p = mod.buildSystemPrompt({
    personal: { full_name: 'Awais Arshad', title: 'Senior Software Engineer', location: 'Lahore', about_me: 'About.', custom_links: [{ icon: 'email', url: 'a@b.c' }, { icon: 'phone', title: '+92 1', url: 'tel:+921' }] },
    workExperience: [{ position: 'SE', company: 'Techlio', start_date: '2025', end_date: 'Present', description: '• Did things' }],
    projects: [], education: [], skills: [{ name: 'Docker' }],
  });
  for (const s of ['Awais Arshad', 'a@b.c', '+92 1', 'Techlio', 'Did things', 'Docker']) assert.ok(p.includes(s), s);
});

test('fetch handler: rejects unknown origins and preflights correctly', async () => {
  const w = mod.default;
  let r = await w.fetch(new Request('https://w.dev/', { method: 'POST', headers: { Origin: 'https://evil.example' }, body: '{}' }), env);
  assert.equal(r.status, 403);
  r = await w.fetch(new Request('https://w.dev/', { method: 'OPTIONS', headers: { Origin: ORIGIN } }), env);
  assert.equal(r.status, 204);
  assert.equal(r.headers.get('access-control-allow-origin'), ORIGIN);
});

test('fetch handler: 503 without key, 400 on bad body, 429 when limited', async () => {
  const w = mod.default;
  const req = (body) => new Request('https://w.dev/', { method: 'POST', headers: { Origin: ORIGIN, 'content-type': 'application/json' }, body });
  let r = await w.fetch(req('{"messages":[{"role":"user","content":"hi"}]}'), { ...env, ANTHROPIC_API_KEY: '' });
  assert.equal(r.status, 503);
  r = await w.fetch(req('not json'), env);
  assert.equal(r.status, 400);
  r = await w.fetch(req('{"messages":"x"}'), env);
  assert.equal(r.status, 400);
  r = await w.fetch(req('{"messages":[{"role":"user","content":"hi"}]}'), { ...env, ASK_LIMITER: { limit: async () => ({ success: false }) } });
  assert.equal(r.status, 429);
});

test('fetch handler: calls Anthropic correctly and streams plain text', async () => {
  const w = mod.default;
  const realFetch = globalThis.fetch;
  let captured;
  globalThis.fetch = async (url, init) => {
    captured = { url, init, body: JSON.parse(init.body) };
    return new Response(
      streamOf(sse([
        { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'He uses ' } },
        { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'Docker.' } },
        { type: 'message_stop' },
      ])),
      { status: 200, headers: { 'content-type': 'text/event-stream' } },
    );
  };
  try {
    const r = await w.fetch(
      new Request('https://w.dev/', {
        method: 'POST',
        headers: { Origin: ORIGIN, 'content-type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'Does he know Docker?' }] }),
      }),
      { ...env, ASK_LIMITER: { limit: async () => ({ success: true }) } },
    );
    assert.equal(r.status, 200);
    assert.equal(r.headers.get('access-control-allow-origin'), ORIGIN);
    assert.equal(await r.text(), 'He uses Docker.');
    assert.equal(captured.url, 'https://api.anthropic.com/v1/messages');
    assert.equal(captured.init.headers['x-api-key'], 'test-key');
    assert.equal(captured.init.headers['anthropic-version'], '2023-06-01');
    assert.equal(captured.body.model, 'claude-haiku-5-5');
    assert.equal(captured.body.stream, true);
    assert.deepEqual(captured.body.thinking, { type: 'disabled' });
    assert.ok(captured.body.system.includes('Awais Arshad'));
    assert.deepEqual(captured.body.messages, [{ role: 'user', content: 'Does he know Docker?' }]);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test('fetch handler: upstream failure becomes a clean 502 without leaking details', async () => {
  const w = mod.default;
  const realFetch = globalThis.fetch;
  const realErr = console.error;
  console.error = () => {};
  globalThis.fetch = async () => new Response('{"error":{"message":"invalid x-api-key"}}', { status: 401 });
  try {
    const r = await w.fetch(
      new Request('https://w.dev/', { method: 'POST', headers: { Origin: ORIGIN }, body: JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] }) }),
      env,
    );
    assert.equal(r.status, 502);
    assert.ok(!(await r.text()).includes('x-api-key'));
  } finally {
    globalThis.fetch = realFetch;
    console.error = realErr;
  }
});
