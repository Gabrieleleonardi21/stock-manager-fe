import type { Oggetto } from "../types";
import { giacenza, totalePrelevato, costoMedio, ultimoArrivo } from "./giacenza";
import { fmtNum, fmtEuro } from "./fmt";

export type StatoScorta = "esaurito" | "sotto-soglia" | "ok" | "fermo";

export interface AnalisiScorta {
  stato: StatoScorta;
  giacenza: number;
  soglia: number;
  consumoMedioMese: number;   // prelievi medi mensili
  meseCopertura: number | null; // mesi di autonomia residua
  costoMedio: number;
  valore: number;
  consigli: string[];
}

const MS_MESE = 30 * 24 * 3600 * 1000;

/** Analisi deterministica dello stato scorta + consigli di riordino */
export function analizzaScorta(o: Oggetto): AnalisiScorta {
  const g = giacenza(o);
  const soglia = Number(o.sogliaMin) || 0;
  const prelievi = (o.movimenti || []).filter((m) => m.tipo === "prelievo");

  /* consumo medio mensile sul periodo coperto dai prelievi */
  let consumoMedioMese = 0;
  if (prelievi.length) {
    const date = prelievi.map((m) => new Date(m.data).getTime()).filter((t) => !isNaN(t));
    const tot = prelievi.reduce((t, m) => t + m.qta, 0);
    const span = date.length > 1 ? Math.max(MS_MESE, Math.max(...date) - Math.min(...date)) : MS_MESE;
    consumoMedioMese = tot / (span / MS_MESE);
  }

  const meseCopertura = consumoMedioMese > 0 ? g / consumoMedioMese : null;
  const cm = costoMedio(o);
  const valore = g * cm;

  let stato: StatoScorta;
  if (g <= 0) stato = "esaurito";
  else if (g < soglia) stato = "sotto-soglia";
  else if (consumoMedioMese === 0) stato = "fermo";
  else stato = "ok";

  const consigli: string[] = [];

  if (stato === "esaurito") {
    const lotto = soglia > 0 ? Math.max(soglia, Math.ceil(consumoMedioMese)) : Math.ceil(consumoMedioMese) || null;
    consigli.push(lotto
      ? `Scorta a zero: emetti subito un ordine. Lotto suggerito ~${fmtNum(lotto)} ${o.unita} (copre soglia e consumo mensile).`
      : "Scorta a zero: emetti un ordine di riapprovvigionamento.");
  } else if (stato === "sotto-soglia") {
    const daOrdinare = Math.ceil(soglia - g + consumoMedioMese);
    consigli.push(`Sotto la soglia minima (${fmtNum(g)} < ${fmtNum(soglia)}): ordina circa ${fmtNum(daOrdinare)} ${o.unita} per rientrare e coprire un mese.`);
  } else if (stato === "fermo") {
    consigli.push("Nessun prelievo registrato: scorta ferma. Verifica se l'articolo è ancora movimentato o se è capitale immobilizzato.");
  } else {
    consigli.push(`Scorta adeguata. Al ritmo attuale (~${fmtNum(consumoMedioMese)} ${o.unita}/mese) hai autonomia per circa ${meseCopertura!.toFixed(1).replace(".", ",")} mesi.`);
  }

  if (meseCopertura !== null && meseCopertura < 1 && stato !== "esaurito")
    consigli.push("Copertura inferiore a un mese: pianifica il riordino a breve per evitare la rottura di stock.");

  if (cm > 0 && valore > 0 && stato === "ok" && meseCopertura !== null && meseCopertura > 6)
    consigli.push(`Oltre 6 mesi di copertura per ${fmtEuro(valore)} di valore: valuta se ridurre i lotti d'acquisto per liberare capitale.`);

  const ua = ultimoArrivo(o);
  if (ua) {
    const giorni = Math.floor((Date.now() - new Date(ua).getTime()) / (24 * 3600 * 1000));
    if (giorni > 180 && stato !== "ok")
      consigli.push(`Ultimo arrivo ${giorni} giorni fa: contatta il fornitore per i tempi di consegna.`);
  }

  return { stato, giacenza: g, soglia, consumoMedioMese, meseCopertura, costoMedio: cm, valore, consigli };
}

/** Totale prelevato esposto per comodità nelle viste */
export { totalePrelevato };
