/** Movimento di magazzino: arrivo (stock in entrata) o prelievo (uscita) */
export interface Movimento {
  id: string;
  tipo: "arrivo" | "prelievo";
  data: string;             // ISO yyyy-mm-dd
  qta: number;              // quantità movimentata (sempre positiva)
  prezzo?: number;          // prezzo unitario di acquisto (solo per gli arrivi)
  nota: string;
}

/** Oggetto/articolo presente in un magazzino */
export interface Oggetto {
  id: string;
  nome: string;
  sku: string;              // codice articolo
  categoria: string;
  unita: string;            // pz, kg, l...
  sogliaMin: number;        // scorta minima sotto cui riordinare
  movimenti: Movimento[];
}
