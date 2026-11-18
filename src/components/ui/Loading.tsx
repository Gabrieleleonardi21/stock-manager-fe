/** Testo di caricamento lampeggiante */
export function Loading({ children }: { children: React.ReactNode }) {
  return <p className="muted pulse">{children}</p>;
}
