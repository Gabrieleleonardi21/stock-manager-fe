import type { ButtonHTMLAttributes } from "react";
import { cx } from "../../utils/cx";

type Variant = "default" | "primary" | "ok" | "danger" | "ghost";
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  small?: boolean;
  block?: boolean;
}

/** Bottone unico del design system. La variante sceglie il colore (classi .btn-* in index.css).
 *  Di default è type="button", così dentro un form non invia per sbaglio. */
export function Button({ variant = "default", small, block, className, ...rest }: Props) {
  return (
    <button
      type="button"
      className={cx("btn", `btn-${variant}`, small && "btn-sm", block && "btn-block", className)}
      {...rest}
    />
  );
}
