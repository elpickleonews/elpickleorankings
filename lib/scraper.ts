import FirecrawlApp from '@mendable/firecrawl-js'
import type {
  AllRankings,
  DuprContinent,
  DuprCategory,
  PpaCategory,
  Player,
} from './types'

// Slugs confirmed from live DUPR URLs (lowercase-hyphen format)
const DUPR_CONTINENT_SLUGS: Record<DuprContinent, string> = {
  north_america:   'north-america',
  central_america: 'central-america-and-caribbean',
  south_america:   'south-america',
  europe:          'europe',
  asia:            'asia',
  oceania:         'oceania',
  africa:          'africa',
}

// Tab order as rendered on DUPR continental pages (pane-0 → pane-3)
const DUPR_TAB_ORDER: DuprCategory[] = [
  'mens_doubles',
  'womens_doubles',
  'mens_singles',
  'womens_singles',
]

// Country name (English, as returned by DUPR) → ISO-2
const COUNTRY_ISO: Record<string, string> = {
  'Afghanistan': 'AF', 'Albania': 'AL', 'Algeria': 'DZ', 'Argentina': 'AR',
  'Armenia': 'AM', 'Australia': 'AU', 'Austria': 'AT', 'Azerbaijan': 'AZ',
  'Bahamas': 'BS', 'Bahrain': 'BH', 'Bangladesh': 'BD', 'Belarus': 'BY',
  'Belgium': 'BE', 'Belize': 'BZ', 'Bolivia': 'BO', 'Bosnia and Herzegovina': 'BA',
  'Brazil': 'BR', 'Bulgaria': 'BG', 'Cambodia': 'KH', 'Canada': 'CA',
  'Chile': 'CL', 'China': 'CN', 'Colombia': 'CO', 'Costa Rica': 'CR',
  'Croatia': 'HR', 'Cuba': 'CU', 'Cyprus': 'CY', 'Czech Republic': 'CZ',
  'Denmark': 'DK', 'Dominican Republic': 'DO', 'Ecuador': 'EC', 'Egypt': 'EG',
  'El Salvador': 'SV', 'Estonia': 'EE', 'Ethiopia': 'ET', 'Finland': 'FI',
  'France': 'FR', 'Georgia': 'GE', 'Germany': 'DE', 'Ghana': 'GH',
  'Greece': 'GR', 'Guatemala': 'GT', 'Honduras': 'HN', 'Hong Kong': 'HK',
  'Hungary': 'HU', 'Iceland': 'IS', 'India': 'IN', 'Indonesia': 'ID',
  'Iran': 'IR', 'Iraq': 'IQ', 'Ireland': 'IE', 'Israel': 'IL',
  'Italy': 'IT', 'Jamaica': 'JM', 'Japan': 'JP', 'Jordan': 'JO',
  'Kazakhstan': 'KZ', 'Kenya': 'KE', 'South Korea': 'KR', 'Kuwait': 'KW',
  'Latvia': 'LV', 'Lebanon': 'LB', 'Lithuania': 'LT', 'Luxembourg': 'LU',
  'Malaysia': 'MY', 'Malta': 'MT', 'Mexico': 'MX', 'Moldova': 'MD',
  'Morocco': 'MA', 'Netherlands': 'NL', 'New Zealand': 'NZ', 'Nicaragua': 'NI',
  'Libya': 'LY', 'Namibia': 'NA', 'Nigeria': 'NG', 'Norway': 'NO', 'Oman': 'OM', 'Pakistan': 'PK',
  'Panama': 'PA', 'Paraguay': 'PY', 'Peru': 'PE', 'Philippines': 'PH',
  'Poland': 'PL', 'Portugal': 'PT', 'Puerto Rico': 'PR', 'Qatar': 'QA',
  'Romania': 'RO', 'Russia': 'RU', 'Saudi Arabia': 'SA', 'Serbia': 'RS',
  'Singapore': 'SG', 'Slovakia': 'SK', 'Slovenia': 'SI', 'South Africa': 'ZA',
  'Spain': 'ES', 'Sweden': 'SE', 'Switzerland': 'CH', 'Taiwan': 'TW',
  'Thailand': 'TH', 'Trinidad and Tobago': 'TT', 'Tunisia': 'TN',
  'Turkey': 'TR', 'Ukraine': 'UA', 'United Arab Emirates': 'AE',
  'United Kingdom': 'GB', 'United States': 'US', 'Uruguay': 'UY',
  'Uzbekistan': 'UZ', 'Venezuela': 'VE', 'Vietnam': 'VN',
}

// Reverse map: ISO-2 → country name (used by PPA parser)
const COUNTRY_ISO_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(COUNTRY_ISO).map(([name, iso]) => [iso, name])
)

const DIV_PLACEHOLDER = 'Este es un texto dentro de un bloque div.'
const SECTION_HEADERS = new Set(['Rango', 'Jugador', 'País', 'Calificación', 'Edad'])

function buildApp(): FirecrawlApp {
  const key = process.env.FIRECRAWL_API_KEY
  if (!key) throw new Error('FIRECRAWL_API_KEY is not set')
  return new FirecrawlApp({ apiKey: key })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function scrapeUrl(app: FirecrawlApp, url: string): Promise<string> {
  const result = await (app.scrapeUrl as (url: string, opts: Record<string, unknown>) => Promise<any>)(url, {
    formats: ['markdown'],
    waitFor: 4000,
  })
  const md = (result.markdown as string | undefined) ?? ''
  if (!md) throw new Error(`Firecrawl returned empty markdown for ${url}`)
  return md
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function scrapeUrlWithClick(app: FirecrawlApp, url: string, selector: string): Promise<string> {
  const result = await (app.scrapeUrl as (url: string, opts: Record<string, unknown>) => Promise<any>)(url, {
    formats: ['markdown'],
    waitFor: 5000,
    actions: [
      { type: 'wait', milliseconds: 3000 },
      { type: 'click', selector },
      { type: 'wait', milliseconds: 4000 },
    ],
  })
  const md = (result.markdown as string | undefined) ?? ''
  if (!md) throw new Error(`Firecrawl returned empty markdown after clicking ${selector}`)
  return md
}

// Split markdown into per-category sections and parse players from each
function parseDuprPage(markdown: string): Partial<Record<DuprCategory, Player[]>> {
  // Each category section starts with a bare "Rango" line
  const sections = markdown.split(/^Rango$/m).slice(1)

  const result: Partial<Record<DuprCategory, Player[]>> = {}

  for (let si = 0; si < Math.min(sections.length, DUPR_TAB_ORDER.length); si++) {
    const category = DUPR_TAB_ORDER[si]
    const lines = sections[si]
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && l !== DIV_PLACEHOLDER && !SECTION_HEADERS.has(l) && !/^\[.*\]/.test(l))

    const players: Player[] = []
    let i = 0
    while (i < lines.length) {
      const rank = parseInt(lines[i], 10)
      if (isNaN(rank)) { i++; continue }

      const name = lines[i + 1] ?? ''
      const countryName = lines[i + 2] ?? ''
      // lines[i+3] is a duplicate of countryName — skip it
      const ratingStr = lines[i + 4] ?? ''
      const metric = parseFloat(ratingStr)

      if (name && countryName && !isNaN(metric)) {
        const iso = COUNTRY_ISO[countryName] ?? countryName.slice(0, 2).toUpperCase()
        players.push({
          rank,
          name,
          country: iso,
          countryName,
          metric,
          metricLabel: metric.toFixed(3),
          trend: 'stable',
        })
        i += 5
      } else {
        i++
      }
    }

    if (players.length > 0) result[category] = players
  }

  return result
}

// Parse PPA markdown table → Player[]
// Table format: | rank | ![Profile](url) Name | ![XX flag](url) | age | points |
function parsePpaMarkdown(markdown: string): Player[] {
  const players: Player[] = []

  for (const line of markdown.split('\n')) {
    if (!line.startsWith('|')) continue
    const cells = line.split('|').slice(1, -1).map(c => c.trim())
    if (cells.length < 5) continue

    // Skip header and separator rows
    if (cells[0].includes('---') || cells[0].includes('PPA Rank') || cells[0].includes('![')) continue

    const rank = parseInt(cells[0], 10)
    if (isNaN(rank)) continue

    // Name: strip profile image markdown, keep text
    const name = cells[1].replace(/!\[[^\]]*\]\([^)]*\)\s*/g, '').trim()
    if (!name) continue

    // Country: extract ISO from alt text "XX flag"
    const isoMatch = cells[2].match(/!\[([A-Z]{2}) flag\]/)
    const country = isoMatch?.[1] ?? 'US'
    const countryName = COUNTRY_ISO_TO_NAME[country] ?? country

    const metric = parseFloat(cells[4].replace(/,/g, ''))
    if (isNaN(metric)) continue

    players.push({
      rank,
      name,
      country,
      countryName,
      metric,
      metricLabel: Math.round(metric).toLocaleString('es-MX'),
      trend: 'stable',
    })
  }

  console.log(`PPA parsed: ${players.length} players`)
  return players
}

const CONTINENTS = Object.keys(DUPR_CONTINENT_SLUGS) as DuprContinent[]

const PPA_CATEGORIES: PpaCategory[] = [
  'mens_doubles',
  'mens_singles',
  'mens_mixed_doubles',
  'womens_doubles',
  'womens_singles',
  'womens_mixed_doubles',
]

const PPA_URL = 'https://ppatour.com/player-rankings/'

export async function scrapeAllRankings(): Promise<AllRankings> {
  const app = buildApp()
  const now = new Date().toISOString()

  const rankings: AllRankings = {
    dupr: { continental: {} },
    ppa: {},
  }

  // --- DUPR: one scrape per continent, all 4 categories in one page ---
  for (const cont of CONTINENTS) {
    const url = `https://www.dupr.com/es/continental-rankings/${DUPR_CONTINENT_SLUGS[cont]}`
    try {
      console.log(`Scraping DUPR ${cont}`)
      const md = await scrapeUrl(app, url)
      const categoriesData = parseDuprPage(md)

      for (const [cat, players] of Object.entries(categoriesData)) {
        if (!rankings.dupr.continental![cont]) {
          rankings.dupr.continental![cont] = {}
        }
        rankings.dupr.continental![cont]![cat as DuprCategory] = { lastUpdated: now, players: players! }
      }
    } catch (err) {
      console.error(`Failed DUPR ${cont}:`, err)
    }
  }

  // --- PPA: one scrape per category via browser click on each tab ---
  for (const cat of PPA_CATEGORIES) {
    try {
      console.log(`Scraping PPA ${cat}`)
      const md = await scrapeUrlWithClick(app, PPA_URL, `#tab-button-${cat}`)
      const players = parsePpaMarkdown(md)
      if (players.length > 0) {
        rankings.ppa[cat] = { lastUpdated: now, players }
      }
    } catch (err) {
      console.error(`Failed PPA ${cat}:`, err)
    }
  }

  return rankings
}

export function mergeRankings(existing: AllRankings | null, fresh: AllRankings): AllRankings {
  if (!existing) return fresh

  const mergedContinental: AllRankings['dupr']['continental'] = { ...existing.dupr.continental }
  for (const [cont, categories] of Object.entries(fresh.dupr.continental ?? {})) {
    const key = cont as DuprContinent
    mergedContinental[key] = { ...mergedContinental[key], ...categories }
  }

  return {
    dupr: { continental: mergedContinental },
    ppa: { ...existing.ppa, ...fresh.ppa },
  }
}
