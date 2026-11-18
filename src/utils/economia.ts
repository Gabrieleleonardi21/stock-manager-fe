import type { Magazzino } from "../types";

/** Riepilogo economico: uscite = costo degli arrivi, entrate = prezzo di vendita dei prelievi. */
export interface Economia {
  uscite: number;
  entrate: number;
  risultato: number; // entrate meno uscite: positivo = guadagno, negativo = perdita
}

const centesimi = (v: number) => Math.round(v * 100) / 100;

/** Calcola uscite, entrate e risultato di un magazzino. I movimenti senza prezzo contano zero. */
export function economiaMagazzino(m: Magazzino): Economia {
  let uscite = 0;
  let entrate = 0;
  for (const o of m.oggetti) {
    for (const mv of o.movimenti) {
      const valore = mv.qta * (mv.prezzo ?? 0);
      if (mv.tipo === "arrivo") {
        uscite += valore;
      } else {
        entrate += valore;
      }
    }
  }
  const risultato = entrate - uscite;
  return { uscite: centesimi(uscite), entrate: centesimi(entrate), risultato: centesimi(risultato) };
}
