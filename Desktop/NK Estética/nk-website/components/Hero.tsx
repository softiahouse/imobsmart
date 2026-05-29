'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section id="hero" className="relative mt-[70px] h-[calc(100vh-70px)] min-h-[600px] flex items-center overflow-hidden">
      {/* Background photo */}
      <Image
        src="/fotos/hero.jpg"
        alt="NK Medicina Estética — Recepción"
        fill
        priority
        className="object-cover brightness-[0.6]"
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-20 max-w-[620px]">
        <p className="text-[10px] tracking-[5px] uppercase text-gold-light mb-4 font-sans">
          {t('label')}
        </p>
        <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.1] text-white mb-4">
          {t('title')}<br />
          <em className="italic text-gold-light">{t('titleItalic')}</em>
        </h1>
        <p className="text-sm md:text-base text-white/75 font-light mb-9 leading-relaxed max-w-[480px]">
          {t('subtitle')}
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#contact"
            className="bg-gold text-white text-[11px] tracking-[2px] uppercase px-8 py-4 hover:bg-[#b8935a] transition-colors duration-200"
          >
            {t('cta')} →
          </a>
          <a
            href="#services"
            className="text-white text-[11px] tracking-[2px] uppercase px-8 py-4 border border-white/40 hover:border-white/70 transition-colors duration-200"
          >
            {t('ctaSecondary')}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[9px] tracking-[3px] uppercase text-white/50 font-sans">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gold/80 to-transparent animate-[scrollPulse_2s_infinite]" />
      </div>
    </section>
  );
}
