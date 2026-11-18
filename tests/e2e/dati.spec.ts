import { test, expect } from "@playwright/test";

// Flusso reale con il server: i dati di un utente registrato sopravvivono al ricaricamento della pagina.
test("magazzino, articolo e movimento restano dopo F5 (utente registrato)", async ({ page }) => {
  const email = `dati-${Date.now()}@example.com`;
  await page.goto("/");
  await page.getByRole("tab", { name: "Registrati" }).click();
  await page.getByLabel("Nome utente").fill("Tester");
  await page.getByLabel("Mail").fill(email);
  await page.getByLabel("Password").fill("passwordsicura123");
  await page.getByRole("button", { name: "Crea account" }).click();
  await expect(page).toHaveURL(/\/azienda/);

  // nuovo magazzino
  await page.getByLabel("Nome").first().fill("Magazzino e2e");
  await page.getByRole("button", { name: "Crea magazzino" }).click();
  await expect(page).toHaveURL(/\/azienda\/magazzino\//);

  // nuovo articolo e arrivo di 10 pezzi
  await page.getByRole("button", { name: /Aggiungi articolo/ }).click();
  await page.getByRole("button", { name: /Movimenti \(0\)/ }).first().click();
  await page.getByLabel(/Quantità/).fill("10");
  await page.getByRole("button", { name: /Registra arrivo/ }).click();
  await expect(page.getByText("Movimento registrato")).toBeVisible();

  // ricaricamento: il dato deve essere ancora sul server
  await page.reload();
  await expect(page.getByRole("heading", { name: "Magazzino e2e" })).toBeVisible();
  await expect(page.getByText("10", { exact: false }).first()).toBeVisible();
});

// Dati salvati nel browser prima dell'account: il banner chiede di importarli, e dopo l'import non compaiono piu'.
test("dati locali: il banner chiede di importarli nell'account", async ({ page }) => {
  const email = `locale-${Date.now()}@example.com`;
  const locale = {
    nome: "Locale SRL",
    magazzini: [{ id: "loc1", nome: "Magazzino locale", luogo: "", responsabile: "", oggetti: [
      { id: "o1", nome: "Chiodi", sku: "", categoria: "Ricambi", unita: "pz", sogliaMin: 0,
        movimenti: [{ id: "m1", tipo: "arrivo", data: "2026-05-01", qta: 7, prezzo: 0.1, nota: "" }] }] }],
  };
  await page.goto("/");
  await page.evaluate((dati) => localStorage.setItem("stock_azienda", JSON.stringify(dati)), locale);
  await page.reload();
  await page.getByRole("tab", { name: "Registrati" }).click();
  await page.getByLabel("Nome utente").fill("Tester");
  await page.getByLabel("Mail").fill(email);
  await page.getByLabel("Password").fill("passwordsicura123");
  await page.getByRole("button", { name: "Crea account" }).click();
  await expect(page).toHaveURL(/\/azienda/);
  await expect(page.getByText("Dati salvati su questo browser")).toBeVisible();
  await page.getByRole("button", { name: "Importa nel mio account" }).click();
  await expect(page.getByText("Magazzino locale")).toBeVisible();
  await expect(page.getByText("Dati salvati su questo browser")).toBeHidden();
  await page.reload();
  await expect(page.getByText("Magazzino locale")).toBeVisible();
  await expect(page.getByText("Dati salvati su questo browser")).toBeHidden();
});
