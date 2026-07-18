import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    css: false,
    exclude: ["e2e/**", "node_modules/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "next/navigation": path.resolve(__dirname, "tests/__mocks__/next-navigation.ts"),
      "next/link": path.resolve(__dirname, "tests/__mocks__/next-link.tsx"),
    },
  },
});
