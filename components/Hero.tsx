interface LeadPlayer {
  name: string
  countryName: string
  metricLabel: string
}

interface HeroProps {
  lastUpdated: string | null
  leadPlayer?: LeadPlayer | null
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export default function Hero({ lastUpdated, leadPlayer }: HeroProps) {
  const dateText = lastUpdated ? formatDate(lastUpdated) : null

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-5">
        <h1
          className="font-bold text-[#0F1F00] text-4xl md:text-5xl leading-tight mb-3"
          style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
        >
          Rankings de pickleball
        </h1>
        {leadPlayer ? (
          <p
            className="text-[#374151] text-lg md:text-xl mb-4 leading-relaxed"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
          >
            El ranking DUPR de pickleball en Sudamérica está liderado por{' '}
            <strong className="text-[#0F1F00]">
              {leadPlayer.name} ({leadPlayer.countryName}, {leadPlayer.metricLabel})
            </strong>
            {dateText ? ` al ${dateText}` : ''}. Consulta el top por continente, país y el circuito PPA Tour.
          </p>
        ) : (
          <p
            className="text-[#6B7280] text-lg md:text-xl mb-4"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
          >
            Los nombres que mandan en DUPR y PPA, actualizados cada semana.
          </p>
        )}
        {dateText && (
          <p
            className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wide"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
          >
            Última actualización: {dateText}
          </p>
        )}
      </div>
    </section>
  )
}
