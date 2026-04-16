'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function VideoHighlight() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="section" style={{ background: 'var(--color-black)' }}>
      <div className="container">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="label mb-5 block">Showreel</span>
            <h2 className="font-display text-[var(--color-text-bright)] mb-6" style={{ fontWeight: 300 }}>
              Bewegtbild,{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--color-green-chili)' }}>
                das bewegt.
              </em>
            </h2>
            <div className="w-10 h-px bg-[var(--color-green-chili)]/50 mb-8" />
            <p className="mb-4">
              Jedes Projekt beginnt mit einem Gespräch — und endet mit
              einem Film, der Ihre Geschichte so erzählt, wie sie verdient wird.
            </p>
            <p>
              Von der ersten Location-Besichtigung bis zum fertigen Schnitt
              begleite ich Sie durch jeden Schritt der Produktion.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
              <div>
                <span className="font-display text-3xl text-[var(--color-green-chili)]" style={{ fontWeight: 300 }}>
                  50+
                </span>
                <p className="label text-[var(--color-text-dim)] text-[9px] mt-1">Projekte realisiert</p>
              </div>
              <div>
                <span className="font-display text-3xl text-[var(--color-green-chili)]" style={{ fontWeight: 300 }}>
                  Salzburg
                </span>
                <p className="label text-[var(--color-text-dim)] text-[9px] mt-1">und österreichweit</p>
              </div>
            </div>
          </motion.div>

          {/* Right: video */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative overflow-hidden cursor-pointer group"
              style={{ aspectRatio: '16/9', background: 'var(--color-black-accent)' }}
              onClick={() => setPlaying(true)}
            >
              {!playing ? (
                <>
                  <img
                    src="https://img.youtube.com/vi/tcXt7rEEHgA/maxresdefault.jpg"
                    alt="GreenChili Showreel"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4 group-hover:bg-black/30 transition-colors duration-300">
                    <div className="w-16 h-16 rounded-full border border-[var(--color-green-chili)]/60 bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:border-[var(--color-green-chili)] group-hover:bg-[var(--color-green-chili)]/10">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="label text-white/80 text-[9px]">Showreel abspielen</span>
                  </div>
                  {/* Corner accents */}
                  {['top-3 left-3 border-t border-l', 'top-3 right-3 border-t border-r', 'bottom-3 left-3 border-b border-l', 'bottom-3 right-3 border-b border-r'].map((cls, i) => (
                    <div key={i} className={`absolute w-5 h-5 ${cls} border-[var(--color-green-chili)]/30 pointer-events-none`} />
                  ))}
                </>
              ) : (
                <iframe
                  className="w-full h-full border-none"
                  src="https://www.youtube.com/embed/tcXt7rEEHgA?autoplay=1&rel=0&modestbranding=1&vq=hd1080"
                  title="GreenChili Productions – Showreel"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
