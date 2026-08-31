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
        background: "#FBFBF9",
        foreground: "#0F172A",
        academic: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F8F9FA",
          muted: "#F1F5F9",
          border: "#E2E8F0",
        },
        risk: {
          low: "#15803D",
          lowBg: "#F0FDF4",
          lowBorder: "#BBF7D0",
          mod: "#B45309",
          modBg: "#FFFBEB",
          modBorder: "#FDE68A",
          high: "#C2410C",
          highBg: "#FFF7ED",
          highBorder: "#FED7AA",
          critical: "#B91C1C",
          criticalBg: "#FEF2F2",
          criticalBorder: "#FECACA",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 2px 5px -1px rgba(0, 0, 0, 0.06), 0 1px 3px -1px rgba(0, 0, 0, 0.04)",
        elevated: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)",
      }
    },
  },
  plugins: [],
};
export default config;
