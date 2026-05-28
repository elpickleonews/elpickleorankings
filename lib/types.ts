export type Trend = 'up' | 'down' | 'stable'

export interface Player {
  rank: number
  name: string
  country: string       // ISO 3166-1 alpha-2 code, e.g. "MX", "AR"
  countryName: string   // full name in Spanish, e.g. "México"
  metric: number        // raw value: DUPR rating or PPA points
  metricLabel: string   // formatted: "6.842" or "4,200"
  trend: Trend
  trendDelta?: string   // e.g. "+0.12" or "+150"
}

export interface RankingSnapshot {
  lastUpdated: string   // ISO 8601
  players: Player[]
}

export type DuprContinent =
  | 'north_america'
  | 'central_america'
  | 'south_america'
  | 'europe'
  | 'asia'
  | 'oceania'
  | 'africa'

export type DuprCategory =
  | 'mens_doubles'
  | 'womens_doubles'
  | 'mens_singles'
  | 'womens_singles'

export type PpaCategory =
  | 'mens_doubles'
  | 'mens_singles'
  | 'mens_mixed_doubles'
  | 'womens_doubles'
  | 'womens_singles'
  | 'womens_mixed_doubles'

export const DUPR_CONTINENT_LABELS: Record<DuprContinent, string> = {
  north_america:   'Norteamérica',
  central_america: 'Centroamérica y El Caribe',
  south_america:   'Sudamérica',
  europe:          'Europa',
  asia:            'Asia',
  oceania:         'Oceanía',
  africa:          'África',
}

export const DUPR_CATEGORY_LABELS: Record<DuprCategory, string> = {
  mens_doubles:   'Dobles masculino',
  womens_doubles: 'Dobles femenino',
  mens_singles:   'Individual hombre',
  womens_singles: 'Individual femenino',
}

export const PPA_CATEGORY_LABELS: Record<PpaCategory, string> = {
  mens_doubles:        'Dobles masculinos',
  mens_singles:        'Individual masculino',
  mens_mixed_doubles:  'Dobles hombres mixto',
  womens_doubles:      'Dobles mujer',
  womens_singles:      'Individual mujer',
  womens_mixed_doubles:'Dobles mujer mixto',
}

export interface AllRankings {
  dupr: {
    continental: Partial<Record<DuprContinent, Partial<Record<DuprCategory, RankingSnapshot>>>>
  }
  ppa: Partial<Record<PpaCategory, RankingSnapshot>>
}
