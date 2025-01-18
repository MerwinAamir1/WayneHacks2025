/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBlack: "#000000",
        brandWhite: "#ffffff",
        brandGray: {
          50: "#f9f9f9",
          100: "#f2f2f2",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        display: ['"Cinzel"', "serif"],
      },
      boxShadow: {
        "glow-white": "0 0 5px 2px rgba(255, 255, 255, 0.1)",
        "glow-black": "0 0 5px 2px rgba(0, 0, 0, 0.4)",
      },
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [],
};
