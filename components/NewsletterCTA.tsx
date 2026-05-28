export default function NewsletterCTA() {
  return (
    <section className="bg-[#0F1F00] py-16 px-5">
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="font-bold text-3xl md:text-4xl text-[#C5F230] mb-3"
          style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
        >
          Para los días que no puedes jugar.
        </h2>
        <p
          className="text-white/80 text-base md:text-lg mb-8"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          El newsletter de pickleball en español. Una vez por semana. Sin relleno.
        </p>
        <a
          href="https://elpickleo.com/"
          className="inline-block px-8 py-3 rounded-[999px] bg-[#C5F230] text-[#0F1F00] font-medium text-sm hover:opacity-90 transition-opacity no-underline"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          Leer el newsletter →
        </a>
      </div>
    </section>
  )
}
