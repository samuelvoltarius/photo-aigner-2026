'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.querySelector('#name') as HTMLInputElement)?.value,
      email: (form.querySelector('#email') as HTMLInputElement)?.value,
      datum: (form.querySelector('#datum') as HTMLInputElement)?.value,
      paket: (form.querySelector('#paket') as HTMLSelectElement)?.value,
      nachricht: (form.querySelector('#nachricht') as HTMLTextAreaElement)?.value,
    };
    try {
      await fetch('/api/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    } catch {}
    setSent(true);
  };

  const inputStyle = {
    width: '100%', padding: '0.9rem 1.2rem',
    background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.1)',
    color: 'var(--color-text-dark)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
    fontWeight: 300, outline: 'none', transition: 'border-color 0.2s',
  } as React.CSSProperties;

  return (
    <section id="kontakt" className="section" style={{ background: 'var(--color-cream)' }} ref={ref}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="label mb-5 block">Kontakt</span>
            <h2 className="font-display mb-4" style={{ fontWeight: 300 }}>
              Lass uns{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>reden.</em>
            </h2>
            <div className="w-10 h-px mb-8" style={{ background: 'var(--color-gold)' }} />
            <p className="mb-8">
              Schreib mir einfach — ich melde mich innerhalb von 24 Stunden.
              Am liebsten erzähle ich euch bei einem Kaffee mehr über meine Arbeit.
            </p>

            <div className="space-y-5">
              {[
                ['Telefon', '+43 676 7901777', 'tel:+436767901777'],
                ['E-Mail',  'office@greenchili.at', 'mailto:office@greenchili.at'],
                ['Standort', 'Salzburg, Österreich', null],
              ].map(([lbl, val, href]) => (
                <div key={lbl}>
                  <span className="label text-[9px] block mb-1" style={{ color: 'var(--color-text-light)' }}>{lbl}</span>
                  {href ? (
                    <a href={href} className="transition-colors duration-200" style={{ color: 'var(--color-text-dark)', textDecoration: 'none', fontSize: '1rem', fontWeight: 300 }}
                       onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                       onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-dark)')}>
                      {val}
                    </a>
                  ) : (
                    <span style={{ color: 'var(--color-text-dark)', fontSize: '1rem', fontWeight: 300 }}>{val}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {sent ? (
              <div className="flex flex-col items-start justify-center h-full">
                <span className="font-display text-4xl mb-4" style={{ fontWeight: 300, color: 'var(--color-gold)' }}>Danke! ♡</span>
                <p>Ich melde mich so schnell wie möglich bei euch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="label text-[9px] block mb-2" style={{ color: 'var(--color-text-light)' }}>Name</label>
                    <input id="name" type="text" required placeholder="Euer Name" style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--color-gold)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
                  </div>
                  <div>
                    <label htmlFor="datum" className="label text-[9px] block mb-2" style={{ color: 'var(--color-text-light)' }}>Hochzeitsdatum</label>
                    <input id="datum" type="date" style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--color-gold)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="label text-[9px] block mb-2" style={{ color: 'var(--color-text-light)' }}>E-Mail</label>
                  <input id="email" type="email" required placeholder="eure@email.at" style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-gold)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
                </div>
                <div>
                  <label htmlFor="paket" className="label text-[9px] block mb-2" style={{ color: 'var(--color-text-light)' }}>Interesse an</label>
                  <select id="paket" style={{ ...inputStyle, background: 'rgba(0,0,0,0.03)' }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-gold)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')}>
                    <option value="">Paket wählen …</option>
                    <option>Essenz (€ 990)</option>
                    <option>Erinnerung (€ 1.890)</option>
                    <option>Ewigkeit (€ 2.990)</option>
                    <option>Individuelles Angebot</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="nachricht" className="label text-[9px] block mb-2" style={{ color: 'var(--color-text-light)' }}>Eure Geschichte</label>
                  <textarea id="nachricht" rows={4} placeholder="Erzählt mir von eurer Hochzeit …" style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-gold)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required className="mt-1" />
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>
                    Ich habe die{' '}
                    <a href="/datenschutz" style={{ color: 'var(--color-gold)', textDecoration: 'underline' }}>Datenschutzerklärung</a>
                    {' '}gelesen und stimme der Verarbeitung meiner Daten zu.
                  </span>
                </label>
                <button type="submit" className="btn-primary w-full justify-center">
                  Anfrage senden
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
