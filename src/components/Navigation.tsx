'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const links = [
  { name: 'Galerie',  href: '#galerie' },
  { name: 'Über mich', href: '#ueber' },
  { name: 'Pakete',   href: '#pakete' },
  { name: 'Kontakt',  href: '#kontakt' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        padding: scrolled ? '1rem 0' : '1.8rem 0',
        background: scrolled ? 'rgba(253,250,245,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
           className="font-display transition-colors duration-300"
           style={{ fontSize: 'clamp(1.3rem, 2vw, 1.7rem)', fontWeight: 300, color: scrolled ? 'var(--color-text-dark)' : 'white', textDecoration: 'none' }}>
          Alfred{' '}
          <em style={{ fontStyle: 'italic', color: scrolled ? 'var(--color-gold)' : 'var(--color-gold-light)' }}>Aigner</em>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => scrollTo(e, l.href)}
              className="label transition-colors duration-300 cursor-pointer"
              style={{ color: scrolled ? 'var(--color-text-mid)' : 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.6rem' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = scrolled ? 'var(--color-gold)' : 'white')}
              onMouseLeave={(e) => (e.currentTarget.style.color = scrolled ? 'var(--color-text-mid)' : 'rgba(255,255,255,0.7)')}
            >
              {l.name}
            </a>
          ))}
          <a href="#kontakt" onClick={(e) => scrollTo(e, '#kontakt')}
             className="label cursor-pointer transition-all duration-300 px-6 py-3"
             style={{
               color: scrolled ? 'var(--color-text-dark)' : 'white',
               border: `1px solid ${scrolled ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)'}`,
               textDecoration: 'none', fontSize: '0.6rem',
             }}
             onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-gold)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--color-gold)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = scrolled ? 'var(--color-text-dark)' : 'white'; e.currentTarget.style.borderColor = scrolled ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)'; }}>
            Anfragen
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
