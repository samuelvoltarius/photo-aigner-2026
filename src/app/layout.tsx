import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alfred Aigner | Hochzeitsfotograf Salzburg',
  description: 'Hochzeitsfotografie & Videografie in Salzburg. Authentische, emotionale Bilder und Filme von eurem schönsten Tag. Jetzt Paket anfragen.',
  keywords: 'Hochzeitsfotograf Salzburg, Hochzeitsvideograf, Hochzeitsfilm Österreich, Brautpaar Fotos, Alfred Aigner',
  openGraph: {
    title: 'Alfred Aigner | Hochzeitsfotograf Salzburg',
    description: 'Authentische Hochzeitsfotografie & Videografie – für unvergessliche Momente.',
    url: 'https://photo-aigner.vercel.app',
    siteName: 'Alfred Aigner Photography',
    locale: 'de_AT',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
