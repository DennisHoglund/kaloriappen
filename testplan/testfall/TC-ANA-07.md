[← Testplan](../index.md)

# TC-ANA-07 · Edge Function är driftsatt och nyckeln fungerar

| | |
|---|---|
| **Område** | Bildanalys |
| **Prioritet** | Hög |
| **Typ** | 🖐️ Manuell |
| **Krav** | [specs/stories.md US-04 AC4, D-06](../../specs/stories.md) |

## Förutsättningar

- Nyckel från Google AI Studio (börjar med `AIza`)
- Inloggad på supabase.com i Jaktvinds projekt (`sjdznlmnvubqscftdkoj`)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | **Edge Functions** → **Secrets** → lägg till `KALORI_GEMINI_KEY` med nyckeln | Secret sparad |
| 2 | **Edge Functions** → **Deploy a new function** → **Via Editor**, namn `kalori-analys`, klistra in `supabase/functions/kalori-analys/index.ts`, **Deploy** | Funktionen visas som aktiv |
| 3 | Öppna funktionen → **Details** (eller Settings) → stäng av **Verify JWT** och spara | Funktionen kontrollerar själv inloggningen |
| 4 | Fota en tallrik mat i appen (T-12) | Förslag med namn, gram och kcal visas inom några sekunder |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
