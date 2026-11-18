/** Dati salvati nel browser dalle versioni precedenti. Vengono letti per l'import, mai usati come fonte. */
import { storage } from "./storage";
import type { Magazzino, ReportMensile } from "../types";

export interface DatiLocali {
  nome: string;
  magazzini: Magazzino[];
  reports: ReportMensile[];
  reportKeys: string[];
}

export async function leggiDatiLocali(): Promise<DatiLocali> {
  const locali: DatiLocali = { nome: "", magazzini: [], reports: [], reportKeys: [] };
  try {
    const a = JSON.parse((await storage.get("azienda")).value) as { nome?: string; magazzini?: Magazzino[] };
    locali.nome = a.nome ?? "";
    locali.magazzini = a.magazzini ?? [];
  } catch { /* niente di salvato */ }
  const elenco = await storage.list("rep_", true);
  for (const key of elenco.keys) {
    try {
      locali.reports.push(JSON.parse((await storage.get(key, true)).value));
      locali.reportKeys.push(key);
    } catch { /* report illeggibile: ignorato */ }
  }
  return locali;
}

export function haDatiLocali(d: DatiLocali): boolean {
  return d.magazzini.length > 0 || d.reports.length > 0;
}

/** Corpo dell'import di un magazzino: la chiave e' l'id locale, cosi' un nuovo tentativo non duplica. */
export function payloadMagazzino(m: Magazzino) {
  return {
    chiave: m.id,
    nome: m.nome,
    luogo: m.luogo,
    responsabile: m.responsabile,
    oggetti: m.oggetti.map((o) => ({
      nome: o.nome,
      sku: o.sku,
      categoria: o.categoria,
      unita: o.unita,
      sogliaMin: o.sogliaMin,
      movimenti: o.movimenti.map((mv) => ({ tipo: mv.tipo, data: mv.data, qta: mv.qta, prezzo: mv.prezzo ?? null, nota: mv.nota })),
    })),
  };
}

/** Cancella i dati locali. Va chiamata solo dopo un import riuscito o su scelta esplicita dell'utente. */
export async function svuotaDatiLocali(reportKeys: string[]): Promise<void> {
  await storage.delete("azienda").catch(() => {});
  for (const key of reportKeys) {
    await storage.delete(key, true).catch(() => {});
  }
}
