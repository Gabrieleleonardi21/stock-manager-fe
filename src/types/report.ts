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
  valoreAcquisti: number;   // somma (qta * prezzo) degli arrivi del mese
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
  autore: string;
  ts: number;
}
