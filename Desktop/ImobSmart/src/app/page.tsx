"use client";

import Link from "next/link";
import { useState } from "react";
import { translations, LANG_FLAGS, LANG_LABELS, type Lang } from "@/lib/landing-i18n";

const NETWORKS = [
  { name: "Instagram", color: "var(--color-ig)" },
  { name: "Facebook", color: "var(--color-fb)" },
  { name: "TikTok", color: "var(--color-tk)" },
  { name: "WhatsApp", color: "var(--color-wa)" },
  { name: "Google Ads", color: "var(--color-gads)" },
];

const STAT_VALUES = ["5+", "24/7", "< 1min", "0€"];

function LangSwitcher({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const langs: Lang[] = ["es", "pt", "en"];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors px-2 py-1 glass rounded-lg"
      >
        <span>{LANG_FLAGS[lang]}</span>
        <span>{LANG_LABELS[lang]}</span>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 glass rounded-lg overflow-hidden min-w-[100px]">
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); setOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${
                  l === lang ? "text-accent bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{LANG_FLAGS[l]}</span>
                <span>{LANG_LABELS[l]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("es");
  const t = translations[lang];

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-t-0 border-x-0 rounded-none">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-accent to-accent-pink bg-clip-text text-transparent">
            ImobSmart
          </span>
          <div className="flex items-center gap-3">
            <LangSwitcher lang={lang} setLang={setLang} />
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2">
              {t.nav.login}
            </Link>
            <Link href="/signup" className="gradient-button px-5 py-2 text-sm text-white font-semibold">
              {t.nav.cta}
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block glass-accent px-4 py-1.5 rounded-full text-xs text-accent-light mb-6">
            {t.hero.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            {t.hero.h1_1}{" "}
            <span className="bg-gradient-to-r from-accent to-accent-pink bg-clip-text text-transparent">
              {t.hero.h1_highlight}
            </span>
            <br />
            {t.hero.h1_2}
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="gradient-button px-8 py-4 text-white font-bold text-lg w-full sm:w-auto text-center"
            >
              {t.hero.cta}
            </Link>
            <a
              href="#funcionalidades"
              className="glass px-8 py-4 text-zinc-300 font-semibold text-lg hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
            >
              {t.hero.secondary}
            </a>
          </div>
          <p className="text-zinc-600 text-xs mt-4">{t.hero.note}</p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[t.stats.networks, t.stats.agent, t.stats.publish, t.stats.start].map((label, i) => (
            <div key={label} className="glass p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent to-accent-pink bg-clip-text text-transparent">
                {STAT_VALUES[i]}
              </p>
              <p className="text-zinc-500 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="funcionalidades" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t.features.title}</h2>
            <p className="text-zinc-500 text-lg">{t.features.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.features.items.map((f) => (
              <div key={f.title} className="glass p-6 hover:bg-white/[0.08] transition-colors group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                  {f.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t.howItWorks.title}</h2>
            <p className="text-zinc-500 text-lg">{t.howItWorks.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {t.howItWorks.steps.map((step) => (
              <div key={step.num} className="glass p-6 flex gap-4">
                <div className="w-10 h-10 flex-shrink-0 rounded-full gradient-button flex items-center justify-center text-white font-bold text-lg">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">{step.title}</h3>
                  <p className="text-zinc-500 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.networks.title}</h2>
          <p className="text-zinc-500 text-lg mb-10">{t.networks.subtitle}</p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {NETWORKS.map((net) => (
              <div key={net.name} className="glass px-6 py-4 text-center" style={{ borderColor: `${net.color}44` }}>
                <p className="font-bold" style={{ color: net.color }}>{net.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto glass-accent p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.cta.title}</h2>
          <p className="text-zinc-400 text-lg mb-8">{t.cta.subtitle}</p>
          <Link href="/signup" className="gradient-button px-10 py-4 text-white font-bold text-lg inline-block">
            {t.cta.button}
          </Link>
          <p className="text-zinc-600 text-xs mt-4">{t.cta.note}</p>
        </div>
      </section>

      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold bg-gradient-to-r from-accent to-accent-pink bg-clip-text text-transparent">
            ImobSmart
          </span>
          <p className="text-zinc-600 text-xs">
            &copy; 2026 ImobSmart — SoftiaHouse. {t.footer.rights}
          </p>
          <div className="flex gap-4 text-zinc-500 text-xs">
            <Link href="/login" className="hover:text-white">{t.footer.login}</Link>
            <Link href="/signup" className="hover:text-white">{t.footer.signup}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
