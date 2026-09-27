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
        background: '#090d16',
        surface: {
          DEFAULT: '#0f1523',
          card: '#131b2c',
          hover: '#182236',
          muted: '#1e293b',
          border: '#222f46',
          borderSubtle: '#1a2336'
        },
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
        },
        decision: {
          allow: '#10b981',
          'allow-bg': 'rgba(16, 185, 129, 0.08)',
          'allow-border': 'rgba(16, 185, 129, 0.3)',
          verify: '#f59e0b',
          'verify-bg': 'rgba(245, 158, 11, 0.08)',
          'verify-border': 'rgba(245, 158, 11, 0.35)',
          block: '#ef4444',
          'block-bg': 'rgba(239, 68, 68, 0.08)',
          'block-border': 'rgba(239, 68, 68, 0.35)',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      borderRadius: {
        'card': '10px',
        'control': '6px'
      }
    },
  },
  plugins: [],
}
