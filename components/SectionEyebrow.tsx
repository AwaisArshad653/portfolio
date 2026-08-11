export function SectionEyebrow({ method, path, note }: { method: string; path: string; note?: string }) {
  const methodColor = method === 'POST' ? 'text-mint border-mint/40' : 'text-primary border-primary/40';
  return (
    <div className="flex items-center gap-2 mb-3 font-mono text-xs">
      <span className={`px-1.5 py-0.5 rounded border ${methodColor} font-semibold tracking-wide`}>{method}</span>
      <span className="text-muted-foreground">{path}</span>
      {note && <span className="text-muted-foreground/60 ml-1">— {note}</span>}
    </div>
  );
}
