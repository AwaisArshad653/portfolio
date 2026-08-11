import MinimalProfileStatic from '@/components/MinimalProfileStatic'
import OrbitingCirclesStatic from '@/components/OrbitingCirclesStatic'
import ThreeDCardStatic from '@/components/ThreeDCardStatic'
import CustomSectionCardStatic from '@/components/CustomSectionCardStatic'
import AskConsoleStatic from '@/components/AskConsoleStatic'
import portfolioData from '@/data/portfolio.json'

const NAV = [
  { label: 'experience', href: '#custom-work-experience' },
  { label: 'education', href: '#custom-education' },
  { label: 'projects', href: '#projects' },
  { label: 'skills', href: '#skills' },
  { label: 'ask', href: '#ask' },
]

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)] opacity-[0.4]" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/10 via-transparent to-mint/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-primary/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-gradient-to-tl from-amber/10 via-transparent to-transparent blur-3xl" />
      </div>

      <nav className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur">
        <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-mono text-sm text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse-dot" />
            awaisarshad.dev
          </a>
          <div className="hidden sm:flex items-center gap-5">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                /{item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div id="top" className="container mx-auto max-w-5xl px-4 py-12 relative scroll-mt-24">
        <MinimalProfileStatic personal={portfolioData.personal} />

        <AskConsoleStatic />

        {portfolioData.workExperience && <CustomSectionCardStatic section={{
          section_name: "Work Experience",
          method: "GET",
          path: "/experience",
          layout_type: "card",
          items: portfolioData.workExperience.map((exp, index) => {
            const dateStr = `${exp.start_date || ''} - ${exp.end_date || ''}`.trim();
            return {
            primaryTitle: exp.company ?? undefined,
            secondaryTitle: exp.position ?? undefined,
            dateInfo: dateStr === '-' ? undefined : dateStr || undefined,
            location: exp.location ?? undefined,
            description: exp.description ?? undefined,
            logoUrl: exp.logoUrl ?? undefined,
            customLinks: exp.custom_links
          }})
        }} />}

        {portfolioData.education && <CustomSectionCardStatic section={{
          section_name: "Education",
          method: "GET",
          path: "/education",
          layout_type: "card",
          items: portfolioData.education.map((edu, index) => {
            const dateStr = `${edu.start_year || ''} - ${edu.end_year || ''}`.trim();
            return {
            primaryTitle: edu.university ?? undefined,
            secondaryTitle: edu.degree ?? undefined,
            dateInfo: dateStr === '-' ? undefined : dateStr || undefined,
            location: edu.location ?? undefined,
            description: edu.description ?? undefined,
            logoUrl: edu.logoUrl ?? undefined,
            customLinks: edu.custom_links
          }})
        }} />}

        {portfolioData.projects && <ThreeDCardStatic projects={portfolioData.projects} />}
        {portfolioData.skills && <OrbitingCirclesStatic skills={portfolioData.skills} />}

        <footer className="border-t border-border pt-8 pb-4 text-center">
          <p className="font-mono text-[11px] text-muted-foreground/70">
            // built with Next.js · deployed via GitHub Actions · status: 200 OK
          </p>
        </footer>
      </div>
    </main>
  )
}
