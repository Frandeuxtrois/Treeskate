import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rojo: '#D7232A',
        azul: '#0B2E6B',
        tinta: '#0E0E10',
        papel: '#F3F0E8',
        gris: '#6B6B70',
        linea: '#DAD5C8',
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
