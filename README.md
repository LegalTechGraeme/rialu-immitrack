# Rialu ImmiTrack

AI-native immigration case management demo — built for modern law firm teams.

## Features

**Immigration team portal**
- Team overview with priority queue and stats
- All cases with inline status updates
- Case detail: documents, timeline, notes, AI brief
- Reports: expiry pipeline, WIP, missing documents
- AI intelligence: team briefing and high-attention cases

**Corporate client portal**
- Dashboard scoped to their employees
- Update case status (documents ready, submit, on hold)
- Case detail with document checklist and messaging

**Design**
- Rialu brand aesthetic: navy, gold, warm cream (matches Rialu Graph)
- Cormorant Garamond + DM Sans typography
- Sidebar app shell

**Data**
- Seed data in `data/*.json` — no database required
- Edits persist in browser localStorage
- Deploy to Vercel free tier

## Deploy

1. Push to GitHub
2. [vercel.com](https://vercel.com) → import repo → Deploy

## Local dev

```bash
npm install && npm run dev
```

Open http://localhost:3000 — pick **Immigration team** or **Corporate client**. To switch portals, use **Exit demo** (no in-app role toggle).

## AI roadmap

Current AI panels use rule-based summaries (demo). Plug in OpenAI/Anthropic for:
- Document extraction from uploads
- Natural-language case queries
- ISD correspondence drafting
- Proactive risk scoring
