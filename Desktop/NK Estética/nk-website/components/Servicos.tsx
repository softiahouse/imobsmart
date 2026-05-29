import { useTranslations } from 'next-intl';

export default function Servicos() {
  const t = useTranslations('services');
  const categories = t.raw('categories') as Array<{ title: string; desc: string; count: string }>;

  return (
    <section id="services" className="bg-cream py-24 px-8 md:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Intro */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-end">
          <div>
            <p className="section-label">{t('label')}</p>
            <h2 className="section-title">
              {t('title')}<br />
              <em className="italic">{t('titleItalic')}</em>
            </h2>
            <div className="section-divider" />
          </div>
          <p className="text-[15px] leading-relaxed text-text-muted">{t('subtitle')}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px]">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="group bg-white p-8 cursor-pointer border-b-2 border-transparent hover:bg-green-dark hover:border-gold transition-all duration-300 relative"
            >
              <span className="text-2xl text-gold group-hover:text-gold mb-4 block">✦</span>
              <h3 className="font-serif text-lg font-semibold text-[#1A1A1A] group-hover:text-white mb-2.5 leading-tight">
                {cat.title}
              </h3>
              <p className="text-xs text-text-muted group-hover:text-white/65 leading-relaxed">{cat.desc}</p>
              <span className="absolute top-7 right-6 text-[10px] text-gold-light font-serif">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
