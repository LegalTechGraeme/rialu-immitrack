# Rialu ImmiTrack

Modern immigration case tracking **demo** — Next.js, no database required.

## How it works

- **Demo data** lives in `data/*.json` (committed to the repo, ~3KB total)
- **Edits persist in your browser** via localStorage (add/update applicants, notifications)
- **No PostgreSQL** — deploys cleanly to Vercel free tier
- **Role toggle** — Employee (all clients) or Client (single account), no login

## Deploy to Vercel

1. Push this repo to GitHub
2. [vercel.com](https://vercel.com) → **Add New Project** → import repo
3. Deploy (zero config needed)

## Local dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Stack

- Next.js 16 · React · TypeScript · Tailwind CSS
- JSON seed data + localStorage

## Reset demo data

Click **Reset demo data** in the dashboard header to restore original JSON seed.
