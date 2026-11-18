import { describe, it, expect } from "vitest";
import { analizzaScorta } from "../../src/utils/riordino";
import type { Oggetto } from "../../src/types";

const base = (movimenti: Oggetto["movimenti"], sogliaMin = 50): Oggetto =>
  ({ id: "x", nome: "Art", sku: "", categoria: "Generico", unita: "pz", sogliaMin, movimenti });

describe("analizzaScorta", () => {
  it("stato esaurito quando la giacenza è zero", () => {
    const a = analizzaScorta(base([{ id: "1", tipo: "arrivo", data: "2026-01-01", qta: 10, nota: "" }, { id: "2", tipo: "prelievo", data: "2026-02-01", qta: 10, nota: "" }]));
    expect(a.stato).toBe("esaurito");
    expect(a.consigli[0]).toMatch(/ordine|ordina/i);
  });
  it("stato sotto-soglia quando la giacenza è sotto il minimo", () => {
    const a = analizzaScorta(base([{ id: "1", tipo: "arrivo", data: "2026-01-01", qta: 30, nota: "" }], 50));
    expect(a.stato).toBe("sotto-soglia");
  });
  it("stato fermo se nessun prelievo", () => {
    const a = analizzaScorta(base([{ id: "1", tipo: "arrivo", data: "2026-01-01", qta: 100, nota: "" }], 50));
    expect(a.stato).toBe("fermo");
    expect(a.consumoMedioMese).toBe(0);
  });
  it("stato ok e copertura calcolata con consumo presente", () => {
    const a = analizzaScorta(base([
      { id: "1", tipo: "arrivo", data: "2026-01-01", qta: 300, nota: "" },
      { id: "2", tipo: "prelievo", data: "2026-01-15", qta: 30, nota: "" },
      { id: "3", tipo: "prelievo", data: "2026-02-15", qta: 30, nota: "" },
    ], 50));
    expect(a.stato).toBe("ok");
    expect(a.meseCopertura).not.toBeNull();
    expect(a.meseCopertura!).toBeGreaterThan(0);
  });
});
