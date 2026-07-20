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
        background: "#0a0a0a",
        "bg-alt": "#111111",
        cream: {
          DEFAULT: "#f8f7f2",
          text: "#141310",
        },
        card: "#111111",
        "card-hover": "#1a1a1a",
        accent: {
          DEFAULT: "#7fe7c4",
          hover: "#6ad4b0",
          dim: "#3d5f52",
        },
        mint: {
          DEFAULT: "#7fe7c4",
          dim: "#3d5f52",
        },
        lavender: {
          DEFAULT: "#a3a1f2",
          dim: "#5a58a0",
        },
        coral: {
          DEFAULT: "#e88a7d",
          dim: "#8a4a42",
        },
        amber: {
          DEFAULT: "#f0c96b",
          dim: "#8a7640",
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
        border: {
          DEFAULT: "rgba(255,255,255,0.09)",
          strong: "rgba(255,255,255,0.18)",
        },
        "text-primary": "#f0efe9",
        "text-secondary": "#8a897f",
        "text-muted": "#64748B",
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
        "reveal-word": {
          "0%": { opacity: "0", filter: "blur(6px)", transform: "translateY(16px)" },
          "100%": { opacity: "1", filter: "blur(0)", transform: "translateY(0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(36px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scroll-line": {
          "0%": { top: "-100%" },
          "60%": { top: "100%" },
          "100%": { top: "100%" },
        },
        gridIn: {
          to: { opacity: "1" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideX: {
          "0%": {
            opacity: "0",
            transform: "translate3d(60vw, -55vh, 0) rotate(-22deg) scale(1.5)",
          },
          "55%": { opacity: "1" },
          "100%": {
            opacity: "1",
            transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)",
            filter: "drop-shadow(0 0 26px rgba(35,167,214,0.6))",
          },
        },
        settle: {
          "0%": { filter: "drop-shadow(0 0 26px rgba(35,167,214,0.6))" },
          "100%": { filter: "drop-shadow(0 0 0 rgba(35,167,214,0))" },
        },
      },
      animation: {
        "reveal-word": "reveal-word 0.7s cubic-bezier(.22,.9,.3,1) forwards",
        "fade-up": "fade-up 0.8s ease forwards",
        "scroll-line": "scroll-line 1.8s ease-in-out infinite",
        gridIn: "gridIn 1.2s ease forwards 0.2s",
        rise: "rise 0.7s cubic-bezier(.2,.9,.2,1) forwards",
        slideX: "slideX 0.85s cubic-bezier(.16,.9,.28,1) forwards",
        settle: "settle 0.5s ease forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
