import { useAppStore } from "../stores/useAppStore";
import * as remoto from "../services/azienda";
import { uid } from "../utils/uid";
import type { Magazzino } from "../types";

export interface NuovoMagazzinoInput {
  nome: string;
  luogo: string;
  responsabile: string;
}

/** Azienda e magazzini: utenti registrati sul server, Ospiti solo in memoria. */
export function useAzienda() {
  const { user, aziendaName, magazzini, setAziendaName, addMagazzino } = useAppStore();

  const createMagazzino = async (input: NuovoMagazzinoInput): Promise<Magazzino> => {
    const dati = {
      nome: input.nome.trim() || `Magazzino ${magazzini.length + 1}`,
      luogo: input.luogo.trim(),
      responsabile: input.responsabile.trim(),
    };
    let m: Magazzino;
    if (user?.guest) {
      m = { id: uid(), ...dati, oggetti: [] };
    } else {
      m = await remoto.creaMagazzino(dati);
    }
    addMagazzino({ ...m, oggetti: m.oggetti ?? [] });
    return m;
  };

  /** Salva il nome dell'azienda (chiamato all'uscita dal campo). */
  const salvaNomeAzienda = async () => {
    if (user && !user.guest) await remoto.rinominaAzienda(aziendaName.trim());
  };

  return { user, aziendaName, magazzini, setAziendaName, createMagazzino, salvaNomeAzienda };
}
