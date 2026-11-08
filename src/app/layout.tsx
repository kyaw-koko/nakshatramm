import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NakshatraMM — Burmese Sky & Astronomical Simulator',
  description:
    'Real-time 360-degree interactive sky dome combining NASA ephemeris calculations with classical Burmese 27 Nakshatras (နက္ခတ် ၂၇ လုံး) & 12 Zodiac signs (၁၂ ရာသီခွင်).',
  keywords: [
    'Nakshatra',
    'Burmese Astronomy',
    'နက္ခတ် ၂၇ လုံး',
    'စန်းယှဉ်နက္ခတ်',
    '၁၂ ရာသီခွင်',
    'Myanmar Sky Map',
    'Astronomy Simulator'
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="my" className="dark h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@300;400;500;600;700&family=Padauk:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#050816] text-slate-100 selection:bg-cyan-500/30">
        {children}
      </body>
    </html>
  );
}
