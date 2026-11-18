/** Pulsante fisso in basso a destra che apre/chiude l'assistente. Il logo gira in 3D al passaggio del mouse (CSS .fab) */
export function AssistantFAB({ onClick }: { onClick: () => void }) {
  return (
    <button className="fab" onClick={onClick} aria-label="Apri Assistente magazzino" title="Assistente magazzino">
      <img src="/logo.png" alt="" />
    </button>
  );
}
