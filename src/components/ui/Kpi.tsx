import { useTilt } from "../../hooks/useTilt";
import { cx } from "../../utils/cx";

/** Card con un indicatore (es. "Articoli: 12"). Si inclina in 3D col mouse ed entra in modo
 *  scaglionato (`delay` in ms). `alert` la evidenzia in rosso (es. articoli da riordinare). */
export function Kpi({ label, value, alert, ok, delay = 0 }: { label: string; value: string; alert?: boolean; ok?: boolean; delay?: number }) {
  const tilt = useTilt<HTMLDivElement>(10);
  return (
    <div {...tilt} className={cx("card tilt rise kpi", alert && "kpi-alert", ok && "kpi-ok")} style={{ animationDelay: `${delay}ms` }}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
    </div>
  );
}
