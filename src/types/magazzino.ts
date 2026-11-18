import type { Oggetto } from "./oggetto";

export interface Magazzino {
  id: string;
  nome: string;
  luogo: string;
  responsabile: string;
  oggetti: Oggetto[];
}

export interface Azienda {
  nome: string;
  magazzini: Magazzino[];
}
