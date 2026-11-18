import { Link } from "react-router-dom";

/** Pagina per le rotte inesistenti. Il "404" ruota in 3D (CSS .notfound-code) */
export function NotFoundPage() {
  return (
    <div className="notfound">
      <div className="notfound-code">404</div>
      <p className="muted">Scaffale vuoto: questa pagina non esiste.</p>
      <Link to="/" className="btn btn-primary">← Torna all'inizio</Link>
    </div>
  );
}
