/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        cmpc: {
          green: "#2E7D32",
          "dark-green": "#1B5E20",
          "light-green": "#4CAF50",
          gray: "#F5F5F5",
          "dark-gray": "#9E9E9E",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
