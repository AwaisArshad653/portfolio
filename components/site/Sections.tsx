import { ExternalLink } from 'lucide-react';
import { withBasePath } from '@/lib/utils';
import { bullets, contactLinks, data, groupedSkills, splitName, techLabel } from '@/lib/content';

function SectionHeading({ id, title, children }: { id: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-10 md:mb-14">
      <h2 id={`${id}-title`} className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
        {title}
      </h2>
      {children && <p className="mt-3 max-w-[60ch] text-muted-foreground">{children}</p>}
    </div>
  );
}

function formatRange(start?: string | null, end?: string | null) {
  if (!start && !end) return '';
  if (!end) return start ?? '';
  return `${start} – ${end}`;
}

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <SectionHeading id="experience" title="Experience" />
        <ol className="border-t border-border">
          {data.workExperience.map((job) => (
            <li
              key={`${job.company}-${job.start_date}`}
              className="grid gap-3 border-b border-border py-10 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10"
            >
              <div className="text-sm text-muted-foreground">
                <p className="tabular-nums">{formatRange(job.start_date, job.end_date)}</p>
                {job.location && <p className="mt-1">{job.location}</p>}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-2xl leading-snug sm:text-[1.75rem]">{job.position}</h3>
                <p className="mt-1 font-medium text-primary">{job.company}</p>
                <ul className="mt-5 max-w-[68ch] space-y-2.5 text-[0.975rem] leading-relaxed text-muted-foreground">
                  {bullets(job.description).map((b) => (
                    <li key={b} className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-muted-foreground/60">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-16 bg-secondary/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <SectionHeading id="projects" title="Selected projects">
          Production platforms I built or extended, most of them still live.
        </SectionHeading>
        <ul className="grid gap-x-10 gap-y-16 md:grid-cols-2">
          {data.projects.map((project, i) => {
            const { title, subtitle } = splitName(project.name);
            const points = bullets(project.description);
            const site = project.custom_links?.[0];
            const tech = Array.from(new Set(project.technologies.map((t) => techLabel(t.name))));
            return (
              <li key={project.name} className="flex min-w-0 flex-col">
                {project.picUrl && (
                  <div className="overflow-hidden rounded-xl border border-border bg-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={withBasePath(project.picUrl)}
                      alt={`Screenshot of ${title}`}
                      loading={i < 2 ? 'eager' : 'lazy'}
                      className="aspect-[16/8] w-full object-cover object-top"
                    />
                  </div>
                )}
                <h3 className="font-display mt-6 text-[1.75rem] leading-tight">{title}</h3>
                {subtitle && <p className="mt-1 text-sm font-medium text-muted-foreground">{subtitle}</p>}
                <ul className="mt-4 space-y-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {points.slice(0, 3).map((b) => (
                    <li key={b} className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-muted-foreground/60">
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-5">
                  <p className="text-sm text-foreground/80">{tech.join(', ')}</p>
                  {site && (
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Visit site
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      <span className="sr-only">(opens {title} in a new tab)</span>
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function Skills() {
  const groups = groupedSkills();
  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <SectionHeading id="skills" title="Skills" />
        <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div key={g.name} className="border-t border-foreground/80 pt-4">
              <dt className="font-medium">{g.name}</dt>
              <dd className="mt-3 text-muted-foreground leading-relaxed">{g.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28">
        <h2 id="education-title" className="font-display text-3xl tracking-tight sm:text-4xl">
          Education
        </h2>
        <ul className="mt-8 border-t border-border">
          {data.education.map((e) => (
            <li
              key={e.degree}
              className="grid gap-1 border-b border-border py-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10"
            >
              <p className="text-sm tabular-nums text-muted-foreground">{formatRange(e.start_year, e.end_year)}</p>
              <div>
                <p className="font-display text-xl leading-snug">{e.degree}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {e.university}
                  {e.location ? `, ${e.location}` : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Footer() {
  const links = contactLinks();
  const email = links.find((l) => l.kind === 'email');
  const phone = links.find((l) => l.kind === 'phone');
  const profiles = links.filter((l) => l.external);
  return (
    <footer id="contact" className="bg-panel text-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24">
        <h2 className="font-display text-5xl leading-none tracking-tight sm:text-6xl">Let&apos;s talk</h2>
        <p className="mt-5 max-w-[48ch] text-white/80 leading-relaxed">
          Open to senior engineering roles and freelance projects. Email is the fastest way to reach me.
        </p>
        <div className="mt-10 flex flex-col gap-3">
          {email && (
            <a
              href={email.href}
              className="font-display w-fit break-all text-2xl underline decoration-white/40 underline-offset-[6px] hover:decoration-white sm:text-4xl"
            >
              {email.display}
            </a>
          )}
          {phone && (
            <a href={phone.href} className="font-display w-fit text-2xl text-white/90 hover:text-white sm:text-3xl">
              {phone.display}
            </a>
          )}
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-6 text-sm text-white/70">
          <p>© {new Date().getFullYear()} {data.personal.full_name}</p>
          <ul className="flex gap-6">
            {profiles.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
