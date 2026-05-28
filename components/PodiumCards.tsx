import type { Player } from '@/lib/types'
import { countryFlag } from '@/lib/flag'
import TrendBadge from './TrendBadge'

interface PodiumCardsProps {
  players: Player[]
  metricUnit?: string
}

const ORDINALS = ['1°', '2°', '3°']

export default function PodiumCards({ players, metricUnit = '' }: PodiumCardsProps) {
  const top3 = players.slice(0, 3)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {top3.map((player, i) => {
        const isFirst = i === 0
        return (
          <div
            key={player.rank}
            className={[
              'rounded-[14px] p-6 flex flex-col gap-2 bg-white overflow-hidden border border-[#E5E7EB]',
              isFirst ? 'ring-2 ring-[#C5F230]' : '',
            ].join(' ')}
          >
            <span
              className="text-[40px] font-bold text-[#C5F230] leading-none"
              style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
            >
              {ORDINALS[i]}
            </span>
            <div>
              <p
                className="font-bold text-xl text-[#0F1F00] leading-snug break-words"
                style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
              >
                {player.name}
              </p>
              <p
                className="text-sm text-[#6B7280] mt-0.5"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
              >
                {countryFlag(player.country)} {player.countryName}
              </p>
            </div>
            <div className="mt-1">
              <p
                className="text-3xl font-bold text-[#0F1F00]"
                style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
              >
                {player.metricLabel}
                {metricUnit && (
                  <span className="text-base font-normal text-[#6B7280] ml-1">{metricUnit}</span>
                )}
              </p>
              <div className="mt-1">
                <TrendBadge trend={player.trend} delta={player.trendDelta} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
