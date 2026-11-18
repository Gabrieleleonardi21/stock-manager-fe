import { useToast } from "../../stores/useToast";
import { movimentiOrdinati } from "../../utils/giacenza";
import { fmtNum, fmtEuro } from "../../utils/fmt";
import type { Oggetto } from "../../types";

const ETICHETTA = { arrivo: "↓ Arrivo", prelievo: "↑ Prelievo" } as const;
const SEGNO = { arrivo: "+", prelievo: "−" } as const;

/** Storico dei movimenti di un articolo, dal più recente. Se c'è `onRemove` compare il pulsante × */
export function MovimentoLog({ o, onRemove }: { o: Oggetto; onRemove?: (mid: string) => void }) {
  const push = useToast((s) => s.push);
  const movs = movimentiOrdinati(o);
  if (!movs.length) return <p className="empty-line">Nessun movimento registrato.</p>;
  return (
    <div className="mov-list">
      {movs.map((m) => (
        <div key={m.id} className="mov">
          <span className={`mov-tipo ${m.tipo}`}>{ETICHETTA[m.tipo]}</span>
          <span>{m.data}</span>
          <span className="mov-qta">{SEGNO[m.tipo]}{fmtNum(m.qta)} {o.unita}</span>
          <span className="mov-note">
            {m.prezzo != null && `${fmtEuro(m.prezzo)}/${o.unita} `}
            {m.nota && <i>· {m.nota}</i>}
          </span>
          {onRemove && (
            <button className="icon-btn" aria-label="Elimina movimento" onClick={() => { onRemove(m.id); push("Movimento eliminato"); }}>×</button>
          )}
        </div>
      ))}
    </div>
  );
}
