/** numero con separatore italiano e massimo 2 decimali */
export const fmtNum = (v: number): string =>
  new Intl.NumberFormat("it-IT", { maximumFractionDigits: 2 }).format(v);

/** valuta in euro */
export const fmtEuro = (v: number): string =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(v || 0);

/** yyyy-mm -> "Giugno 2026" */
export function meseLabel(mese: string): string {
  const [y, m] = mese.split("-").map(Number);
  if (!y || !m) return mese;
  const nomi = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  return `${nomi[m - 1]} ${y}`;
}
