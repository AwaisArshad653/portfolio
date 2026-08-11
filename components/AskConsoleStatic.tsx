"use client";
import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { answerQuestion, SUGGESTED_QUESTIONS } from '@/lib/ask-engine';
import { SectionEyebrow } from './SectionEyebrow';

type Turn = {
  question: string;
  answer: string;
  typed: string;
  done: boolean;
};

export default function AskConsoleStatic() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns]);

  // Typewriter reveal for the most recent, not-yet-finished answer
  useEffect(() => {
    const lastIndex = turns.length - 1;
    if (lastIndex < 0) return;
    const last = turns[lastIndex];
    if (last.done) return;

    if (reducedMotion.current) {
      setTurns((prev) => {
        const next = [...prev];
        next[lastIndex] = { ...last, typed: last.answer, done: true };
        return next;
      });
      return;
    }

    if (last.typed.length >= last.answer.length) {
      const t = setTimeout(() => {
        setTurns((prev) => {
          const next = [...prev];
          next[lastIndex] = { ...last, done: true };
          return next;
        });
      }, 100);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setTurns((prev) => {
        const next = [...prev];
        next[lastIndex] = { ...last, typed: last.answer.slice(0, last.typed.length + 2) };
        return next;
      });
    }, 12);
    return () => clearTimeout(t);
  }, [turns]);

  function ask(question: string) {
    const q = question.trim();
    if (!q) return;
    const answer = answerQuestion(q);
    setTurns((prev) => [...prev, { question: q, answer, typed: '', done: false }]);
    setInput('');
  }

  return (
    <section id="ask" className="mb-28 scroll-mt-24">
      <SectionEyebrow method="POST" path="/ask" note="live · client-side" />
      <div className="rounded-xl border border-border bg-card/70 backdrop-blur overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.2)]">
        {/* Terminal chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background/40">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-mint/70" />
          <span className="ml-3 font-mono text-xs text-muted-foreground truncate">
            awais@portfolio:~/ask
          </span>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-mint">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse-dot" />
            online
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <p className="font-mono text-xs text-muted-foreground mb-4">
            // Ask about his experience, skills, or projects — answered instantly from his resume data, no server involved.
          </p>

          {/* Suggested chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {SUGGESTED_QUESTIONS.map((sq) => (
              <button
                key={sq}
                onClick={() => ask(sq)}
                className="font-mono text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Conversation */}
          <div
            ref={scrollRef}
            className="max-h-[360px] overflow-y-auto space-y-4 mb-4 pr-1 hide-scrollbar"
          >
            {turns.length === 0 && (
              <div className="rounded-md border border-border bg-background/40 p-3 font-mono text-sm text-muted-foreground">
                <span className="text-mint">$</span> Hi, I&apos;m a static assistant built from Awais&apos;s
                portfolio data. Ask me anything about his experience, skills, or how to reach him.
              </div>
            )}
            {turns.map((t, i) => (
              <div key={i} className="space-y-2">
                <div className="font-mono text-sm text-foreground">
                  <span className="text-primary">&gt;</span> {t.question}
                </div>
                <div className="rounded-md border border-border bg-background/40 p-3 font-mono text-sm text-muted-foreground whitespace-pre-line">
                  {t.typed}
                  {!t.done && <span className="inline-block w-1.5 h-4 bg-primary/80 ml-0.5 align-middle animate-caret" />}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 border-t border-border pt-4"
          >
            <span className="font-mono text-primary">$</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about Awais..."
              aria-label="Ask a question about Awais"
              className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send question"
              className="p-2 rounded-md text-primary hover:bg-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
