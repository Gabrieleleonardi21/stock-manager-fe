import { useState, type FormEvent } from "react";
import { useAssistantAI } from "../../hooks/useAssistantAI";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

// classe della bolla in base al ruolo di chi scrive
const BOLLA = { user: "bubble-u", assistant: "bubble-a" } as const;

/** Finestra di chat con l'assistente AI. `aria-live` fa leggere agli screen reader le risposte */
export function AssistantPanel({ onClose }: { onClose: () => void }) {
  const { msgs, loading, send } = useAssistantAI();
  const [input, setInput] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault(); // niente ricaricamento della pagina
    if (!input.trim()) return;
    send(input);
    setInput("");
  };

  return (
    <div className="chatpanel" role="dialog" aria-label="Assistente magazzino">
      <div className="chat-head">
        <span>Assistente magazzino</span>
        <button className="icon-btn" onClick={onClose} aria-label="Chiudi">×</button>
      </div>
      <div className="chat-body" aria-live="polite">
        {msgs.length === 0 && <p className="chat-empty muted">Chiedimi di scorte, riordini, valorizzazione del magazzino o come organizzare i movimenti.</p>}
        {msgs.map((m, i) => <div key={i} className={BOLLA[m.role]}>{m.content}</div>)}
        {loading && <div className="bubble-a pulse">Sto pensando…</div>}
      </div>
      <form className="chat-foot" onSubmit={submit}>
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Scrivi all'assistente…" aria-label="Messaggio per l'assistente" />
        <Button type="submit" variant="primary" disabled={loading}>Invia</Button>
      </form>
    </div>
  );
}
