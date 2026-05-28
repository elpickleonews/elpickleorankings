import type { AllRankings } from './types'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'rankings.json')
const BLOB_KEY = 'rankings.json'

export async function getRankings(): Promise<AllRankings | null> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return getBlobRankings()
  }
  return getLocalRankings()
}

export async function setRankings(rankings: AllRankings): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await setBlobRankings(rankings)
  } else {
    await setLocalRankings(rankings)
  }
}

async function getLocalRankings(): Promise<AllRankings | null> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw) as AllRankings
  } catch {
    return null
  }
}

async function setLocalRankings(rankings: AllRankings): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(rankings, null, 2), 'utf-8')
}

async function getBlobRankings(): Promise<AllRankings | null> {
  try {
    const { list } = await import('@vercel/blob')
    const { blobs } = await list({ prefix: BLOB_KEY })
    const blob = blobs.find((b) => b.pathname === BLOB_KEY)
    if (!blob) return null
    const res = await fetch(blob.url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json() as Promise<AllRankings>
  } catch {
    return null
  }
}

async function setBlobRankings(rankings: AllRankings): Promise<void> {
  const { put } = await import('@vercel/blob')
  await put(BLOB_KEY, JSON.stringify(rankings), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}
