import { useEffect, useState } from "react";
import { useAppStore } from "../stores/useAppStore";
import { elencoReport, generaReport } from "../services/report";
import type { Magazzino, ReportMensile } from "../types";

/** Archivio dei report mensili dell'utente, dal server. Gli Ospiti non ne hanno. */
export function useReportArchivio() {
  const { user } = useAppStore();
  const [reports, setReports] = useState<ReportMensile[] | null>(null);

  const reload = async () => {
    if (!user || user.guest) {
      setReports([]);
      return;
    }
    try {
      setReports(await elencoReport());
    } catch {
      setReports([]);
    }
  };
  useEffect(() => { reload(); }, []);
  return { reports, reload };
}

/** Generazione e archiviazione di un report mensile sul server. Restituisce il report o il messaggio d'errore. */
export function usePubblicaReport() {
  const { user } = useAppStore();

  const pubblica = async (m: Magazzino, mese: string): Promise<ReportMensile | string> => {
    if (!user) return "Sessione non valida.";
    if (user.guest) return "La pubblicazione dei report richiede un account registrato.";
    try {
      return await generaReport(m, mese);
    } catch (e) {
      if (e instanceof Error) return e.message;
      return "Pubblicazione non riuscita, riprova.";
    }
  };

  return { pubblica };
}
