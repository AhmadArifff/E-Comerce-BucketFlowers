import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          primary: 'var(--primary)',
          'primary-hover': 'var(--primary-hover)',
          'primary-light': 'var(--primary-light)',
          'primary-border': 'var(--primary-border)',
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          'surface-subtle': 'var(--surface-subtle)',
          border: 'var(--border)',
          'text-main': 'var(--text-main)',
          'text-muted': 'var(--text-muted)',
          accent: 'var(--accent)',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
        'heading-a': ['var(--font-cormorant)', 'serif'],
        'heading-b': ['var(--font-playfair)', 'serif'],
        'heading-c': ['var(--font-fredoka)', 'sans-serif'],
        'body-b': ['var(--font-outfit)', 'sans-serif'],
        'body-c': ['var(--font-quicksand)', 'sans-serif'],
      },
      keyframes: {
        beamStep2: {
          '0%': { left: '12.5%', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { left: 'calc(37.5% - 48px)', opacity: '0' },
        },
        beamStep3: {
          '0%': { left: '37.5%', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { left: 'calc(62.5% - 48px)', opacity: '0' },
        },
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.15)', opacity: '1' },
        },
        floatSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'beam-step-2': 'beamStep2 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'beam-step-3': 'beamStep3 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float-soft': 'floatSoft 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
