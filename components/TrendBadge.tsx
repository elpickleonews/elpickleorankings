import type { Trend } from '@/lib/types'

interface TrendBadgeProps {
  trend: Trend
  delta?: string
}

export default function TrendBadge({ trend, delta }: TrendBadgeProps) {
  if (trend === 'up') {
    return (
      <span
        className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#16A34A]"
        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
      >
        ▲ {delta}
      </span>
    )
  }
  if (trend === 'down') {
    return (
      <span
        className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#DC2626]"
        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
      >
        ▼ {delta}
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#9CA3AF]"
      style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
    >
      ● estable
    </span>
  )
}
