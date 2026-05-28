import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { list } = await import('@vercel/blob')
    const result = await list({ prefix: 'rankings.json' })

    const blobs = result.blobs.map((b) => ({
      pathname: b.pathname,
      url: b.url,
      downloadUrl: b.downloadUrl,
      size: b.size,
    }))

    if (blobs.length === 0) {
      return NextResponse.json({ error: 'no blobs found', blobs })
    }

    const blob = blobs[0]
    const res = await fetch(blob.url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
      cache: 'no-store',
    })
    const text = await res.text()

    return NextResponse.json({
      status: res.status,
      blobFound: true,
      pathname: blob.pathname,
      bodyLength: text.length,
      bodyPreview: text.slice(0, 200),
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
