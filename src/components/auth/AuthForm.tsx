import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { cx } from "../../utils/cx";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Cube3D } from "../ui/Cube3D";

const registerSchema = z.object({
  name: z.string().min(1, "Inserisci il nome utente"),
  email: z.string().email("Mail non valida"),
  pass: z.string().min(4, "Password di almeno 4 caratteri"),
});
const loginSchema = z.object({ email: z.string().email("Mail non valida"), pass: z.string().min(1, "Inserisci la password") });
type RegisterData = z.infer<typeof registerSchema>;
type LoginData = z.infer<typeof loginSchema>;

/** Schermata di accesso: a sinistra il cubo 3D e i punti di forza, a destra registrazione, login o modalità Ospite */
export function AuthForm() {
  const { register: doRegister, login: doLogin, enterGuest } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"register" | "login">("login");
  const [authError, setAuthError] = useState<string | null>(null);
  const regForm = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });
  const logForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  // errori del server (es. registrazione non completata) mostrati in pagina, mai lasciati senza catch
  const onRegister = regForm.handleSubmit(async (d) => {
    setAuthError(null);
    try {
      await doRegister(d.name, d.email, d.pass);
      navigate("/azienda");
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : "Registrazione non riuscita.");
    }
  });
  const onLogin = logForm.handleSubmit(async (d) => {
    setAuthError(null);
    const ok = await doLogin(d.email, d.pass);
    if (!ok) { setAuthError("Mail o password non corretti."); return; }
    navigate("/azienda");
  });

  const switchMode = (m: "register" | "login") => { setMode(m); setAuthError(null); };
  // messaggio di errore del campo, o nulla se il campo è valido
  const err = (m?: string) => m && <span className="field-error">{m}</span>;

  return (
    <section className="auth">
      <div className="auth-hero">
        <Cube3D />
        <div className="eyebrow">Gestionale di magazzino</div>
        <h2 className="hero-title">Scorte sotto controllo, <span>a colpo d'occhio.</span></h2>
        <p className="muted hero-text">Gestisci magazzini e articoli, registra arrivi e prelievi con data e prezzo, e archivia i report mensili.</p>
        <ul className="hero-points">
          <li>Stato scorta automatico per ogni articolo</li>
          <li>Consigli di riordino e valore del magazzino</li>
          <li>Report mensili esportabili in CSV</li>
        </ul>
      </div>

      <div className="card auth-card">
        <div className="seg full" role="tablist" aria-label="Accesso">
          <button role="tab" aria-selected={mode === "register"} className={cx("seg-btn", mode === "register" && "on")} onClick={() => switchMode("register")}>Registrati</button>
          <button role="tab" aria-selected={mode === "login"} className={cx("seg-btn", mode === "login" && "on")} onClick={() => switchMode("login")}>Accedi</button>
        </div>

        {mode === "register" && (
          <form className="stack" onSubmit={onRegister}>
            <Input label="Nome utente" placeholder="Es. Gabriele" autoComplete="name" {...regForm.register("name")} />
            {err(regForm.formState.errors.name?.message)}
            <Input label="Mail" type="email" placeholder="nome@mail.it" autoComplete="email" {...regForm.register("email")} />
            {err(regForm.formState.errors.email?.message)}
            <Input label="Password" type="password" autoComplete="new-password" {...regForm.register("pass")} />
            {err(regForm.formState.errors.pass?.message)}
            <p className="muted small">La password viene verificata dal server e non viene mai salvata nel browser. Usa una password che non usi altrove (minimo 12 caratteri).</p>
            <Button type="submit" variant="primary" block>Crea account</Button>
          </form>
        )}

        {mode === "login" && (
          <form className="stack" onSubmit={onLogin}>
            <Input label="Mail" type="email" autoComplete="email" {...logForm.register("email")} />
            {err(logForm.formState.errors.email?.message)}
            <Input label="Password" type="password" autoComplete="current-password" {...logForm.register("pass")} />
            {err(logForm.formState.errors.pass?.message)}
            <Button type="submit" variant="primary" block>Accedi</Button>
          </form>
        )}

        {authError && <p className="field-error">{authError}</p>}

        <div className="auth-foot">
          <Button block onClick={() => { enterGuest(); navigate("/azienda"); }}>Continua come Ospite</Button>
          <p className="muted">L'Ospite prova tutto senza salvataggi e senza i controlli sulle giacenze.</p>
        </div>
      </div>
    </section>
  );
}
