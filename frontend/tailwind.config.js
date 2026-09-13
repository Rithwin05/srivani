/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FDFBF7',
        cream: '#F5F0E6',
        ink: '#1C1917',
        brass: { DEFAULT: '#D97706', dark: '#B45309', light: '#FEF3C7' },
        forest: { DEFAULT: '#065F46', light: '#D1FAE5' },
        wa: { DEFAULT: '#16A34A', dark: '#15803D' },
        wood: { DEFAULT: '#3B2616', light: '#5C3A21' },
        line: { DEFAULT: '#E7E0D3', strong: '#D6CEBE' },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        book: '0 1px 2px rgba(28,25,23,.08), 0 8px 24px -12px rgba(28,25,23,.25)',
        lift: '0 12px 32px -12px rgba(28,25,23,.35)',
      },
      keyframes: {
        rise: { '0%': { opacity: 0, transform: 'translateY(14px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: { rise: 'rise .6s cubic-bezier(.2,.7,.2,1) both' },
    },
  },
  plugins: [],
};
