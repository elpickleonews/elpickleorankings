export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-[#0F1F00] py-8 px-5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p
            className="font-bold text-[#C5F230] text-base"
            style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
          >
            El Pickleo
          </p>
          <p
            className="text-[#C5F230]/50 text-xs mt-0.5"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
          >
            Rankings de pickleball en español
          </p>
        </div>
        <span
          className="text-[#C5F230]/50 text-xs"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          © {year} El Pickleo
        </span>
      </div>
    </footer>
  )
}
