'use client';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-12" style={{ background: 'var(--color-black)' }}>
      <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-display" style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300, fontSize: '1.2rem' }}>
          Alfred <em style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>Aigner</em>
        </p>
        <div className="flex gap-8 text-center">
          {[['Impressum', '/impressum'], ['Datenschutz', '/datenschutz']].map(([lbl, href]) => (
            <a key={lbl} href={href}
               className="label transition-colors duration-200"
               style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem', textDecoration: 'none' }}
               onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
               onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}>
              {lbl}
            </a>
          ))}
        </div>
        <p className="label" style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.55rem' }}>
          © {year} Alfred Aigner · Salzburg
        </p>
      </div>
    </footer>
  );
}
