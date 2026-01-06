/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        cyan: {
          500: '#06b6d4',
        },
        orange: {
          500: '#f97316',
        },
        purple: {
          500: '#a855f7',
        },
        emerald: {
          500: '#10b981',
        },
      },
      fontFamily: {
        plaster: ['"Plaster"', 'cursive'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
