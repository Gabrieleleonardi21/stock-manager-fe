import { test, expect } from "@playwright/test";

async function registra(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("tab", { name: "Registrati" }).click();
  await page.getByLabel("Nome utente").fill("Tester");
  await page.getByLabel("Mail").fill(`nf-${Date.now()}@example.com`);
  await page.getByLabel("Password").fill("passwordsicura123");
  await page.getByRole("button", { name: "Crea account" }).click();
  await expect(page).toHaveURL(/\/azienda/);
}

test("dati di prova: crea il magazzino demo", async ({ page }) => {
  await registra(page);
  await page.getByRole("button", { name: "Carica dati di prova" }).click();
  await expect(page.getByText("Magazzino demo")).toBeVisible();
  await expect(page.getByRole("button", { name: "Carica dati di prova" })).toBeHidden();
});

test("chat: chiudere il pannello non cancella la conversazione", async ({ page }) => {
  await registra(page);
  await page.getByRole("button", { name: "Apri Assistente magazzino" }).click();
  await page.getByLabel("Messaggio per l'assistente").fill("Ciao, cosa puoi fare?");
  await page.getByRole("button", { name: "Invia" }).click();
  await expect(page.getByText("Ciao, cosa puoi fare?")).toBeVisible();
  await page.getByRole("button", { name: /Chiudi \(la conversazione resta\)/ }).click();
  await page.getByRole("button", { name: "Apri Assistente magazzino" }).click();
  await expect(page.getByText("Ciao, cosa puoi fare?")).toBeVisible();
  await page.getByRole("button", { name: "Nuova chat" }).click();
  await expect(page.getByText("Ciao, cosa puoi fare?")).toBeHidden();
});
