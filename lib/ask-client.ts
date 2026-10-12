/**
 * Client for the Claude-backed assistant.
 *
 * The site is static (GitHub Pages), so the Anthropic API key lives in a
 * Cloudflare Worker (see /worker). The worker URL is baked in at build time
 * from NEXT_PUBLIC_ASK_API_URL. When it is not set, or a request fails, the
 * UI falls back to the local rule-based answers in ask-engine.ts.
 */
export const ASK_API_URL = (process.env.NEXT_PUBLIC_ASK_API_URL || '').trim()

export const isLive = ASK_API_URL.length > 0

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export class AskError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
  }
}

/** Streams the assistant's reply as plain-text chunks. */
export async function streamAnswer(
  messages: ChatMessage[],
  onText: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(ASK_API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  })
  if (!res.ok || !res.body) {
    let msg = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body?.error) msg = body.error
    } catch {
      /* non-JSON error body */
    }
    throw new AskError(msg, res.status)
  }
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value, { stream: true })
    if (text) onText(text)
  }
}
