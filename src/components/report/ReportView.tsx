import { meseLabel } from "../../utils/fmt";
import { scaricaCsv } from "../../services/report";
import { Button } from "../ui/Button";
import { ReportTable } from "./ReportTable";
import type { ReportMensile } from "../../types";

/** Dettaglio di un report mensile. Il CSV lo genera il server (celle protette dalle formule). */
export function ReportView({ r }: { r: ReportMensile }) {
  const nomeFile = `report_${r.magazzinoNome.replace(/\s+/g, "-")}_${r.mese}.csv`;
  return (
    <div>
      <div className="section-head">
        <div>
          <div className="eyebrow">
            {[r.azienda, r.magazzinoNome].filter(Boolean).join(" · ")}{r.autore && ` · a cura di ${r.autore}`}
          </div>
          <h3 className="report-title">{meseLabel(r.mese)}</h3>
        </div>
        <Button small onClick={() => scaricaCsv(r.id, nomeFile)}>↓ Esporta CSV</Button>
      </div>
      <ReportTable r={r} />
    </div>
  );
}
