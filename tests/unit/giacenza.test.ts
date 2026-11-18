import { describe, it, expect } from "vitest";
import { giacenza, totalePrelevato, totaleArrivato, costoMedio, valoreGiacenza, ultimoArrivo } from "../../src/utils/giacenza";
import type { Oggetto } from "../../src/types";

const o: Oggetto = {
  id: "o1", nome: "Vite M6", sku: "VM6", categoria: "Ricambi", unita: "pz", sogliaMin: 50,
  movimenti: [
    { id: "a", tipo: "arrivo", data: "2026-01-10", qta: 100, prezzo: 0.20, nota: "" },
    { id: "b", tipo: "arrivo", data: "2026-02-15", qta: 100, prezzo: 0.30, nota: "" },
    { id: "c", tipo: "prelievo", data: "2026-03-01", qta: 60, nota: "" },
  ],
};

describe("giacenza e valorizzazione", () => {
  it("calcola la giacenza come arrivi meno prelievi", () => { expect(giacenza(o)).toBe(140); });
  it("somma arrivi e prelievi separatamente", () => {
    expect(totaleArrivato(o)).toBe(200);
    expect(totalePrelevato(o)).toBe(60);
  });
  it("costo medio ponderato sugli arrivi", () => { expect(costoMedio(o)).toBeCloseTo(0.25, 5); });
  it("valore di giacenza = giacenza * costo medio", () => { expect(valoreGiacenza(o)).toBeCloseTo(35, 5); });
  it("ultimo arrivo è la data più recente", () => { expect(ultimoArrivo(o)).toBe("2026-02-15"); });
  it("oggetto senza movimenti: tutto a zero", () => {
    const vuoto: Oggetto = { ...o, movimenti: [] };
    expect(giacenza(vuoto)).toBe(0);
    expect(costoMedio(vuoto)).toBe(0);
    expect(ultimoArrivo(vuoto)).toBeNull();
  });
});
