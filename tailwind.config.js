/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './components/**/*.{js,ts,jsx,tsx}', './contexts/**/*.{js,ts,jsx,tsx}', './hooks/**/*.{js,ts,jsx,tsx}', './utils/**/*.{js,ts,jsx,tsx}', './*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color, #2563eb)',
        'primary-hover': 'var(--primary-hover-color, #1d4ed8)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
