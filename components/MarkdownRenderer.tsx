"use client";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { normalizeMarkdown } from '@/lib/markdown-utils';
interface MarkdownRendererProps {
  content: string;
  className?: string;
}
export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
        p: ({ node, ...props }) => (
          <p className="text-muted-foreground leading-relaxed mb-2 last:mb-0" {...props} />
        ),
        strong: ({ node, ...props }) => (
          <strong className="font-semibold text-foreground" {...props} />
        ),
        em: ({ node, ...props }) => (
          <em className="italic" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-outside space-y-1 my-2 ml-4" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-outside space-y-1 my-2 ml-5" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="text-muted-foreground" {...props} />
        ),
        h1: ({ node, ...props }) => (
          <h1 className="text-xl font-bold text-foreground mt-4 mb-2 first:mt-0" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-lg font-semibold text-foreground mt-3 mb-2 first:mt-0" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-base font-semibold text-foreground mt-2 mb-1 first:mt-0" {...props} />
        ),
        }}
      >
        {normalizeMarkdown(content)}
      </ReactMarkdown>
    </div>
  );
}
