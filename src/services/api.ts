/** Client HTTP verso il back-end. Stessa origine: il cookie di sessione (HttpOnly) lo gestisce il browser. */

/** Errore restituito dal server, con lo stato HTTP e il messaggio generico (formato ProblemDetail). */
export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Token CSRF dal cookie XSRF-TOKEN: non HttpOnly, va letto e rimandato nell'header X-XSRF-TOKEN. */
function tokenCsrf(): string {
  const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

/**
 * Chiamata JSON al back-end. Ogni metodo diverso da GET manda il token CSRF.
 * In caso di errore lancia ApiError con il messaggio del server.
 */
export async function api<T>(path: string, metodo: "GET" | "POST" | "PUT" | "DELETE" = "GET", corpo?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  // JSON.stringify(undefined) vale undefined: nessun corpo quando non c'e' nulla da inviare
  const body = JSON.stringify(corpo);
  if (corpo !== undefined) headers["Content-Type"] = "application/json";
  if (metodo !== "GET") headers["X-XSRF-TOKEN"] = tokenCsrf();

  const res = await fetch(`/api${path}`, { method: metodo, headers, body, credentials: "same-origin" });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.detail || data.title || "Errore di rete");
  return data as T;
}
