import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Tecnologia() {
  const t = useTranslations('technology');

  const features = [
    { icon: '◉', title: t('feature1Title'), desc: t('feature1Desc') },
    { icon: '◎', title: t('feature2Title'), desc: t('feature2Desc') },
    { icon: '◈', title: t('feature3Title'), desc: t('feature3Desc') },
  ];

  return (
    <section id="technology" className="bg-white py-24 px-8 md:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Text */}
        <div>
          <p className="section-label">{t('label')}</p>
          <h2 className="section-title">
            {t('title')}<br />
            <em className="italic">{t('titleItalic')}</em>
          </h2>
          <div className="section-divider" />
          <p className="text-[15px] leading-relaxed text-text-muted mb-10">{t('text')}</p>
          <div className="flex flex-col gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4 items-start">
                <div className="w-10 h-10 flex-shrink-0 border border-gold flex items-center justify-center text-gold text-base">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">{f.title}</h4>
                  <p className="text-[13px] text-text-muted leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo */}
        <div className="relative h-[400px] md:h-[480px]">
          <Image
            src="/fotos/scanner-ia.jpg"
            alt="Scanner de análise facial por IA"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
