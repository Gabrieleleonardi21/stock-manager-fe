import type { Magazzino } from "./magazzino";

/** Riga di un report mensile, una per oggetto */
export interface ReportRow {
  nome: string;
  sku: string;
  categoria: string;
  unita: string;
  giacenzaIniziale: number;
  arrivi: number;
  prelievi: number;
  giacenzaFinale: number;
  valoreAcquisti: number;   // uscite: somma (qta * prezzo) degli arrivi del mese
  entrate?: number;         // entrate: somma (qta * prezzo di vendita) dei prelievi del mese
}

/** Report mensile di un magazzino, archiviabile e condivisibile */
export interface ReportMensile {
  id: string;               // `${magazzinoId}_${mese}`
  magazzinoId: string;
  magazzinoNome: string;
  azienda: string;
  mese: string;             // yyyy-mm
  righe: ReportRow[];
  totValoreAcquisti: number;
  totArrivi: number;
  totPrelievi: number;
  totEntrate?: number;      // entrate del mese
  totRisultato?: number;    // entrate meno uscite (positivo = guadagno)
  autore: string;
  ts: number;
}
