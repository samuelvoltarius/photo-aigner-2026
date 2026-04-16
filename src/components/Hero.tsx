'use client';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-end overflow-hidden" style={{ background: 'var(--color-black)' }}>
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/gallery/wedding-1.jpg"
          alt="Hochzeitsfotografie Alfred Aigner"
          className="w-full h-full object-cover opacity-70"
          style={{ objectPosition: 'center 30%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container pb-24 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="label mb-6 block" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Hochzeitsfotografie &amp; Videografie · Salzburg
          </span>

          <h1
            className="font-display leading-[0.92] mb-8"
            style={{ color: 'white', fontWeight: 300, fontSize: 'clamp(4rem, 11vw, 10rem)' }}
          >
            Dein Tag,
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--color-gold-light)' }}>für immer.</em>
          </h1>

          <p
            className="font-sans mb-12 max-w-lg leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 300, fontSize: 'clamp(1rem, 1.5vw, 1.15rem)' }}
          >
            Authentische Hochzeitsfotos und -filme, die eure Geschichte erzählen —
            ehrlich, emotional und zeitlos schön.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#pakete" className="btn-primary">Pakete ansehen</a>
            <a href="#kontakt" className="btn-outline-light">Termin anfragen</a>
          </div>
        </motion.div>
      </div>

      {/* Scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 right-8"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
          <span className="label text-[8px]" style={{ color: 'rgba(255,255,255,0.5)' }}>scroll</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
