import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Sobre() {
  const t = useTranslations('about');

  const stats = [
    { num: t('stat1Num'), label: t('stat1Label') },
    { num: t('stat2Num'), label: t('stat2Label') },
    { num: t('stat3Num'), label: t('stat3Label') },
    { num: t('stat4Num'), label: t('stat4Label') },
  ];

  return (
    <section id="about" className="bg-white py-24 px-8 md:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Image — Natasha */}
        <div className="relative h-[520px] md:h-[600px]">
          <Image
            src="/fotos/natasha.jpg"
            alt="Natasha Knaus — Fundadora e CEO da NK Medicina Estética"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Name/title overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-dark/90 to-transparent px-6 py-5">
            <p className="font-serif text-lg text-white leading-tight">{t('founderName')}</p>
            <p className="text-[10px] tracking-[3px] uppercase text-gold-light mt-1">{t('founderTitle')}</p>
          </div>
          {/* Decorative gold border */}
          <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold-light -z-10" />
        </div>

        {/* Text */}
        <div>
          <p className="section-label">{t('label')}</p>
          <h2 className="section-title">
            {t('title')}<br />
            <em className="italic">{t('titleItalic')}</em>
          </h2>
          <div className="section-divider" />
          <p className="text-[15px] leading-relaxed text-text-muted mb-4">{t('text1')}</p>
          <p className="text-[15px] leading-relaxed text-text-muted">{t('text2')}</p>

          <div className="grid grid-cols-2 gap-6 mt-10">
            {stats.map((s) => (
              <div key={s.label} className="border-l-2 border-gold pl-4">
                <div className="font-serif text-3xl font-light">{s.num}</div>
                <div className="text-[11px] uppercase tracking-wide text-text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
