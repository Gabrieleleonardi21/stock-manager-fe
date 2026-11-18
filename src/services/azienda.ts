/** Dati del gestionale sul server (fase 4). Ogni chiamata e' limitata ai dati dell'utente della sessione. */
import { api } from "./api";
import type { Magazzino, Movimento, Oggetto } from "../types";

/** Albero completo restituito da GET /api/azienda. */
export interface AziendaRemota {
  nome: string;
  magazzini: Magazzino[];
}

export type NuovoOggetto = Omit<Oggetto, "id" | "movimenti">;
export type NuovoMagazzino = Pick<Magazzino, "nome" | "luogo" | "responsabile">;
/** Movimento da registrare: come lo compila il form. */
export interface NuovoMovimento {
  tipo: "arrivo" | "prelievo";
  data: string;
  qta: number;
  prezzo?: number | null;
  nota: string;
}

export const caricaAzienda = () => api<AziendaRemota>("/azienda");
export const rinominaAzienda = (nome: string) => api<void>("/azienda", "PUT", { nome });

export const creaMagazzino = (m: NuovoMagazzino) =>
  api<Magazzino>("/magazzini", "POST", m);
export const aggiornaMagazzino = (id: string, m: NuovoMagazzino) =>
  api<Magazzino>(`/magazzini/${id}`, "PUT", m);
export const eliminaMagazzino = (id: string) => api<void>(`/magazzini/${id}`, "DELETE");

export const creaOggetto = (magazzinoId: string, o: NuovoOggetto) =>
  api<Oggetto>(`/magazzini/${magazzinoId}/oggetti`, "POST", o);
export const aggiornaOggetto = (id: string, o: NuovoOggetto) =>
  api<Oggetto>(`/oggetti/${id}`, "PUT", o);
export const eliminaOggetto = (id: string) => api<void>(`/oggetti/${id}`, "DELETE");

export const creaMovimento = (oggettoId: string, m: NuovoMovimento) =>
  api<Movimento>(`/oggetti/${oggettoId}/movimenti`, "POST", m);
export const eliminaMovimento = (id: string) => api<void>(`/movimenti/${id}`, "DELETE");

/** Import di un magazzino dal browser (idempotente: `chiave` e' l'id locale). */
export const importaMagazzino = (payload: unknown) =>
  api<{ nuovo: boolean; magazzinoId: string }>("/import/magazzini", "POST", payload);

/** Crea il magazzino di prova nell'account (idempotente: ripremere il pulsante non duplica). */
export const caricaDatiDemo = () =>
  api<{ nuovo: boolean; magazzinoId: string }>("/demo", "POST");
