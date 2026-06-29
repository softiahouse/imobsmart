"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "imobsmart_pwa_dismiss";

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (localStorage.getItem(DISMISS_KEY)) return;

    const standalone = window.matchMedia("(display-mode: standalone)").matches
      || (navigator as unknown as { standalone?: boolean }).standalone;
    if (standalone) return;

    const ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(ios);

    if (ios) {
      setShowBanner(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "true");
    setShowBanner(false);
    setShowIOSGuide(false);
  }

  if (!showBanner) return null;

  if (showIOSGuide) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[90] p-4 animate-in slide-in-from-bottom duration-300">
        <div className="glass rounded-2xl p-4 max-w-md mx-auto space-y-3">
          <div className="flex items-start justify-between">
            <p className="text-white font-semibold text-sm">Instalar ImobSmart en iPhone</p>
            <button onClick={dismiss} className="text-zinc-500 hover:text-white text-lg leading-none">&times;</button>
          </div>
          <div className="space-y-2 text-zinc-400 text-xs">
            <p>1. Toca el icono <span className="inline-block px-1.5 py-0.5 bg-white/10 rounded text-white">&#xFEFF;⬆&#xFE0E;</span> (Compartir) en la barra de Safari</p>
            <p>2. Desplázate hacia abajo y toca <strong className="text-white">"Añadir a la pantalla de inicio"</strong></p>
            <p>3. Toca <strong className="text-white">"Añadir"</strong></p>
          </div>
          <button onClick={dismiss} className="w-full text-center text-xs text-zinc-500 hover:text-white py-1">
            Entendido, cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[90] animate-in slide-in-from-bottom duration-300 md:left-auto md:right-4 md:max-w-sm">
      <div className="glass rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-pink flex items-center justify-center flex-shrink-0">
          <span className="text-lg">📱</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold">Instalar ImobSmart</p>
          <p className="text-zinc-400 text-xs">Acceso rápido desde la pantalla de inicio</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={dismiss} className="text-zinc-500 hover:text-white text-xs px-2 py-1">
            Luego
          </button>
          <button
            onClick={handleInstall}
            className="gradient-button px-3 py-1.5 text-xs text-white font-semibold rounded-lg"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
}
