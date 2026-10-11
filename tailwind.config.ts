import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FBF9F5",
        sand: "#F2ECE1",
        beige: "#EAE2D5",
        warmstone: "#D8CDBF",
        charcoal: "#242322",
        ink: "#111111",
        terracotta: {
          DEFAULT: "#C26535",
          dark: "#A85226",
          light: "#E38959",
        },
        amber: {
          DEFAULT: "#D48B47",
          dark: "#B87332",
        },
        sage: "#6E7A69",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
