// Client-side "AI" answer engine for the POST /ask console.
// No network calls, no API keys — everything is derived from data/portfolio.json
// at build time, so this works entirely as a static site on GitHub Pages.

import portfolioData from '@/data/portfolio.json'

type WorkExp = (typeof portfolioData.workExperience)[number]

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s+.#/]/g, ' ').replace(/\s+/g, ' ').trim()

function findSkill(q: string) {
  return portfolioData.skills.find((s) => q.includes(norm(s.name)) || norm(s.name).includes(q.split(' ').find(w => w.length > 2) || '__'))
}

function currentRole(): WorkExp | undefined {
  return portfolioData.workExperience.find((e) => norm(e.end_date || '') === 'present')
}

function matchCompany(q: string): WorkExp | undefined {
  return portfolioData.workExperience.find((e) => q.includes(norm(e.company)) || norm(e.company).split(' ').some(w => w.length > 3 && q.includes(w)))
}

function listBullets(description: string | null, max = 3) {
  if (!description) return []
  return description
    .split('\n')
    .map((l) => l.replace(/^[•\-*]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, max)
}

function yearsOfExperience(): string {
  const m = portfolioData.personal.about_me?.match(/(\d+)\+?\s*years?/i)
  return m ? m[1] : '6'
}

export function answerQuestion(raw: string): string {
  const q = norm(raw)
  if (!q) return "Ask me something — try \"What's his Laravel experience?\" or \"How do I contact him?\""

  // Greeting
  if (/^(hi|hello|hey|yo|salaam|assalam)\b/.test(q)) {
    return `Hey! I'm a static assistant built from ${portfolioData.personal.full_name}'s portfolio data. Ask about his experience, skills, projects, or how to reach him.`
  }

  // Contact / hire
  if (/(contact|email|hire|reach|connect|get in touch|available|freelance)/.test(q)) {
    const email = portfolioData.personal.custom_links.find((l) => l.icon === 'email')?.url
    const linkedin = portfolioData.personal.custom_links.find((l) => l.icon === 'linkedin')?.url
    const github = portfolioData.personal.custom_links.find((l) => l.icon === 'github')?.url
    return `Best way to reach ${portfolioData.personal.full_name.split(' ')[0]} is by email at ${email}. He's also on LinkedIn (${linkedin}) and GitHub (${github}). Use the buttons above the fold too.`
  }

  // Resume / CV
  if (/(resume|\bcv\b|download)/.test(q)) {
    return `You can grab the full resume from the "Resume" button at the top of the page — it has the complete work history, education, and skills in one document.`
  }

  // Years of experience
  if (/(how many years|years of experience|experience level|how long)/.test(q)) {
    return `${portfolioData.personal.full_name.split(' ')[0]} has ${yearsOfExperience()}+ years of experience building backend and full-stack web applications, primarily with Laravel and Vue.js.`
  }

  // AI tooling
  if (/(\bai\b|chatgpt|claude|cursor|copilot|automat|agentic)/.test(q)) {
    const techlio = portfolioData.workExperience.find((e) => norm(e.company).includes('techlio'))
    const aiBullets = listBullets(techlio?.description ?? null, 6).filter((b) => /claude|cursor|ai|chatgpt/i.test(b))
    const list = aiBullets.length ? aiBullets.map((b) => `• ${b}`).join('\n') : ''
    return `Yes — he actively uses AI-assisted development in his day-to-day work: Claude Code and Cursor for agentic coding, ChatGPT/Claude for troubleshooting, and Figma's MCP integration for design-to-code.${list ? `\n\nAt his current role:\n${list}` : ''}`
  }

  // Current role
  if (/(current|currently|now|present|where does he work|working at)/.test(q)) {
    const role = currentRole()
    if (role) {
      const bullets = listBullets(role.description, 3).map((b) => `• ${b}`).join('\n')
      return `He's currently a ${role.position} at ${role.company} (since ${role.start_date}).\n\n${bullets}`
    }
  }

  // Specific company
  const company = matchCompany(q)
  if (company) {
    const bullets = listBullets(company.description, 4).map((b) => `• ${b}`).join('\n')
    return `${company.position} at ${company.company}, ${company.start_date} – ${company.end_date}.\n\n${bullets}`
  }

  // Education
  if (/(degree|university|study|studied|education|school|bachelor|fellowship)/.test(q)) {
    const list = portfolioData.education
      .map((e) => `• ${e.degree} — ${e.university} (${e.start_year}${e.end_year ? ` – ${e.end_year}` : ''})`)
      .join('\n')
    return `Education:\n${list}`
  }

  // Projects
  if (/(project|built|portfolio piece|shipped|worked on)/.test(q)) {
    const list = portfolioData.projects
      .slice(0, 4)
      .map((p) => `• ${p.name}`)
      .join('\n')
    return `A few things he's built:\n${list}\n\nScroll down to GET /projects for the full writeups.`
  }

  // Location
  if (/(where is he|based|located|location|from|city|country)/.test(q)) {
    return `He's based in ${portfolioData.personal.location}.`
  }

  // Skill lookup — check every skill for a name match
  const skillHit = portfolioData.skills.find((s) => q.includes(norm(s.name)))
  if (skillHit) {
    const usedIn = portfolioData.workExperience.find((e) => norm(e.description || '').includes(norm(skillHit.name)))
      || portfolioData.projects.find((p) => norm(p.description || '').includes(norm(skillHit.name)) || p.technologies.some(t => norm(t.name).includes(norm(skillHit.name))))
    const context = usedIn
      ? ('company' in usedIn ? ` He's used it professionally at ${usedIn.company}.` : ` He's used it on the "${usedIn.name}" project.`)
      : ''
    return `Yes, ${skillHit.name} is in his stack.${context}`
  }

  // Skills list fallback
  if (/(skill|tech stack|technolog|know|proficient)/.test(q)) {
    const names = portfolioData.skills.slice(0, 10).map((s) => s.name).join(', ')
    return `Core stack: ${names}, and more — see GET /skills below for the full list.`
  }

  return `I don't have a direct answer for that yet. Try asking about his experience, skills, projects, education, or how to get in touch.`
}

export const SUGGESTED_QUESTIONS = [
  "What's his Laravel experience?",
  'Does he use AI tools?',
  'What is he working on now?',
  'How do I contact him?',
]
