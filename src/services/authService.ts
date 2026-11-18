/** Autenticazione verso il back-end (sessione su cookie HttpOnly, vedi server/). Nessun dato sensibile nel browser. */
import { api } from "./api";
import type { User } from "../types";

/** Risposta del server: mai password o hash. */
interface UtenteApi {
  id: string;
  name: string;
  email: string;
}

const daApi = (u: UtenteApi): User => ({ name: u.name, email: u.email, guest: false });

/** Utente della sessione corrente, o null se non c'e' una sessione valida (es. dopo F5). */
export async function me(): Promise<User | null> {
  try {
    return daApi(await api<UtenteApi>("/auth/me"));
  } catch {
    return null;
  }
}

export async function register(name: string, email: string, password: string): Promise<void> {
  await api<UtenteApi>("/auth/register", "POST", { name, email, password });
}

/** Login: lancia ApiError (401) se le credenziali non valgono. */
export async function login(email: string, password: string): Promise<User> {
  return daApi(await api<UtenteApi>("/auth/login", "POST", { email, password }));
}

export async function logout(): Promise<void> {
  await api<void>("/auth/logout", "POST").catch(() => {});
}
