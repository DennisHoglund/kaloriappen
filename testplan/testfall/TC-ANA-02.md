[← Testplan](../index.md)

# TC-ANA-02 · Bara inloggade får anropa, nyckeln skickas aldrig tillbaka

| | |
|---|---|
| **Område** | Bildanalys |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-04 AC4](../../specs/stories.md), [plan.md avsnitt 6](../../specs/plan.md) |
| **Playwright** | [`tests/analys.spec.js`](../../tests/analys.spec.js#L42) – *bara inloggade får anropa och nyckeln skickas aldrig tillbaka* |

## Förutsättningar

- Enhetstest av `supabase/functions/kalori-analys/index.ts` med låtsas-Supabase Auth och låtsas-Gemini. Riktig körning: TC-ANA-07.

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Kör testet i CI | Grönt |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
