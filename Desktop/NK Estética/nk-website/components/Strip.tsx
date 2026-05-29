import { useTranslations } from 'next-intl';

export default function Strip() {
  const t = useTranslations('strip');
  const items = [t('item1'), t('item2'), t('item3'), t('item4')];

  return (
    <div className="bg-green-dark py-4 px-8 flex flex-wrap gap-6 justify-center items-center">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <span className="text-gold text-base">✦</span>
          <span className="text-[11px] tracking-widest uppercase text-white/85 font-sans">{item}</span>
        </div>
      ))}
    </div>
  );
}
