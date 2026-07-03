/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // dark plum palette, in the spirit of osu! clients
        base: "#17131d",
        surface: "#221c2b",
        "surface-2": "#2c2438",
        "surface-3": "#372d46",
        line: "#3d3450",
        muted: "#a99cbd",
        accent: {
          DEFAULT: "#ff66aa",
          hover: "#ff85bb",
          soft: "#ff66aa26",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
