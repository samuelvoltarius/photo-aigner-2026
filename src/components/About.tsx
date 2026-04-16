'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="ueber" className="section" style={{ background: 'var(--color-cream)' }} ref={ref}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-center">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative img-reveal" style={{ aspectRatio: '3/4' }}>
              <img
                src="/images/alfred.jpg"
                alt="Alfred Aigner – Hochzeitsfotograf Salzburg"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Gold accent line */}
            <div className="absolute top-8 -left-4 w-1 h-32 bg-gradient-to-b from-transparent via-[var(--color-gold)] to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="label mb-5 block">Hallo, ich bin</span>
            <h2 className="font-display mb-2" style={{ fontWeight: 300 }}>Alfred Aigner</h2>
            <p className="font-display mb-10" style={{
              fontStyle: 'italic', color: 'var(--color-gold)',
              fontSize: 'clamp(1.3rem, 2vw, 1.8rem)', fontWeight: 300
            }}>
              Fotograf &amp; Videograf · Salzburg
            </p>

            <div className="w-10 h-px mb-10" style={{ background: 'var(--color-gold)' }} />

            <div className="space-y-5 mb-12">
              <p>
                Ich fotografiere und filme Hochzeiten mit einer einfachen Überzeugung:
                Euer Tag gehört euch — ich halte nur fest, was wirklich passiert.
                Keine gestellten Posen, keine aufgesetzten Momente.
              </p>
              <p>
                Als Videograf und Fotograf aus Salzburg verbinde ich cineastisches
                Gespür mit dem Blick für kleine, kostbare Augenblicke: der erste Blick,
                das Lachen der Mutter, die Gänsehaut beim Ja-Wort.
              </p>
              <p>
                Eure Hochzeit ist einmalig. Eure Bilder sollten es auch sein.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 mb-12" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              {[['2019', 'Dabei seit'], ['50+', 'Hochzeiten'], ['Salzburg', 'Heimatbasis']].map(([val, lbl]) => (
                <div key={lbl}>
                  <span className="font-display block" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 300, color: 'var(--color-gold)' }}>{val}</span>
                  <span className="label text-[9px]" style={{ color: 'var(--color-text-light)' }}>{lbl}</span>
                </div>
              ))}
            </div>

            <a href="#kontakt" className="btn-primary">Jetzt anfragen</a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
