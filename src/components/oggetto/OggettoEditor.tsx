import { CATEGORIE } from "../../constants/categories";
import { UNITS } from "../../constants/units";
import { giacenza } from "../../utils/giacenza";
import { analizzaScorta } from "../../utils/riordino";
import { fmtNum } from "../../utils/fmt";
import { cx } from "../../utils/cx";
import { useToast } from "../../stores/useToast";
import { StatoBadge } from "../ui/StatoBadge";
import { Input, Select } from "../ui/Input";
import { Button } from "../ui/Button";
import type { Oggetto } from "../../types";
import type { useMagazzino } from "../../hooks/useMagazzino";

/** Card di un articolo: giacenza con barra rispetto alla scorta, modifica dei dati base e accesso ai movimenti */
export function OggettoEditor({ o, h, onOpen }: { o: Oggetto; h: ReturnType<typeof useMagazzino>; onOpen: () => void }) {
  const push = useToast((s) => s.push);
  const g = giacenza(o);
  const { stato } = analizzaScorta(o);
  // la barra arriva al doppio della scorta minima (o alla giacenza, se è più alta)
  const scala = Math.max(o.sogliaMin * 2, g, 1);
  const pct = Math.min(100, Math.max(0, (g / scala) * 100));
  const inAllerta = stato === "esaurito" || stato === "sotto-soglia";

  return (
    <article className={cx("card card-lift", inAllerta && "is-alert")}>
      <div className="oggetto-head">
        <StatoBadge stato={stato} />
        <span className="qty">{fmtNum(g)} <small>{o.unita}</small></span>
      </div>
      <div className="bar" aria-hidden="true">
        <div className={cx("bar-fill", stato)} style={{ width: `${pct}%` }} />
      </div>

      <div className="grid-2">
        <Input label="Articolo" value={o.nome} onChange={(e) => h.updateOggetto(o.id, { nome: e.target.value })} placeholder="Nome" />
        <Input label="SKU / codice" value={o.sku} onChange={(e) => h.updateOggetto(o.id, { sku: e.target.value })} placeholder="ABC-001" />
        <Select label="Categoria" value={o.categoria} onChange={(e) => h.updateOggetto(o.id, { categoria: e.target.value })}>
          {[...new Set([o.categoria, ...CATEGORIE])].map((c) => <option key={c}>{c}</option>)}
        </Select>
        <Select label="Unità" value={o.unita} onChange={(e) => h.updateOggetto(o.id, { unita: e.target.value })}>
          {[...new Set([o.unita, ...UNITS])].map((u) => <option key={u}>{u}</option>)}
        </Select>
        <Input label="Scorta minima" type="number" min={0} value={o.sogliaMin} onChange={(e) => h.updateOggetto(o.id, { sogliaMin: Math.max(0, Number(e.target.value) || 0) })} />
      </div>

      <div className="oggetto-foot">
        <Button variant="primary" small onClick={onOpen}>Movimenti ({o.movimenti.length})</Button>
        <Button variant="ghost" small onClick={() => { h.removeOggetto(o.id); push("Articolo rimosso"); }}>Rimuovi</Button>
      </div>
    </article>
  );
}
