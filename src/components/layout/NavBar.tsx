import { NavLink } from "react-router-dom";
import { cx } from "../../utils/cx";

const links = [["/azienda", "Magazzini"], ["/report", "Report mensili"]] as const;

/** Menu principale: la voce della pagina corrente è evidenziata */
export function NavBar() {
  return (
    <nav className="nav" aria-label="Sezioni">
      {links.map(([to, label]) => (
        <NavLink key={to} to={to} className={({ isActive }) => cx("navlink", isActive && "active")}>{label}</NavLink>
      ))}
    </nav>
  );
}
