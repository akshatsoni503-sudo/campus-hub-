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
          navy: '#17105F',
          blue: '#1769E0',
        },
        lavender: {
          light: '#F5F3FF',
          DEFAULT: '#EDE9FE',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        text: {
          dark: '#1E1B4B',
          medium: '#4B5563',
          light: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
