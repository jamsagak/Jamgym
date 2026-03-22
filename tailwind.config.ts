import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#080C14',
        card: '#111827',
        hover: '#1A2235',
        primary: '#00D4AA',
        'primary-hover': '#00B894',
        'primary-light': 'rgba(0,212,170,0.1)',
        border: '#1E2A3A',
        muted: '#6B7280',
        secondary: '#D1D5DB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
