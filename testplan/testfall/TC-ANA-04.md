[← Testplan](../index.md)

# TC-ANA-04 · Ingen mat på bilden och ogiltiga svar hanteras

| | |
|---|---|
| **Område** | Bildanalys |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-04 AC3](../../specs/stories.md), [plan.md avsnitt 6](../../specs/plan.md) |
| **Playwright** | [`tests/analys.spec.js`](../../tests/analys.spec.js#L65) – *ingen mat på bilden och ogiltiga svar hanteras* |

## Förutsättningar

- Enhetstest av `supabase/functions/kalori-analys/index.ts` med låtsas-Supabase Auth och låtsas-Gemini. Riktig körning: TC-ANA-07.

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Kör testet i CI | Grönt |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
