import { fmtNum, fmtEuro } from "../../utils/fmt";
import { cx } from "../../utils/cx";
import type { ReportMensile } from "../../types";

/** Tabella del report: una riga per articolo e in fondo il totale.
 *  Uscite = costo degli arrivi; entrate = vendite dei prelievi; risultato = entrate meno uscite.
 *  Lo scroll orizzontale su schermi piccoli e' nel contenitore .table-wrap */
export function ReportTable({ r }: { r: ReportMensile }) {
  const totEntrate = r.righe.reduce((t, x) => t + (x.entrate ?? 0), 0);
  const totRisultato = totEntrate - r.totValoreAcquisti;
  return (
    <div className="table-wrap">
      <table className="tbl">
        <thead>
          <tr>
            <th className="l">Articolo</th><th className="l">SKU</th>
            <th>Iniziale</th><th>Arrivi</th><th>Prelievi</th><th>Finale</th>
            <th>Uscite €</th><th>Entrate €</th><th>Risultato €</th>
          </tr>
        </thead>
        <tbody>
          {r.righe.map((x, i) => {
            const risultato = (x.entrate ?? 0) - x.valoreAcquisti;
            return (
              <tr key={i}>
                <td className="name">{x.nome || "—"}</td>
                <td className="l muted">{x.sku || "—"}</td>
                <td>{fmtNum(x.giacenzaIniziale)}</td>
                <td className="pos">{(x.arrivi > 0 && `+${fmtNum(x.arrivi)}`) || "—"}</td>
                <td className="neg">{(x.prelievi > 0 && `−${fmtNum(x.prelievi)}`) || "—"}</td>
                <td><strong>{fmtNum(x.giacenzaFinale)}</strong></td>
                <td>{(x.valoreAcquisti > 0 && fmtEuro(x.valoreAcquisti)) || "—"}</td>
                <td>{((x.entrate ?? 0) > 0 && fmtEuro(x.entrate ?? 0)) || "—"}</td>
                <td className={cx(risultato < 0 && "neg", risultato >= 0 && "pos")}>{fmtEuro(risultato)}</td>
              </tr>
            );
          })}
          <tr className="total">
            <td className="name" colSpan={3}>TOTALE</td>
            <td className="pos">+{fmtNum(r.totArrivi)}</td>
            <td className="neg">−{fmtNum(r.totPrelievi)}</td>
            <td></td>
            <td>{fmtEuro(r.totValoreAcquisti)}</td>
            <td>{fmtEuro(totEntrate)}</td>
            <td className={cx(totRisultato < 0 && "neg", totRisultato >= 0 && "pos")}>{fmtEuro(totRisultato)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
