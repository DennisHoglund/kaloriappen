[← Testplan](../index.md)

# TC-ANA-06 · Modellen kan bytas med en secret

| | |
|---|---|
| **Område** | Bildanalys |
| **Prioritet** | Låg |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md D-06](../../specs/stories.md), [plan.md avsnitt 6](../../specs/plan.md) |
| **Playwright** | [`tests/analys.spec.js`](../../tests/analys.spec.js#L92) – *modell och tänkande kan bytas med secrets* |

## Förutsättningar

- Enhetstest av `supabase/functions/kalori-analys/index.ts` med låtsas-Supabase Auth och låtsas-Gemini. Riktig körning: TC-ANA-07.

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Kör testet i CI | Grönt |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
