import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "./components/layout/Header";
import { NavBar } from "./components/layout/NavBar";
import { AssistantFAB } from "./components/coach/AssistantFAB";
import { AssistantPanel } from "./components/coach/AssistantPanel";
import { Toaster } from "./components/ui/Toaster";
import { Loading } from "./components/ui/Loading";
import { useAuth } from "./hooks/useAuth";
import { useAppStore } from "./stores/useAppStore";
import { useAssistantAI } from "./hooks/useAssistantAI";
import { HomePage } from "./pages/HomePage";
import { AziendaPage } from "./pages/AziendaPage";
import { MagazzinoPage } from "./pages/MagazzinoPage";
import { ReportPage } from "./pages/ReportPage";
import { NotFoundPage } from "./pages/NotFoundPage";

/** Radice dell'app: layout comune (sfondo 3D, intestazione, menu), rotte, assistente e notifiche */
export default function App() {
  const user = useAppStore((s) => s.user);
  const authChecked = useAppStore((s) => s.authChecked);
  const { ripristina } = useAuth();
  const [aiOpen, setAiOpen] = useState(false);
  // la conversazione vive qui: chiudere il pannello non la cancella
  const chat = useAssistantAI();
  // al primo caricamento (anche dopo F5) ripristina la sessione dal server
  useEffect(() => { ripristina(); }, []);
  return (
    <BrowserRouter>
      {/* pavimento prospettico decorativo: nascosto agli screen reader */}
      <div className="bg-floor" aria-hidden="true" />
      <div className="shell">
        <Header />
        {user && <NavBar />}
        <main>
          {/* finche' la sessione non e' verificata non si mostra il form di accesso (niente lampeggio) */}
          {!authChecked && <Loading>Caricamento…</Loading>}
          {authChecked && <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/azienda" element={<AziendaPage />} />
            <Route path="/azienda/magazzino/:id" element={<MagazzinoPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>}
        </main>
      </div>
      {aiOpen && <AssistantPanel chat={chat} onClose={() => setAiOpen(false)} />}
      <AssistantFAB onClick={() => setAiOpen((o) => !o)} />
      <Toaster />
    </BrowserRouter>
  );
}
