"use client";
import { useEffect, useRef, useState } from 'react';
import { ArrowUp, RotateCcw } from 'lucide-react';
import { answerQuestion, SUGGESTED_QUESTIONS } from '@/lib/ask-engine';
import { AskError, isLive, streamAnswer, type ChatMessage } from '@/lib/ask-client';

type Turn = {
  question: string;
  answer: string;
  status: 'streaming' | 'done';
  source: 'claude' | 'local';
  note?: string;
};

const MAX_LEN = 600;

export default function AskSection({ firstName }: { firstName: string }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const busy = turns.some((t) => t.status === 'streaming');
  const logRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function update(index: number, patch: Partial<Turn> | ((t: Turn) => Partial<Turn>)) {
    setTurns((prev) => {
      const next = [...prev];
      const cur = next[index];
      if (!cur) return prev;
      next[index] = { ...cur, ...(typeof patch === 'function' ? patch(cur) : patch) };
      return next;
    });
  }

  async function ask(raw: string) {
    const question = raw.trim().slice(0, MAX_LEN);
    if (!question || busy) return;
    setInput('');
    const index = turns.length;

    if (!isLive) {
      setTurns((prev) => [...prev, { question, answer: answerQuestion(question), status: 'done', source: 'local' }]);
      return;
    }

    setTurns((prev) => [...prev, { question, answer: '', status: 'streaming', source: 'claude' }]);

    const history: ChatMessage[] = turns
      .filter((t) => t.source === 'claude' && t.answer)
      .slice(-5)
      .flatMap((t) => [
        { role: 'user' as const, content: t.question },
        { role: 'assistant' as const, content: t.answer },
      ]);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      await streamAnswer([...history, { role: 'user', content: question }], (chunk) => {
        update(index, (t) => ({ answer: t.answer + chunk }));
      }, controller.signal);
      update(index, (t) =>
        t.answer.trim()
          ? { status: 'done' }
          : { status: 'done', source: 'local', answer: answerQuestion(question), note: 'Claude returned an empty reply, so this answer comes from the resume data.' },
      );
    } catch (err) {
      if (controller.signal.aborted) return;
      const limited = err instanceof AskError && err.status === 429;
      update(index, {
        status: 'done',
        source: 'local',
        answer: answerQuestion(question),
        note: limited
          ? 'Too many questions in a short time, so this answer comes from the resume data. Try Claude again in a minute.'
          : 'Claude could not be reached, so this answer comes from the resume data.',
      });
    }
  }

  function reset() {
    abortRef.current?.abort();
    setTurns([]);
  }

  return (
    <section id="ask" className="scroll-mt-16 border-y border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:gap-16 md:py-24">
        <div>
          <h2 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">Ask about my work</h2>
          <p className="mt-4 max-w-[40ch] text-muted-foreground leading-relaxed">
            {isLive
              ? `Claude answers from my resume and project history. Ask the questions you would ask in a first interview.`
              : `Answers come from my resume and project history. Ask the questions you would ask in a first interview.`}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-teal' : 'bg-muted-foreground/50'}`} aria-hidden />
            {isLive ? 'Powered by Claude, from Anthropic' : 'Offline answers'}
          </p>
        </div>

        <div className="flex min-w-0 flex-col">
          <div
            ref={logRef}
            aria-live="polite"
            className="hide-scrollbar max-h-[460px] min-h-[220px] overflow-y-auto"
          >
            {turns.length === 0 ? (
              <div>
                <p className="text-sm text-muted-foreground">Try one of these</p>
                <ul className="mt-3 divide-y divide-border border-y border-border">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <li key={q}>
                      <button
                        type="button"
                        onClick={() => ask(q)}
                        className="font-display w-full py-3.5 text-left text-xl sm:text-2xl hover:text-primary transition-colors"
                      >
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ol className="space-y-8">
                {turns.map((t, i) => (
                  <li key={i}>
                    <p className="text-sm font-medium text-muted-foreground">{t.question}</p>
                    <div className="font-display mt-2 whitespace-pre-line text-xl leading-[1.5] text-pretty sm:text-[1.375rem]">
                      {t.answer}
                      {t.status === 'streaming' && (
                        <span
                          aria-hidden
                          className="animate-caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.15em] bg-primary"
                        />
                      )}
                      {t.status === 'streaming' && !t.answer && <span className="sr-only">Claude is writing an answer</span>}
                    </div>
                    {t.note && <p className="mt-2 text-xs text-muted-foreground">{t.note}</p>}
                  </li>
                ))}
              </ol>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="mt-8 flex items-center gap-2 rounded-full border border-input bg-background py-1.5 pl-5 pr-1.5 focus-within:border-primary transition-colors"
          >
            <label htmlFor="ask-input" className="sr-only">
              Your question about {firstName}
            </label>
            <input
              id="ask-input"
              value={input}
              maxLength={MAX_LEN}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask anything about ${firstName}'s work`}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent py-1.5 text-base placeholder:text-muted-foreground focus:outline-none"
            />
            {turns.length > 0 && !busy && (
              <button
                type="button"
                onClick={reset}
                aria-label="Clear conversation"
                title="Clear conversation"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Ask"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
