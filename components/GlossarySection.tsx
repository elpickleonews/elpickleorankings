import { FAQ } from '@/lib/faq'

export default function GlossarySection() {
  return (
    <section className="bg-[#F4F7E8] py-12">
      <div className="max-w-5xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FAQ.map((item) => (
            <div
              key={item.question}
              className="bg-white rounded-[14px] border border-[#E5E7EB] p-6"
            >
              <h3
                className="font-bold text-lg text-[#0F1F00] mb-3"
                style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
              >
                {item.question}
              </h3>
              <p
                className="text-sm text-[#374151] leading-relaxed"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
              >
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
