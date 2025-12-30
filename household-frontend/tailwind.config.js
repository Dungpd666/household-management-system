/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sidebar: {
          bg: ' #17192D',
          active: '#22253B',
          hover: '#292C44',
          border: '#303552'
        },
        brand: {
          primary: '#4ADE80',
          primaryHover: '#22C55E',
          purple: '#6366F1',
          purpleSoft: '#EEF2FF',
          yellow: '#FACC15',
          red: '#FB7185',
        },
        surface: {
          base: '#FFFFFF',
          muted: '#F5F3FF',
          subtle: '#FAFAFF'
        },
        border: '#E5E7EB',
        textc: {
          primary: '#111827',
          secondary: '#6B7280',
          faint: '#9CA3AF',
          inverse: '#FFFFFF'
        },
      },
      boxShadow: {
        card: '0 20px 45px rgba(15,23,42,0.18)',
      },
    },
  },
  plugins: [],
};
