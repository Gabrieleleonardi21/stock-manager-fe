import { Navigate, useNavigate } from "react-router-dom";
import { useAzienda } from "../hooks/useAzienda";
import { useToast } from "../stores/useToast";
import { useAppStore } from "../stores/useAppStore";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { MagazzinoForm } from "../components/magazzino/MagazzinoForm";
import { MagazzinoCard } from "../components/magazzino/MagazzinoCard";
import { GuestBanner } from "../components/auth/GuestBanner";
import { Input } from "../components/ui/Input";

/** Pagina "Magazzini": nome dell'azienda, creazione di un magazzino ed elenco di quelli esistenti */
export function AziendaPage() {
  const { user, aziendaName, magazzini, setAziendaName, createMagazzino, salvaNomeAzienda, caricaDemo } = useAzienda();
  const datiLocali = useAppStore((s) => s.datiLocali);
  const { importaDatiLocali, scartaDatiLocali } = useAuth();
  const navigate = useNavigate();
  const push = useToast((s) => s.push);
  if (!user) return <Navigate to="/" replace />;
  return (
    <>
      <GuestBanner text="Modalità Ospite (prova): i dati non vengono salvati e i prelievi non sono limitati dalla giacenza. Registrati per la gestione completa." />
      {datiLocali && (
        <div className="card block-gap">
          <p className="panel-title">Dati salvati su questo browser</p>
          <p className="muted small">Ci sono dati creati prima dell'account. Vuoi importarli nel tuo account?</p>
          <div className="row-wrap">
            <Button variant="ok" small onClick={() => importaDatiLocali()}>Importa nel mio account</Button>
            <Button variant="ghost" small onClick={() => scartaDatiLocali()}>Scarta</Button>
          </div>
        </div>
      )}
      <div className="card block-gap narrow">
        <Input label="Azienda / organizzazione" value={aziendaName} onChange={(e) => setAziendaName(e.target.value)} onBlur={() => salvaNomeAzienda()} placeholder="Es. Rossi Forniture S.r.l." />
      </div>
      <MagazzinoForm onCreate={async (i) => {
        const m = await createMagazzino(i);
        push("Magazzino creato");
        navigate(`/azienda/magazzino/${m.id}`);
      }} />
      {magazzini.length === 0 && user && !user.guest && (
        <div className="card block-gap">
          <p className="panel-title">Primi passi</p>
          <p className="muted small">Carica un magazzino di prova con articoli e movimenti, per vedere subito come funziona.</p>
          <Button variant="ok" small onClick={async () => {
            try {
              await caricaDemo();
              push("Dati di prova caricati");
            } catch {
              push("Caricamento dei dati di prova non riuscito, riprova.", "err");
            }
          }}>Carica dati di prova</Button>
        </div>
      )}
      <section className="section">
        <div className="section-head">
          <h2 className="page-title">I tuoi magazzini</h2>
          <span className="muted">{magazzini.length} totali</span>
        </div>
        {magazzini.length === 0 && <div className="empty">Nessun magazzino: creane uno qui sopra.</div>}
        <div className="list">
          {magazzini.map((m) => <MagazzinoCard key={m.id} m={m} onOpen={() => navigate(`/azienda/magazzino/${m.id}`)} />)}
        </div>
      </section>
    </>
  );
}
