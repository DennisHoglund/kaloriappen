# Kaloriappen – instruktioner för AI-assistenter

Appen byggs **spec-drivet**. Läs `specs/stories.md` (krav och beslut), `specs/plan.md` (arkitektur och regler) och `specs/tasks.md` (vad som är nästa steg).
Ändringar börjar alltid i specen: uppdatera `stories.md`/`plan.md` först, sedan koden.

## Projektet
- Privat PWA för mat, träning och vikt, en användare (Dennis), används på iPhone.
- Ren HTML/CSS/JS **utan byggsteg**. Inga ramverk, ingen bundler. Bibliotek via CDN med låst version.
- Supabase (auth + Postgres + Storage + Edge Function), Google Gemini Flash via Edge Function, GitHub Pages via Actions.

## Språk och ton
- All UI-text, felmeddelanden, kommentarer, commit-meddelanden och testnamn på **svenska**.
- Kort och praktiskt. Felmeddelanden säger vad som hände och vad man kan göra.

## Får aldrig brytas
- **Supabase-projektet delas med Jaktvind och Svampkartan.** Rör aldrig deras tabeller (`logg`, `platser`, `svamp_*` m.fl.), auth-inställningar eller mejlmallar.
  Allt eget har prefixet `kalori_` (tabeller, index, policies, secrets) och bucketen heter `kalori-foton`.
- Schemaändringar görs i `supabase/schema.sql` och ska gå att köra flera gånger (`if not exists`, `drop policy if exists`).
- RLS på alla tabeller: bara `auth.uid() = user_id`. `anon` får inget.
- Inga hemligheter i koden. Endast den publika publishable-nyckeln i `config.js`. Gemini-nyckeln finns bara som secret `KALORI_GEMINI_KEY`.
- Dagsmålet får aldrig gå under golvet (1 500 kcal man / 1 200 kcal kvinna) och takten aldrig över 1 % av kroppsvikten per vecka.
- Brända kcal från träning ändrar **inte** dagsmålet.

## Vid varje ändring
1. Höj `CACHE`-versionen i `sw.js` (`kalori-vN`) när appfiler ändras, och lägg nya filer i `SHELL`.
2. Nya JS-filer: lägg till `<script>` i `index.html` och i `SHELL`.
3. Kör testerna: `npx playwright test` (lokalt räcker `--project="Android (Chromium)"` om WebKit saknas).
4. Lägg till eller uppdatera tester i `tests/`. All extern trafik mockas i `tests/mock.js`.
   Använd `bild(page, 'Namn')` för skärmdumpar som ska synas i rapporten.
5. Lägg till eller uppdatera testfall i `testplan/` (fil i `testfall/` + rad i `index.md`) och koppla automatiserade tester med
   `{ annotation: { type: 'testfall', description: 'TC-…' } }`. Ange vilka acceptanskriterier testfallet verifierar i fältet
   **Krav** (t.ex. `US-07 AC1–2`). Kör `npm run testplan` – den kontrollerar också att varje acceptanskriterium har testfall.
6. Uppdatera `specs/` (status i `tasks.md`) och `README.md` så att de stämmer med koden.
7. Committa med beskrivande svenskt meddelande och pusha till `main`. CI testar och publicerar.

## Livsmedelsdata
- `data/livsmedel.json` skapas av `scripts/hamta-livsmedel.js` via arbetsflödet **Uppdatera livsmedel**. Redigera aldrig filen för hand.
- Källan (Livsmedelsverkets livsmedelsdatabas, CC BY 4.0) ska alltid synas i appen där livsmedel visas.

## Design
- Färgprofil **Blåbär** med ljust och mörkt läge via CSS-variabler i `styles.css`. Använd alltid variablerna, aldrig hårdkodade färger.
- Stora tryckytor (≥ 44 px), `env(safe-area-inset-*)` för iPhone. Siffror i IBM Plex Mono.

## Kod
- Moduler som IIFE på `window` (`KaloriApp`, `KaloriBerakning` …).
- `localStorage` alltid i try/catch. Nycklar börjar med `kalori-`.
- Escapa all användartext som hamnar i HTML (`esc()`).
- Beräkningar som rena funktioner i `berakning.js` med enhetstester.

## Tester och rapport
- Playwright på iPhone 14 (WebKit) och Pixel 7 (Chromium).
- Egen rapport: `tests/rapport-reporter.js` → https://dennishoglund.github.io/kaloriappen/rapport/
- Ett rött test i WebKit men grönt i Chromium betyder oftast ett riktigt Safari-problem – fixa appen, inte testet.
