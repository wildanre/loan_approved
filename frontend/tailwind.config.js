/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#256DB1",
        lightBlue: "#D6E8F7",
        success: "#27AE60",
        danger: "#C0392B",
        surface: "#F0F4FA",
        ink: "#1a2332",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px rgba(37, 109, 177, 0.09), 0 1px 4px rgba(0,0,0,0.04)",
        card: "0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(37,109,177,0.06)",
      },
      backgroundOpacity: {
        8: "0.08",
      },
    },
  },
  plugins: [],
};
