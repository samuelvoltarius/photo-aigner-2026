'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Datenschutz() {
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
            <h1 className="font-serif text-4xl lg:text-5xl text-[var(--color-text-bright)]">
              Datenschutzerklärung
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
        <div className="max-w-3xl">
          {/* Einleitung */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl text-[var(--color-text-bright)] mb-6 uppercase tracking-wider">
              1. Datenschutz auf einen Blick
            </h2>
            <div className="space-y-4 text-[var(--color-text-dim)] leading-relaxed">
              <h3 className="font-medium text-[var(--color-text-bright)] text-lg">Allgemeine Hinweise</h3>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen 
                Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit 
                denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema 
                Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
              </p>
            </div>
          </section>

          {/* Verantwortlicher */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl text-[var(--color-text-bright)] mb-6 uppercase tracking-wider">
              2. Verantwortliche Stelle
            </h2>
            <div className="space-y-4 text-[var(--color-text-dim)] leading-relaxed">
              <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
              <div className="bg-[var(--color-black-soft)] p-6 border-l-4 border-[var(--color-green-chili)]">
                <p className="font-medium text-[var(--color-text-bright)]">Green Chili Productions</p>
                <p>Alfred Aigner</p>
                <p>Salzburg, Österreich</p>
                <p className="mt-4">
                  Telefon: <a href="tel:+436767901777" className="hover:text-[var(--color-green-chili)] transition-colors text-[var(--color-green-chili)]">+43 676 790 1777</a>
                </p>
                <p>
                  E-Mail: <a href="mailto:office@greenchili.at" className="hover:text-[var(--color-green-chili)] transition-colors text-[var(--color-green-chili)]">office@greenchili.at</a>
                </p>
              </div>
            </div>
          </section>

          {/* Datenerfassung */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl text-[var(--color-text-bright)] mb-6 uppercase tracking-wider">
              3. Datenerfassung auf dieser Website
            </h2>
            <div className="space-y-6 text-[var(--color-text-dim)] leading-relaxed">
              <div>
                <h3 className="font-medium text-[var(--color-text-bright)] text-lg mb-3">Server-Log-Dateien</h3>
                <p>
                  Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten 
                  Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
                </p>
                <ul className="list-disc list-inside mt-3 space-y-1 font-mono text-sm">
                  <li>Browsertyp und Browserversion</li>
                  <li>verwendetes Betriebssystem</li>
                  <li>Referrer URL</li>
                  <li>Hostname des zugreifenden Rechners</li>
                  <li>Uhrzeit der Serveranfrage</li>
                  <li>IP-Adresse</li>
                </ul>
                <p className="mt-3">
                  Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die 
                  Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
                </p>
              </div>
            </div>
          </section>

          {/* Kontaktformular */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl text-[var(--color-text-bright)] mb-6 uppercase tracking-wider">
              4. Kontaktformular
            </h2>
            <div className="space-y-4 text-[var(--color-text-dim)] leading-relaxed">
              <p>
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem 
                Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung 
                der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
              </p>
              <div className="bg-[var(--color-black-soft)] p-6 border-l-4 border-[var(--color-green-chili)]">
                <p className="font-medium text-[var(--color-text-bright)] mb-2">Erhobene Daten im Kontaktformular:</p>
                <ul className="list-disc list-inside space-y-1 font-mono text-sm">
                  <li>Name</li>
                  <li>E-Mail-Adresse</li>
                  <li>Telefonnummer (optional)</li>
                  <li>Projekt-Details</li>
                  <li>Location/Ort (optional)</li>
                  <li>Ihre Nachricht</li>
                </ul>
              </div>
              <p>
                Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern 
                Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung 
                vorvertraglicher Maßnahmen erforderlich ist.
              </p>
            </div>
          </section>

          {/* Ihre Rechte */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl text-[var(--color-text-bright)] mb-6 uppercase tracking-wider">
              5. Ihre Rechte
            </h2>
            <div className="space-y-4 text-[var(--color-text-dim)] leading-relaxed">
              <p>Sie haben gemäß DSGVO folgende Rechte:</p>
              <ul className="list-disc list-inside space-y-2 font-mono text-sm">
                <li><span className="text-[var(--color-text-bright)]">Auskunftsrecht (Art. 15 DSGVO)</span></li>
                <li><span className="text-[var(--color-text-bright)]">Berichtigungsrecht (Art. 16 DSGVO)</span></li>
                <li><span className="text-[var(--color-text-bright)]">Löschungsrecht (Art. 17 DSGVO)</span></li>
                <li><span className="text-[var(--color-text-bright)]">Recht auf Einschränkung (Art. 18 DSGVO)</span></li>
                <li><span className="text-[var(--color-text-bright)]">Widerspruchsrecht (Art. 21 DSGVO)</span></li>
              </ul>
              <p className="mt-4">
                Kontakt für Datenschutz-Anfragen: <a href="mailto:office@greenchili.at" className="text-[var(--color-green-chili)] hover:underline">office@greenchili.at</a>
              </p>
            </div>
          </section>
        </div>
      </motion.div>

      {/* Footer Link */}
      <div className="border-t border-[var(--color-green-chili)]/10 py-8">
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          <Link 
            href="/" 
            className="text-[var(--color-text-dim)] hover:text-[var(--color-green-chili)] transition-colors text-sm font-mono"
          >
            ← Zurück zur Startseite
          </Link>
          <Link 
            href="/impressum" 
            className="text-[var(--color-text-dim)] hover:text-[var(--color-green-chili)] transition-colors text-sm font-mono"
          >
            Impressum →
          </Link>
        </div>
      </div>
    </main>
  );
}
