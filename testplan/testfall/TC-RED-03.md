[← Testplan](../index.md)

# TC-RED-03 · AI-rader kan också ändras

| | |
|---|---|
| **Område** | Ändra och ta bort |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-08 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/redigera.spec.js`](../../tests/redigera.spec.js#L44) – *AI-rader utan livsmedel kan också ändras* |

## Förutsättningar

- Inloggad, minst en loggad måltid idag

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ändra mängden på en rad från foto (efter T-12) | kcal ändras i samma proportion |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
