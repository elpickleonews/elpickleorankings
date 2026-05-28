export default function GlossarySection() {
  return (
    <section className="bg-[#F4F7E8] py-12">
      <div className="max-w-5xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-6">
            <h3
              className="font-bold text-lg text-[#0F1F00] mb-3"
              style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
            >
              ¿Qué es DUPR?
            </h3>
            <p
              className="text-sm text-[#374151] leading-relaxed"
              style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
            >
              El rating universal del pickleball. Va de 2.0 (recién empiezas) a 8.0 (te ganas la
              vida con esto). Se actualiza con cada partido reportado, sin importar si lo jugaste
              en un torneo o un domingo cualquiera. Si tu DUPR sube 0.05 después de una buena
              semana, es real.
            </p>
          </div>

          <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-6">
            <h3
              className="font-bold text-lg text-[#0F1F00] mb-3"
              style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
            >
              ¿Qué es el PPA Tour?
            </h3>
            <p
              className="text-sm text-[#374151] leading-relaxed"
              style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
            >
              El circuito profesional más importante del pickleball en Estados Unidos. Los mejores
              del mundo juegan aquí por puntos y premios. El ranking PPA refleja cuánto ganaste en
              torneos del año: más finales, más puntos. Si estás en el top 10, vives del pickleball.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
