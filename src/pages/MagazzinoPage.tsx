import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useMagazzino } from "../hooks/useMagazzino";
import { OggettoEditor } from "../components/oggetto/OggettoEditor";
import { OggettoScheda } from "../components/movimento/OggettoScheda";
import { GeneraReport } from "../components/report/GeneraReport";
import { ReportView } from "../components/report/ReportView";
import { Kpi } from "../components/ui/Kpi";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { valoreGiacenza } from "../utils/giacenza";
import { economiaMagazzino } from "../utils/economia";
import { analizzaScorta, type StatoScorta } from "../utils/riordino";
import { fmtEuro, fmtNum } from "../utils/fmt";
import { cx } from "../utils/cx";
import type { Oggetto, ReportMensile } from "../types";

type Filtro = "tutti" | "allerta" | "ok" | "fermo";
const FILTRI: { id: Filtro; label: string }[] = [
  { id: "tutti", label: "Tutti" },
  { id: "allerta", label: "Da riordinare" },
  { id: "ok", label: "In scorta" },
  { id: "fermo", label: "Fermi" },
];
const IN_ALLERTA: StatoScorta[] = ["esaurito", "sotto-soglia"];

const statoDi = (o: Oggetto) => analizzaScorta(o).stato;

/** Pagina di un magazzino: KPI, ricerca e filtri sugli articoli, card con barra di scorta, report mensile */
export function MagazzinoPage() {
  const { id } = useParams();
  const h = useMagazzino(id);
  const navigate = useNavigate();
  const [openOid, setOpenOid] = useState<string | null>(null);
  const [report, setReport] = useState<ReportMensile | null>(null);
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("tutti");

  if (!h.user) return <Navigate to="/" replace />;
  if (!h.magazzino) return <Navigate to="/azienda" replace />;
  const m = h.magazzino;

  const allerta = m.oggetti.filter((o) => IN_ALLERTA.includes(statoDi(o)));
  const valore = m.oggetti.reduce((t, o) => t + valoreGiacenza(o), 0);
  const movimenti = m.oggetti.reduce((t, o) => t + o.movimenti.length, 0);
  const economia = economiaMagazzino(m);
  const openObj = m.oggetti.find((o) => o.id === openOid);

  // filtro per stato e ricerca per nome o SKU, combinati
  const needle = q.trim().toLowerCase();
  const visibili = m.oggetti.filter((o) => {
    const s = statoDi(o);
    const okFiltro = filtro === "tutti" || (filtro === "allerta" && IN_ALLERTA.includes(s)) || filtro === s;
    const okTesto = `${o.nome} ${o.sku}`.toLowerCase().includes(needle);
    return okFiltro && okTesto;
  });

  return (
    <div>
      <div className="section-head">
        <div>
          <div className="eyebrow">{[m.luogo, m.responsabile].filter(Boolean).join(" · ") || "Magazzino"}</div>
          <h2 className="page-title">{m.nome}</h2>
        </div>
        <div className="row-wrap">
          <Button variant="ghost" small onClick={() => navigate("/azienda")}>← Tutti i magazzini</Button>
          <Button variant="danger" small onClick={async () => { await h.removeMagazzino(); navigate("/azienda"); }}>Elimina magazzino</Button>
        </div>
      </div>

      <div className="kpis">
        <Kpi label="Articoli" value={fmtNum(m.oggetti.length)} delay={0} />
        <Kpi label="Valore magazzino" value={fmtEuro(valore)} delay={80} />
        <Kpi label="Da riordinare" value={fmtNum(allerta.length)} alert={allerta.length > 0} delay={160} />
        <Kpi label="Uscite (acquisti)" value={fmtEuro(economia.uscite)} delay={240} />
        <Kpi label="Entrate (vendite)" value={fmtEuro(economia.entrate)} delay={280} />
        <Kpi label="Risultato" value={fmtEuro(economia.risultato)} alert={economia.risultato < 0} ok={economia.risultato >= 0} delay={320} />
      </div>

      {allerta.length > 0 && (
        <p className="notice" role="alert">
          Da riordinare: {allerta.map((o) => o.nome || "(senza nome)").join(", ")}.
        </p>
      )}

      <div className="toolbar">
        <div className="row-wrap">
          <Input type="search" className="search" placeholder="Cerca per nome o SKU…" aria-label="Cerca articolo" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="chips" role="group" aria-label="Filtra articoli">
            {FILTRI.map((f) => (
              <button key={f.id} className={cx("chip", filtro === f.id && "on")} aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <Button variant="ok" small onClick={h.addOggetto}>+ Aggiungi articolo</Button>
      </div>

      {m.oggetti.length === 0 && <div className="empty">Nessun articolo: aggiungine uno per iniziare a registrare i movimenti.</div>}
      {m.oggetti.length > 0 && visibili.length === 0 && <div className="empty">Nessun articolo corrisponde a ricerca o filtro.</div>}
      <div className="grid-cards">
        {visibili.map((o) => <OggettoEditor key={o.id} o={o} h={h} onOpen={() => setOpenOid(o.id)} />)}
      </div>

      <section className="section">
        <GeneraReport magazzino={m} onPubblicato={setReport} />
        {report && <ReportView r={report} />}
      </section>

      {openObj && <OggettoScheda o={openObj} h={h} onClose={() => setOpenOid(null)} />}
    </div>
  );
}
