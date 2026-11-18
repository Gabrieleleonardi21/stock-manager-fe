import { fmtNum, fmtEuro } from "../../utils/fmt";
import type { ReportMensile } from "../../types";

/** Tabella del report: una riga per articolo e in fondo il totale.
 *  Lo scroll orizzontale su schermi piccoli è nel contenitore .table-wrap */
export function ReportTable({ r }: { r: ReportMensile }) {
  return (
    <div className="table-wrap">
      <table className="tbl">
        <thead>
          <tr>
            <th className="l">Articolo</th><th className="l">SKU</th>
            <th>Iniziale</th><th>Arrivi</th><th>Prelievi</th><th>Finale</th><th>Acquisti €</th>
          </tr>
        </thead>
        <tbody>
          {r.righe.map((x, i) => (
            <tr key={i}>
              <td className="name">{x.nome || "—"}</td>
              <td className="l muted">{x.sku || "—"}</td>
              <td>{fmtNum(x.giacenzaIniziale)}</td>
              <td className="pos">{(x.arrivi > 0 && `+${fmtNum(x.arrivi)}`) || "—"}</td>
              <td className="neg">{(x.prelievi > 0 && `−${fmtNum(x.prelievi)}`) || "—"}</td>
              <td><strong>{fmtNum(x.giacenzaFinale)}</strong></td>
              <td>{(x.valoreAcquisti > 0 && fmtEuro(x.valoreAcquisti)) || "—"}</td>
            </tr>
          ))}
          <tr className="total">
            <td className="name" colSpan={3}>TOTALE</td>
            <td className="pos">+{fmtNum(r.totArrivi)}</td>
            <td className="neg">−{fmtNum(r.totPrelievi)}</td>
            <td></td>
            <td>{fmtEuro(r.totValoreAcquisti)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
