import type { StatoScorta } from "../../utils/riordino";
const MAP: Record<StatoScorta, { cls: string; label: string }> = {
  ok: { cls: "ok", label: "Scorta ok" },
  "sotto-soglia": { cls: "low", label: "Sotto soglia" },
  esaurito: { cls: "empty", label: "Esaurito" },
  fermo: { cls: "idle", label: "Fermo" },
};
export function StatoBadge({ stato }: { stato: StatoScorta }) {
  const s = MAP[stato];
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}
