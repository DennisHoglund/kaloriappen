# Kaloriappen – Tasks

Status: **v1.0** (2026-10-24). En task i taget. **Klar** = tester gröna i WebKit + Chromium, testfall finns i `testplan/`, och `specs/` stämmer med koden.

Status: ⬜ ej påbörjad · 🔄 pågår · ✅ klar · 📱 Dennis testar på iPhone

## Fas 0 – Grund

| ID | Task | Stories | Dennis gör | Status |
|---|---|---|---|---|
| T-01 | Projektskelett: `CLAUDE.md`/`AGENTS.md`, `package.json`, Playwright-config, `tests/mock.js`, rapport-reporter, CI-workflow, `sw.js`, manifest, tom app som visar laddning | – | Pages Source = GitHub Actions | ✅ |
| T-02 | Blåbär-tema i `styles.css` (ljust + mörkt läge, temaknapp) och ikon (SVG + PNG 180/192/512/maskable). Ljust läge och ikon visas som förslag först | D-11 | Väljer ljust läge och ikon | ✅ |
| T-03 | `supabase/schema.sql`: alla `kalori_`-tabeller, index, RLS, grants, bucket och storage-policies. Ska gå att köra om | US-01 AC3 | Kör SQL:en | ✅ |

## Fas 1 – Inloggning och profil

| ID | Task | Stories | Dennis gör | Status |
|---|---|---|---|---|
| T-04 | Inloggning med e-post + lösenord, session finns kvar efter omstart, logga ut | US-01 | 📱 | ✅ |
| T-05 | `berakning.js`: BMR, aktivitetsfaktor, takt med 1 %-tak, golv, avrundning. Enhetstester först | US-03 | – | ✅ |
| T-06 | Profil och onboarding: födelsedatum, kön, längd, aktivitet, målvikt, takt, startvikt (blir första raden i `kalori_vikt`). Dagsmålet räknas om direkt | US-02, US-03 AC3 | – | ✅ |

## Fas 2 – Manuell loggning och dagsöversikt

| ID | Task | Stories | Dennis gör | Status |
|---|---|---|---|---|
| T-07 | `scripts/hamta-livsmedel.js` + CI-steg som skapar `data/livsmedel.json` från Livsmedelsverkets API. Källa anges i appen | D-07 | – | ✅ |
| T-08 | Sök livsmedel (≥ 2 tecken, diakritik-okänsligt), ange gram, spara som måltid med typ. "Senaste" för snabbval | US-06, US-05 AC3 | – | ✅ |
| T-09 | Dagsöversikt: ätit/mål/kvar, stapel, måltider per typ, bläddra mellan dagar | US-07 | 📱 | ✅ |
| T-10 | Ändra mängd och ta bort måltid/rad (med bekräftelse) | US-08 | – | ✅ |

## Fas 3 – Foto

| ID | Task | Stories | Dennis gör | Status |
|---|---|---|---|---|
| T-11 | Edge Function `kalori-analys`: JWT-kontroll, Gemini Flash med JSON-svar, timeout och felkoder. Mockad i testerna | US-04 AC4 | Skapar Gemini-nyckel, lägger secret, deployar via editorn | ✅ |
| T-12 | Fota/välj bild → nedskalning → analys → justeringsvy (ändra gram, lägg till/ta bort rad) → spara med miniatyr ≤ 30 kB. Fel och 429 leder till manuell sökning | US-04, US-05 | 📱 | ✅ |

## Fas 4 – Vikt

| ID | Task | Stories | Dennis gör | Status |
|---|---|---|---|---|
| T-13 | Logga vikt (en per dag, ny ersätter). Aktuell vikt och dagsmål uppdateras | US-09 | – | 📱 |
| T-14 | Viktgraf i SVG: vikt, 7-dagars medel, linje för målvikt, period 30/90/allt. Kort på dagsöversikten | US-10 | 📱 | 📱 |

## Fas 5 – Träning

| ID | Task | Stories | Dennis gör | Status |
|---|---|---|---|---|
| T-15 | Logga träning: typ, minuter, km (inte för styrka), kommentar. Tempo/hastighet visas. MET-förbränning i `berakning.js` med enhetstester. Ändra/ta bort | US-11, US-12 AC1 | – | 📱 |
| T-16 | ~~Träningskort på dagsöversikten ("≈ N kcal", påverkar inte kvar)~~ (klart i T-15). Veckohistorik med tid per typ och total sträcka, bläddra bakåt | US-12 AC2–3, US-13 | 📱 | 📱 |

## Fas 6 – Avslut

| ID | Task | Stories | Dennis gör | Status |
|---|---|---|---|---|
| T-17 | Täckningskontroll: varje AC har testfall. `testplan/index.md`, README och specs uppdaterade. Manuella testfall för kamera och riktig backend | Alla | 📱 Kör manuella testfall | ⬜ |

## Spårbarhet

| Story | Tasks |
|---|---|
| US-01 | T-03, T-04 |
| US-02 | T-06 |
| US-03 | T-05, T-06 |
| US-04 | T-11, T-12 |
| US-05 | T-08, T-12 |
| US-06 | T-07, T-08 |
| US-07 | T-09 |
| US-08 | T-10 |
| US-09 | T-06, T-13 |
| US-10 | T-14 |
| US-11 | T-15 |
| US-12 | T-15, T-16 |
| US-13 | T-16 |
