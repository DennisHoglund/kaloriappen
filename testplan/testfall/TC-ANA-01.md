[← Testplan](../index.md)

# TC-ANA-01 · Bilden skickas till Gemini och svaret blir rader

| | |
|---|---|
| **Område** | Bildanalys |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-04 AC2](../../specs/stories.md), [plan.md avsnitt 6](../../specs/plan.md) |
| **Playwright** | [`tests/analys.spec.js`](../../tests/analys.spec.js#L24) – *bilden skickas till Gemini och svaret blir rader med namn, gram och kcal* |

## Förutsättningar

- Enhetstest av `supabase/functions/kalori-analys/index.ts` med låtsas-Supabase Auth och låtsas-Gemini. Riktig körning: TC-ANA-07.

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Kör testet i CI | Grönt |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
