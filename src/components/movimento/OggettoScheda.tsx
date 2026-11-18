import { useState } from "react";
import { analizzaScorta } from "../../utils/riordino";
import { totaleArrivato, totalePrelevato, ultimoArrivo } from "../../utils/giacenza";
import { fmtNum, fmtEuro } from "../../utils/fmt";
import { askAssistant } from "../../services/aiService";
import { StatoBadge } from "../ui/StatoBadge";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { MovimentoForm } from "./MovimentoForm";
import { MovimentoLog } from "./MovimentoLog";
import type { Oggetto } from "../../types";
import type { useMagazzino } from "../../hooks/useMagazzino";

/** Scheda di un articolo in finestra modale: stato, statistiche, consigli di riordino,
 *  raccomandazione dell'assistente AI, registrazione e storico dei movimenti */
export function OggettoScheda({ o, h, onClose }: { o: Oggetto; h: ReturnType<typeof useMagazzino>; onClose: () => void }) {
  const a = analizzaScorta(o);
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const guest = !!h.user?.guest;

  const chiediAI = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    try {
      const q = `Articolo "${o.nome}" (${o.categoria}). Giacenza ${fmtNum(a.giacenza)} ${o.unita}, scorta minima ${fmtNum(a.soglia)} ${o.unita}, consumo medio ${fmtNum(a.consumoMedioMese)} ${o.unita}/mese, costo medio ${fmtEuro(a.costoMedio)}, valore a magazzino ${fmtEuro(a.valore)}, stato "${a.stato}". Dammi una raccomandazione di riordino (se e quanto ordinare) e un suggerimento sulla gestione di questo articolo.`;
      setAiText(await askAssistant([{ role: "user", content: q }]));
    } catch { setAiText("L'assistente non risponde ora, riprova tra poco."); }
    finally { setAiLoading(false); }
  };

  // una casella di statistica (etichetta piccola + valore grande)
  const stat = (label: string, value: string) => (
    <div className="stat" key={label}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );

  return (
    <Modal label={`Scheda di ${o.nome || "articolo"}`} onClose={onClose}>
      <div className="modal-head">
        <div>
          <div className="eyebrow">{[o.sku, o.categoria].filter(Boolean).join(" · ")}</div>
          <h3 className="modal-title">{o.nome || "(senza nome)"}</h3>
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="Chiudi">×</button>
      </div>

      <div className="row-wrap">
        <StatoBadge stato={a.stato} />
        <span className="muted small">
          {(a.meseCopertura !== null && `Autonomia ~${a.meseCopertura.toFixed(1).replace(".", ",")} mesi`) || "Consumo non ancora stimabile"}
        </span>
      </div>

      <div className="stat-grid">
        {stat("Giacenza", `${fmtNum(a.giacenza)} ${o.unita}`)}
        {stat("Scorta minima", `${fmtNum(a.soglia)} ${o.unita}`)}
        {stat("Tot. arrivato", `${fmtNum(totaleArrivato(o))} ${o.unita}`)}
        {stat("Tot. prelevato", `${fmtNum(totalePrelevato(o))} ${o.unita}`)}
        {stat("Costo medio", fmtEuro(a.costoMedio))}
        {stat("Valore stock", fmtEuro(a.valore))}
      </div>

      <h4 className="panel-title">Consigli di riordino</h4>
      <div className="reco">
        <ul>{a.consigli.map((c, i) => <li key={i}>{c}</li>)}</ul>
        {ultimoArrivo(o) && <p className="muted small">Ultimo arrivo: {ultimoArrivo(o)}.</p>}
      </div>

      <div className="ai-block">
        {aiText && <p className="ai-out"><span className="ai-tag">Assistente AI</span>{aiText}</p>}
        {!aiText && !guest && (
          <>
            <Button small onClick={chiediAI} disabled={aiLoading}>Raccomandazione dell'Assistente AI</Button>
            {aiLoading && <span className="pulse muted small"> L'assistente sta valutando…</span>}
          </>
        )}
        {!aiText && guest && <p className="muted small">L'assistente è disponibile con un account registrato.</p>}
      </div>

      <h4 className="panel-title section-rule">Registra un movimento</h4>
      <MovimentoForm unita={o.unita} guest={guest} onAdd={(d) => h.addMovimento(o.id, d)} />

      <h4 className="panel-title section-rule">Storico movimenti</h4>
      <MovimentoLog o={o} onRemove={(mid) => h.removeMovimento(o.id, mid)} />
    </Modal>
  );
}
