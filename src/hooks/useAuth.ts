import { useAppStore } from "../stores/useAppStore";
import { useToast } from "../stores/useToast";
import * as authService from "../services/authService";
import * as remoto from "../services/azienda";
import { importaReportLocale } from "../services/report";
import * as legacy from "../services/legacy";

/**
 * Carica l'albero dal server. Se nel browser ci sono dati salvati prima dell'account, non li importa da soli:
 * segnala la presenza (il banner in Magazzini chiede all'utente se importarli o scartarli).
 * Va completata PRIMA di impostare l'utente: la pagina di accesso reindirizza appena l'utente c'e'.
 */
async function caricaDati(): Promise<void> {
  const { setAzienda, setDatiLocali } = useAppStore.getState();
  try {
    const albero = await remoto.caricaAzienda();
    setAzienda(albero.nome, albero.magazzini);
    setDatiLocali(legacy.haDatiLocali(await legacy.leggiDatiLocali()));
  } catch {
    useToast.getState().push("Impossibile caricare i dati, riprova ricaricando la pagina.", "err");
  }
}

/** Importa i dati del browser nell'account. Idempotente: se fallisce a meta', si puo' riprovare senza duplicati. */
async function importaDatiLocali(): Promise<void> {
  const { setAzienda, setDatiLocali } = useAppStore.getState();
  const toast = useToast.getState();
  try {
    const locali = await legacy.leggiDatiLocali();
    if (locali.nome.trim()) await remoto.rinominaAzienda(locali.nome.trim());
    for (const m of locali.magazzini) {
      await remoto.importaMagazzino(legacy.payloadMagazzino(m));
    }
    for (const r of locali.reports) {
      await importaReportLocale(r);
    }
    await legacy.svuotaDatiLocali(locali.reportKeys);
    const albero = await remoto.caricaAzienda();
    setAzienda(albero.nome, albero.magazzini);
    setDatiLocali(false);
    toast.push("Dati importati nel tuo account.");
  } catch {
    toast.push("Import non riuscito. Nulla e' stato perso: riprova.", "err");
  }
}

/** Scarta i dati del browser (scelta esplicita dell'utente nel banner). */
async function scartaDatiLocali(): Promise<void> {
  const locali = await legacy.leggiDatiLocali();
  await legacy.svuotaDatiLocali(locali.reportKeys);
  useAppStore.getState().setDatiLocali(false);
}

/** Autenticazione lato client: sessione sul server, modalita' Ospite solo in memoria. */
export function useAuth() {
  const { user, setUser, setAzienda, reset, setAuthChecked } = useAppStore();

  // all'avvio (e dopo F5) ripristina la sessione se il cookie e' ancora valido
  const ripristina = async () => {
    const u = await authService.me();
    if (u) {
      await caricaDati();
      setUser(u);
    }
    setAuthChecked(true);
  };

  // registrazione e poi accesso automatico con le stesse credenziali
  const register = async (name: string, email: string, pass: string) => {
    await authService.register(name, email, pass);
    await login(email, pass);
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const u = await authService.login(email, pass);
      await caricaDati();
      setUser(u);
      return true;
    } catch {
      return false;
    }
  };

  const enterGuest = () => { setAzienda("", []); setUser({ name: "Ospite", guest: true }); };

  const logout = async () => {
    await authService.logout();
    reset();
  };

  return { user, ripristina, register, login, enterGuest, logout, importaDatiLocali, scartaDatiLocali };
}
