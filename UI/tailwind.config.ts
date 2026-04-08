import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui"],
        sans: ["Instrument Sans", "ui-sans-serif", "system-ui"],
      },
      colors: {
        ink: {
          900: "#0b0f14",
          800: "#111826",
          700: "#1b2432",
          200: "#b7c0cf",
          100: "#e6edf7",
        },
        brand: {
          600: "#2563eb",
          500: "#3b82f6",
          400: "#60a5fa",
        },
        mist: {
          50: "#f7f9fc",
          100: "#eef3f9",
        },
        mint: {
          400: "#22c55e",
        },
        amber: {
          400: "#f59e0b",
        },
        rose: {
          400: "#f43f5e",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
        glow: "0 0 40px rgba(59, 130, 246, 0.25)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
