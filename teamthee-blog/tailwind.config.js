/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#0a0a0a',
        'surface-card': '#0e0e0e',
        'surface-border': 'rgba(255, 255, 255, 0.1)',
        'surface-border-light': 'rgba(255, 255, 255, 0.2)',
        brand: {
          fuchsia: '#d946ef',
          purple: '#a855f7',
          emerald: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-fuchsia': 'glowFuchsia 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glowFuchsia: {
          '0%': { boxShadow: '0 0 5px rgba(217, 70, 239, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(217, 70, 239, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}

