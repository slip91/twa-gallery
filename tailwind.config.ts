import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '375px', // iPhone SE / современные узкие телефоны
      },
      colors: {
        twa: {
          bg: 'var(--twa-bg)',
          text: 'var(--twa-text)',
          btn: 'var(--twa-btn)',
          hint: 'var(--twa-hint)',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
