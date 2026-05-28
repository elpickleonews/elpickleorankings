'use client'

interface CategoryToggleProps {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}

export default function CategoryToggle({ options, value, onChange }: CategoryToggleProps) {
  return (
    <div className="flex gap-0 overflow-x-auto">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={[
              'px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
              active
                ? 'border-[#C5F230] text-[#0F1F00]'
                : 'border-[#E5E7EB] text-[#6B7280] hover:text-[#0F1F00]',
            ].join(' ')}
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
