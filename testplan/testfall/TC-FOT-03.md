[← Testplan](../index.md)

# TC-FOT-03 · Ändrad mängd räknar om kcal

| | |
|---|---|
| **Område** | Fota mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-05 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/foto.spec.js`](../../tests/foto.spec.js#L50) – *ändrad mängd räknar om kcal i samma proportion* |

## Förutsättningar

- Inloggad, Edge Function `kalori-analys` driftsatt (TC-ANA-07)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ändra gram på en rad | kcal på raden och totalt ändras i samma proportion |
| 2 | Ändra kcal direkt | Totalen ändras |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
