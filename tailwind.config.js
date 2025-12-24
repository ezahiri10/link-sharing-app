/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#633CFF',
        primaryLight: '#EFEBFF',
        borderGray: '#E2E2E2',
        bgGray: '#FAFAFA',
        textMuted: '#737373',
      },
    },
  },
  plugins: [],
}
