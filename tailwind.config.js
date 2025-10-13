// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF5733",
        secondary: "#C70039",
        accent: "#900C3F",
        background: "#F8F9FA",
        surface: "#FFFFFF",
        error: "#B00020",
        success: "#4CAF50",
        warning: "#FFC107",
      },
    },
  },
  plugins: [],
};