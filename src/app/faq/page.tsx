'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

type FAQItem = {
  q: string;
  a: string;
};

const faqs: FAQItem[] = [
  {
    q: 'Werden Foto- und Videoproduktionen angeboten?',
    a: 'Ja. Green Chili produziert sowohl Foto als auch Video. Mit der Sony FX6 und FX3 bieten wir cineastische Qualität für jedes Projekt.',
  },
  {
    q: 'Wie läuft eine Zusammenarbeit ab?',
    a: 'Unverbindliches Erstgespräch, individuelles Angebot, danach Planung, Produktion und termingerechte Nachbearbeitung inkl. Grading.',
  },
  {
    q: 'Was kostet eine Produktion?',
    a: 'Richtet sich nach Art und Umfang. Content-Pakete starten ab €599, High-End Imagefilme ab €2.999.',
  },
  {
    q: 'Wie lange dauert die Lieferung?',
    a: 'Ø 7–14 Werktage. Express-Lieferung für Social Media Content auf Anfrage möglich.',
  },
  {
    q: 'Nur regional verfügbar?',
    a: 'Unsere Basis ist Salzburg, aber wir sind europaweit für unsere Kunden im Einsatz. Reisekosten werden individuell vereinbart.',
  },
  {
    q: 'Bietest du Drohnenaufnahmen an?',
    a: 'Ja, ich bin spezialisiert auf cineastische Drohnenflüge, FPV-Aufnahmen, Thermografie und industrielle 3D-Vermessung.',
  },
  {
    q: 'Erstellst du Inhalte für Social Media?',
    a: 'Absolut. Ich produziere hochkant-optimierte Reels und Shorts, die technisches Know-how mit kreativem Storytelling vereinen.',
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[var(--color-black)] text-[var(--color-text-bright)]">
      {/* Header */}
      <div className="bg-[var(--color-black-soft)] py-24 lg:py-32 border-b border-[var(--color-green-chili)]/10">
        <div className="container mx-auto px-6 lg:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--color-text-dim)] hover:text-[var(--color-green-chili)] transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm tracking-widest uppercase font-mono">Zurück zur Startseite</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[var(--color-green-chili)] text-sm tracking-[0.2em] uppercase mb-4 block font-mono">
              Fragen & Antworten
            </span>
            <h1 className="font-serif text-4xl lg:text-5xl text-[var(--color-text-bright)]">
              FAQ
            </h1>
            <div className="w-16 h-px bg-[var(--color-green-chili)] mt-6" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="container mx-auto px-6 lg:px-12 py-16 lg:py-24"
      >
        <div className="max-w-4xl space-y-8">
          {faqs.map((item, idx) => (
            <div key={item.q} className="bg-[var(--color-black-soft)] p-8 border border-[var(--color-green-chili)]/10 hover:border-[var(--color-green-chili)]/30 transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-serif text-xl md:text-2xl text-[var(--color-text-bright)] leading-snug uppercase tracking-tight">
                  {item.q}
                </h2>
                <span className="text-[var(--color-green-chili)] font-mono text-sm">{String(idx + 1).padStart(2, '0')}</span>
              </div>
              <p className="text-[var(--color-text-dim)] leading-relaxed mt-4 whitespace-pre-line">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="border-t border-[var(--color-green-chili)]/10 py-8">
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          <Link href="/" className="text-[var(--color-text-dim)] hover:text-[var(--color-green-chili)] transition-colors text-sm font-mono">
            ← Zurück zur Startseite
          </Link>
          <Link href="/impressum" className="text-[var(--color-text-dim)] hover:text-[var(--color-green-chili)] transition-colors text-sm font-mono">
            Impressum →
          </Link>
        </div>
      </div>
    </main>
  );
}
