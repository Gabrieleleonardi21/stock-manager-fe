import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { NuovoMagazzinoInput } from "../../hooks/useAzienda";

const VUOTO: NuovoMagazzinoInput = { nome: "", luogo: "", responsabile: "" };

/** Form per creare un magazzino (nome, luogo, responsabile). Invio dalla tastiera o bottone */
export function MagazzinoForm({ onCreate }: { onCreate: (i: NuovoMagazzinoInput) => void }) {
  const [d, setD] = useState<NuovoMagazzinoInput>(VUOTO);
  // aggiorna un solo campo del form
  const set = (k: keyof NuovoMagazzinoInput) => (e: ChangeEvent<HTMLInputElement>) => setD({ ...d, [k]: e.target.value });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onCreate(d);
    setD(VUOTO);
  };

  return (
    <form className="card block-gap" onSubmit={submit}>
      <h2 className="panel-title">Nuovo magazzino</h2>
      <div className="grid-form">
        <Input label="Nome" value={d.nome} onChange={set("nome")} placeholder="Es. Magazzino centrale" />
        <Input label="Luogo" value={d.luogo} onChange={set("luogo")} placeholder="Es. Roma — Via Tiburtina" />
        <Input label="Responsabile" value={d.responsabile} onChange={set("responsabile")} />
      </div>
      <div className="form-actions">
        <Button type="submit" variant="ok">Crea magazzino</Button>
      </div>
    </form>
  );
}
