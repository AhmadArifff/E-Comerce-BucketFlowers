export const ATELIER_CONFIG = {
  name: 'Aesthetic Chenille Flowers Atelier',
  address: 'Jl. Margonda Raya No. 108 Depok',
  phone: '081234567890',
  latitude: -6.3728,
  longitude: 106.8315,
  maxFreeCodRadiusKm: 5.0,
  dailyPoLimit: 10,
} as const;

export const THEME_CONFIGS = {
  'tema-a': {
    name: 'Korean Pastel Atelier',
    badge: 'Soft & Elegant',
    primaryColor: '#E86A82',
    bgPage: '#FAF8F5',
    fontHeading: 'Cormorant Garamond',
    fontBody: 'Plus Jakarta Sans',
  },
  'tema-b': {
    name: 'Modern Romantic',
    badge: 'Luxury Velvet',
    primaryColor: '#722F37',
    bgPage: '#F7F3EE',
    fontHeading: 'Bodoni Moda',
    fontBody: 'Inter',
  },
  'tema-c': {
    name: 'Playful Kawaii & Pastel Pop',
    badge: 'Fun & Cheerful',
    primaryColor: '#FF6B81',
    bgPage: '#FFF9F5',
    fontHeading: 'Nunito',
    fontBody: 'Outfit',
  },
} as const;
