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

---

## Operational Notes (invariants — do not regress)

These are runtime constraints not obvious from code. Modifying them will break production.

### Scraper (`lib/scraper.ts`)
- **`waitFor: 6000`** on DUPR scrapes — DUPR is an SPA and rendering takes ~6s. Lower values cause cross-continent contamination (e.g. Chilean players showing up in North America).
- **DUPR metric filter** `metric >= 1.5 && metric <= 9.0` — drops contaminated rows where PPA-like values (1,000+) sneak into the parsed markdown.
- **Sort + dedupe + re-rank** after parsing each section: sort by metric desc → deduplicate by player name (keep highest) → reassign sequential ranks. Skipping any of these reintroduces duplicate ranks and out-of-order rows.
- **Country ISO map** (`COUNTRY_ISO`) must be kept up-to-date. New countries that appear in scraped data will show the ISO code instead of the name. Add entries when a player surfaces with a missing mapping.

### Data store (`lib/data-store.ts`)
- The Vercel Blob store is **private**. Reads must use `Authorization: Bearer ${BLOB_READ_WRITE_TOKEN}` header on `blob.url`. `downloadUrl` returns 403.
- Writes require `access: 'private'` AND `allowOverwrite: true` — otherwise repeated writes (every Monday) throw.

### Cache invalidation
- `app/page.tsx` wraps rankings in `unstable_cache` with `tags: ['rankings']` and a 7-day revalidate window.
- The cron handler (`app/api/cron/update-rankings/route.ts`) MUST call `revalidateTag('rankings')` after writing — `revalidatePath('/')` does not invalidate `unstable_cache`.

### UI (`components/RankingsPanel.tsx`)
- The `<div>` wrapping `<PodiumCards>` + `<RankingList>` must have `key={snapshotKey}` where `snapshotKey` combines ranking type + continent + category. Without it, mobile Safari leaves stale DOM from previous tabs visible (PPA rows appearing in DUPR view).
- `PodiumCards` and `RankingList` items use composite keys `${player.rank}-${player.name}` — not rank alone — as defense-in-depth.

### Cron schedule
- `vercel.json` cron `0 7 * * 1` = Monday 07:00 UTC = **Monday 1:00 AM Costa Rica** (UTC-6). If the timezone offset ever changes (e.g. DST elsewhere), reconfirm the UTC schedule.
- Vercel sends an automatic email to the account owner if the cron throws. Verify the cron last-run status in Vercel → project → Cron Jobs.

### Manual scrape (for testing fixes)
Production manual trigger — only when authorized, consumes Firecrawl credits:
```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://rankings.elpickleo.com/api/cron/update-rankings
```
Expected response: `{"ok":true,"lastUpdated":"...","continental_snapshots":24,"ppa":6}`
