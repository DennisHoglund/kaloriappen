[← Testplan](../index.md)

# TC-RED-02 · Ändrad mängd räknar om kcal och sparas

| | |
|---|---|
| **Område** | Ändra och ta bort |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-08 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/redigera.spec.js`](../../tests/redigera.spec.js#L32) – *ändrad mängd räknar om kcal i samma proportion och sparas* |

## Förutsättningar

- Inloggad, minst en loggad måltid idag

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ändra mängden | kcal ändras i samma proportion direkt |
| 2 | Tryck **Spara** | Tillbaka till översikten, Ätit och raden är uppdaterade |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
