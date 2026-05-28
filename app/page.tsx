import { unstable_cache } from 'next/cache'
import type { AllRankings } from '@/lib/types'
import { getRankings } from '@/lib/data-store'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import RankingsPanel from '@/components/RankingsPanel'
import GlossarySection from '@/components/GlossarySection'
import NewsletterCTA from '@/components/NewsletterCTA'
import Footer from '@/components/Footer'

// Revalidate once per week (604800 seconds = 7 days)
const getCachedRankings = unstable_cache(
  async () => getRankings(),
  ['rankings'],
  { revalidate: 604800 },
)

function getLastUpdated(rankings: AllRankings): string | null {
  const snapshots = [
    ...Object.values(rankings.dupr.continental ?? {}).flatMap((cats) =>
      Object.values(cats ?? {}),
    ),
    ...Object.values(rankings.ppa ?? {}),
  ]
  if (snapshots.length === 0) return null
  return snapshots
    .map((s) => s?.lastUpdated ?? '')
    .filter(Boolean)
    .sort()
    .at(-1) ?? null
}

// JSON-LD structured data for search engines and LLMs
function buildJsonLd(rankings: AllRankings, lastUpdated: string | null) {
  const saCategories = rankings.dupr.continental?.south_america ?? {}
  const topDuprPlayers =
    saCategories.mens_singles?.players?.slice(0, 10) ??
    Object.values(saCategories)[0]?.players?.slice(0, 10) ?? []

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'El Pickleo',
    url: 'https://elpickleo.com',
    inLanguage: 'es',
    description: 'El sitio de referencia de pickleball en español para Latinoamérica.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://elpickleo.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  const webpage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Rankings de pickleball – DUPR y PPA',
    description:
      'Rankings actualizados de pickleball en español. Top jugadores DUPR por continente y PPA Tour por categoría. Actualización semanal cada lunes.',
    url: 'https://elpickleo.com/rankings',
    inLanguage: 'es',
    isPartOf: { '@type': 'WebSite', url: 'https://elpickleo.com' },
    dateModified: lastUpdated ?? undefined,
  }

  const dataset = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Rankings de pickleball – DUPR y PPA',
    description:
      'Ranking actualizado de jugadores de pickleball por rating DUPR y puntos PPA Tour, en español.',
    url: 'https://elpickleo.com/rankings',
    creator: { '@type': 'Organization', name: 'El Pickleo' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    dateModified: lastUpdated ?? undefined,
    keywords: 'pickleball, ranking, DUPR, PPA Tour, latinoamerica',
    hasPart: topDuprPlayers.map((p) => ({
      '@type': 'Person',
      name: p.name,
      nationality: p.country,
      description: `Ranking DUPR Sudamérica: ${p.metricLabel}`,
    })),
  }

  return [website, webpage, dataset]
}

export default async function RankingsPage() {
  const rankings = await getCachedRankings()

  if (!rankings) {
    return (
      <>
        <Header />
        <main className="max-w-5xl mx-auto px-5 py-24 text-center text-[#6B7280]"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
          Todavía no hay datos disponibles. La cancha está cerrada por ahora.
        </main>
        <Footer />
      </>
    )
  }

  const lastUpdated = getLastUpdated(rankings)
  const jsonLd = buildJsonLd(rankings, lastUpdated)

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Header />
      <main>
        <Hero lastUpdated={lastUpdated} />
        <div className="border-t border-[#E5E7EB]">
          <RankingsPanel rankings={rankings} />
        </div>
        <GlossarySection />
        <NewsletterCTA />
      </main>
      <Footer />
    </>
  )
}
