/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#090A0C',
          surface: '#111318',
          'surface-elevated': '#181B21',
          border: '#242830',
          'border-subtle': '#1B1E24',

          text: '#F5F7FA',
          'text-secondary': '#8B929E',
          'text-muted': '#5F6672',

          blue: '#4DA3FF',
          'blue-bright': '#69B1FF',

          success: '#35D07F',
          warning: '#FFB547',
          danger: '#FF5C5C',
        },
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        '8xl': ['5rem', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        '9xl': ['7rem', { lineHeight: '0.9', letterSpacing: '-0.05em' }],
      },
      spacing: {
        'safe-b': 'env(safe-area-inset-bottom)',
        'safe-t': 'env(safe-area-inset-top)',
      },
      keyframes: {
  'pulse-subtle': {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.55' },
  },

  'scale-in': {
    '0%': {
      transform: 'scale(0.85)',
      opacity: '0',
    },
    '100%': {
      transform: 'scale(1)',
      opacity: '1',
    },
  },

  'fade-up': {
    '0%': {
      transform: 'translateY(8px)',
      opacity: '0',
    },
    '100%': {
      transform: 'translateY(0)',
      opacity: '1',
    },
  },

  'glow': {
    '0%, 100%': {
      opacity: '0.7',
    },
    '50%': {
      opacity: '1',
    },
  },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-up': 'fade-up 0.35s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
