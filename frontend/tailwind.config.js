/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#181d26",
        body: "#333840",
        muted: "#41454d",
        hairline: "#dddddd",
        "surface-soft": "#f8fafc",
        "surface-strong": "#e0e2e6",
        coral: "#aa2d00",
        forest: "#0a2e0e",
        cream: "#f5e9d4",
        link: "#1b61c9",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        button: "0 8px 20px rgba(27, 97, 201, 0.10)",
      },
    },
  },
  plugins: [],
};
