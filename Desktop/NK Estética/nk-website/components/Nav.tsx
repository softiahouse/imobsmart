'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const locales = ['es', 'en', 'pt'] as const;

export default function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const navLinks = [
    { href: '#services', label: t('services') },
    { href: '#about', label: t('about') },
    { href: '#gallery', label: t('gallery') },
    { href: '#technology', label: t('technology') },
    { href: '#contact', label: t('contact') },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm' : 'bg-cream/90 backdrop-blur-sm'
      } border-b border-gold/20`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-[70px] flex items-center justify-between">
        {/* Logo */}
        <a href={`/${locale}`} className="font-serif text-3xl font-semibold tracking-widest">
          N<span className="text-gold">K</span>
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] tracking-[2px] uppercase text-text-muted hover:text-gold transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: lang switcher + CTA */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-1">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`text-[9px] tracking-[1px] uppercase px-2 py-1 rounded transition-all ${
                  locale === loc
                    ? 'bg-gold text-white'
                    : 'text-text-muted hover:text-gold'
                }`}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            href="#contact"
            className="hidden md:block bg-gold text-white text-[10px] tracking-[2px] uppercase px-5 py-3 hover:bg-[#b8935a] transition-colors duration-200"
          >
            {t('book')}
          </a>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-px bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-px bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-px bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-cream border-t border-gold/20 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] tracking-[2px] uppercase text-text-muted hover:text-gold"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => { switchLocale(loc); setMenuOpen(false); }}
                className={`text-[9px] tracking-[1px] uppercase px-2 py-1 rounded ${
                  locale === loc ? 'bg-gold text-white' : 'text-text-muted'
                }`}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            href="#contact"
            className="bg-gold text-white text-[10px] tracking-[2px] uppercase px-5 py-3 text-center"
            onClick={() => setMenuOpen(false)}
          >
            {t('book')}
          </a>
        </div>
      )}
    </nav>
  );
}
