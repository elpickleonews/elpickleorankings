interface HeroProps {
  lastUpdated: string | null
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export default function Hero({ lastUpdated }: HeroProps) {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-5">
        <h1
          className="font-bold text-[#0F1F00] text-4xl md:text-5xl leading-tight mb-3"
          style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
        >
          Rankings de pickleball
        </h1>
        <p
          className="text-[#6B7280] text-lg md:text-xl mb-4"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          Los nombres que mandan en DUPR y PPA, actualizados cada semana.
        </p>
        {lastUpdated && (
          <p
            className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wide"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
          >
            Última actualización: {formatDate(lastUpdated)}
          </p>
        )}
      </div>
    </section>
  )
}
