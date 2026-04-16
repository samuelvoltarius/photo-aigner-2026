'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const images = [
  { src: '/images/gallery/wedding-1.jpg', alt: 'Brautpaar im Sonnenlicht',       cols: 2 },
  { src: '/images/gallery/wedding-2.jpg', alt: 'Romantischer Moment',            cols: 1 },
  { src: '/images/gallery/wedding-3.jpg', alt: 'Hochzeitsportrait',              cols: 1 },
  { src: '/images/gallery/event-PHOTO-2025-01-27-17-02-02.jpg',   alt: 'Details des Tages',    cols: 1 },
  { src: '/images/gallery/event-PHOTO-2025-01-27-17-02-54.jpg',   alt: 'Atmosphäre',           cols: 1 },
  { src: '/images/gallery/event-PHOTO-2025-01-27-17-02-02-2.jpg', alt: 'Gemeinsam lachen',     cols: 1 },
];

export default function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section id="galerie" className="section" style={{ background: 'var(--color-cream-soft)' }} ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="label mb-5 block">Galerie</span>
          <h2 className="font-display" style={{ fontWeight: 300 }}>
            Momente,{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>die bleiben</em>
          </h2>
        </motion.div>

        {/* Grid — first image spans 2 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`img-reveal cursor-pointer overflow-hidden ${img.cols === 2 ? 'col-span-2 lg:col-span-2' : ''}`}
              style={{ aspectRatio: img.cols === 2 ? '16/9' : '4/5' }}
              onClick={() => setLightbox(img.src)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <a href="#kontakt" className="btn-outline">Termin &amp; Verfügbarkeit anfragen</a>
        </motion.div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(28,24,21,0.97)' }}
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-[90vw] object-contain" />
          <button
            className="absolute top-6 right-8 text-3xl font-light transition-colors duration-200"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
            onClick={() => setLightbox(null)}
          >✕</button>
        </div>
      )}
    </section>
  );
}
