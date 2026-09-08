import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Cormorant_Garamond, Playfair_Display, Fredoka, Outfit, Quicksand } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-fredoka',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aesthetic Chenille Flowers Atelier | Buket Bunga Kawat Bulu Depok',
  description:
    'Katalog E-Commerce & Perangkaian Buket Bunga Kawat Bulu (Pipe Cleaner) Estetik Depok. Buket Wisuda UI & Margonda, Ready Stock & Pre-Order, Garansi 100% Anti Layu.',
  keywords: [
    'buket bunga kawat bulu',
    'chenille flower bouquet',
    'buket wisuda depok',
    'buket ui depok',
    'pipe cleaner flowers',
    'aesthetic flower atelier',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      data-theme="tema-a"
      className={`${jakarta.variable} ${cormorant.variable} ${playfair.variable} ${fredoka.variable} ${outfit.variable} ${quicksand.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('chenille_active_theme');
                  if (saved) {
                    var th = 'tema-a';
                    try {
                      var parsed = JSON.parse(saved);
                      th = (parsed && parsed.state && parsed.state.theme) ? parsed.state.theme : (typeof saved === 'string' ? saved.replace(/"/g, '') : 'tema-a');
                    } catch(e) {
                      th = saved.replace(/"/g, '');
                    }
                    if (['tema-a', 'tema-b', 'tema-c'].indexOf(th) !== -1) {
                      document.documentElement.setAttribute('data-theme', th);
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-theme-bg text-theme-text-main min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
