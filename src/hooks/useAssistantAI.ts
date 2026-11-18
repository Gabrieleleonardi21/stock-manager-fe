import { useState } from "react";
import { askAssistant, type ChatMsg } from "../services/aiService";
import { ApiError } from "../services/api";

/** Limiti della sezione 6 del piano: massimo 20 messaggi, 2000 caratteri ciascuno. */
const MAX_MESSAGGI = 20;
const MAX_CARATTERI = 2000;

/** Testo mostrato all'utente in caso di errore: quello del server, se e' un errore previsto. */
function messaggioErrore(e: unknown): string {
  if (e instanceof ApiError && e.status === 401) return "Accedi per usare l'assistente.";
  if (e instanceof ApiError) return e.message;
  return "Si è verificato un errore, riprova tra poco.";
}

/** Conversazione con l'assistente. La cronologia resta nel componente; il modello sta sul server. */
export function useAssistantAI() {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async (text: string) => {
    const t = text.trim().slice(0, MAX_CARATTERI);
    if (!t || loading) return;
    const tutti: ChatMsg[] = [...msgs, { role: "user", content: t }];
    // solo gli ultimi messaggi; la cronologia deve iniziare con un messaggio dell'utente
    const recenti = tutti.slice(-MAX_MESSAGGI);
    const inizio = recenti.findIndex((m) => m.role === "user");
    const cronologia = recenti.slice(inizio);

    setMsgs(tutti);
    setLoading(true);
    try {
      const reply = await askAssistant(cronologia);
      setMsgs([...tutti, { role: "assistant", content: reply }]);
    } catch (e) {
      setMsgs([...tutti, { role: "assistant", content: messaggioErrore(e) }]);
    } finally {
      setLoading(false);
    }
  };

  /** Svuota la conversazione ("Nuova chat"). Chiudere la chat invece non la cancella. */
  const reset = () => setMsgs([]);

  return { msgs, loading, send, reset };
}
