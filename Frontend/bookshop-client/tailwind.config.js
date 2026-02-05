/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fbf7f3',
          100: '#f5ebe0',
          200: '#eddcc5',
          300: '#e3c6a0',
          400: '#d5a873',
          500: '#c58b4a',
          600: '#a66a33',
          700: '#8b4513', // Leather
          800: '#723a13',
          900: '#5e3113',
          950: '#341908',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        body: ['"Lora"', 'serif'],
      }
    },
  },
  plugins: [],
}
