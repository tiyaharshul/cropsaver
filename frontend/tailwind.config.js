/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#f2fbf3',
          100: '#e0f7e3',
          200: '#bfeec7',
          300: '#8fdd9e',
          400: '#57c46e',
          500: '#2fa84b',
          600: '#1f8a3a',
          700: '#186e30',
          800: '#155829',
          900: '#124824',
        },
        earth: {
          50: '#fdf8ef',
          100: '#faedd3',
          300: '#f0cb85',
          400: '#e6ae4d',
          500: '#d9922b',
          600: '#b8741f',
        },
      },
      fontFamily: {
        heading: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(18, 72, 36, 0.12)',
        card: '0 2px 8px rgba(18, 72, 36, 0.08)',
        floaty: '0 8px 24px -4px rgba(18, 72, 36, 0.35)',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(120deg, rgba(18,72,36,0.85) 0%, rgba(31,138,58,0.75) 55%, rgba(217,146,43,0.55) 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(47, 168, 75, 0.5)' },
          '70%': { boxShadow: '0 0 0 12px rgba(47, 168, 75, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(47, 168, 75, 0)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.2s ease-out infinite',
      },
    },
  },
  plugins: [],
}