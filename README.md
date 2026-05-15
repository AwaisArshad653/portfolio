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
