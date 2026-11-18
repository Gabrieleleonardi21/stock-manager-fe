# STOCK MANAGER — frontend

Interfaccia React 19 + TypeScript + Vite per il gestionale di magazzino.

Avvio locale: `npm install` poi `npm run dev` (porta 5173). Le chiamate `/api` vanno al server
(`vite.config.ts`, proxy verso `localhost:8080`), quindi il back-end deve essere avviato.

Test: `npm test` (unit), `npm run test:e2e` (end-to-end, serve il back-end attivo).
