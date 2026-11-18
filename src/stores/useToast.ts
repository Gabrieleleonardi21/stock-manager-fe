import { create } from "zustand";

export interface Toast {
  id: number;
  msg: string;
  tono: "ok" | "err";
}

interface ToastState {
  toasts: Toast[];
  push: (msg: string, tono?: "ok" | "err") => void;
  remove: (id: number) => void;
}

const DURATA_MS = 3200; // quanto resta visibile una notifica
let seq = 0;            // id progressivo, serve a rimuovere la notifica giusta

/** Notifiche globali (es. "Movimento registrato"). Si chiudono da sole dopo qualche secondo */
export const useToast = create<ToastState>((set) => ({
  toasts: [],
  push: (msg, tono = "ok") => {
    const id = ++seq;
    set((s) => ({ toasts: [...s.toasts, { id, msg, tono }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), DURATA_MS);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
