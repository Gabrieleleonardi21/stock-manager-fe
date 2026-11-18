import type { Movimento, Oggetto } from "../types";

/** Giacenza attuale: somma arrivi meno prelievi */
export function giacenza(o: Oggetto): number {
  return (o.movimenti || []).reduce((t, m) => t + (m.tipo === "arrivo" ? m.qta : -m.qta), 0);
}

/** Totale prelevato (uscite cumulate) */
export function totalePrelevato(o: Oggetto): number {
  return (o.movimenti || []).filter((m) => m.tipo === "prelievo").reduce((t, m) => t + m.qta, 0);
}

/** Totale arrivato (entrate cumulate) */
export function totaleArrivato(o: Oggetto): number {
  return (o.movimenti || []).filter((m) => m.tipo === "arrivo").reduce((t, m) => t + m.qta, 0);
}

/** Costo medio ponderato di acquisto sugli arrivi con prezzo indicato */
export function costoMedio(o: Oggetto): number {
  let qta = 0, costo = 0;
  (o.movimenti || []).forEach((m) => {
    if (m.tipo === "arrivo" && m.prezzo != null) { qta += m.qta; costo += m.qta * m.prezzo; }
  });
  return qta > 0 ? costo / qta : 0;
}

/** Valore di magazzino dell'oggetto: giacenza * costo medio */
export function valoreGiacenza(o: Oggetto): number {
  return giacenza(o) * costoMedio(o);
}

/** Data dell'ultimo arrivo (ISO) o null */
export function ultimoArrivo(o: Oggetto): string | null {
  const arr = (o.movimenti || []).filter((m) => m.tipo === "arrivo").map((m) => m.data).sort();
  return arr.length ? arr[arr.length - 1] : null;
}

/** Movimenti ordinati per data decrescente */
export function movimentiOrdinati(o: Oggetto): Movimento[] {
  return [...(o.movimenti || [])].sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
}
