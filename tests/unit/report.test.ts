import { describe, it, expect } from "vitest";
import { buildReport, mesiConMovimenti, reportToCSV } from "../../src/utils/report";
import type { Magazzino } from "../../src/types";

const m: Magazzino = {
  id: "m1", nome: "Centrale", luogo: "", responsabile: "", oggetti: [
    { id: "o1", nome: "Cartone", sku: "C1", categoria: "Imballaggi", unita: "pz", sogliaMin: 10, movimenti: [
      { id: "a", tipo: "arrivo", data: "2026-04-05", qta: 200, prezzo: 0.5, nota: "" },
      { id: "b", tipo: "prelievo", data: "2026-05-10", qta: 50, nota: "" },
      { id: "c", tipo: "arrivo", data: "2026-05-20", qta: 100, prezzo: 0.6, nota: "" },
    ] },
  ],
};

describe("report mensili", () => {
  it("elenca i mesi con movimenti, decrescente", () => {
    expect(mesiConMovimenti(m)).toEqual(["2026-05", "2026-04"]);
  });
  it("calcola iniziale/arrivi/prelievi/finale del mese", () => {
    const r = buildReport(m, "2026-05", "Azienda", "Tester");
    const riga = r.righe[0];
    expect(riga.giacenzaIniziale).toBe(200); // arrivo di aprile
    expect(riga.arrivi).toBe(100);
    expect(riga.prelievi).toBe(50);
    expect(riga.giacenzaFinale).toBe(250);
    expect(riga.valoreAcquisti).toBeCloseTo(60, 5); // 100 * 0.6
  });
  it("il CSV ha intestazione, riga e totale separati da ;", () => {
    const r = buildReport(m, "2026-05", "Azienda", "Tester");
    const csv = reportToCSV(r);
    const righe = csv.split("\n");
    expect(righe[0]).toContain("Articolo;SKU");
    expect(righe[righe.length - 1]).toContain("TOTALE");
  });
});

describe("sicurezza CSV", () => {
  it("neutralizza le formule (=, +, -, @) nei campi di testo", () => {
    const r = buildReport({
      id: "m", nome: "M", luogo: "", responsabile: "",
      oggetti: [{ id: "o", nome: "=HYPERLINK(\"x\")", sku: "@SUM", categoria: "c", unita: "pz", sogliaMin: 0,
        movimenti: [{ id: "a", tipo: "arrivo", data: "2026-05-01", qta: 5, prezzo: 1, nota: "" }] }],
    }, "2026-05", "A", "U");
    const riga = reportToCSV(r).split("\n")[1];
    expect(riga.startsWith("\"'=HYPERLINK")).toBe(true);
    expect(riga).toContain("'@SUM");
  });
});
