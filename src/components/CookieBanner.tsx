"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-consent";

type ConsentState = "accepted" | "dismissed" | null;

export default function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ConsentState;
    if (stored) setConsent(stored);
  }, []);

  const handleChoice = (choice: ConsentState) => {
    setConsent(choice);
    window.localStorage.setItem(STORAGE_KEY, choice || "dismissed");
  };

  if (consent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-black-accent)] text-[var(--color-text-bright)] border-t border-[var(--color-green-chili)]/20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm md:text-base leading-relaxed max-w-2xl">
          <span className="text-[var(--color-green-chili)] font-bold mr-2 uppercase tracking-wider">Datenschutz:</span>
          Wir nutzen Cookies für grundlegende Funktionen und anonymisierte Nutzungsstatistiken, um Dein Erlebnis zu verbessern.
        </div>
        <div className="flex gap-4 justify-end shrink-0">
          <button
            onClick={() => handleChoice("dismissed")}
            className="px-6 py-2.5 text-xs uppercase tracking-widest border border-[var(--color-text-dim)]/30 text-[var(--color-text-dim)] hover:border-[var(--color-green-chili)] hover:text-[var(--color-green-chili)] transition-all duration-300 font-mono"
          >
            Ablehnen
          </button>
          <button
            onClick={() => handleChoice("accepted")}
            className="px-6 py-2.5 text-xs uppercase tracking-widest bg-[var(--color-green-chili)] text-[var(--color-black)] font-bold hover:bg-[var(--color-green-light)] transition-all duration-300 shadow-[0_0_15px_rgba(0,255,65,0.2)] font-mono"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
