# Kaloriappen – Plan

Status: **v1.0** (2026-10-24). Bygger på `stories.md` v1.1. Referensimplementation: `DennisHoglund/svampkartan`.

## 1. Principer (gäller alla tasks)

- Ren HTML/CSS/JS **utan byggsteg**. Moduler som IIFE på `window` (`KaloriX`). CDN med låsta versioner (supabase-js@2 från jsdelivr).
- All UI-text, kommentarer, testnamn och commits på **svenska**.
- **Delad Supabase:** rör aldrig andra appars tabeller, auth-inställningar eller mejlmallar. Allt eget har prefixet `kalori_`, bucketen heter `kalori-foton` (D-05, D-14).
- Inga hemligheter i klienten. Bara den publika publishable-nyckeln i `config.js`. Gemini-nyckeln finns bara som secret i Edge Function.
- `localStorage` alltid i try/catch, nycklar börjar med `kalori-`. Escapa all användartext (`esc()`).
- Design **Blåbär** (D-11) med ljust **och** mörkt läge via CSS-variabler. Temaknapp Auto/Ljust/Mörkt. Tryckytor ≥ 44 px, `env(safe-area-inset-*)`.
- Varje task levereras med Playwright-tester (WebKit + Chromium) och testfall i `testplan/`. All extern trafik mockas.
- Avvikelse från husreglerna: v1 kräver nät (D-09). Ingen offline-kö. Om en sparning misslyckas visas ett fel och formuläret behålls.

## 2. Arkitektur

```
iPhone (PWA, GitHub Pages)
 ├─ statiska filer + data/livsmedel.json
 ├─ supabase-js ──► Supabase Auth (e-post + lösenord)
 │               ──► Postgres  kalori_*  (RLS)
 │               ──► Storage   kalori-foton (miniatyrer)
 └─ fetch ───────► Edge Function kalori-analys ──► Google Gemini Flash (gratisnivå)
```

| Del | Val | Varför |
|---|---|---|
| Hosting | GitHub Pages via Actions | Som övriga appar |
| Data | Supabase, delat projekt (Jaktvinds) | Gratisnivån tillåter bara två projekt |
| Bildanalys | Gemini Flash via Edge Function `kalori-analys` | 0 kr (D-06), nyckeln hålls utanför klienten |
| Livsmedel | Livsmedelsverkets API (2 606 livsmedel), nedladdat till `data/livsmedel.json` av arbetsflödet **Uppdatera livsmedel** varje måndag och vid behov. Filen committas i repot | API:et kräver ett anrop per livsmedel för näringsvärden, så hämtningen tar några minuter och görs inte vid varje push. Inga CORS-problem, snabb sökning. 102 kB |
| Graf | Egen inline-SVG | Inget extra bibliotek, styrs av temavariablerna |
| Beräkningar | Rena funktioner i `berakning.js` | Lätta att enhetstesta |

## 3. Filer

| Fil | Ansvar |
|---|---|
| `index.html` | Vyer: laddning, inloggning, profil/onboarding, Idag, Sök, Foto, Vikt, Träning, Profil |
| `styles.css` | Blåbär-tema (ljust + mörkt), komponenter |
| `config.js` | Supabase-URL, publik nyckel, URL till Edge Function |
| `app.js` | Tema, inloggning, session, navigering, registrering av service worker |
| `berakning.js` | BMR, dagsmål med golv, MET-förbränning, tempo/hastighet, glidande medel. Laddas både i webbläsaren (`window.KaloriBerakning`) och i Node, så att enhetstesterna körs utan webbläsare |
| `profil.js` | Profilformulär och onboarding |
| `idag.js` | Dagsöversikt, bläddra mellan dagar |
| `maltid.js` | Spara, ändra, ta bort måltider och rader. Senaste livsmedel |
| `livsmedel.js` | Laddar `data/livsmedel.json` och söker (diakritik-okänslig) |
| `foto.js` | Kamera/bildval, nedskalning, anrop till analys, miniatyr ≤ 30 kB |
| `vikt.js` | Viktlogg och graf |
| `traning.js` | Träningslogg, historik per vecka |
| `sw.js` | Appfiler nätet först, CDN cache först. Höj `kalori-vN` vid ändring |
| `manifest.webmanifest`, `icons/` | PWA och egen ikon |
| `data/livsmedel.json` | Genereras av `scripts/hamta-livsmedel.js`: `{ kalla, licens, hamtad, antal, livsmedel: [[nummer, namn, kcal/100 g], …] }`, sorterad på svenska. Redigeras aldrig för hand |
| `supabase/schema.sql` | Tabeller, index, RLS, bucket, storage-policies. Ska gå att köra om |
| `supabase/functions/kalori-analys/index.ts` | Edge Function för bildanalys |
| `tests/`, `playwright.config.js`, `testplan/` | Som i Svampkartan, inklusive egen rapport |
| `.github/workflows/tester.yml` | Schematester → Playwright → bygg `_site` → publicera |
| `.github/workflows/uppdatera-livsmedel.yml` | Hämtar livsmedel varje måndag, committar vid ändring och startar `tester.yml` |
| `CLAUDE.md`, `AGENTS.md` | Regler för AI-assistenter (pekar på `specs/`) |

## 4. Datamodell (`supabase/schema.sql`)

| Tabell | Kolumner | Nyckel |
|---|---|---|
| `kalori_profil` | `user_id`, `fodelsedatum date`, `kon text (man/kvinna)`, `langd_cm int`, `aktivitet text (stillasittande/latt/mattlig/hog)`, `malvikt_kg numeric`, `takt_kg_vecka numeric (0.25/0.5/0.75)`, `uppdaterad timestamptz` | `user_id` |
| `kalori_vikt` | `user_id`, `datum date`, `vikt_kg numeric(5,1)` | `(user_id, datum)`. Ny mätning samma dag ersätter (US-09 AC1) |
| `kalori_maltid` | `id uuid`, `user_id`, `tid timestamptz`, `typ text (frukost/lunch/middag/mellanmal)`, `kalla text (foto/manuell)`, `miniatyr text null` | `id` |
| `kalori_maltid_rad` | `id uuid`, `maltid_id → kalori_maltid on delete cascade`, `user_id`, `namn text`, `livsmedel_nr int null`, `gram numeric`, `kcal numeric` | `id` |
| `kalori_traning` | `id uuid`, `user_id`, `datum date`, `typ text (styrka/lopning/promenad/cykling)`, `minuter int`, `km numeric null`, `kommentar text null`, `kcal numeric` | `id` |

- Aktuell vikt = senaste raden i `kalori_vikt`. Profilen lagrar ingen vikt, så det finns bara en sanning (US-09 AC2).
- RLS på alla tabeller: `(select auth.uid()) = user_id`. `revoke all from anon`, uttryckliga `grant` till `authenticated`.
- Bucket `kalori-foton` (privat), sökväg `<user_id>/<maltid_id>.jpg`. Policies på `storage.foldername(name)[1]`. Visas via signerad URL.
- `kcal` för träning sparas vid loggning (vikten den dagen), så historiken inte ändras när vikten ändras.

## 5. Beräkningar (`berakning.js`)

- **BMR (Mifflin-St Jeor):** man `10·kg + 6,25·cm − 5·ålder + 5`, kvinna `… − 161`.
- **Underhåll:** BMR × aktivitetsfaktor (stillasittande 1,2 · lätt 1,375 · måttlig 1,55 · hög 1,725).
- **Dagsmål:** underhåll − takt × 7 700 / 7 (≈ 7 700 kcal per kg). Takt begränsas till max 1 % av kroppsvikten per vecka (US-03 AC2). Golv 1 500 (man) / 1 200 (kvinna) (D-17). Avrundas till närmaste 10.
- **Träning:** kcal = MET × kg × timmar. MET: styrka 5,0 · promenad 3,5 · löpning efter tempo (6:00 min/km ≈ 9,8, 5:00 ≈ 11,0, 7:00 ≈ 8,3, interpoleras) · cykling efter km/h (< 16 ≈ 4,0, 16–19 ≈ 6,8, 19–22 ≈ 8,0, > 22 ≈ 10,0). Visas som "≈" (US-12).
- **Viktgraf:** glidande medel över 7 dagar (US-10 AC3).

## 6. Bildanalys (`kalori-analys`)

1. Klienten skalar ner bilden till max 1024 px JPEG och skickar base64 + användarens JWT.
2. Funktionen verifierar JWT (bara inloggade får anropa) och skickar bilden till Gemini Flash med en svensk prompt och **strukturerat JSON-svar**: `[{ namn, gram, kcal }]`.
3. Timeout 20 s. Fel, tom lista eller kvot slut (429) ger en tydlig felkod. Klienten visar då "Analysen misslyckades – lägg till manuellt" (US-04 AC3).
4. Modell-ID står i en konstant i funktionen så att den går att byta utan klientändring (D-06).
5. Secret: `KALORI_GEMINI_KEY`. Edge Function skapas och deployas i Supabase Dashboard (Edge Functions → Deploy a new function → Via Editor), så det fungerar från telefonen.

## 7. Tester

- Playwright på iPhone 14 (WebKit) och Pixel 7 (Chromium), sv-SE, Europe/Stockholm, `serviceWorkers: 'block'`.
- `tests/mock.js`: Supabase auth/REST/storage (in-memory), Edge Function (fasta svar inklusive fel och 429), `data/livsmedel.json` (liten fixtur), CDN från `node_modules`. Mockad kamera via `setInputFiles`.
- Enhetstester för `berakning.js` körs i samma svit (sida som laddar bara skriptet).
- `tests/schema.sh` kör `supabase/schema.sql` två gånger mot en tom Postgres (med `supabase/stub.sql` som låtsas-auth/storage) och sedan `supabase/tester.sql`: RLS mellan användare, anon nekas, regler i tabellerna, foton bara i egen mapp. Körs i CI med en Postgres-tjänst.
- Testfall i `testplan/testfall/TC-<OMR>-NN.md`, kopplade via `annotation: { type: 'testfall' }`. Områden: INL, PRO, MAL, SOK, FOT, IDA, VIK, TRA.
- Rapport på `https://dennishoglund.github.io/kaloriappen/rapport/` i Blåbär-tema.
- Varje AC i `stories.md` ska ha minst ett testfall. Täckning listas i `testplan/index.md`.

## 8. Det Dennis behöver göra (manuellt)

| När | Vad |
|---|---|
| T-01 | GitHub: Settings → Pages → Source = **GitHub Actions** |
| T-03 | Supabase (Jaktvinds projekt): SQL Editor → klistra in `schema.sql` → Run |
| T-11 | Google AI Studio: skapa API-nyckel. Supabase: Edge Functions → Secrets → `KALORI_GEMINI_KEY`. Deploya funktionen via editorn |
| Efter T-04, T-09, T-12, T-14, T-16 | Testa på iPhone |
