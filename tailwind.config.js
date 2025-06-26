/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'magical': {
          'green': '#2C5530',
          'pink': '#FFB6C1',
          'lavender': '#E6E6FA',
          'gold': '#FFD700',
        },
      },
      backgroundImage: {
        'forest': "url('/src/assets/forest-bg.jpg')",
      },
      fontFamily: {
        'magical': ['Playfair Display', 'serif'],
        'body': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 