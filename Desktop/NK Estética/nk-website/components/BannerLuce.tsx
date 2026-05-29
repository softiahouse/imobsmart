import { useTranslations } from 'next-intl';

export default function BannerLuce() {
  const t = useTranslations('banner');

  return (
    <section
      className="relative h-[380px] md:h-[420px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/fotos/loveyourself.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-green-dark/50" />
      <div className="relative z-10 text-center px-6">
        <h2 className="font-serif text-5xl md:text-6xl font-light text-white mb-4">{t('title')}</h2>
        <p className="text-[13px] tracking-[3px] uppercase text-white/80 font-sans">{t('subtitle')} · +34 621 661 700</p>
      </div>
    </section>
  );
}
