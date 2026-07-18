/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B1426",
        card: "#1A2744",
        "card-hover": "#1E3A5F",
        accent: {
          DEFAULT: "#3B82F6",
          hover: "#2563EB",
        },
        success: {
          DEFAULT: "#10B981",
          hover: "#059669",
        },
        danger: {
          DEFAULT: "#EF4444",
          hover: "#DC2626",
        },
        warning: {
          DEFAULT: "#F59E0B",
        },
        border: "#1E3A5F",
        "text-primary": "#F8FAFC",
        "text-secondary": "#94A3B8",
        "text-muted": "#64748B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
