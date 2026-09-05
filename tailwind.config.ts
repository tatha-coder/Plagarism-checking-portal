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
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "monospace"],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
        elevated: "0 12px 30px -8px rgba(15, 23, 42, 0.08), 0 4px 12px -4px rgba(15, 23, 42, 0.04)",
        spotlight: "0 0 0 1px rgba(15, 23, 42, 0.08), 0 20px 40px -15px rgba(15, 23, 42, 0.1)",
      }
    },
  },
  plugins: [],
};
export default config;
