/** Assistente AI: il modello sta sul server (fase 3). Il browser manda solo la conversazione, mai la chiave. */
import { api } from "./api";

export interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

/** Invia la conversazione (l'ultimo messaggio deve essere dell'utente). Lancia ApiError in caso di errore. */
export async function askAssistant(messaggi: ChatMsg[]): Promise<string> {
  const res = await api<{ risposta: string }>("/assistente", "POST", {
    messaggi: messaggi.map((m) => ({ ruolo: m.role, contenuto: m.content })),
  });
  return res.risposta;
}
