/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          DEFAULT: "#C8A96A",
          light: "#DFCA9B",
          dark: "#A3864C",
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "marquee": "marquee 25s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "counter-rotate": "counter-rotate 15s linear infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite",
        "grain": "grain 8s steps(10) infinite",
        "glow-breathe": "glow-breathe 3s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%) skewX(-15deg)" },
          "100%": { transform: "translateX(200%) skewX(-15deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "rotate-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "counter-rotate": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(-360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "1" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-2%, -3%)" },
          "30%": { transform: "translate(1%, -4%)" },
          "50%": { transform: "translate(-3%, 1%)" },
          "70%": { transform: "translate(2%, 4%)" },
          "90%": { transform: "translate(4%, 2%)" },
        },
        "glow-breathe": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(200, 169, 106, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(200, 169, 106, 0.5)" },
        },
      },
      transitionTimingFunction: {
        "luxury": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "1200": "1200ms",
        "1500": "1500ms",
        "2000": "2000ms",
      },
      boxShadow: {
        "gold": "0 20px 60px rgba(200, 169, 106, 0.15)",
        "gold-lg": "0 30px 80px rgba(200, 169, 106, 0.25)",
      },
    },
  },
  plugins: [],
};
