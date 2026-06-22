'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

const serviceKeys = [
  'Harmonización Facial', 'Toxina Botulínica', 'Bioestimuladores de Colágeno',
  'Tratamentos Faciais', 'Estética Corporal', 'Aparatología Estética',
  'Saúde Capilar', 'Medicina Estética Vascular', 'Estética Íntima Feminina',
  'Estética Íntima Masculina', 'Maquillaje Permanente', 'Outros',
];

type FormState = 'idle' | 'sending' | 'success' | 'error';

export default function Contato() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [form, setForm] = useState({ name: '', phone: '', service: '', message: '' });
  const [status, setStatus] = useState<FormState>('idle');

  const openWhatsApp = () => {
    const parts = [
      `Hola, me llamo ${form.name}.`,
      form.service ? `Me interesa: ${form.service}.` : '',
      form.phone ? `Mi teléfono: ${form.phone}.` : '',
      form.message ? form.message : '',
    ].filter(Boolean).join(' ');
    const url = `https://wa.me/34621661700?text=${encodeURIComponent(parts)}`;
    window.open(url, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`/${locale}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang: locale }),
      });
      if (!res.ok) throw new Error('server error');
      setStatus('success');
      setForm({ name: '', phone: '', service: '', message: '' });
    } catch {
      openWhatsApp();
      setStatus('success');
      setForm({ name: '', phone: '', service: '', message: '' });
    }
  };

  return (
    <section id="contact" className="bg-green-dark py-24 px-8 md:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-24">
        {/* Info */}
        <div>
          <p className="text-[10px] tracking-[4px] uppercase text-gold-light mb-3 font-sans">{t('label')}</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight text-white mb-5">
            {t('title')}<br />
            <em className="italic text-gold-light">{t('titleItalic')}</em>
          </h2>
          <div className="w-12 h-px bg-gold-light mb-10" />

          <div className="flex flex-col gap-7">
            <div className="flex gap-4 items-start">
              <span className="text-gold text-lg mt-0.5">📍</span>
              <div>
                <h4 className="text-[11px] font-semibold text-white uppercase tracking-wide mb-1">{t('addressLabel')}</h4>
                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{t('address')}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-gold text-lg mt-0.5">✉</span>
              <div>
                <h4 className="text-[11px] font-semibold text-white uppercase tracking-wide mb-1">{t('emailLabel')}</h4>
                <a href={`mailto:${t('email')}`} className="text-sm text-white/70 hover:text-gold-light transition-colors">
                  {t('email')}
                </a>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-gold text-lg mt-0.5">📱</span>
              <div>
                <h4 className="text-[11px] font-semibold text-white uppercase tracking-wide mb-1">{t('phoneLabel')}</h4>
                <p className="text-sm text-white/70">+34 621 661 700</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-gold text-lg mt-0.5">🕐</span>
              <div>
                <h4 className="text-[11px] font-semibold text-white uppercase tracking-wide mb-1">{t('hoursLabel')}</h4>
                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{t('hours')}</p>
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP ?? '34621661700'}?text=${encodeURIComponent('Hola! Quiero reservar una cita en NK Medicina Estética. Vengo desde vuestro sitio web 🌿')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 bg-[#25D366] text-white text-[11px] tracking-wide uppercase px-7 py-3.5 hover:bg-[#1ebe5d] transition-colors duration-200"
          >
            <span className="text-lg">💬</span>
            {t('whatsappBtn')}
          </a>
        </div>

        {/* Form */}
        <div>
          {status === 'success' ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-4">✓</div>
                <p className="text-white text-lg font-light">{t('formSuccess')}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                required
                placeholder={t('formName')}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-sm focus:outline-none focus:border-gold"
              />
              <input
                type="tel"
                required
                placeholder={t('formPhone')}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-sm focus:outline-none focus:border-gold"
              />
              <select
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className="bg-white/10 border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-gold appearance-none"
              >
                <option value="" disabled className="text-black">{t('formServiceDefault')}</option>
                {serviceKeys.map((s) => (
                  <option key={s} value={s} className="text-black">{s}</option>
                ))}
              </select>
              <textarea
                rows={4}
                placeholder={t('formMessage')}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none"
              />
              {status === 'error' && (
                <p className="text-red-300 text-sm">{t('formError')}</p>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="bg-gold text-white text-[11px] tracking-[2px] uppercase px-8 py-4 hover:bg-[#b8935a] transition-colors duration-200 disabled:opacity-60"
              >
                {status === 'sending' ? t('formSending') : t('formSubmit')}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
