[← Testplan](../index.md)

# TC-ANA-03 · Slut på gratiskvot, fel och tidsgräns ger tydliga felkoder

| | |
|---|---|
| **Område** | Bildanalys |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-04 AC3](../../specs/stories.md), [plan.md avsnitt 6](../../specs/plan.md) |
| **Playwright** | [`tests/analys.spec.js`](../../tests/analys.spec.js#L53) – *slut på gratiskvot, fel och tidsgräns ger tydliga felkoder* |

## Förutsättningar

- Enhetstest av `supabase/functions/kalori-analys/index.ts` med låtsas-Supabase Auth och låtsas-Gemini. Riktig körning: TC-ANA-07.

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Kör testet i CI | Grönt |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
