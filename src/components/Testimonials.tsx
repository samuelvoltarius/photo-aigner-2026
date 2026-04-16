'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Bruckner Immobilien',
    location: 'Salzburg',
    date: 'Dezember 2025',
    quote: 'Die FPV-Aufnahmen von Alfred haben unsere Vermarktung auf ein neues Level gehoben. Absolute Professionalität und ein Auge für das Detail.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800',
  },
  {
    id: 2,
    name: 'Hotel Alpenblick',
    location: 'Zell am See',
    date: 'Oktober 2025',
    quote: 'Herausragende Qualität bei der Hotelfotografie. Die Stimmung wurde perfekt eingefangen, unsere Buchungsrate ist spürbar gestiegen.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
  },
  {
    id: 3,
    name: 'Agrar & Forst GmbH',
    location: 'Pinzgau',
    date: 'September 2025',
    quote: 'Die Thermografie-Scans unserer Anlagen waren präzise und extrem hilfreich für die Wartungsplanung. Top Service!',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800',
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="section bg-[var(--color-black-soft)] overflow-hidden" ref={ref}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[var(--color-green-chili)] text-sm tracking-[0.4em] uppercase mb-4 block font-mono">
            Referenzen
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl text-[var(--color-text-bright)] mb-6 uppercase">
            Stimmen unserer Kunden
          </h2>
          <div className="w-16 h-1 bg-[var(--color-green-chili)] mx-auto" />
        </motion.div>

        {/* Testimonial Slider */}
        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 gap-12 items-center bg-[var(--color-black-accent)] border border-[var(--color-green-chili)]/10 p-4 md:p-8"
            >
              {/* Image */}
              <div className="relative aspect-video md:aspect-[4/5] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <img
                  src={testimonials[current].image}
                  alt={testimonials[current].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="text-center md:text-left px-4">
                {/* Quote Icon */}
                <svg
                  className="w-12 h-12 text-[var(--color-green-chili)]/20 mb-6 mx-auto md:mx-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <p className="font-serif text-xl lg:text-2xl text-[var(--color-text-bright)] italic leading-relaxed mb-8">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </p>

                <div>
                  <p className="font-serif text-xl text-[var(--color-green-chili)] uppercase tracking-tight">
                    {testimonials[current].name}
                  </p>
                  <p className="text-xs font-mono text-[var(--color-text-dim)] mt-1 uppercase tracking-widest">
                    {testimonials[current].location} — {testimonials[current].date}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-1 transition-all duration-500 ${
                  index === current
                    ? 'bg-[var(--color-green-chili)] w-12'
                    : 'bg-[var(--color-text-dim)]/20 w-6 hover:bg-[var(--color-green-chili)]/40'
                }`}
                aria-label={`Testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
