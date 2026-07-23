/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],

  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#F4FAF5',
          100: '#E7F5EA',
          200: '#CDE9D3',
          300: '#A4D6AE',
          400: '#6DBE7C',
          500: '#45A25D',
          600: '#2F8749',
          700: '#246C3B',
          800: '#1D5631',
          900: '#174429',
          950: '#0D2B1A',
        },

        earth: {
          50: '#FFF9EF',
          100: '#FFF0D2',
          200: '#FBDDA4',
          300: '#F4C46C',
          400: '#EAAA3E',
          500: '#DA8D25',
          600: '#B96B1C',
        },

        cream: {
          50: '#FCFDF9',
          100: '#F7FAF4',
          200: '#EEF4EA',
        },
      },

      fontFamily: {
        heading: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },

      boxShadow: {
        card:
          '0 8px 30px rgba(27, 79, 46, 0.07)',

        'card-hover':
          '0 20px 45px rgba(27, 79, 46, 0.14)',

        soft:
          '0 14px 50px rgba(23, 68, 41, 0.10)',

        floaty:
          '0 12px 35px rgba(23, 68, 41, 0.22)',
      },

      keyframes: {
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },

          '50%': {
            transform: 'translateY(-5px)',
          },
        },

        'pulse-ring': {
          '0%': {
            boxShadow:
              '0 0 0 0 rgba(69, 162, 93, 0.35)',
          },

          '70%': {
            boxShadow:
              '0 0 0 12px rgba(69, 162, 93, 0)',
          },

          '100%': {
            boxShadow:
              '0 0 0 0 rgba(69, 162, 93, 0)',
          },
        },
      },

      animation: {
        float:
          'float 3.5s ease-in-out infinite',

        'pulse-ring':
          'pulse-ring 2.4s ease-out infinite',
      },
    },
  },

  plugins: [],
}