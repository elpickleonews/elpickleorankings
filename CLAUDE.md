# CLAUDE.md — El Pickleo · Rankings de Pickleball

## WAT Framework

This project uses the **WAT** framework to structure all AI-assisted work:

| Letter | Stands For | Role |
|--------|-----------|------|
| **W**  | Workflows  | Step-by-step procedure files that orchestrate the work |
| **A**  | Agent      | Claude Code — the AI that reads, plans, and executes |
| **T**  | Tools      | Scripts and integrations the Agent uses to get things done |

---

## Project

**El Pickleo Rankings** — página web de rankings de pickleball en español. Muestra datos DUPR (por continente y país) y PPA Tour (por categoría). Actualización automática cada lunes.

Stack: Next.js 15 · Tailwind CSS 4 · TypeScript · Firecrawl · Vercel Blob · Vercel Cron Jobs

---

## Folder Structure

```
/
├── CLAUDE.md                  ← you are here
├── app/                       ← Next.js App Router
│   ├── layout.tsx             ← root layout, fonts, metadata, lang="es"
│   ├── page.tsx               ← main rankings page
│   ├── globals.css            ← Tailwind + CSS vars (colors, fonts)
│   ├── sitemap.ts             ← auto-generated sitemap.xml
│   └── api/cron/update-rankings/route.ts ← weekly cron endpoint
├── components/                ← UI components
│   ├── Header.tsx             ← dark green nav with lime CTA
│   ├── Hero.tsx               ← H1 + lastUpdated metadata line
│   ├── RankingToggle.tsx      ← DUPR / PPA pill switcher
│   ├── CategoryToggle.tsx     ← tab row for sub-categories
│   ├── RankingsPanel.tsx      ← client component: state + layout
│   ├── PodiumCards.tsx        ← top 3 featured cards
│   ├── RankingList.tsx        ← positions 4–50 row list
│   ├── TrendBadge.tsx         ← ▲▼● trend indicator
│   ├── GlossarySection.tsx    ← "¿Qué es DUPR?" explainer cards
│   ├── NewsletterCTA.tsx      ← email signup, dark green bg
│   └── Footer.tsx
├── lib/
│   ├── types.ts               ← TypeScript interfaces + label maps
│   ├── flag.ts                ← ISO → emoji flag helper
│   ├── scraper.ts             ← Firecrawl scraping logic
│   └── data-store.ts          ← local JSON (dev) / Vercel Blob (prod)
├── data/
│   └── rankings.json          ← local data store (dev only)
├── public/
│   ├── robots.txt             ← allows all AI crawlers
│   └── llms.txt               ← LLM/AI discovery file
├── tools/
│   └── manual-scrape.ts       ← CLI runner: npm run scrape
├── workflows/
│   └── scrape-rankings.md     ← how to run the scraper manually
├── temp/
│   ├── outputs/               ← agent writes results here
│   └── resources/             ← source data files for agent input
├── vercel.json                ← cron: every Monday 07:00 UTC
└── .env.local.example         ← required env vars template
```

---

## Design System (strict — do not deviate)

| Token | Value |
|---|---|
| Brand dark | `#0F1F00` |
| Brand lime | `#C5F230` |
| Background soft | `#F4F7E8` |
| Border | `#E5E7EB` |
| Secondary text | `#6B7280` |
| Card radius | `14px` |
| Pill radius | `999px` |
| Display font | Bricolage Grotesque (Bold/SemiBold) |
| Body font | Inter (Regular/Medium) |

Rules: **no shadows, no gradients, no 3D effects**. Flat design only.

---

## Workflows (W)

Workflows live in `/workflows/`. Read the relevant workflow before starting a task.

| Workflow | Purpose |
|---|---|
| `scrape-rankings.md` | Run the Firecrawl scraper manually |

---

## Agent (A)

Claude Code is the Agent. At the start of every session:
1. Read this file (`CLAUDE.md`)
2. Identify the relevant workflow in `/workflows/`
3. Use tools from `/tools/` as directed
4. Write temporary results to `/temp/outputs/`
5. Source data goes in `/temp/resources/`

---

## Tools (T)

| Tool | Command | Purpose |
|---|---|---|
| manual-scrape.ts | `npm run scrape` | Run Firecrawl scraper, update `data/rankings.json` |

---

## Required Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
FIRECRAWL_API_KEY=    # from firecrawl.dev
BLOB_READ_WRITE_TOKEN= # from Vercel Blob integration
CRON_SECRET=           # any random string
```

---

## Running Locally

```bash
npm install
cp .env.local.example .env.local
# fill in FIRECRAWL_API_KEY in .env.local
npm run dev      # starts dev server at http://localhost:3000
npm run scrape   # runs scraper, writes data/rankings.json
```

---

## Deploying to Vercel

1. Push to GitHub
2. Import project in Vercel dashboard
3. Add **Vercel Blob** storage integration
4. Set env vars: `FIRECRAWL_API_KEY`, `BLOB_READ_WRITE_TOKEN`, `CRON_SECRET`
5. Deploy
6. Trigger first scrape manually: `GET /api/cron/update-rankings` with `Authorization: Bearer <CRON_SECRET>`

Cron runs automatically every Monday at 07:00 UTC (defined in `vercel.json`).

---

## Working Rules

- Always read the relevant workflow file before starting a task
- Follow the design system strictly — no deviations without explicit instruction
- Write intermediate results to `/temp/outputs/`
- Place source data in `/temp/resources/` before running workflows
- `temp/` contents are ephemeral — not source of truth
- Do not modify files outside the project directory without explicit instruction
