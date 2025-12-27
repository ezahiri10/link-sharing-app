/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Instrument Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontWeight: {
        normal: '400',
        semibold: '600',
        bold: '700',
      },
      colors: {
        primary: '#633CFF',
        'primary-soft': '#EFEBFF',
        'dark-text': '#333333',
        'gray-text': '#737373',
        'border-gray': '#D9D9D9',
        error: '#FF3939',
        'light-bg': '#FAFAFA',
      },
    },
  },
  plugins: [],
}
