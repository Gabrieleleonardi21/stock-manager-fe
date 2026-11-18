import { create } from "zustand";
import type { Magazzino, User } from "../types";

/** Stato dell'app in memoria. I dati non vengono salvati nel browser: stanno sul server (utenti registrati)
 *  oppure vanno persi al ricaricamento (modalita' Ospite, come dichiarato nell'interfaccia). */
interface AppState {
  user: User | null;
  authChecked: boolean;      // true quando il ripristino della sessione e' finito
  datiLocali: boolean;       // ci sono dati salvati nel browser da importare (chiesto all'utente)
  setDatiLocali: (v: boolean) => void;
  aziendaName: string;
  magazzini: Magazzino[];
  setUser: (u: User | null) => void;
  setAuthChecked: (v: boolean) => void;
  setAziendaName: (nome: string) => void;
  setAzienda: (nome: string, magazzini: Magazzino[]) => void;
  addMagazzino: (m: Magazzino) => void;
  updateMagazzino: (id: string, patch: Partial<Magazzino>) => void;
  replaceMagazzino: (m: Magazzino) => void;
  removeMagazzino: (id: string) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  authChecked: false,
  datiLocali: false,
  setDatiLocali: (datiLocali) => set({ datiLocali }),
  aziendaName: "",
  magazzini: [],
  setUser: (user) => set({ user }),
  setAuthChecked: (authChecked) => set({ authChecked }),
  setAziendaName: (aziendaName) => set({ aziendaName }),
  setAzienda: (aziendaName, magazzini) => set({ aziendaName, magazzini }),
  addMagazzino: (m) => set((s) => ({ magazzini: [...s.magazzini, m] })),
  updateMagazzino: (id, patch) =>
    set((s) => ({ magazzini: s.magazzini.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
  replaceMagazzino: (m) => set((s) => ({ magazzini: s.magazzini.map((x) => (x.id === m.id ? m : x)) })),
  removeMagazzino: (id) => set((s) => ({ magazzini: s.magazzini.filter((m) => m.id !== id) })),
  reset: () => set({ user: null, aziendaName: "", magazzini: [] }),
}));
