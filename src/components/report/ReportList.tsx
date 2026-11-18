import { Loading } from "../ui/Loading";
import { cx } from "../../utils/cx";
import { meseLabel, fmtEuro, fmtNum } from "../../utils/fmt";
import type { ReportMensile } from "../../types";

/** Archivio dei report mensili: una riga per report, con arrivi, prelievi e valore acquisti */
export function ReportList({ reports, onOpen }: { reports: ReportMensile[] | null; onOpen: (r: ReportMensile) => void }) {
  if (reports === null) return <Loading>Sto aprendo i report archiviati…</Loading>;
  if (!reports.length) return <div className="empty">Nessun report archiviato: generane uno dalla pagina di un magazzino.</div>;
  return (
    <section className="section">
      <div className="section-head">
        <h2 className="page-title">Report mensili</h2>
        <span className="muted">{reports.length} archiviati</span>
      </div>
      <div className="list">
        {reports.map((r) => (
          <button key={r.id} className="list-item" onClick={() => onOpen(r)}>
            <span className="item-main">
              <strong className="item-title">{meseLabel(r.mese)}</strong>
              <span className="muted item-sub">{[r.azienda, r.magazzinoNome].filter(Boolean).join(" · ")}</span>
            </span>
            <span className="item-meta">
              <span className="pos">+{fmtNum(r.totArrivi)}</span> / <span className="neg">−{fmtNum(r.totPrelievi)}</span> · risultato{" "}
              <span className={cx((r.totRisultato ?? 0) < 0 && "neg", (r.totRisultato ?? 0) >= 0 && "pos")}>{fmtEuro(r.totRisultato ?? 0)}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
