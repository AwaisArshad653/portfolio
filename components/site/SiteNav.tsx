import ThemeToggle from './ThemeToggle';

const LINKS = [
  { label: 'Ask', href: '#ask' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
];

export default function SiteNav({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="font-display text-lg font-medium tracking-tight">
          {name}
        </a>
        <nav aria-label="Sections" className="flex items-center gap-0.5 sm:gap-2">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className={`rounded-full px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors ${
                i > 1 ? 'hidden sm:inline-block' : ''
              }`}
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
