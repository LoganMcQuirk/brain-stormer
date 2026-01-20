/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'note-color': 'rgb(var(--color-note) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
