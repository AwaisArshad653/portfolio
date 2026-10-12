import SiteNav from '@/components/site/SiteNav'
import Hero from '@/components/site/Hero'
import AskSection from '@/components/site/AskSection'
import { Education, Experience, Footer, Projects, Skills } from '@/components/site/Sections'
import { data } from '@/lib/content'

export default function Portfolio() {
  const name = data.personal.full_name
  return (
    <>
      <a
        href="#ask"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to the assistant
      </a>
      <SiteNav name={name} />
      <main>
        <Hero />
        <AskSection firstName={name.split(' ')[0]} />
        <Experience />
        <Projects />
        <Skills />
        <Education />
      </main>
      <Footer />
    </>
  )
}
