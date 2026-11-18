/** Report mensili sul server (fase 5): calcolo, elenco, dettaglio, CSV. */
import { api, ApiError } from "./api";
import type { Magazzino, ReportMensile, ReportRow } from "../types";

/** Risposta completa di POST /magazzini/{id}/report e GET /report/{id}. */
interface ReportApi {
  id: string;
  mese: string;
  azienda: string;
  magazzinoNome: string;
  autore: string;
  totArrivi: number;
  totPrelievi: number;
  totValoreAcquisti: number;
  righe: ReportRow[];
}

/** Riga dell'elenco: senza le righe del report. */
interface SintesiApi {
  id: string;
  mese: string;
  azienda: string;
  magazzinoNome: string;
  totArrivi: number;
  totPrelievi: number;
  totValoreAcquisti: number;
}

/** Il server non restituisce magazzinoId e ts: il tipo del client li ha, ma non servono qui. */
function daApi(r: ReportApi): ReportMensile {
  return {
    id: r.id, magazzinoId: "", magazzinoNome: r.magazzinoNome, azienda: r.azienda, mese: r.mese,
    righe: r.righe, totValoreAcquisti: r.totValoreAcquisti, totArrivi: r.totArrivi,
    totPrelievi: r.totPrelievi, autore: r.autore, ts: 0,
  };
}

function sintesiDaApi(s: SintesiApi): ReportMensile {
  return daApi({ ...s, autore: "", righe: [] });
}

/** Genera (o rigenera) il report di un mese. Lancia ApiError con il motivo se non e' possibile. */
export async function generaReport(magazzino: Pick<Magazzino, "id">, mese: string): Promise<ReportMensile> {
  return daApi(await api<ReportApi>(`/magazzini/${magazzino.id}/report`, "POST", { mese }));
}

/** Elenco dei report dell'utente (la prima pagina, massimo 50). */
export async function elencoReport(): Promise<ReportMensile[]> {
  const pagina = await api<{ content: SintesiApi[] }>("/report?pagina=0&dimensione=50");
  return pagina.content.map(sintesiDaApi);
}

export async function dettaglioReport(id: string): Promise<ReportMensile> {
  return daApi(await api<ReportApi>(`/report/${id}`));
}

/** Scarica il CSV generato dal server (con le celle protette dalle formule). */
export async function scaricaCsv(id: string, nomeFile: string): Promise<void> {
  const res = await fetch(`/api/report/${id}/csv`, { credentials: "same-origin" });
  if (!res.ok) throw new ApiError(res.status, "Esportazione non riuscita, riprova.");
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeFile;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Report archiviato nel browser (fasi precedenti): import idempotente con la sua chiave locale. */
export async function importaReportLocale(r: ReportMensile): Promise<void> {
  await api<{ id: string }>("/import/report", "POST", {
    chiave: r.id, mese: r.mese, azienda: r.azienda, magazzinoNome: r.magazzinoNome,
    autore: r.autore, righe: r.righe,
  });
}
