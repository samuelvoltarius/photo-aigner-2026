'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Impressum() {
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
              Rechtliches
            </span>
            <h1 className="font-serif text-4xl lg:text-5xl text-[var(--color-text-bright)]">Impressum</h1>
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
        <div className="max-w-3xl space-y-12">
          <section>
            <h2 className="font-serif text-2xl text-[var(--color-text-bright)] mb-6 uppercase tracking-wider">Unternehmensangaben</h2>
            <div className="space-y-3 text-[var(--color-text-dim)] leading-relaxed">
              <p><span className="font-medium text-[var(--color-text-bright)]">Name:</span> Green Chili Productions</p>
              <p><span className="font-medium text-[var(--color-text-bright)]">Inhaber:</span> Alfred Aigner</p>
              <p><span className="font-medium text-[var(--color-text-bright)]">Adresse:</span> Kaiserschützenstraße 10, Top 18, 5020 Salzburg, Österreich</p>
              <p>
                <span className="font-medium text-[var(--color-text-bright)]">Kontakt:</span> Telefon{' '}
                <a href="tel:+436767901777" className="hover:text-[var(--color-green-chili)] transition-colors text-[var(--color-green-chili)]">+43 676 7901777</a>
                {' '}· E-Mail{' '}
                <a href="mailto:office@greenchili.at" className="hover:text-[var(--color-green-chili)] transition-colors text-[var(--color-green-chili)]">office@greenchili.at</a>
                {' '}· Web <a href="https://www.greenchili.at" className="hover:text-[var(--color-green-chili)] transition-colors text-[var(--color-green-chili)]">greenchili.at</a>
              </p>
              <p><span className="font-medium text-[var(--color-text-bright)]">UID:</span> ATU81930957</p>
              <p><span className="font-medium text-[var(--color-text-bright)]">GISA (Filmproduktion):</span> 28108627 · <span className="font-medium text-[var(--color-text-bright)]">Seit:</span> 02.04.2024</p>
              <p><span className="font-medium text-[var(--color-text-bright)]">GISA (Berufsfotografie):</span> 37021047 LI · <span className="font-medium text-[var(--color-text-bright)]">Seit:</span> 08.10.2015</p>
              <p><span className="font-medium text-[var(--color-text-bright)]">Behörde gem. ECG:</span> Magistrat der Stadt Salzburg</p>
              <p><span className="font-medium text-[var(--color-text-bright)]">Mitglied WKO:</span> Fachgruppe Berufsfotografie & Film-/Videoproduktion, Salzburg</p>
              <p><span className="font-medium text-[var(--color-text-bright)]">Berufsrecht:</span> Gewerbeordnung (ris.bka.gv.at)</p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[var(--color-text-bright)] mb-6 uppercase tracking-wider">Online-Streitbeilegung</h2>
            <p className="text-[var(--color-text-dim)] leading-relaxed">
              Plattform der EU-Kommission zur Online-Streitbeilegung:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-green-chili)] hover:underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              . Ich bin nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[var(--color-text-bright)] mb-6 uppercase tracking-wider">Haftungsausschluss</h2>
            <p className="text-[var(--color-text-dim)] leading-relaxed">
              Inhalte wurden mit größter Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität übernehmen wir keine Gewähr. Bei Bekanntwerden von Rechtsverletzungen werden entsprechende Inhalte umgehend entfernt.
            </p>
          </section>
        </div>
      </motion.div>

      <div className="border-t border-[var(--color-green-chili)]/10 py-8">
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          <Link href="/" className="text-[var(--color-text-dim)] hover:text-[var(--color-green-chili)] transition-colors text-sm font-mono">
            ← Zurück zur Startseite
          </Link>
          <Link href="/datenschutz" className="text-[var(--color-text-dim)] hover:text-[var(--color-green-chili)] transition-colors text-sm font-mono">
            Datenschutzerklärung →
          </Link>
        </div>
      </div>
    </main>
  );
}
