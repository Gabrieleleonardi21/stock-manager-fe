import { useEffect, type ReactNode } from "react";

/** Finestra modale accessibile: si chiude con Esc o cliccando lo sfondo.
 *  L'entrata 3D è nella classe `.modal` di index.css. */
export function Modal({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* stopPropagation: il click dentro la finestra non deve chiuderla */}
      <div className="modal" role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
