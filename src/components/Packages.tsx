'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const pakete = [
  {
    name: 'Klassik',
    subtitle: 'Perfekt für intime Feiern',
    price: '2.490',
    highlight: false,
    includes: [
      '6 Stunden Begleitung',
      'Getting Ready Dokumentation',
      'Zeremonie & Empfang',
      '300+ bearbeitete Fotos',
      'Online-Galerie',
      'USB-Stick mit Originaldateien',
    ],
  },
  {
    name: 'Premium',
    subtitle: 'Das exklusive Hybrid-Paket (Foto & Video)',
    price: '3.899',
    highlight: true,
    includes: [
      '10 Stunden Begleitung',
      'Highlight-Film & Trailer',
      'Sony FX6 Cinema Look',
      'Alle bearbeiteten Fotos',
      'Online-Galerie mit Download',
      'Drohnenaufnahmen inklusive',
    ],
  },
  {
    name: 'Exklusiv',
    subtitle: 'Für unvergessliche Erlebnisse',
    price: '5.990',
    highlight: false,
    includes: [
      'Unbegrenzte Begleitung',
      'Komplette Dokumentation',
      '800+ bearbeitete Fotos',
      'Premium Fotobuch (40×30 cm)',
      'Fine Art Prints (5 Stück)',
      'Drohnenaufnahmen',
      'Same-Day-Edit Video',
      'Nachbesprechung & Styling-Beratung',
    ],
  },
];

export default function Packages() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="pakete" className="section" style={{ background: 'var(--color-black)' }} ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <span className="label mb-5 block" style={{ color: 'var(--color-gold-light)' }}>Pakete &amp; Preise</span>
          <h2 className="font-display" style={{ color: 'var(--color-cream)', fontWeight: 300 }}>
            Einfach,{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--color-gold-light)' }}>transparent.</em>
          </h2>
          <p className="mt-4 max-w-lg" style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 300 }}>
            Alle Preise inkl. USt. Anreise in Salzburg inkludiert —
            weitere Regionen auf Anfrage. Individuelle Wünsche sind immer willkommen.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {pakete.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="flex flex-col p-10 relative"
              style={{
                background: p.highlight ? 'var(--color-gold)' : 'var(--color-black-soft)',
                border: p.highlight ? 'none' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {p.highlight && (
                <span
                  className="label absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-2"
                  style={{ background: 'var(--color-cream)', color: 'var(--color-black)', fontSize: '0.55rem' }}
                >
                  Beliebt
                </span>
              )}

              <h3
                className="font-display mb-1"
                style={{ color: p.highlight ? 'white' : 'var(--color-cream)', fontWeight: 300, fontSize: 'clamp(2rem, 3vw, 2.8rem)' }}
              >
                {p.name}
              </h3>
              <p className="mb-6" style={{ color: p.highlight ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.3)', fontSize: '0.82rem', fontWeight: 300, lineHeight: 1.5 }}>
                {p.subtitle}
              </p>

              <div className="mb-8">
                <span
                  className="font-display"
                  style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 300, color: p.highlight ? 'white' : 'var(--color-gold-light)' }}
                >
                  € {p.price}
                </span>
              </div>

              <ul className="space-y-3 mb-10 flex-1">
                {p.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span style={{ color: p.highlight ? 'rgba(255,255,255,0.5)' : 'var(--color-gold)', fontSize: '0.5rem', marginTop: '0.45rem', flexShrink: 0 }}>▶</span>
                    <span style={{ fontSize: '0.85rem', color: p.highlight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#kontakt"
                className="label text-center py-4 block transition-all duration-300"
                style={{
                  background: p.highlight ? 'rgba(255,255,255,0.15)' : 'transparent',
                  border: `1px solid ${p.highlight ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  color: p.highlight ? 'white' : 'rgba(255,255,255,0.4)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.22em',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = p.highlight ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = p.highlight ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = p.highlight ? 'rgba(255,255,255,0.15)' : 'transparent';
                  e.currentTarget.style.color = p.highlight ? 'white' : 'rgba(255,255,255,0.4)';
                  e.currentTarget.style.borderColor = p.highlight ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)';
                }}
              >
                Anfragen
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
          style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 300, fontSize: '0.78rem' }}
        >
          Anreise innerhalb Salzburgs inkludiert · Außerhalb auf Anfrage · Maßgeschneiderte Kombinationen möglich
        </motion.p>
      </div>
    </section>
  );
}
