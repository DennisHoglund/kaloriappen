[← Testplan](../index.md)

# TC-ANA-05 · Saknad bild, för stor bild och saknad nyckel stoppas

| | |
|---|---|
| **Område** | Bildanalys |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-04](../../specs/stories.md), [plan.md avsnitt 6](../../specs/plan.md) |
| **Playwright** | [`tests/analys.spec.js`](../../tests/analys.spec.js#L77) – *saknad bild, för stor bild och saknad nyckel stoppas* |

## Förutsättningar

- Enhetstest av `supabase/functions/kalori-analys/index.ts` med låtsas-Supabase Auth och låtsas-Gemini. Riktig körning: TC-ANA-07.

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Kör testet i CI | Grönt |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
