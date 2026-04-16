/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'Fira Code'", "monospace"],
      },
      colors: {
        paper: "#faf9f6",
        ink: "#1a1a2e",
        mist: "#e8e6e1",
        amber: { 400: "#fbbf24", 500: "#f59e0b" },
      },
    },
  },
  plugins: [],
};
