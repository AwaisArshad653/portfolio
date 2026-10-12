import { FileDown, Mail, Phone } from 'lucide-react';
import { renderIcon } from '@/lib/hybrid-icon-resolver';
import { withBasePath } from '@/lib/utils';
import { contactLinks, data } from '@/lib/content';

const STATEMENT =
  'I design, build and scale web platforms end to end — event management, ticketing, B2B marketplaces and scientific data systems. Six years of shipping production software, from database schema to the screen people use.';

export default function Hero() {
  const p = data.personal;
  const links = contactLinks();
  const email = links.find((l) => l.kind === 'email');
  const phone = links.find((l) => l.kind === 'phone');
  const profiles = links.filter((l) => l.external);

  return (
    <section id="top" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-16 md:grid-cols-[minmax(0,1fr)_300px] md:items-end md:gap-14 md:pb-24 md:pt-20 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="order-2 md:order-1">
          <h1 className="font-display text-[clamp(3.25rem,10vw,7rem)] font-normal leading-[0.92] tracking-[-0.03em]">
            {p.full_name}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            {p.title} in {p.location}
          </p>
          <p className="font-display mt-8 max-w-[36ch] text-[1.5rem] leading-[1.35] text-pretty sm:text-[1.75rem]">
            {STATEMENT}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {email && (
              <a
                href={email.href}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Mail className="h-4 w-4" />
                Email me
              </a>
            )}
            {p.cvUrl && (
              <a
                href={withBasePath(p.cvUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium hover:border-foreground/50 transition-colors"
              >
                <FileDown className="h-4 w-4" />
                View resume
              </a>
            )}
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {phone && (
              <li>
                <a href={phone.href} className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
                  <Phone className="h-4 w-4" />
                  {phone.display}
                </a>
              </li>
            )}
            {profiles.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  {renderIcon(l.kind, 'h-4 w-4')}
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {p.avatarUrl && (
          <figure className="order-1 md:order-2">
            <div className="relative aspect-[4/5] w-48 overflow-hidden rounded-[2rem] bg-panel sm:w-64 md:w-full">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 50% 50%, transparent 38%, rgba(255,255,255,.9) 39%, transparent 41%), radial-gradient(circle at 50% 50%, transparent 58%, rgba(255,255,255,.7) 59%, transparent 61%)',
                  backgroundSize: '72px 72px',
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={withBasePath(p.avatarUrl)}
                alt={`Portrait of ${p.full_name}`}
                className="absolute inset-x-0 bottom-0 mx-auto h-[92%] w-auto max-w-none object-contain object-bottom"
              />
            </div>
          </figure>
        )}
      </div>
    </section>
  );
}
