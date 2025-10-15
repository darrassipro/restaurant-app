// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  // IMPORTANT: Add the NativeWind preset
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FF5733",
        secondary: "#FFC300",
        error: "#EF4444",
        success: "#10B981",
      },
    },
  },
  plugins: [],
}