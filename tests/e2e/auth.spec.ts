import { test, expect } from "@playwright/test";
test("la home mostra accesso e ingresso Ospite", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "STOCK MANAGER" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Continua come Ospite/i })).toBeVisible();
});
test("l'Ospite entra nell'area magazzini", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Continua come Ospite/i }).click();
  await expect(page).toHaveURL(/\/azienda/);
});

// Flusso reale con il back-end: registrazione, F5 che mantiene la sessione, logout.
test("registrazione reale, sessione mantenuta dopo F5, logout", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;
  await page.goto("/");
  await page.getByRole("tab", { name: "Registrati" }).click();
  await page.getByLabel("Nome utente").fill("Tester");
  await page.getByLabel("Mail").fill(email);
  await page.getByLabel("Password").fill("passwordsicura123");
  await page.getByRole("button", { name: "Crea account" }).click();
  await expect(page).toHaveURL(/\/azienda/);
  await page.reload();
  await expect(page).toHaveURL(/\/azienda/);
  await expect(page.getByRole("button", { name: "Esci" })).toBeVisible();
  await page.getByRole("button", { name: "Esci" }).click();
  await expect(page.getByRole("button", { name: "Continua come Ospite" })).toBeVisible();
});
