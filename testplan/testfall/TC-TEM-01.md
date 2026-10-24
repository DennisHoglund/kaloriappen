[← Testplan](../index.md)

# TC-TEM-01 · Temaknappen växlar Auto → Ljust → Mörkt och sparar valet

| | |
|---|---|
| **Område** | Tema |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md D-11](../../specs/stories.md) |
| **Playwright** | [`tests/tema.spec.js`](../../tests/tema.spec.js#L4) – *temaknappen växlar Auto → Ljust → Mörkt och sparar valet* |

## Förutsättningar

- Appen öppen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck på temaknappen uppe till höger | Texten byts från **Auto** till **Ljust** och appen blir ljus |
| 2 | Tryck igen | **Mörkt**, appen blir mörkblå |
| 3 | Stäng och öppna appen | Fortfarande **Mörkt** |
| 4 | Tryck igen | **Auto**, appen följer telefonen |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
