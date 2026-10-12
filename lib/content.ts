import portfolioData from '@/data/portfolio.json'

export const data = portfolioData

/** Split a "• line\n• line" description into clean bullet strings. */
export function bullets(text: string | null | undefined): string[] {
  if (!text) return []
  return text
    .split('\n')
    .map((l) => l.replace(/^\s*[•\-*]\s*/, '').trim())
    .filter(Boolean)
}

/** "E-vent – Event Management System" → { title: "E-vent", subtitle: "Event Management System" } */
export function splitName(name: string | null): { title: string; subtitle?: string } {
  if (!name) return { title: '' }
  const [title, ...rest] = name.split(/\s+[–—-]\s+/)
  return { title: title.trim(), subtitle: rest.join(' – ').trim() || undefined }
}

const TECH_LABELS: Record<string, string> = {
  laravel: 'Laravel',
  php: 'PHP',
  graphql: 'GraphQL',
  vuejs: 'Vue.js',
  'vue.js': 'Vue.js',
  mysql: 'MySQL',
  postgresql: 'PostgreSQL',
  jquery: 'jQuery',
  blade: 'Blade',
  'rest apis': 'REST APIs',
}

export function techLabel(name: string): string {
  return TECH_LABELS[name.trim().toLowerCase()] ?? name.trim()
}

export type ContactLink = { kind: string; label: string; href: string; display: string; external: boolean }

export function contactLinks(): ContactLink[] {
  return data.personal.custom_links.map((l) => {
    if (l.icon === 'email') {
      return { kind: 'email', label: 'Email', href: `mailto:${l.url}`, display: l.url, external: false }
    }
    if (l.icon === 'phone') {
      return { kind: 'phone', label: 'Phone', href: l.url, display: l.title, external: false }
    }
    return {
      kind: l.icon,
      label: l.title,
      href: l.url,
      display: l.url.replace(/^https?:\/\/(www\.)?/, ''),
      external: true,
    }
  })
}

export const SKILL_GROUPS: { name: string; match: string[] }[] = [
  { name: 'Backend', match: ['PHP', 'Laravel', 'CodeIgniter', 'Node.js', 'GraphQL', 'REST APIs', 'WebSockets'] },
  { name: 'Frontend', match: ['Vue.js', 'React.js', 'Blade Templates', 'HTML5', 'CSS3', 'Bootstrap'] },
  { name: 'Data', match: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQL', 'NoSQL', 'Redis'] },
  { name: 'Delivery', match: ['Docker', 'Git', 'GitHub', 'Agile', 'Scrum'] },
  { name: 'AI-assisted development', match: ['Claude Code', 'Cursor', 'ChatGPT/Claude AI'] },
]

export function groupedSkills(): { name: string; items: string[] }[] {
  const names = data.skills.map((s) => s.name)
  const used = new Set<string>()
  const groups = SKILL_GROUPS.map((g) => {
    const items = names.filter((n) => g.match.includes(n))
    items.forEach((i) => used.add(i))
    return { name: g.name, items }
  }).filter((g) => g.items.length)
  const rest = names.filter((n) => !used.has(n))
  if (rest.length) groups.push({ name: 'Other', items: rest })
  return groups
}
