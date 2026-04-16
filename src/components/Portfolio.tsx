'use client';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const ytThumb = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

const portfolioItems = [
  {
    id: 1, type: 'youtube', src: 'tcXt7rEEHgA',
    alt: 'GreenChili Showreel', category: 'cine',
    label: 'Showreel 2024', featured: true,
  },
  {
    id: 2, type: 'youtube', src: 'vU3sz-Xdtt0',
    alt: 'Immobilien Video', category: 'immo',
    label: 'Immobilien Film',
  },
  {
    id: 3, type: 'image', src: '/images/portfolio/drohne-01.jpg',
    alt: 'Drohnenaufnahme Gebäude', category: 'drohne',
    label: 'Aerial Survey',
  },
  {
    id: 4, type: 'youtube', src: 'tYwwtJadPTQ',
    alt: 'Cineastisches Video', category: 'cine',
    label: 'Cine Production',
  },
  {
    id: 5, type: 'image', src: '/images/portfolio/drohne-02.jpg',
    alt: 'Luftaufnahme Gebäude', category: 'drohne',
    label: 'Drohneninspektion',
  },
  {
    id: 6, type: 'image', src: '/images/portfolio/thermal-01.jpg',
    alt: 'Thermografie Gebäude', category: 'thermo',
    label: 'ChiliView Thermografie',
  },
  {
    id: 7, type: 'image', src: '/images/portfolio/drohne-03.jpg',
    alt: 'Drohne Gebäude Vogelperspektive', category: 'drohne',
    label: 'Mapping Aufnahme',
  },
  {
    id: 8, type: 'youtube', src: 'vLb6ShloRWo',
    alt: 'Immobilien Spotlight', category: 'immo',
    label: 'Spotlight Production',
  },
  {
    id: 9, type: 'image', src: '/images/portfolio/thermal-02.jpg',
    alt: 'Wärmebild Analyse', category: 'thermo',
    label: 'Wärmebild Analyse',
  },
  {
    id: 10, type: 'image', src: '/images/portfolio/drohne-05.jpg',
    alt: 'Drohnenaufnahme Immobilie', category: 'drohne',
    label: 'Aerial Immobilien',
  },
  {
    id: 11, type: 'image', src: '/images/portfolio/drohne-06.jpg',
    alt: 'Luftaufnahme Landschaft', category: 'drohne',
    label: 'Aerial Panorama',
  },
];

const categories = [
  { id: 'all',    name: 'Alle' },
  { id: 'cine',   name: 'Cinema' },
  { id: 'immo',   name: 'Immobilien' },
  { id: 'drohne', name: 'Drohne' },
  { id: 'thermo', name: 'Thermografie' },
];

function YouTubeItem({ videoId, alt }: { videoId: string; alt: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="w-full h-full" onClick={() => setPlaying(true)}>
      {!playing ? (
        <div className="relative w-full h-full cursor-pointer group/yt">
          <img
            src={ytThumb(videoId)}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover/yt:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors duration-300 group-hover/yt:bg-black/20">
            <div className="w-14 h-14 rounded-full border border-[var(--color-green-chili)]/60 bg-black/40 flex items-center justify-center transition-all duration-300 group-hover/yt:border-[var(--color-green-chili)] group-hover/yt:bg-[var(--color-green-chili)]/20 backdrop-blur-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}

export default function Portfolio() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filteredItems =
    activeCategory === 'all'
      ? portfolioItems
      : portfolioItems.filter((i) => i.category === activeCategory);

  return (
    <section id="portfolio" className="section bg-[var(--color-black)]" ref={ref}>
      <div className="container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="label mb-5 block">Portfolio</span>
          <h2 className="font-display text-[var(--color-text-bright)]"
              style={{ fontWeight: 300 }}>
            Ausgewählte{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--color-green-chili)' }}>
              Arbeiten
            </em>
          </h2>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-16"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 text-[11px] tracking-widest uppercase transition-all duration-300 font-mono border ${
                activeCategory === cat.id
                  ? 'bg-[var(--color-green-chili)] text-black border-[var(--color-green-chili)]'
                  : 'text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)] border-white/10 hover:border-white/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => {
            const isFeatured = item.featured && activeCategory === 'all';
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className={`relative overflow-hidden cursor-pointer group bg-[var(--color-black-accent)] ${
                  isFeatured ? 'md:col-span-2 md:row-span-1 aspect-video' : 'aspect-video'
                }`}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {item.type === 'youtube' ? (
                  <YouTubeItem videoId={item.src} alt={item.alt} />
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredId === item.id ? 'scale-105' : 'scale-100'
                    }`}
                  />
                )}

                {/* Label overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex items-end p-6 transition-opacity duration-300 pointer-events-none ${
                  hoveredId === item.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div>
                    <span className="label text-[9px] block mb-1">{item.category}</span>
                    <p className="font-display text-[var(--color-text-bright)] text-xl" style={{ fontWeight: 300 }}>
                      {item.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20"
        >
          <a href="#contact" className="btn-outline">
            Projekt anfragen
          </a>
        </motion.div>
      </div>
    </section>
  );
}
