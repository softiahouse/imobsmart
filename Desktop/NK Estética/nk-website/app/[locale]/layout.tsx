import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';

const locales = ['es', 'en', 'pt'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const titles: Record<string, string> = {
    es: 'NK Medicina Estética Avanzada | Torrevieja',
    en: 'NK Advanced Aesthetic Medicine | Torrevieja',
    pt: 'NK Medicina Estética Avançada | Torrevieja',
  };
  const descriptions: Record<string, string> = {
    es: 'Clínica de medicina estética avanzada en Torrevieja. Harmonización facial, botox, bioestimuladores y más. Atención en ES, EN y PT.',
    en: 'Advanced aesthetic medicine clinic in Torrevieja. Facial harmonisation, botox, biostimulators and more. Service in ES, EN & PT.',
    pt: 'Clínica de medicina estética avançada em Torrevieja. Harmonização facial, botox, bioestimuladores e mais. Atendimento em ES, EN e PT.',
  };
  return {
    title: titles[locale] ?? titles.es,
    description: descriptions[locale] ?? descriptions.es,
    openGraph: {
      images: ['/fotos/hero.jpg'],
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
