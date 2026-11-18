import { test, expect } from "@playwright/test";
test("creazione magazzino e articolo da Ospite", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Continua come Ospite/i }).click();
  await page.getByLabel(/Nome/i).first().fill("Magazzino test");
  await page.getByRole("button", { name: /Crea magazzino/i }).click();
  await expect(page).toHaveURL(/\/azienda\/magazzino\//);
  await page.getByRole("button", { name: /Aggiungi articolo/i }).click();
  await expect(page.getByRole("button", { name: /Movimenti \(0\)/ }).first()).toBeVisible();
});
