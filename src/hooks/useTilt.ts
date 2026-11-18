import { useRef, type PointerEvent } from "react";

/** Effetto 3D "tilt": inclina l'elemento seguendo il puntatore e sposta il riflesso.
 *  Scrive le variabili CSS --rx, --ry (inclinazione) e --mx, --my (posizione del
 *  riflesso); lo stile è nella classe `.tilt` di index.css.
 *  Uso: <div className="tilt" {...tilt}> — `max` = gradi massimi di inclinazione.
 *  Sui dispositivi touch non fa nulla (niente hover). */
export function useTilt<T extends HTMLElement>(max = 8) {
  const ref = useRef<T>(null);

  // imposta una variabile CSS sull'elemento, se è già montato
  const set = (nome: string, valore: string) => ref.current?.style.setProperty(nome, valore);

  const onPointerMove = (e: PointerEvent<T>) => {
    if (e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;  // 0 (bordo sinistro) → 1 (destro)
    const py = (e.clientY - r.top) / r.height;  // 0 (alto) → 1 (basso)
    set("--ry", `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
    set("--rx", `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
    set("--mx", `${(px * 100).toFixed(1)}%`);
    set("--my", `${(py * 100).toFixed(1)}%`);
  };

  // al termine dell'hover la card torna piatta
  const onPointerLeave = () => {
    set("--rx", "0deg");
    set("--ry", "0deg");
  };

  return { ref, onPointerMove, onPointerLeave };
}
