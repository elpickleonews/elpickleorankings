import { unstable_cache } from 'next/cache'
import type { AllRankings } from '@/lib/types'
import { getRankings } from '@/lib/data-store'
import { FAQ } from '@/lib/faq'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import RankingsPanel from '@/components/RankingsPanel'
import GlossarySection from '@/components/GlossarySection'
import NewsletterCTA from '@/components/NewsletterCTA'
import Footer from '@/components/Footer'

const SITE_URL = 'https://rankings.elpickleo.com'

// Revalidate once per week (604800 seconds = 7 days)
const getCachedRankings = unstable_cache(
  async () => getRankings(),
  ['rankings'],
  { revalidate: 604800, tags: ['rankings'] },
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
    saCategories.mens_singles?.players?.slice(0, 20) ??
    Object.values(saCategories)[0]?.players?.slice(0, 20) ?? []

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'El Pickleo',
    url: SITE_URL,
    inLanguage: 'es',
    description: 'El sitio de referencia de pickleball en español para Latinoamérica.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const webpage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Rankings de pickleball – DUPR y PPA',
    description:
      'Rankings actualizados de pickleball en español. Top jugadores DUPR por continente y PPA Tour por categoría. Actualización semanal cada lunes.',
    url: `${SITE_URL}/`,
    inLanguage: 'es',
    isPartOf: { '@type': 'WebSite', url: SITE_URL },
    dateModified: lastUpdated ?? undefined,
  }

  const dataset = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Rankings de pickleball – DUPR y PPA',
    description:
      'Ranking actualizado de jugadores de pickleball por rating DUPR y puntos PPA Tour, en español.',
    url: `${SITE_URL}/`,
    creator: { '@type': 'Organization', name: 'El Pickleo' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    dateModified: lastUpdated ?? undefined,
    keywords: 'pickleball, ranking, DUPR, PPA Tour, latinoamerica',
    hasPart: topDuprPlayers.map((p) => ({
      '@type': 'Person',
      name: p.name,
      nationality: p.countryName,
      description: `Ranking DUPR Sudamérica: ${p.metricLabel}`,
    })),
  }

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top DUPR Sudamérica – Individual Masculino',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: topDuprPlayers.length,
    itemListElement: topDuprPlayers.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Person',
        name: p.name,
        nationality: p.countryName,
        description: `Rating DUPR: ${p.metricLabel}`,
      },
    })),
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return [website, webpage, dataset, itemList, faqPage]
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
  const leadPlayerRaw = rankings.dupr.continental?.south_america?.mens_singles?.players?.[0] ?? null
  const leadPlayer = leadPlayerRaw
    ? {
        name: leadPlayerRaw.name,
        countryName: leadPlayerRaw.countryName,
        metricLabel: leadPlayerRaw.metricLabel,
      }
    : null

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
        <Hero lastUpdated={lastUpdated} leadPlayer={leadPlayer} />
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
