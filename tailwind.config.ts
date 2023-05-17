import type { Config } from 'tailwindcss';

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-noto-mono)'],
      },
		},
  },
} satisfies Config;
