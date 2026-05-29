import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-[#0f0f0f] text-white/50 px-8 md:px-20 pt-12 pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          <div className="col-span-2 md:col-span-1">
            <div className="font-serif text-3xl font-semibold text-white mb-3">
              N<span className="text-gold">K</span>
            </div>
            <p className="text-sm leading-relaxed max-w-[260px]">{t('description')}</p>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[3px] uppercase text-white/80 mb-4">{t('servicesTitle')}</h4>
            <ul className="flex flex-col gap-2.5">
              {['Harmonización Facial', 'Toxina Botulínica', 'Estética Corporal', 'Aparatología'].map((s) => (
                <li key={s} className="text-sm hover:text-gold cursor-pointer transition-colors">{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[3px] uppercase text-white/80 mb-4">{t('clinicTitle')}</h4>
            <ul className="flex flex-col gap-2.5">
              {['Sobre Nosotros', 'Tecnología', 'Galería', 'Contacto'].map((s) => (
                <li key={s} className="text-sm hover:text-gold cursor-pointer transition-colors">{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[3px] uppercase text-white/80 mb-4">{t('languagesTitle')}</h4>
            <ul className="flex flex-col gap-2.5">
              {['🇪🇸 Español', '🇬🇧 English', '🇧🇷 Português'].map((s) => (
                <li key={s} className="text-sm hover:text-gold cursor-pointer transition-colors">{s}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 pt-5 text-[11px]">
          <span>{t('copyright')}</span>
          <span>Av. Habaneras, 115 · +34 621 661 700</span>
        </div>
      </div>
    </footer>
  );
}
