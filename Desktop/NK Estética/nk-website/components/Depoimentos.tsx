'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Depoimentos() {
  const t = useTranslations('testimonials');
  const items = t.raw('items') as Array<{ text: string; name: string; service: string }>;
  const [active, setActive] = useState(0);

  return (
    <section className="bg-white py-24 px-8 md:px-20">
      <div className="max-w-4xl mx-auto text-center">
        <p className="section-label mx-auto">{t('label')}</p>
        <h2 className="section-title">
          {t('title')} <em className="italic">{t('titleItalic')}</em>
        </h2>
        <div className="w-12 h-px bg-gold mx-auto mb-12" />

        {/* Active testimonial */}
        <div className="min-h-[140px] flex flex-col items-center justify-center mb-8">
          <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-gold text-lg">★</span>
            ))}
          </div>
          <p className="text-[16px] md:text-lg font-light leading-relaxed text-text-muted max-w-2xl italic mb-6">
            &ldquo;{items[active].text}&rdquo;
          </p>
          <p className="font-semibold text-sm tracking-wide">{items[active].name}</p>
          <p className="text-[11px] uppercase tracking-[2px] text-gold mt-1">{items[active].service}</p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === active ? 'bg-gold scale-125' : 'bg-gold/30'
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
