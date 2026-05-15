import MinimalProfileStatic from '@/components/MinimalProfileStatic'
import OrbitingCirclesStatic from '@/components/OrbitingCirclesStatic'
import ThreeDCardStatic from '@/components/ThreeDCardStatic'
import CustomSectionCardStatic from '@/components/CustomSectionCardStatic'
import CustomSectionListStatic from '@/components/CustomSectionListStatic'
import CustomSectionTimelineStatic from '@/components/CustomSectionTimelineStatic'
import portfolioData from '@/data/portfolio.json'

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/15 via-transparent to-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-primary/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-gradient-to-tl from-primary/10 via-transparent to-transparent blur-3xl" />
      </div>
      <div className="container mx-auto max-w-5xl px-4 py-12 relative">
        <MinimalProfileStatic personal={portfolioData.personal} />
        {portfolioData.workExperience && <CustomSectionCardStatic section={{
          section_name: "Work Experience",
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
      </div>
    </main>
  )
}