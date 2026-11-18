import { defineConfig } from "@playwright/test";

// Config delle e2e: limitata a tests/e2e (i test unitari sono di Vitest).
// Avvia il dev server da solo, oppure riusa quello già acceso.
export default defineConfig({
  testDir: "tests/e2e",
  // Back-end reale: BCrypt (costo 12) e database remoto rendono le risposte piu' lente dei default
  timeout: 60_000,
  expect: { timeout: 20_000 },
  // E2E_BASE_URL: esegue le e2e contro il server di produzione (es. http://localhost:8080) senza dev server
  use: { baseURL: process.env.E2E_BASE_URL ?? "http://localhost:5173" },
  webServer: process.env.E2E_BASE_URL ? undefined : {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
  },
});
