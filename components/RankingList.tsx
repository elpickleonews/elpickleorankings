import type { Player } from '@/lib/types'
import { countryFlag } from '@/lib/flag'
import TrendBadge from './TrendBadge'

interface RankingListProps {
  players: Player[]
  metricUnit?: string
}

export default function RankingList({ players, metricUnit = '' }: RankingListProps) {
  const rest = players.slice(3)
  if (rest.length === 0) return null

  return (
    <div className="border border-[#E5E7EB] rounded-[14px] overflow-hidden">
      {rest.map((player, i) => (
        <div
          key={player.rank}
          className={[
            'flex items-center gap-4 px-5 py-4 hover:bg-[#F4F7E8] transition-colors',
            i < rest.length - 1 ? 'border-b border-[#E5E7EB]' : '',
          ].join(' ')}
        >
          {/* Position */}
          <span
            className="w-8 text-lg font-bold text-[#9CA3AF] shrink-0 text-right"
            style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
          >
            {player.rank}
          </span>

          {/* Flag + name */}
          <div className="flex-1 min-w-0">
            <p
              className="font-medium text-[15px] text-[#0F1F00] truncate"
              style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
            >
              {countryFlag(player.country)} {player.name}
            </p>
            <p
              className="text-xs text-[#6B7280] mt-0.5"
              style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
            >
              {player.countryName}
            </p>
          </div>

          {/* Metric */}
          <div className="text-right shrink-0">
            <p
              className="text-base font-bold text-[#0F1F00]"
              style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
            >
              {player.metricLabel}
              {metricUnit && (
                <span className="text-xs font-normal text-[#6B7280] ml-1">{metricUnit}</span>
              )}
            </p>
            <div className="mt-0.5">
              <TrendBadge trend={player.trend} delta={player.trendDelta} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
