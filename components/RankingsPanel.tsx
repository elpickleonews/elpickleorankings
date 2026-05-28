'use client'

import { useState } from 'react'
import type { AllRankings, DuprContinent, DuprCategory, PpaCategory } from '@/lib/types'
import {
  DUPR_CONTINENT_LABELS,
  DUPR_CATEGORY_LABELS,
  PPA_CATEGORY_LABELS,
} from '@/lib/types'
import RankingToggle, { type RankingType } from './RankingToggle'
import CategoryToggle from './CategoryToggle'
import PodiumCards from './PodiumCards'
import RankingList from './RankingList'

interface RankingsPanelProps {
  rankings: AllRankings
}

export default function RankingsPanel({ rankings }: RankingsPanelProps) {
  const [rankingType, setRankingType] = useState<RankingType>('dupr')

  // DUPR state
  const [continent, setContinent] = useState<DuprContinent>('south_america')
  const [duprCategory, setDuprCategory] = useState<DuprCategory>('mens_singles')

  // PPA state
  const [ppaCategory, setPpaCategory] = useState<PpaCategory>('mens_singles')

  // Build current snapshot
  let snapshot = null
  const metricUnit = rankingType === 'dupr' ? 'pts DUPR' : 'pts PPA'

  if (rankingType === 'dupr') {
    snapshot = rankings.dupr.continental?.[continent]?.[duprCategory] ?? null
  } else {
    snapshot = rankings.ppa?.[ppaCategory] ?? null
  }

  // Continent options — only those with data
  const continentOptions = (Object.keys(DUPR_CONTINENT_LABELS) as DuprContinent[])
    .filter((k) => rankings.dupr.continental?.[k])
    .map((k) => ({ value: k, label: DUPR_CONTINENT_LABELS[k] }))

  // DUPR category options — only those with data in the current continent
  const duprCategoryOptions = (Object.keys(DUPR_CATEGORY_LABELS) as DuprCategory[])
    .filter((k) => rankings.dupr.continental?.[continent]?.[k])
    .map((k) => ({ value: k, label: DUPR_CATEGORY_LABELS[k] }))

  // PPA category options — only those with data
  const ppaOptions = (Object.keys(PPA_CATEGORY_LABELS) as PpaCategory[])
    .filter((k) => rankings.ppa?.[k])
    .map((k) => ({ value: k, label: PPA_CATEGORY_LABELS[k] }))

  // When switching continent, reset to first available category for that continent
  function handleContinentChange(v: string) {
    const next = v as DuprContinent
    setContinent(next)
    const available = (Object.keys(DUPR_CATEGORY_LABELS) as DuprCategory[])
      .filter((k) => rankings.dupr.continental?.[next]?.[k])
    if (available.length > 0 && !rankings.dupr.continental?.[next]?.[duprCategory]) {
      setDuprCategory(available[0])
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10 space-y-5">
      {/* Top-level: DUPR / PPA */}
      <RankingToggle value={rankingType} onChange={setRankingType} />

      {/* DUPR: continent tabs → category tabs */}
      {rankingType === 'dupr' && (
        <>
          {continentOptions.length > 0 && (
            <CategoryToggle
              options={continentOptions}
              value={continent}
              onChange={handleContinentChange}
            />
          )}
          {duprCategoryOptions.length > 0 && (
            <CategoryToggle
              options={duprCategoryOptions}
              value={duprCategory}
              onChange={(v) => setDuprCategory(v as DuprCategory)}
            />
          )}
        </>
      )}

      {/* PPA: category tabs */}
      {rankingType === 'ppa' && ppaOptions.length > 0 && (
        <CategoryToggle
          options={ppaOptions}
          value={ppaCategory}
          onChange={(v) => setPpaCategory(v as PpaCategory)}
        />
      )}

      {/* Rankings content */}
      {snapshot ? (
        <div className="space-y-5">
          <PodiumCards players={snapshot.players} metricUnit={metricUnit} />
          <RankingList players={snapshot.players} metricUnit={metricUnit} />
        </div>
      ) : (
        <p
          className="py-16 text-center text-[#6B7280] text-sm"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          No hay datos disponibles para esta selección.
        </p>
      )}
    </div>
  )
}
