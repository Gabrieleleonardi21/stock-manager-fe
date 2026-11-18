import { describe, it, expect } from "vitest";
import { economiaMagazzino } from "../../src/utils/economia";
import type { Magazzino } from "../../src/types";

const mag = (movimenti: Magazzino["oggetti"][number]["movimenti"]): Magazzino => ({
  id: "m", nome: "M", luogo: "", responsabile: "",
  oggetti: [{ id: "o", nome: "Dado", sku: "", categoria: "c", unita: "pz", sogliaMin: 0, movimenti }],
});

describe("economia del magazzino", () => {
  it("guadagno: entrate maggiori delle uscite", () => {
    const r = economiaMagazzino(mag([
      { id: "1", tipo: "arrivo", data: "2026-11-01", qta: 10, prezzo: 2, nota: "" },
      { id: "2", tipo: "prelievo", data: "2026-11-05", qta: 4, prezzo: 6, nota: "" },
    ]));
    expect(r).toEqual({ uscite: 20, entrate: 24, risultato: 4 });
  });

  it("perdita: risultato negativo quando si vende sotto costo", () => {
    const r = economiaMagazzino(mag([
      { id: "1", tipo: "arrivo", data: "2026-11-01", qta: 10, prezzo: 5, nota: "" },
      { id: "2", tipo: "prelievo", data: "2026-11-05", qta: 4, prezzo: 3, nota: "" },
    ]));
    expect(r.risultato).toBe(-38);
  });

  it("i movimenti senza prezzo contano zero", () => {
    const r = economiaMagazzino(mag([
      { id: "1", tipo: "arrivo", data: "2026-11-01", qta: 10, nota: "" },
      { id: "2", tipo: "prelievo", data: "2026-11-05", qta: 4, nota: "" },
    ]));
    expect(r).toEqual({ uscite: 0, entrate: 0, risultato: 0 });
  });
});
