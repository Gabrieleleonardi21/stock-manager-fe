import type { Magazzino } from "../../types";
import { giacenza } from "../../utils/giacenza";
import { analizzaScorta } from "../../utils/riordino";
import { fmtNum } from "../../utils/fmt";

/** Riga della lista magazzini: nome, luogo e stato (articoli da riordinare o pezzi in giacenza) */
export function MagazzinoCard({ m, onOpen }: { m: Magazzino; onOpen: () => void }) {
  const allerta = m.oggetti.filter((o) => {
    const s = analizzaScorta(o).stato;
    return s === "esaurito" || s === "sotto-soglia";
  }).length;
  const pezzi = m.oggetti.reduce((t, o) => t + Math.max(0, giacenza(o)), 0);
  return (
    <button className="list-item" onClick={onOpen}>
      <span className="item-main">
        <strong className="item-title">{m.nome}</strong>
        <span className="muted item-sub">
          {[m.luogo, m.responsabile].filter(Boolean).join(" · ")} · {m.oggetti.length} articoli
        </span>
      </span>
      {allerta > 0 && <span className="badge low">{allerta} da riordinare</span>}
      {allerta === 0 && <span className="badge ok">{fmtNum(pezzi)} pezzi in giacenza</span>}
    </button>
  );
}
