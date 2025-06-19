import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          600: '#1e3a8a',
          800: '#1e293b',
          900: '#0f172a',
        },
        mint: {
          500: '#9FE2BF',
        },
      },
    },
  },
  plugins: [
    forms,
  ],
}