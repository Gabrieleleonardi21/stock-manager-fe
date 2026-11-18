/** Scena 3D decorativa, solo CSS: un cubo-cassa che ruota continuamente.
 *  Le facce sono in index.css (.scene, .cube, .face, .f-*). È nascosta agli screen reader
 *  perché non porta informazioni. */
export function Cube3D() {
  return (
    <div className="scene" aria-hidden="true">
      <div className="cube">
        <div className="face face-logo f-front"><img src="/logo.png" alt="" /></div>
        <div className="face f-back">IN</div>
        <div className="face f-right">SKU</div>
        <div className="face f-left">OUT</div>
        <div className="face f-top">€</div>
        <div className="face f-bottom">PZ</div>
      </div>
    </div>
  );
}
