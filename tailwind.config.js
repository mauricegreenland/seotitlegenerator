/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        custom: {
          primary: '#2B6CB0',
          'primary-dark': '#215387',
          darkest: '#19202B',
          'dark-gray': '#2E3748',
          'medium-gray': '#495568',
          'light-gray': '#718096',
          'off-white': '#F7FAFC',
          'gray-blue': '#EDF2F7'
        }
      },
    },
  },
  plugins: [],
};