# Awais Arshad's Portfolio

Portfolio built with Next.js. A static, self-contained portfolio website.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your portfolio.

### Building for Production

```bash
# Build static site
npm run build
```

The build output will be in the `out/` directory.

## 🤖 AI assistant (Claude)

The "Ask about my work" section answers questions with Claude, Anthropic's model.
Because GitHub Pages only serves static files, the Anthropic API key lives in a small
Cloudflare Worker (`worker/`). The site calls that worker; if it isn't configured or
can't be reached, the section falls back to the built-in offline answers (`lib/ask-engine.ts`).

**One-time setup**

1. **Anthropic key** — create one at [console.anthropic.com](https://console.anthropic.com) and set a monthly spend limit there.
2. **Cloudflare** — create a free account. Copy your **Account ID** (Workers & Pages overview) and create an
   **API token** with the *Edit Cloudflare Workers* template.
3. **GitHub secrets** — in this repo go to *Settings → Secrets and variables → Actions → Secrets* and add
   `ANTHROPIC_API_KEY`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
4. **Deploy the worker** — *Actions → Deploy AI assistant (Cloudflare Worker) → Run workflow*.
   The run summary shows the worker URL (`https://portfolio-ask.<your-subdomain>.workers.dev`).
5. **Point the site at it** — add a repository **variable** (*Variables* tab) named `ASK_API_URL` with that URL,
   then re-run *Deploy to GitHub Pages*.

After that, the worker redeploys automatically whenever `worker/` or `data/portfolio.json` changes,
so Claude always answers from the current profile.

**Settings** (`worker/wrangler.toml`): `MODEL` (default `claude-haiku-5-5`), `MAX_TOKENS`,
`ALLOWED_ORIGINS` (sites allowed to call the worker), and a per-visitor limit of 10 questions a minute.

**Local development**

```bash
cd worker && npm install && npm test
npx wrangler secret put ANTHROPIC_API_KEY   # once, if deploying from your machine
npx wrangler dev                            # http://localhost:8787
# in another terminal, from the repo root:
NEXT_PUBLIC_ASK_API_URL=http://localhost:8787 npm run dev
```

## 📦 Deployment Options

Your portfolio is a static Next.js site and can be deployed anywhere that hosts static files:

### Option 1: Vercel (Recommended)
1. Push this code to a GitHub repository
2. Import the repository in [Vercel](https://vercel.com)
3. Vercel will auto-detect Next.js and deploy

### Option 2: Netlify
1. Push this code to a GitHub repository
2. Import the repository in [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `out`

### Option 3: GitHub Pages
1. Push this code to a GitHub repository
2. Go to Settings → Pages
3. Set up GitHub Actions workflow (see [Next.js docs](https://nextjs.org/docs/app/building-your-application/deploying/static-exports#deploying))

### Option 4: Self-host
Upload the contents of the `out/` directory to any web server or CDN.

## 📁 Project Structure

```
├── app/               # Next.js app directory
│   ├── page.tsx      # Main portfolio page
│   ├── layout.tsx    # Root layout
│   └── globals.css   # Global styles
├── components/       # React components
├── data/            # Portfolio data (JSON)
├── public/          # Static assets
└── lib/             # Utility functions
```

## 🎨 Customization

Your portfolio data is stored in `data/portfolio.json`. You can edit this file to update your information, or modify the components in the `components/` directory to change the design.
