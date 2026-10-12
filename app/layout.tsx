import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/newsreader/opsz.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Awais Arshad — Senior Software Engineer',
  description:
    'Portfolio of Awais Arshad, Senior Software Engineer in Lahore. Ask the built-in assistant, powered by Claude, about his experience, skills, and projects.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F5F1' },
    { media: '(prefers-color-scheme: dark)', color: '#0F151C' },
  ],
}

// Applies the saved (or system) theme before first paint so there is no flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans bg-background text-foreground antialiased">{children}</body>
    </html>
  )
}
