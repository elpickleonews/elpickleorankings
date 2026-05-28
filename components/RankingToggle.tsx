'use client'

export type RankingType = 'dupr' | 'ppa'

interface RankingToggleProps {
  value: RankingType
  onChange: (v: RankingType) => void
}

const OPTIONS: { value: RankingType; label: string; sub: string }[] = [
  { value: 'dupr', label: 'DUPR', sub: 'Rating universal' },
  { value: 'ppa', label: 'PPA Tour', sub: 'Circuito profesional' },
]

export default function RankingToggle({ value, onChange }: RankingToggleProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      {OPTIONS.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={[
              'flex flex-col items-start px-5 py-3 rounded-[999px] border transition-colors text-left',
              active
                ? 'bg-[#C5F230] border-[#C5F230] text-[#0F1F00]'
                : 'bg-transparent border-[#E5E7EB] text-[#0F1F00] hover:bg-[#F4F7E8]',
            ].join(' ')}
          >
            <span
              className="font-bold text-base leading-tight"
              style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
            >
              {opt.label}
            </span>
            <span
              className="text-xs opacity-70 mt-0.5"
              style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
            >
              {opt.sub}
            </span>
          </button>
        )
      })}
    </div>
  )
}
