"use client";
import { Mail, FileDown } from "lucide-react";
import { renderIcon } from "@/lib/hybrid-icon-resolver";
import { withBasePath } from "@/lib/utils";
import { MarkdownRenderer } from './MarkdownRenderer';
import HeroFieldStatic from './HeroFieldStatic';

interface StaticPersonalData {
  personal: {
    full_name: string | null
    title: string | null
    about_me: string | null
    location: string | null
    avatarUrl: string | null
    cvUrl: string | null
    custom_links: Array<{
      icon: string
      title: string
      url: string
    }>
  }
}

function getInitials(name: string | null) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function InitialsAvatar({ name }: { name: string | null }) {
  return (
    <div
      className="relative mx-auto sm:mx-0 size-24 sm:size-28 rounded-2xl shrink-0 flex items-center justify-center overflow-hidden ring-1 ring-border shadow-lg bg-gradient-to-br from-primary via-primary/80 to-mint"
      role="img"
      aria-label={`${name ?? 'Profile'} avatar`}
    >
      <div aria-hidden className="absolute inset-0 bg-grid opacity-20" />
      <span className="relative font-display text-3xl sm:text-4xl font-bold text-primary-foreground tracking-tight">
        {getInitials(name)}
      </span>
      <span aria-hidden className="absolute top-1.5 left-1.5 h-2 w-2 border-t border-l border-primary-foreground/50" />
      <span aria-hidden className="absolute bottom-1.5 right-1.5 h-2 w-2 border-b border-r border-primary-foreground/50" />
    </div>
  );
}

export default function MinimalProfileStatic({ personal }: StaticPersonalData) {
  return (
    <header className="mb-24">
      <div className="rounded-xl border border-border bg-card/70 backdrop-blur overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.2)] relative">
        <HeroFieldStatic />
        {/* Terminal chrome */}
        <div className="relative flex items-center gap-2 px-4 py-3 border-b border-border bg-background/40">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-mint/70" />
          <span className="ml-3 font-mono text-xs text-muted-foreground truncate">
            awais@portfolio:~
          </span>
          <span className="ml-auto font-mono text-[11px] px-1.5 py-0.5 rounded border text-mint border-mint/40">
            GET /awais-arshad · 200
          </span>
        </div>

        <div className="relative p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
            <InitialsAvatar name={personal.full_name} />
            <div className="text-center sm:text-left">
              {personal.title && (
                <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-primary mb-2">
                  {personal.title}
                </p>
              )}
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-2">
                {personal.full_name}
              </h1>
              {personal.location && (
                <p className="font-mono text-sm text-muted-foreground">{personal.location}</p>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="font-mono text-xs text-mint mb-2">
                <span className="text-primary">$</span> whoami
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                {personal.custom_links?.find(link => link.icon === 'email') && (
                  <a
                    href={`mailto:${personal.custom_links.find(link => link.icon === 'email')?.url}`}
                    aria-label="Email"
                    className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-primary hover:border-primary/60 hover:-translate-y-0.5 transition-all"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </a>
                )}
                {personal.cvUrl && (
                  <a
                    href={withBasePath(personal.cvUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download CV"
                    className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-primary hover:border-primary/60 hover:-translate-y-0.5 transition-all"
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    Resume
                  </a>
                )}
                {personal.custom_links?.filter(link => link.icon !== 'email').map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.title}
                    className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-primary hover:border-primary/60 hover:-translate-y-0.5 transition-all"
                  >
                    {renderIcon(link.icon)}
                    {link.title}
                  </a>
                ))}
              </div>
            </div>

            {personal.about_me && (
              <div>
                <p className="font-mono text-xs text-mint mb-2">
                  <span className="text-primary">$</span> cat about.md
                </p>
                <MarkdownRenderer content={personal.about_me} className="text-muted-foreground leading-relaxed max-w-3xl" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
