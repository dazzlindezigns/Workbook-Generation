# Workbook Generator — Youth Ministry Edition

AI-powered workbook generator built with Next.js and Claude.

## Local Development

```bash
npm install
```

Create a `.env.local` file:
```
ANTHROPIC_API_KEY=your_key_here
```

```bash
npm run dev
```

Visit http://localhost:3000

## Deploy to Vercel

1. Push this repo to GitHub
2. Import repo in Vercel
3. Add environment variable: `ANTHROPIC_API_KEY` = your Anthropic API key
4. Deploy ✅

## Project Structure

```
app/
  page.js                  # Root page
  layout.js                # Root layout
  components/
    WorkbookGenerator.js   # Main app component
  api/
    generate/
      route.js             # Secure API proxy (keeps API key server-side)
```
