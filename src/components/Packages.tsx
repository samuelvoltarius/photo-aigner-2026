'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const pakete = [
  {
    name: 'Essenz',
    hours: '4 Stunden',
    price: '990',
    highlight: false,
    includes: [
      'Bis zu 4 Stunden Begleitung',
      'Standesamt oder Trauung',
      '150+ bearbeitete Fotos',
      'Online-Galerie (90 Tage)',
      'Download in Full-HD',
    ],
  },
  {
    name: 'Erinnerung',
    hours: 'Ganztags',
    price: '1.890',
    highlight: true,
    includes: [
      'Ganztags-Begleitung (bis 10h)',
      'Vorgespräch & Locationbesuch',
      '400+ bearbeitete Fotos',
      'Online-Galerie (unbegrenzt)',
      'Download in Full-HD',
      'Kurzfilm (3–5 Min.)',
      '1 Fotobuch nach Wahl',
    ],
  },
  {
    name: 'Ewigkeit',
    hours: 'Ganztags + Video',
    price: '2.990',
    highlight: false,
    includes: [
      'Ganztags-Begleitung (bis 12h)',
      'Vorgespräch, Engagement-Shooting',
      '600+ bearbeitete Fotos',
      'Cineastischer Hochzeitsfilm',
      'Online-Galerie (unbegrenzt)',
      'Download in 4K',
      '2 Fotobücher nach Wahl',
      'Drohnenaufnahmen',
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
            Alle Preise verstehen sich inkl. USt. Individuelle Anpassungen sind immer möglich —
            sprich mich einfach an.
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
                <span className="label absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-2 text-[9px]"
                  style={{ background: 'var(--color-cream)', color: 'var(--color-black)' }}>
                  Beliebteste Wahl
                </span>
              )}

              <span className="label mb-2 block" style={{ color: p.highlight ? 'rgba(255,255,255,0.7)' : 'var(--color-gold-light)', fontSize: '0.6rem' }}>
                {p.hours}
              </span>
              <h3 className="font-display mb-6" style={{
                color: p.highlight ? 'white' : 'var(--color-cream)',
                fontWeight: 300, fontSize: 'clamp(2rem, 3vw, 2.8rem)'
              }}>
                {p.name}
              </h3>

              <div className="mb-8">
                <span className="font-display" style={{
                  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                  fontWeight: 300,
                  color: p.highlight ? 'white' : 'var(--color-gold-light)'
                }}>
                  € {p.price}
                </span>
              </div>

              <ul className="space-y-3 mb-10 flex-1">
                {p.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span style={{ color: p.highlight ? 'rgba(255,255,255,0.6)' : 'var(--color-gold)', fontSize: '0.55rem', marginTop: '0.4rem' }}>▶</span>
                    <span style={{ fontSize: '0.85rem', color: p.highlight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
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
                  color: p.highlight ? 'white' : 'rgba(255,255,255,0.5)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = p.highlight ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = p.highlight ? 'rgba(255,255,255,0.15)' : 'transparent';
                  e.currentTarget.style.color = p.highlight ? 'white' : 'rgba(255,255,255,0.5)';
                }}
              >
                Paket anfragen
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 text-sm"
          style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 300, fontSize: '0.8rem' }}
        >
          Anreise innerhalb Salzburgs inkludiert · Außerhalb auf Anfrage · Maßgeschneiderte Pakete möglich
        </motion.p>
      </div>
    </section>
  );
}
