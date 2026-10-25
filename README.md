# Kaloriappen

Privat iPhone-PWA för att gå ner i vikt: logga mat (foto med AI-uppskattning eller sökning i Livsmedelsverkets databas),
träning och vikt mot ett beräknat dagligt kalorimål.

- **App:** https://dennishoglund.github.io/kaloriappen/
- **Testrapport:** https://dennishoglund.github.io/kaloriappen/rapport/
- **Testplan:** [testplan/index.md](testplan/index.md) · **Spårbarhet krav → test:** [testplan/sparbarhet.md](testplan/sparbarhet.md)

## Funktioner

| Område | Vad |
|---|---|
| Inloggning | E-post + lösenord, samma konto som Svampkartan och Jaktvind |
| Profil | Födelsedatum, kön, längd, vikt, aktivitet, målvikt och takt → dagsmål (Mifflin-St Jeor, golv 1 500/1 200 kcal, högst 1 %/vecka) |
| Dagsöversikt | Ätit / mål / kvar, måltider per typ, bläddra mellan dagar. Status för avslutade dagar (i mål, under, för lite, över) och veckans prickar med snitt |
| Logga mat | Sök bland 2 606 livsmedel, gram → kcal, föreslagen måltid, senaste livsmedel |
| Fota maten | Bilden analyseras av Gemini Flash-Lite via Edge Function, justera och spara med miniatyr |
| Ändra | Ändra mängd eller ta bort, med bekräftelse |
| Träning | Styrka, löpning, promenad, cykling och gång på löpband (hastighet + lutning). Tempo/fart och uppskattad förbränning (påverkar inte dagsmålet). Veckohistorik |
| Vikt | Logga per dag, graf med 7-dagars medel och målvikt |

## Spec-driven

Allt börjar i `specs/`. Ändringar görs först i specen, sedan i koden.

| Fil | Innehåll |
|---|---|
| `specs/stories.md` | User stories US-01–15 med acceptanskriterier och beslut D-01–24 |
| `specs/plan.md` | Principer, arkitektur, datamodell, beräkningar, bildanalys, tester |
| `specs/tasks.md` | Tasks T-01–19 med status och spårbarhet |
| `testplan/` | 124 testfall som docs-as-code, kopplade till krav och Playwright-tester |
| `CLAUDE.md` | Regler för AI-assistenter (`AGENTS.md` pekar hit) |

## Kom igång

```bash
npm ci
npx playwright install webkit chromium
npm test            # testplan + spårbarhet + Playwright (iPhone/WebKit och Android/Chromium)
tests/schema.sh     # databasschemat mot en lokal Postgres (PGHOST/PGUSER)
```

Lokalt räcker `npx playwright test --project="Android (Chromium)"`. Rapporten hamnar i `rapport/index.html`.

## Drift

| Del | Var | Hur |
|---|---|---|
| App + rapport | GitHub Pages | Arbetsflödet **Tester** vid varje push till `main` |
| Livsmedel | `data/livsmedel.json` | Arbetsflödet **Uppdatera livsmedel** varje måndag och vid behov |
| Databas | Supabase (Jaktvinds projekt, delat) | Kör `supabase/schema.sql` i SQL Editor. Tabellprefix `kalori_`, bucket `kalori-foton` |
| Bildanalys | Supabase Edge Function `kalori-analys` | Klistra in `supabase/functions/kalori-analys/index.ts` i editorn. Secret `KALORI_GEMINI_KEY` (Google AI Studio). Valfritt `KALORI_GEMINI_MODELL`, `KALORI_GEMINI_TANKANDE` |

## Källor

Livsmedelsdata: Livsmedelsverkets livsmedelsdatabas (CC BY 4.0).
MET-värden: Compendium of Physical Activities.
Designförslag: claude.ai-kanvasen "Kaloriappen – designförslag" (vald: C · Blåbär).
