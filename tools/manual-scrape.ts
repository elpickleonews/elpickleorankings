#!/usr/bin/env tsx
/**
 * Manual scrape runner. Usage:
 *   npm run scrape
 *
 * Requires FIRECRAWL_API_KEY in .env.local
 * Writes output to data/rankings.json (local) or Vercel Blob (production)
 */

import { config } from 'dotenv'
import path from 'path'

// Load .env.local
config({ path: path.resolve(process.cwd(), '.env.local') })

import { scrapeAllRankings, mergeRankings } from '../lib/scraper'
import { getRankings, setRankings } from '../lib/data-store'

async function main() {
  console.log('Starting manual rankings scrape...\n')

  const existing = await getRankings()
  const fresh = await scrapeAllRankings()
  const merged = mergeRankings(existing, fresh)

  await setRankings(merged)

  const continentCount = Object.keys(merged.dupr.continental ?? {}).length
  const snapshotCount = Object.values(merged.dupr.continental ?? {}).reduce(
    (acc, cats) => acc + Object.keys(cats ?? {}).length, 0,
  )
  const ppaCount = Object.keys(merged.ppa ?? {}).length

  console.log(`\n✓ Saved rankings:`)
  console.log(`  DUPR continents:  ${continentCount} regions`)
  console.log(`  DUPR snapshots:   ${snapshotCount} (continent × category)`)
  console.log(`  PPA categories:   ${ppaCount} categories`)
}

main().catch((err) => {
  console.error('Scrape failed:', err)
  process.exit(1)
})
