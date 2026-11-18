import { useAppStore } from "../../stores/useAppStore";

/** Avviso visibile solo in modalità Ospite (dati non salvati, niente controlli sulle giacenze) */
export function GuestBanner({ text }: { text: string }) {
  const user = useAppStore((s) => s.user);
  if (!user?.guest) return null;
  return <p className="notice">{text}</p>;
}
