/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          100: '#F8C7DC',
          300: '#EC5FA7',
          400: '#F06292',
          500: '#D94AA6',
        },
        purple: {
          200: '#CBA6F7',
          400: '#A66CFF',
          600: '#8E3FD1',
          700: '#7B2FCF',
        },
        background: {
          DEFAULT: '#F3ECF4',
          soft: '#EDE7F6',
        }
      }
    }
  },
  plugins: [],
}