[← Testplan](../index.md)

# TC-RED-06 · Ta bort sista raden tar bort hela måltiden

| | |
|---|---|
| **Område** | Ändra och ta bort |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-08 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/redigera.spec.js`](../../tests/redigera.spec.js#L77) – *ta bort sista raden tar bort hela måltiden* |

## Förutsättningar

- Inloggad, minst en loggad måltid idag

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ta bort det enda livsmedlet i en måltid | Måltiden visar **Inte loggat** |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
