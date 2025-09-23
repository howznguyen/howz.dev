// const colors = require("tailwindcss/colors");
const typography = require("@tailwindcss/typography");
const aspectRatio = require("@tailwindcss/aspect-ratio");

module.exports = {
  darkMode: "class",
  mode: "jit",
  future: {
    removeDeprecatedGapUtilities: true,
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
      },
      spacing: {
        content: "68rem",
      },
      colors: {
        pink: {
          50: "#FDF2F8",
          100: "#FCE8F3",
          200: "#FBCFE8",
          300: "#F9A8D4",
          400: "#F472B6",
          500: "#EC4899",
          600: "#DB2777",
          700: "#BE185D",
          800: "#9D174D",
          900: "#831843",
        },
        brown: {
          50: "#fdf8f6",
          100: "#f2e8e5",
          200: "#eaddd7",
          300: "#e0cec7",
          400: "#d2bab0",
          500: "#bfa094",
          600: "#a18072",
          700: "#977669",
          800: "#846358",
          900: "#43302b",
        },
        dark: "#222222",
        primary: "#3E54AC",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [typography, aspectRatio],
};
