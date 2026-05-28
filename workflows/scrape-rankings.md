# Workflow: Scrape Rankings

## When to use this workflow

Run this workflow to manually update the rankings data from DUPR and PPA. Use it:
- Before a first deploy to seed initial data
- When the automatic cron failed and you need to trigger a manual update
- When testing scraper changes

---

## Prerequisites

- `FIRECRAWL_API_KEY` set in `.env.local`
- Node.js and npm installed
- Dependencies installed (`npm install`)

---

## Steps

### 1. Verify environment

```bash
cat .env.local | grep FIRECRAWL_API_KEY
# Should print: FIRECRAWL_API_KEY=fc-...
```

### 2. Run the scraper

```bash
npm run scrape
```

The scraper will:
- Fetch DUPR continental rankings for all continents
- Fetch DUPR country rankings for 9 LATAM countries (AR, BR, CL, CO, CR, DO, MX, PE, VE)
- Fetch PPA Tour rankings for all categories
- Write results to `data/rankings.json` (local) or Vercel Blob (production)

### 3. Verify output

```bash
cat data/rankings.json | head -50
# Should show JSON with dupr.continental, dupr.countries, ppa sections
```

### 4. Check in the browser

```bash
npm run dev
# Open http://localhost:3000
# Rankings should reflect the freshly scraped data
```

---

## Troubleshooting

**"FIRECRAWL_API_KEY is not set"** — check `.env.local` has the key.

**Empty player list for a section** — the DUPR/PPA page structure may have changed. Check the raw markdown by adding `console.log(md)` to `lib/scraper.ts` temporarily.

**Country URLs returning 404** — DUPR may use different URL patterns. Check the actual country ranking URL in a browser and update `DUPR_COUNTRY_URLS` in `lib/scraper.ts`.

---

## Triggering the cron manually in production

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://elpickleo.com/api/cron/update-rankings
```
