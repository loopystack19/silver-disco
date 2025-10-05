import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // UmojaHub Brand Colors
        primary: {
          DEFAULT: "#007F4E", // Deep Green - Growth, sustainability, agriculture
          50: "#e6f5f0",
          100: "#ccebe0",
          200: "#99d7c1",
          300: "#66c3a2",
          400: "#33af83",
          500: "#007F4E", // Main
          600: "#00663e",
          700: "#004d2f",
          800: "#00331f",
          900: "#001a10",
        },
        accent: {
          DEFAULT: "#FFD166", // Warm Yellow - Hope, energy, opportunity
          50: "#fffbf0",
          100: "#fff7e0",
          200: "#ffefc2",
          300: "#ffe7a3",
          400: "#ffdf85",
          500: "#FFD166", // Main
          600: "#cca752",
          700: "#997d3d",
          800: "#665429",
          900: "#332a14",
        },
        terracotta: {
          DEFAULT: "#D95D39", // Earth, resilience, community
          50: "#fceee9",
          100: "#f9ddd4",
          200: "#f3bba9",
          300: "#ed997e",
          400: "#e77753",
          500: "#D95D39", // Main
          600: "#ae4a2e",
          700: "#823822",
          800: "#572517",
          900: "#2b130b",
        },
        sky: {
          DEFAULT: "#3DB2FF", // Trust, clarity, education, innovation
          50: "#ebf7ff",
          100: "#d7efff",
          200: "#afdfff",
          300: "#87cfff",
          400: "#5fbfff",
          500: "#3DB2FF", // Main
          600: "#318ecc",
          700: "#256b99",
          800: "#194766",
          900: "#0c2433",
        },
        background: {
          DEFAULT: "#F4F4F4", // Soft Gray - Clean, minimalist
          light: "#FFFFFF",
          dark: "#E5E5E5",
        },
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
