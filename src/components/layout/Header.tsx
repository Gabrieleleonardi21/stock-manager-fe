import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTilt } from "../../hooks/useTilt";
import { Button } from "../ui/Button";

/** Intestazione: logo che si inclina in 3D col mouse, nome dell'app e utente con "Esci" */
export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const logo = useTilt<HTMLDivElement>(18);
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-logo tilt" {...logo}>
          <img src="/logo.png" alt="Logo STOCK MANAGER" />
        </div>
        <div>
          <h1>STOCK <span>MANAGER</span></h1>
          <div className="tag">Stock · Movimenti · Riordino</div>
        </div>
      </div>
      {user && (
        <div className="userbox">
          <span className="muted">{user.name}{user.guest && " (ospite)"}</span>
          <Button variant="ghost" small onClick={() => { logout(); navigate("/"); }}>Esci</Button>
        </div>
      )}
    </header>
  );
}
