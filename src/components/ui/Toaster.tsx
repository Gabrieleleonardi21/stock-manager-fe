import { useToast } from "../../stores/useToast";
import { cx } from "../../utils/cx";

/** Pila delle notifiche in alto a destra. `aria-live` le fa leggere agli screen reader.
 *  Un click su una notifica la chiude subito. */
export function Toaster() {
  const toasts = useToast((s) => s.toasts);
  const remove = useToast((s) => s.remove);
  return (
    <div className="toaster" role="status" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} className={cx("toast", `toast-${t.tono}`)} onClick={() => remove(t.id)}>
          {t.msg}
        </button>
      ))}
    </div>
  );
}
