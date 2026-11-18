import { useState, type FormEvent } from "react";
import type { useAssistantAI } from "../../hooks/useAssistantAI";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

// classe della bolla in base al ruolo di chi scrive
const BOLLA = { user: "bubble-u", assistant: "bubble-a" } as const;

/**
 * Finestra della chat. La conversazione arriva dall'app: "Chiudi" nasconde soltanto il pannello,
 * "Nuova chat" svuota la conversazione. `aria-live` fa leggere agli screen reader le risposte.
 */
export function AssistantPanel({ chat, onClose }: { chat: ReturnType<typeof useAssistantAI>; onClose: () => void }) {
  const { msgs, loading, send, reset } = chat;
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
        <div className="row-wrap">
          <Button variant="ghost" small onClick={reset} disabled={loading || msgs.length === 0}>Nuova chat</Button>
          <button className="icon-btn" onClick={onClose} aria-label="Chiudi (la conversazione resta)" title="Chiudi: la conversazione resta">×</button>
        </div>
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
