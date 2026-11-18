import { useState, type ChangeEvent } from "react";
import { mesiConMovimenti } from "../../utils/report";
import { meseLabel } from "../../utils/fmt";
import { usePubblicaReport } from "../../hooks/useReport";
import { useToast } from "../../stores/useToast";
import { Button } from "../ui/Button";
import { Select } from "../ui/Input";
import type { Magazzino, ReportMensile } from "../../types";

/** Archivia il report del mese scelto per questo magazzino (solo utenti registrati) */
export function GeneraReport({ magazzino, onPubblicato }: { magazzino: Magazzino; onPubblicato: (r: ReportMensile) => void }) {
  const mesi = mesiConMovimenti(magazzino);
  const [mese, setMese] = useState(mesi[0] || "");
  const [msg, setMsg] = useState<string | null>(null);
  const { pubblica } = usePubblicaReport();
  const push = useToast((s) => s.push);

  const run = async () => {
    if (!mese) { setMsg("Nessun mese con movimenti da archiviare."); return; }
    const res = await pubblica(magazzino, mese);
    if (typeof res === "string") { setMsg(res); return; }
    setMsg(null);
    onPubblicato(res);
    push("Report archiviato");
  };

  const cambiaMese = (e: ChangeEvent<HTMLSelectElement>) => { setMese(e.target.value); setMsg(null); };

  return (
    <div className="card block-gap">
      <h3 className="panel-title">Genera e archivia un report mensile</h3>
      {mesi.length === 0 && <p className="muted">Registra qualche movimento per poter generare un report.</p>}
      {mesi.length > 0 && (
        <div className="row-wrap">
          <Select value={mese} onChange={cambiaMese} aria-label="Mese del report">
            {mesi.map((m) => <option key={m} value={m}>{meseLabel(m)}</option>)}
          </Select>
          <Button variant="ok" onClick={run}>Archivia report</Button>
        </div>
      )}
      {msg && <p className="field-error">{msg}</p>}
      <p className="muted small top-gap">
        Il report fotografa giacenze, arrivi, prelievi e valore acquisti del mese. Una volta archiviato è consultabile da tutti ed esportabile in CSV.
      </p>
    </div>
  );
}
