import { useState } from "react";
import { useReportArchivio } from "../hooks/useReport";
import { ReportList } from "../components/report/ReportList";
import { ReportView } from "../components/report/ReportView";
import { Button } from "../components/ui/Button";
import { dettaglioReport } from "../services/report";
import type { ReportMensile } from "../types";

/** Archivio dei report: elenco, oppure il dettaglio del report selezionato (caricato dal server) */
export function ReportPage() {
  const { reports } = useReportArchivio();
  const [sel, setSel] = useState<ReportMensile | null>(null);

  // l'elenco non contiene le righe: il dettaglio si carica quando si apre il report
  const apri = async (r: ReportMensile) => {
    setSel(await dettaglioReport(r.id));
  };

  if (sel) {
    return (
      <div>
        <div className="section-head">
          <Button variant="ghost" small onClick={() => setSel(null)}>← Tutti i report</Button>
        </div>
        <ReportView r={sel} />
      </div>
    );
  }
  return <ReportList reports={reports} onOpen={apri} />;
}
