[← Testplan](../index.md)

# TC-LIV-01 · kcal per 100 g plockas ur näringsvärdena

| | |
|---|---|
| **Område** | Livsmedelsdata |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md D-07, US-06](../../specs/stories.md) |
| **Playwright** | [`tests/livsmedel.spec.js`](../../tests/livsmedel.spec.js#L11) – *kcal per 100 g plockas ur Livsmedelsverkets näringsvärden* |

## Förutsättningar

- Ingen (enhetstest)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Jämför ett livsmedel i appen med Livsmedelsverkets webbplats | Samma kcal per 100 g |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
