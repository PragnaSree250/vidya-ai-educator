/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B1220',
          900: '#111827',
          800: '#1E293B',
        },
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#3730A3',
        },
        teal: {
          50: '#F0FDFA',
          500: '#0D9488',
          600: '#0F766E',
        },
        sun: {
          50: '#FFFBEB',
          400: '#FBBF24',
          500: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.06)',
        lift: '0 12px 40px rgba(67, 56, 202, 0.16)',
      },
    },
  },
  plugins: [],
}
