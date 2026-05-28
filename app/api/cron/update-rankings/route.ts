import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { scrapeAllRankings, mergeRankings } from '@/lib/scraper'
import { getRankings, setRankings } from '@/lib/data-store'

export const maxDuration = 300 // 5 minutes — Vercel Pro/Hobby max for cron functions

export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sets Authorization header automatically)
  const authHeader = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const existing = await getRankings()
    const fresh = await scrapeAllRankings()
    const merged = mergeRankings(existing, fresh)
    await setRankings(merged)

    revalidateTag('rankings')

    const continentalCount = Object.values(merged.dupr.continental ?? {}).reduce(
      (acc, cats) => acc + Object.keys(cats ?? {}).length,
      0,
    )
    const summary = {
      ok: true,
      lastUpdated: new Date().toISOString(),
      continental_snapshots: continentalCount,
      ppa: Object.keys(merged.ppa ?? {}).length,
    }

    console.log('Rankings updated:', summary)
    return NextResponse.json(summary)
  } catch (err) {
    console.error('Cron update failed:', err)
    return NextResponse.json(
      { error: String(err) },
      { status: 500 },
    )
  }
}
