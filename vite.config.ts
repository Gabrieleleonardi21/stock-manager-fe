/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Sviluppo: solo localhost. Le chiamate /api vanno al back-end Spring sulla stessa origine (cookie e CSRF)
  server: {
    host: "localhost",
    port: 5173,
    proxy: { "/api": { target: "http://localhost:8080", changeOrigin: false } },
  },
  test: { environment: "node", include: ["tests/unit/**/*.test.ts"] },
});
