/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#F0FBF3',
          100: '#D8F3DC',
          200: '#A8E6C0',
          300: '#74C69D',
          400: '#52B788',
          500: '#40916C',
          600: '#2D6A4F',
          700: '#245941',
          800: '#1B4332',
          900: '#0D2218',
        },
        accent: {
          400: '#EFB82A',
          600: '#D4A017',
          800: '#8B6800',
        },
        surface: '#F0FBF3',
        dark:    '#1B4332',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
