"use client";

import Link from "next/link";
import { useState } from "react";
import { translations, LANG_FLAGS, LANG_LABELS, type Lang } from "@/lib/landing-i18n";

const NETWORKS = [
  { name: "Instagram", icon: "📸", color: "#E1306C", bg: "rgba(225,48,108,0.12)" },
  { name: "Facebook", icon: "📘", color: "#1877F2", bg: "rgba(24,119,242,0.12)" },
  { name: "TikTok", icon: "🎵", color: "#00f2ea", bg: "rgba(0,242,234,0.12)" },
  { name: "WhatsApp", icon: "💬", color: "#25D366", bg: "rgba(37,211,102,0.12)" },
  { name: "Google Ads", icon: "📢", color: "#FBBC05", bg: "rgba(251,188,5,0.12)" },
];

const STAT_VALUES_BASE = ["5+", "24/7", "< 1min"];
const STAT_START: Record<Lang, string> = { es: "9,90€", pt: "R$49", en: "€9.90" };

function LangSwitcher({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const langs: Lang[] = ["es", "pt", "en"];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
      >
        <span>{LANG_FLAGS[lang]}</span>
        <span className="font-medium">{LANG_LABELS[lang]}</span>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-[#1a2332]/95 backdrop-blur-xl rounded-xl overflow-hidden min-w-[110px] border border-white/15 shadow-2xl">
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); setOpen(false); }}
                className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors ${
                  l === lang ? "text-amber-400 bg-white/10" : "text-zinc-300 hover:text-white hover:bg-white/5"
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
    <div className="min-h-screen bg-[#0c1520]" style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all">
        <div className="bg-[#0c1520]/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-amber-500/30">
                IS
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Imob<span className="text-amber-400">Smart</span>
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <LangSwitcher lang={lang} setLang={setLang} />
              <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2 hidden sm:block">
                {t.nav.login}
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 px-5 py-2.5 text-sm text-white font-bold rounded-full shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
              >
                {t.nav.cta}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO — full photo background */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c1520]/70 via-[#0c1520]/60 to-[#0c1520]" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-transparent to-blue-900/20" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 w-full">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300 text-sm font-medium">{t.hero.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
            <span className="text-white">{t.hero.h1_1}</span>
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              {t.hero.h1_highlight}
            </span>
            <br />
            <span className="text-white">{t.hero.h1_2}</span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/signup"
              className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 px-8 py-4 text-white font-bold text-lg rounded-full shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all flex items-center gap-2"
            >
              {t.hero.cta}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <a
              href="#funcionalidades"
              className="px-8 py-4 text-white/80 font-semibold text-lg border border-white/20 rounded-full hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm"
            >
              {t.hero.secondary}
            </a>
          </div>
          <p className="text-white/30 text-xs mt-6">{t.hero.note}</p>
        </div>

        {/* Stats bar at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-5xl mx-auto px-6 pb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[t.stats.networks, t.stats.agent, t.stats.publish, t.stats.start].map((label, i) => (
                <div key={label} className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
                  <p className="text-2xl md:text-3xl font-black text-amber-400">
                    {[...STAT_VALUES_BASE, STAT_START[lang]][i]}
                  </p>
                  <p className="text-white/40 text-xs mt-1 font-medium uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES — warm dark section */}
      <section id="funcionalidades" className="py-24 px-6" style={{ background: "linear-gradient(180deg, #0c1520 0%, #14202e 50%, #0c1520 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-400 text-sm font-bold uppercase tracking-widest">FEATURES</span>
            <h2 className="text-3xl md:text-5xl font-black mt-3 mb-4 text-white">{t.features.title}</h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">{t.features.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.features.items.map((f, i) => {
              const accents = [
                { border: "border-amber-500/30", glow: "group-hover:shadow-amber-500/10" },
                { border: "border-sky-500/30", glow: "group-hover:shadow-sky-500/10" },
                { border: "border-emerald-500/30", glow: "group-hover:shadow-emerald-500/10" },
                { border: "border-violet-500/30", glow: "group-hover:shadow-violet-500/10" },
                { border: "border-rose-500/30", glow: "group-hover:shadow-rose-500/10" },
                { border: "border-cyan-500/30", glow: "group-hover:shadow-cyan-500/10" },
              ];
              const accent = accents[i % accents.length];
              return (
                <div
                  key={f.title}
                  className={`group relative bg-white/[0.04] border ${accent.border} rounded-2xl p-7 hover:bg-white/[0.08] transition-all duration-300 hover:shadow-xl ${accent.glow} hover:-translate-y-1`}
                >
                  <div className="text-4xl mb-5">{f.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — accent background section */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a1040 0%, #0d2847 50%, #1a1040 100%)" }}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(251,191,36,0.15), transparent 60%), radial-gradient(circle at 80% 30%, rgba(59,130,246,0.1), transparent 50%)" }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-sky-400 text-sm font-bold uppercase tracking-widest">HOW IT WORKS</span>
            <h2 className="text-3xl md:text-5xl font-black mt-3 mb-4 text-white">{t.howItWorks.title}</h2>
            <p className="text-white/50 text-lg">{t.howItWorks.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {t.howItWorks.steps.map((step) => (
              <div key={step.num} className="flex gap-5 bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:bg-white/[0.1] transition-all">
                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-amber-500/20">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1.5">{step.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING — lighter warm section */}
      <section id="precios" className="py-24 px-6" style={{ background: "linear-gradient(180deg, #0c1520 0%, #171e28 50%, #0c1520 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">PRICING</span>
            <h2 className="text-3xl md:text-5xl font-black mt-3 mb-4 text-white">{t.pricing.title}</h2>
            <p className="text-white/50 text-lg">{t.pricing.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {t.pricing.plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-amber-500/10 to-orange-500/5 border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 md:scale-105 md:-my-4"
                    : "bg-white/[0.04] border border-white/10 hover:border-white/20"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-1.5 text-xs text-white font-bold rounded-full uppercase tracking-wider shadow-lg">
                    {t.pricing.popular}
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <div className="mb-3">
                  <span className={`text-4xl font-black ${plan.highlighted ? "text-amber-400" : "text-white"}`}>
                    {plan.price}
                  </span>
                  <span className="text-white/40 text-sm ml-1">{plan.priceNote}</span>
                </div>
                {plan.trial && (
                  <div className="mb-5 inline-block bg-emerald-500/12 border border-emerald-500/25 px-3 py-1.5 rounded-full text-emerald-400 text-xs font-semibold w-fit">
                    {t.pricing.trialNote}
                  </div>
                )}
                {!plan.trial && <div className="mb-5" />}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/55">
                      <span className={`mt-0.5 text-xs ${plan.highlighted ? "text-amber-400" : "text-emerald-400"}`}>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center py-3.5 rounded-full font-bold text-sm transition-all ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                      : "bg-white/[0.06] border border-white/15 text-white/80 hover:bg-white/[0.12] hover:text-white"
                  }`}
                >
                  {plan.highlighted ? t.pricing.ctaPro : t.pricing.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NETWORKS — blue-tinted section */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0d1f35 0%, #162840 50%, #0d1f35 100%)" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 50% 80%, rgba(37,211,102,0.2), transparent 50%)" }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-green-400 text-sm font-bold uppercase tracking-widest">INTEGRATIONS</span>
          <h2 className="text-3xl md:text-5xl font-black mt-3 mb-4 text-white">{t.networks.title}</h2>
          <p className="text-white/50 text-lg mb-12">{t.networks.subtitle}</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {NETWORKS.map((net) => (
              <div
                key={net.name}
                className="rounded-2xl px-7 py-5 text-center border transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ background: net.bg, borderColor: `${net.color}33` }}
              >
                <div className="text-3xl mb-2">{net.icon}</div>
                <p className="font-bold text-sm" style={{ color: net.color }}>{net.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — warm gradient section */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a1040 0%, #2a1530 50%, #1a1040 100%)" }}>
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(251,191,36,0.15), transparent 50%)" }} />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-xl border border-white/15 rounded-3xl p-10 md:p-16 text-center shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-black mb-5 text-white leading-tight">{t.cta.title}</h2>
            <p className="text-white/50 text-lg mb-10 max-w-lg mx-auto">{t.cta.subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 px-10 py-4 text-white font-bold text-lg rounded-full shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
              >
                {t.cta.button}
              </Link>
              <a
                href="https://wa.me/34602427508"
                target="_blank"
                rel="noopener"
                className="px-8 py-4 text-green-400 font-semibold text-lg border border-green-500/30 rounded-full hover:bg-green-500/10 transition-all flex items-center gap-2"
              >
                💬 WhatsApp
              </a>
            </div>
            <p className="text-white/25 text-xs mt-6">{t.cta.note}</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 border-t border-white/5 bg-[#080e16]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-[10px]">
              IS
            </div>
            <span className="text-sm font-bold text-white">
              Imob<span className="text-amber-400">Smart</span>
            </span>
          </div>
          <p className="text-white/25 text-xs">
            &copy; 2026 ImobSmart — SoftiaHouse. {t.footer.rights}
          </p>
          <div className="flex items-center gap-5 text-white/40 text-xs">
            <a href="https://wa.me/34602427508" target="_blank" rel="noopener" className="hover:text-green-400 flex items-center gap-1 transition-colors">
              💬 +34 602 427 508
            </a>
            <Link href="/login" className="hover:text-white transition-colors">{t.footer.login}</Link>
            <Link href="/signup" className="hover:text-amber-400 transition-colors">{t.footer.signup}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
