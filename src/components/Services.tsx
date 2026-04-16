'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const services = [
  {
    id: 'cine',
    icon: '▶',
    title: 'Cine Video',
    subtitle: 'Cineastische Videoproduktion',
    description:
      'Von Corporate Films über Imagevideos bis zu Eventdokumentationen — mit der Sony FX6 produziere ich Inhalte auf Kinoniveau, die Ihre Marke emotional verankern.',
    highlights: ['4K RAW', 'Colour Grading', 'Schnitt & Ton', 'Soundtrack-Lizenzierung'],
  },
  {
    id: 'immo',
    icon: '⌂',
    title: 'Immobilien',
    subtitle: 'Immobilien- & Architekturfilm',
    description:
      'Hochwertige Foto- und Videoaufnahmen für Makler, Bauträger und Architekten. Drohnenflug, Innenräume und virtuelle Touren aus einer Hand.',
    highlights: ['Drohnenaufnahmen', 'Innenraum-Shooting', 'Twilight-Aufnahmen', 'Virtuelle Tour'],
  },
  {
    id: 'hotel',
    icon: '✦',
    title: 'Hotellerie & Gastro',
    subtitle: 'Hospitality Content',
    description:
      'Imagefilme, Social-Content und Food-Fotografie für Hotels, Restaurants und Resorts — visuell so ansprechend wie Ihr Angebot.',
    highlights: ['Image-Film', 'Social Media Cuts', 'Food & Ambiente', 'Reels & Stories'],
  },
  {
    id: 'thermo',
    icon: '◉',
    title: 'ChiliView Thermografie',
    subtitle: 'Gebäude-Thermografie per Drohne',
    description:
      'Mit dem DJI M30T erfassen wir Wärmebrücken, Feuchtigkeitsschäden und Fassadenmängel aus der Luft — schnell, präzise, zertifiziert.',
    highlights: ['DJI M30T Drohne', 'DACH-Zertifizierung', 'Detaillierter Bericht', 'Solarpanel-Inspektion'],
  },
  {
    id: 'mapping',
    icon: '◎',
    title: 'Mapping & Industrie',
    subtitle: 'Industrielle Luftaufnahmen',
    description:
      'Orthofotos, 3D-Modelle und Vermessungsflüge für Bauprojekte, Agrar und Infrastruktur. Professionelle Drohnendienstleistungen mit Genehmigungsmanagement.',
    highlights: ['Orthofotos', '3D-Modellierung', 'Baufortschritt', 'GIS-Export'],
  },
  {
    id: 'agrar',
    icon: '❋',
    title: 'Land- & Forstwirtschaft',
    subtitle: 'Agrar-Luftaufnahmen',
    description:
      'Bestandsaufnahmen, Schadenserfassung und Monitoring für Landwirte, Forstbetriebe und Versicherungen — effizient und kostensparend.',
    highlights: ['Flächenmonitoring', 'Schadenserfassung', 'NDVI-Analyse', 'Versicherungsberichte'],
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="services" className="section" style={{ background: 'var(--color-black-soft)' }} ref={ref}>
      <div className="container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <span className="label mb-5 block">Leistungen</span>
          <h2 className="font-display text-[var(--color-text-bright)] mb-6" style={{ fontWeight: 300 }}>
            Was ich{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--color-green-chili)' }}>
              für Sie tue
            </em>
          </h2>
          <p className="max-w-xl" style={{ color: 'var(--color-text-dim)' }}>
            Jedes Projekt ist einzigartig — daher gibt es kein starres Paket, sondern
            ein maßgeschneidertes Angebot. Sprechen Sie mich einfach an.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {services.map((s, index) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="group p-10 bg-[var(--color-black-soft)] hover:bg-[var(--color-black-accent)] transition-colors duration-300 flex flex-col"
            >
              {/* Icon */}
              <span
                className="text-2xl mb-6 block transition-colors duration-300"
                style={{ color: 'var(--color-green-chili)', fontFamily: 'var(--font-mono)' }}
              >
                {s.icon}
              </span>

              {/* Title */}
              <h3
                className="font-display text-[var(--color-text-bright)] mb-1"
                style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', fontWeight: 400 }}
              >
                {s.title}
              </h3>
              <p className="label text-[8px] mb-5" style={{ color: 'var(--color-green-chili)' }}>
                {s.subtitle}
              </p>

              {/* Description */}
              <p className="text-sm leading-relaxed mb-8 flex-1" style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
                {s.description}
              </p>

              {/* Highlights */}
              <ul className="space-y-2 mb-8">
                {s.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3">
                    <span style={{ color: 'var(--color-green-chili)', fontSize: '0.6rem' }}>▶</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-dim)', fontFamily: 'var(--font-sans)' }}>
                      {h}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#contact"
                className="label text-[9px] flex items-center gap-2 transition-colors duration-300"
                style={{ color: 'var(--color-text-dim)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-green-chili)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-dim)')}
              >
                Angebot anfragen
                <span style={{ fontSize: '1rem', lineHeight: 1 }}>→</span>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 flex flex-col sm:flex-row items-start sm:items-center gap-8 pt-12 border-t border-white/5"
        >
          <div>
            <p className="font-display text-2xl text-[var(--color-text-bright)] mb-1" style={{ fontWeight: 300 }}>
              Kein passendes Angebot dabei?
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>
              Jede Anfrage ist willkommen — ich finde die richtige Lösung für Ihr Projekt.
            </p>
          </div>
          <a href="#contact" className="btn-primary whitespace-nowrap">
            Jetzt anfragen
          </a>
        </motion.div>

      </div>
    </section>
  );
}
