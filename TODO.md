# TODO — front-end STOCK MANAGER

Stato di riferimento: front-end in produzione, servito dal back-end sullo stesso dominio.
Legenda: 🔴 priorità alta · 🟡 media · 🟢 bassa

## Funzioni da completare
- 🔴 **Pagina delle bozze d'ordine**: l'assistente prepara le bozze, ma nell'interfaccia non c'è ancora dove vederle e confermarle. Serve un elenco con dettaglio, e i pulsanti per confermare o annullare (quando il back-end li supporterà).
- 🟡 **Storico della chat**: oggi la conversazione vive in memoria e si perde al ricaricamento della pagina. Valutare `sessionStorage` (per sessione del browser, senza dati sensibili persistiti).
- 🟡 **Scadenza della sessione**: se la sessione scade mentre l'utente lavora, le richieste falliscono senza un messaggio chiaro. Gestire il 401 con un ritorno alla schermata di accesso e un avviso.
- 🟡 **Messaggi di errore dal server nei form**: i campi non validi andrebbero evidenziati con il messaggio del server (oggi arrivano come testo generico).
- 🟢 **Conferma prima di eliminare** un magazzino, un articolo o un movimento (oggi l'eliminazione è immediata).

## Pulizia
- 🟡 **Rimozione del vecchio flusso locale**: `utils/report.ts` (calcolo dei report nel browser) serve solo ai test unitari. Quando il vecchio import non serve più, rimuovere `services/legacy.ts`, `storage.ts` e il banner di importazione.
- 🟡 **Pagina dei report**: verificare che sia coerente con i report generati dal server e rimuovere i riferimenti al vecchio salvataggio locale.
- 🟢 **Schermata di attesa**: uniformare il caricamento iniziale (oggi c'è un testo semplice).

## Test
- 🔴 **Test e2e in sequenza**: `workers: 1` è necessario perché i test registrano utenti sullo stesso server. Valutare un database e un server dedicati ai test, per poterli eseguire in parallelo.
- 🟡 **Test unitari dei nuovi hook** (`useAssistantAI`, `useMagazzino`, `useAuth`) con il server simulato.
- 🟡 **Test e2e del flusso d'ordine** quando la pagina delle bozze sarà pronta.
- 🟡 **Test su dispositivi reali** (mobile): verificare il pannello della chat e il layout delle card su schermi piccoli.
- 🟢 **Test di accessibilità** automatici (contrasto, navigazione da tastiera) sulle schermate principali.

## Sicurezza e prestazioni
- 🟡 **Vulnerabilità `picomatch`** (solo dev, ReDoS, via Vite): nessuna versione corretta pubblicata al momento. Riverificare.
- 🟡 **Dimensione del bundle**: controllare il peso del JavaScript e valutare la suddivisione per rotta (lazy loading).
- 🟢 **Content Security Policy**: la CSP del back-end è già restrittiva. Verificare che nessuna nuova funzione richieda di allentarla.

## Deploy
- 🟡 **Versione pinnata nel back-end**: ogni nuova versione di questa repository va comunicata al back-end, che aggiorna `FE_REF` nel `Dockerfile` e rifa il deploy con "Clear build cache".
- 🟢 **Configurazione di sviluppo**: il proxy `/api` è verso `localhost:8080`. Documentarlo meglio per chi lavora in locale.

## Pulizia del repository
- 🟢 **`README.md` e `LICENSE`**: verificare che le istruzioni di avvio siano aggiornate dopo i cambiamenti di architettura.
- 🟢 **File di design (`.impeccable/`)**: escluso dal repository. Decidere se conservarlo fuori dal progetto.
