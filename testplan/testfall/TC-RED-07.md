[← Testplan](../index.md)

# TC-RED-07 · Ogiltig mängd stoppas

| | |
|---|---|
| **Område** | Ändra och ta bort |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-08](../../specs/stories.md) |
| **Playwright** | [`tests/redigera.spec.js`](../../tests/redigera.spec.js#L87) – *ogiltig mängd stoppas* |

## Förutsättningar

- Inloggad, minst en loggad måltid idag

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ange 0 och tryck **Spara** | **Ange en mängd mellan 1 och 5 000 gram.** |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
