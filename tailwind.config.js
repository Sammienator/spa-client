/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        belleza: ["Belleza", "sans-serif"], // Add Belleza as a custom font
      },
    },
  },
  plugins: [],
};