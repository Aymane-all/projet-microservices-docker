/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#C1DFFF',
          300: '#A2CFFF',
          400: '#83BFFF',
          500: '#4F92FF', // Main primary color
          600: '#3B78E6',
          700: '#2E5FCC',
          800: '#234AAD',
          900: '#193684'
        },
        secondary: {
          50: '#EDFCFC',
          100: '#D0F4F4',
          200: '#A4E9E8',
          300: '#79DDDC',
          400: '#4DD1D0',
          500: '#3EB1AF', // Main teal color
          600: '#2B8C8B',
          700: '#1D6867',
          800: '#144544',
          900: '#0B2322'
        },
        accent: {
          50: '#FFF4ED',
          100: '#FFE9DB',
          200: '#FFD3B7',
          300: '#FFBD93',
          400: '#FFA670',
          500: '#FF8A47', // Main accent color
          600: '#E6703A',
          700: '#CC582E',
          800: '#AD4221',
          900: '#842F15'
        },
        warning: {
          50: '#FFFAEB',
          100: '#FEF0C7',
          200: '#FEDF89',
          300: '#FEC84B',
          400: '#FDB022',
          500: '#F79009',
          600: '#DC6803',
          700: '#B54708',
          800: '#93370D',
          900: '#7A2E0E'
        },
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B'
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D'
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};