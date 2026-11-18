import { useAppStore } from "../stores/useAppStore";
import { useToast } from "../stores/useToast";
import * as remoto from "../services/azienda";
import { ApiError } from "../services/api";
import { uid } from "../utils/uid";
import { CATEGORIE } from "../constants/categories";
import type { Magazzino, Movimento, Oggetto } from "../types";

export interface MovimentoDraft {
  tipo: "arrivo" | "prelievo";
  data: string;
  qta: string;
  prezzo: string;
  nota: string;
}

/** Ritardo del salvataggio dei campi di un articolo: evita una richiesta per ogni tasto premuto. */
const RITARDO_SALVATAGGIO_MS = 500;
const timers = new Map<string, ReturnType<typeof setTimeout>>();

/** Messaggio per l'utente: quello del server se e' un errore previsto, altrimenti generico. */
function messaggio(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  return "Operazione non riuscita, riprova.";
}

/** Prezzo del form (costo per gli arrivi, vendita per i prelievi): facoltativo, mai negativo. */
function prezzoDi(d: MovimentoDraft): number | null {
  if (d.prezzo === "") return null;
  return Math.max(0, Number(d.prezzo));
}

/**
 * Magazzino selezionato e azioni su articoli e movimenti.
 * Utenti registrati: ogni azione passa dal server, poi lo stato locale viene allineato.
 * Ospiti: solo in memoria, senza server.
 */
export function useMagazzino(id: string | undefined) {
  const { user, aziendaName, magazzini, updateMagazzino, removeMagazzino } = useAppStore();
  const magazzino = magazzini.find((m) => m.id === id) || null;
  const remoto_ = !!user && !user.guest;
  const notifica = (msg: string) => useToast.getState().push(msg, "err");

  // legge sempre lo stato piu' recente (dopo un await lo snapshot del render puo' essere vecchio)
  const trovaOggetto = (oid: string): Oggetto | undefined => {
    for (const m of useAppStore.getState().magazzini) {
      const o = m.oggetti.find((x) => x.id === oid);
      if (o) return o;
    }
    return undefined;
  };
  const modificaOggetti = (mid: string, fn: (oggetti: Oggetto[]) => Oggetto[]) => {
    const m = useAppStore.getState().magazzini.find((x) => x.id === mid);
    if (m) updateMagazzino(mid, { oggetti: fn(m.oggetti) });
  };

  /** Salva l'articolo sul server dopo una pausa di scrittura, con l'ultimo valore. */
  const programmaSalvataggio = (oid: string) => {
    clearTimeout(timers.get(oid));
    timers.set(oid, setTimeout(async () => {
      timers.delete(oid);
      const o = trovaOggetto(oid);
      if (!o) return;
      try {
        await remoto.aggiornaOggetto(oid, { nome: o.nome, sku: o.sku, categoria: o.categoria, unita: o.unita, sogliaMin: o.sogliaMin });
      } catch (e) {
        notifica(messaggio(e));
      }
    }, RITARDO_SALVATAGGIO_MS));
  };

  const addOggetto = async () => {
    if (!magazzino) return;
    const dati = { nome: "", sku: "", categoria: CATEGORIE[0], unita: "pz", sogliaMin: 0 };
    let o: Oggetto;
    if (remoto_) {
      try { o = await remoto.creaOggetto(magazzino.id, dati); } catch (e) { notifica(messaggio(e)); return; }
    } else {
      o = { id: uid(), ...dati, movimenti: [] };
    }
    modificaOggetti(magazzino.id, (os) => [...os, { ...o, movimenti: o.movimenti ?? [] }]);
  };

  const updateOggetto = (oid: string, p: Partial<Oggetto>) => {
    if (!magazzino) return;
    modificaOggetti(magazzino.id, (os) => os.map((o) => {
      if (o.id !== oid) return o;
      return { ...o, ...p };
    }));
    if (remoto_) programmaSalvataggio(oid);
  };

  const removeOggetto = async (oid: string) => {
    if (!magazzino) return;
    if (remoto_) {
      try { await remoto.eliminaOggetto(oid); } catch (e) { notifica(messaggio(e)); return; }
    }
    clearTimeout(timers.get(oid));
    modificaOggetti(magazzino.id, (os) => os.filter((o) => o.id !== oid));
  };

  /** Restituisce il messaggio d'errore da mostrare nel form, o null se la registrazione e' riuscita. */
  const addMovimento = async (oid: string, draft: MovimentoDraft): Promise<string | null> => {
    if (!magazzino) return "Magazzino non trovato.";
    const qta = Number(draft.qta);
    if (!qta || qta <= 0) return "Inserisci una quantità maggiore di zero.";
    if (!draft.data) return "Inserisci la data del movimento.";
    const dati = { tipo: draft.tipo, data: draft.data, qta, prezzo: prezzoDi(draft), nota: draft.nota.trim() };

    let mov: Movimento;
    if (remoto_) {
      try {
        // il server applica la regola della giacenza: il prelievo eccessivo torna come errore
        const creato = await remoto.creaMovimento(oid, dati);
        mov = { ...creato, prezzo: creato.prezzo ?? undefined };
      } catch (e) {
        return messaggio(e);
      }
    } else {
      mov = { id: uid(), ...dati, prezzo: dati.prezzo ?? undefined };
    }
    modificaOggetti(magazzino.id, (os) => os.map((o) => {
      if (o.id !== oid) return o;
      return { ...o, movimenti: [...o.movimenti, mov] };
    }));
    return null;
  };

  const removeMovimento = async (oid: string, mid: string) => {
    if (!magazzino) return;
    if (remoto_) {
      try { await remoto.eliminaMovimento(mid); } catch (e) { notifica(messaggio(e)); return; }
    }
    modificaOggetti(magazzino.id, (os) => os.map((o) => {
      if (o.id !== oid) return o;
      return { ...o, movimenti: o.movimenti.filter((m) => m.id !== mid) };
    }));
  };

  const eliminaMagazzino = async () => {
    if (!magazzino) return;
    if (remoto_) {
      try { await remoto.eliminaMagazzino(magazzino.id); } catch (e) { notifica(messaggio(e)); return; }
    }
    removeMagazzino(magazzino.id);
  };

  return {
    user, aziendaName, magazzino,
    addOggetto, updateOggetto, removeOggetto,
    addMovimento, removeMovimento, removeMagazzino: eliminaMagazzino,
  };
}

export type { Magazzino };
