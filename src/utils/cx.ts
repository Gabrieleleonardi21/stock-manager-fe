/** Unisce classi CSS scartando i valori falsy, senza ternari:
 *  cx("btn", attivo && "on") → "btn on" oppure "btn" */
export const cx = (...parti: Array<string | false | null | undefined>): string =>
  parti.filter(Boolean).join(" ");
