export default function Header() {
  return (
    <header className="bg-[#0F1F00] text-[#C5F230]">
      <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 no-underline">
          <span
            className="font-display font-bold text-xl tracking-tight text-[#C5F230]"
            style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
          >
            El Pickleo
          </span>
        </a>
        <a
          href="https://elpickleo.com/"
          className="font-medium text-sm text-[#0F1F00] bg-[#C5F230] px-4 py-2 rounded-[999px] hover:opacity-90 transition-opacity no-underline"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          Newsletter →
        </a>
      </div>
    </header>
  )
}
