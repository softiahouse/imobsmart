import { useTranslations } from 'next-intl';
import Image from 'next/image';

const photos = [
  { src: '/fotos/nk-mesa-2.jpg', alt: 'NK — Mesa decorativa', tall: true },
  { src: '/fotos/sala-tratamento-1.jpg', alt: 'Sala de tratamento 1', tall: false },
  { src: '/fotos/cafe.jpg', alt: 'Área de café', tall: false },
  { src: '/fotos/sala-tratamento-2.jpg', alt: 'Sala de tratamento 2', tall: false },
  { src: '/fotos/arte-gold.jpg', alt: 'Arte gold', tall: false },
];

export default function Galeria() {
  const t = useTranslations('gallery');

  return (
    <section id="gallery" className="bg-marble py-24 px-8 md:px-20">
      <div className="max-w-7xl mx-auto">
        <p className="section-label">{t('label')}</p>
        <h2 className="section-title">
          {t('title')}<br />
          <em className="italic">{t('titleItalic')}</em>
        </h2>

        <div className="mt-14 grid grid-cols-3 grid-rows-2 gap-1" style={{ height: '580px' }}>
          {photos.map((photo) => (
            <div
              key={photo.src}
              className={`relative overflow-hidden ${photo.tall ? 'row-span-2' : ''} group`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
