import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Cormorant_Garamond, Playfair_Display, Fredoka, Outfit, Quicksand } from 'next/font/google';
import './globals.css';
import { MagicToastContainer } from '@/components/storefront/MagicToastContainer';

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chenille-flowers.vercel.app';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFF5F7' },
    { media: '(prefers-color-scheme: dark)', color: '#181216' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Aesthetic Chenille Flowers Atelier | Buket Bunga Kawat Bulu Depok',
    template: '%s | Chenille Flowers Atelier',
  },
  description:
    'Katalog E-Commerce & Perangkaian Buket Bunga Kawat Bulu (Pipe Cleaner) Estetik Depok. Buket Wisuda UI & Margonda, Ready Stock & Pre-Order, Garansi 100% Anti Layu & Bebas Ongkir COD Titik Temu.',
  keywords: [
    'buket bunga kawat bulu',
    'chenille flower bouquet',
    'pipe cleaner flowers depok',
    'buket wisuda ui',
    'buket wisuda depok',
    'hadiah wisuda aesthetic',
    'buket kawat bulu margonda',
    'buket bunga abadi',
    'aesthetic flower atelier',
    'bunga pipe cleaner murah',
  ],
  authors: [
    { name: 'Chenille Flowers Atelier', url: siteUrl },
    { name: 'Ahmad Arif' },
  ],
  creator: 'Chenille Flowers Atelier',
  publisher: 'Chenille Flowers Atelier',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteUrl,
    siteName: 'Chenille Flowers Atelier',
    title: 'Aesthetic Chenille Flowers Atelier | Buket Bunga Kawat Bulu Depok',
    description:
      'Katalog E-Commerce & Perangkaian Buket Bunga Kawat Bulu Estetik. Ready Stock & Pre-Order Wisuda, Bebas Ongkir COD Titik Temu Margonda & UI, Garansi 100% Anti-Layu.',
    images: [
      {
        url: '/preview-tema-a.jpg',
        width: 1200,
        height: 630,
        alt: 'Aesthetic Chenille Flowers Atelier Showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aesthetic Chenille Flowers Atelier | Buket Bunga Kawat Bulu',
    description:
      'Buket Bunga Kawat Bulu Awet Selamanya. Garansi 100% Anti Patah & Free Ongkir COD Titik Temu Depok.',
    images: ['/preview-tema-a.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@type': 'Florist',
  '@id': `${siteUrl}/#florist`,
  name: 'Aesthetic Chenille Flowers Atelier',
  url: siteUrl,
  logo: `${siteUrl}/preview-tema-a.jpg`,
  image: `${siteUrl}/preview-tema-a.jpg`,
  description:
    'Atelier kerajinan tangan buket bunga kawat bulu (chenille stem / pipe cleaner) estetik di Depok. Melayani buket wisuda UI & Gunadarma, buket romantis, dan kustom bunga.',
  telephone: '+6281234567890',
  priceRange: 'Rp 25.000 - Rp 250.000',
  currenciesAccepted: 'IDR',
  paymentAccepted: 'Cash, QRIS, Bank Transfer, Midtrans',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Margonda Raya No. 108',
    addressLocality: 'Depok',
    addressRegion: 'Jawa Barat',
    postalCode: '16424',
    addressCountry: 'ID',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -6.3728,
    longitude: 106.8315,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '21:00',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '342',
    bestRating: '5',
    worstRating: '1',
  },
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
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
        <MagicToastContainer />
      </body>
    </html>
  );
}
