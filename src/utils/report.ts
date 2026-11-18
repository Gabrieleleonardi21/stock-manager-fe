import type { Magazzino, ReportMensile, ReportRow } from "../types";

/** elenco dei mesi (yyyy-mm) in cui il magazzino ha movimenti, decrescente */
export function mesiConMovimenti(m: Magazzino): string[] {
  const set = new Set<string>();
  m.oggetti.forEach((o) => (o.movimenti || []).forEach((mov) => {
    if (mov.data && mov.data.length >= 7) set.add(mov.data.slice(0, 7));
  }));
  return [...set].sort().reverse();
}

/** Costruisce il report di un singolo mese (yyyy-mm) per un magazzino */
export function buildReport(m: Magazzino, mese: string, azienda: string, autore: string): ReportMensile {
  const righe: ReportRow[] = m.oggetti.map((o) => {
    let iniziale = 0, arrivi = 0, prelievi = 0, valoreAcquisti = 0;
    (o.movimenti || []).forEach((mov) => {
      const mm = (mov.data || "").slice(0, 7);
      const delta = mov.tipo === "arrivo" ? mov.qta : -mov.qta;
      if (mm < mese) iniziale += delta;
      else if (mm === mese) {
        if (mov.tipo === "arrivo") { arrivi += mov.qta; valoreAcquisti += mov.qta * (mov.prezzo || 0); }
        else prelievi += mov.qta;
      }
    });
    return {
      nome: o.nome, sku: o.sku, categoria: o.categoria, unita: o.unita,
      giacenzaIniziale: iniziale, arrivi, prelievi,
      giacenzaFinale: iniziale + arrivi - prelievi, valoreAcquisti,
    };
  }).filter((r) => r.arrivi !== 0 || r.prelievi !== 0 || r.giacenzaIniziale !== 0);

  return {
    id: `${m.id}_${mese}`,
    magazzinoId: m.id, magazzinoNome: m.nome, azienda, mese, righe,
    totValoreAcquisti: righe.reduce((t, r) => t + r.valoreAcquisti, 0),
    totArrivi: righe.reduce((t, r) => t + r.arrivi, 0),
    totPrelievi: righe.reduce((t, r) => t + r.prelievi, 0),
    autore, ts: Date.now(),
  };
}

/** Serializza un report in CSV (separatore ; per Excel italiano) */
export function reportToCSV(r: ReportMensile): string {
  const head = ["Articolo", "SKU", "Categoria", "Unita", "Giacenza iniziale", "Arrivi", "Prelievi", "Giacenza finale", "Valore acquisti EUR"];
  const rows = r.righe.map((x) => [
    x.nome, x.sku, x.categoria, x.unita,
    x.giacenzaIniziale, x.arrivi, x.prelievi, x.giacenzaFinale,
    x.valoreAcquisti.toFixed(2),
  ]);
  // celle di testo che iniziano con = + - @ (o tab/a capo) Excel le eseguirebbe come formule:
  // le neutralizziamo con un apostrofo iniziale. I numeri restano invariati
  const esc = (v: string | number) => {
    const base = typeof v === "string" && /^[=+\-@\t\r]/.test(v) ? `'${v}` : String(v);
    const s = base.replace(/"/g, '""');
    return /[";\n]/.test(s) ? `"${s}"` : s;
  };
  const tot = ["TOTALE", "", "", "", "", r.totArrivi, r.totPrelievi, "", r.totValoreAcquisti.toFixed(2)];
  return [head, ...rows, tot].map((r) => r.map(esc).join(";")).join("\n");
}
