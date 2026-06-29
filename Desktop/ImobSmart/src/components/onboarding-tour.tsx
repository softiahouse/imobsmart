"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "imobsmart_onboarding_done";

interface Step {
  title: string;
  description: string;
  icon: string;
}

const STEPS: Step[] = [
  {
    title: "¡Bienvenido a ImobSmart! 👋",
    icon: "🏠",
    description:
      "Tu plataforma completa para automatizar la publicación de inmuebles, captar leads y cerrar negocios. ¿Hacemos un tour rápido?",
  },
  {
    title: "Dashboard",
    icon: "📊",
    description:
      "Aquí tienes tu visión general: inmuebles publicados, leads calientes, posts de la semana y visitas agendadas. Todo en un solo lugar.",
  },
  {
    title: "Alta de Inmuebles",
    icon: "🏗️",
    description:
      "Añade inmuebles con fotos, detalles y precio. El sistema genera automáticamente el anuncio para publicar en redes sociales.",
  },
  {
    title: "CRM & Pipeline",
    icon: "📋",
    description:
      "Gestiona tus leads con el Kanban visual. Arrastra las tarjetas entre columnas: nuevo → contactado → visita → propuesta → cerrado.",
  },
  {
    title: "Prospección B2B",
    icon: "🔍",
    description:
      "Encuentra nuevas inmobiliarias por ciudad, clasifícalas por presencia digital e importa listas CSV para automatizar la prospección.",
  },
  {
    title: "Autopublicación Social",
    icon: "📱",
    description:
      "Publica automáticamente en Instagram, Facebook, TikTok y Google Ads. Configúralo una vez e ImobSmart se encarga del resto.",
  },
  {
    title: "Agente IA 24/7",
    icon: "🤖",
    description:
      "Tu asistente virtual atiende leads por WhatsApp y Webchat, cualifica interesados, agenda visitas y ¡nunca duerme!",
  },
  {
    title: "¡Todo listo! 🚀",
    icon: "✅",
    description:
      "Estás listo para empezar. Usa el menú lateral para navegar entre las secciones. ¡Buenos negocios!",
  },
];

export function OnboardingTour() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  }

  function prev() {
    if (step > 0) setStep(step - 1);
  }

  if (!visible) return null;

  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={dismiss} />

      <div className="relative glass w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div
          className="h-1 bg-gradient-to-r from-accent to-accent-pink transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="text-4xl">{current.icon}</div>
            <button
              onClick={dismiss}
              className="text-zinc-500 hover:text-white transition-colors text-sm flex items-center gap-1"
            >
              <span>Saltar</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">{current.title}</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">{current.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-zinc-600 text-xs">
              {step + 1} de {STEPS.length}
            </span>

            <div className="flex gap-2">
              {!isFirst && (
                <button
                  onClick={prev}
                  className="glass px-4 py-2 text-sm text-zinc-300 hover:bg-white/10 transition-colors"
                >
                  Atrás
                </button>
              )}
              {isFirst && (
                <button
                  onClick={dismiss}
                  className="glass px-4 py-2 text-sm text-zinc-500 hover:bg-white/10 transition-colors"
                >
                  No, gracias
                </button>
              )}
              <button
                onClick={next}
                className="gradient-button px-5 py-2 text-sm text-white font-semibold"
              >
                {isLast ? "¡Empezar!" : "Siguiente →"}
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-1.5 mt-4">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? "w-6 bg-accent"
                    : i < step
                      ? "w-1.5 bg-accent/40"
                      : "w-1.5 bg-zinc-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
