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
        background: "#ffffff",
        "bg-alt": "#f8fafc",
        card: "#ffffff",
        "card-hover": "#f1f5f9",
        accent: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
          dim: "#93c5fd",
        },
        "text-primary": "#0f172a",
        "text-secondary": "#64748b",
        "text-muted": "#94a3b8",
        border: {
          DEFAULT: "#e2e8f0",
          strong: "#cbd5e1",
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
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Newsreader", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      transitionDuration: {
        800: "800ms",
        900: "900ms",
      },
      transitionDelay: {
        400: "400ms",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(.22,.9,.3,1)",
        "out-quart": "cubic-bezier(.76,0,.24,1)",
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(.22,.9,.3,1) forwards",
        "fade-in": "fade-in 0.5s ease forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
