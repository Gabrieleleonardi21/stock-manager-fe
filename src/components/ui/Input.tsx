import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";
import { cx } from "../../utils/cx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; }

/** Campo di testo. Con `label` l'input è avvolto in un <label>, così è accessibile senza id */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, className, ...rest }, ref) {
  const input = <input ref={ref} className={cx("input", className)} {...rest} />;
  if (!label) return input;
  return <label className="field"><span>{label}</span>{input}</label>;
});

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { label?: string; }

/** Menu a tendina con lo stesso stile di Input */
export function Select({ label, children, ...rest }: SelectProps) {
  const select = <select className="select" {...rest}>{children}</select>;
  if (!label) return select;
  return <label className="field"><span>{label}</span>{select}</label>;
}
