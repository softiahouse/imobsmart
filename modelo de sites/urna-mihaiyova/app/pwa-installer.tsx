"use client";

import { useEffect } from "react";

/**
 * PWA Installer Component
 * Registers the Service Worker for PWA functionality
 */
export default function PWAInstaller() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered successfully:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return null;
}
