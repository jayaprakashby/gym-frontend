/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#b7f34a',
          hover: '#a3e635',
          dark: '#0b0f17',
          card: '#111827',
          border: '#263244',
        },
      },
      boxShadow: {
        glow: '0 0 32px rgba(183, 243, 74, 0.16)',
      },
    },
  },
  plugins: [],
}
