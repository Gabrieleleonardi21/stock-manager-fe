import { useState } from "react";
import { useToast } from "../../stores/useToast";
import { cx } from "../../utils/cx";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import type { MovimentoDraft } from "../../hooks/useMagazzino";

const oggi = () => new Date().toISOString().slice(0, 10);

// selettore del tipo di movimento: etichetta per ciascun tipo
const TIPI = [
  { tipo: "arrivo", label: "↓ Arrivo stock" },
  { tipo: "prelievo", label: "↑ Prelievo" },
] as const;

// etichetta del prezzo: costo per gli arrivi, prezzo di vendita per i prelievi
const ETICHETTA_PREZZO = { arrivo: "Prezzo acquisto €", prelievo: "Prezzo vendita €" } as const;

// variante del bottone "Registra" per tipo di movimento
const BOTTONE = { arrivo: "ok", prelievo: "primary" } as const;

/** Form per registrare un arrivo (con prezzo d'acquisto) o un prelievo.
 *  `onAdd` restituisce (in modo asincrono) il messaggio di errore, oppure null se è andato a buon fine */
export function MovimentoForm({ unita, guest, onAdd }: {
  unita: string; guest: boolean; onAdd: (d: MovimentoDraft) => Promise<string | null>;
}) {
  const push = useToast((s) => s.push);
  const vuoto: MovimentoDraft = { tipo: "arrivo", data: oggi(), qta: "", prezzo: "", nota: "" };
  const [d, setD] = useState<MovimentoDraft>(vuoto);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    const e = await onAdd(d);
    setErr(e);
    if (e) return;
    push("Movimento registrato");
    // tiene il tipo e la data scelti, azzera il resto
    setD({ ...vuoto, tipo: d.tipo, data: d.data });
  };

  return (
    <div className="form-box">
      <div className="seg full" role="group" aria-label="Tipo di movimento">
        {TIPI.map((t) => {
          const on = d.tipo === t.tipo;
          return (
            <button
              key={t.tipo}
              className={cx("seg-btn", on && "on", on && t.tipo === "arrivo" && "in")}
              aria-pressed={on}
              onClick={() => { setD({ ...d, tipo: t.tipo }); setErr(null); }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="grid-form top-gap">
        <Input label="Data" type="date" value={d.data} onChange={(e) => setD({ ...d, data: e.target.value })} />
        <Input label={`Quantità (${unita})`} type="number" min={0} step="any" value={d.qta} onChange={(e) => setD({ ...d, qta: e.target.value })} />
        <Input label={ETICHETTA_PREZZO[d.tipo]} type="number" min={0} step="any" value={d.prezzo} onChange={(e) => setD({ ...d, prezzo: e.target.value })} placeholder="0,00" />
      </div>
      <div className="top-gap">
        <Input label="Nota (fornitore, lotto, destinazione…)" value={d.nota} onChange={(e) => setD({ ...d, nota: e.target.value })} />
      </div>

      {err && <p className="field-error">{err}</p>}
      <div className="form-actions">
        <Button variant={BOTTONE[d.tipo]} small onClick={submit}>Registra {d.tipo}</Button>
      </div>
      {guest && <p className="muted small top-gap">Modalità Ospite: i prelievi non vengono bloccati dalla giacenza.</p>}
    </div>
  );
}
