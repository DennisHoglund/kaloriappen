[← Testplan](../index.md)

# TC-RED-08 · Fel vid sparning eller borttagning behåller raden

| | |
|---|---|
| **Område** | Ändra och ta bort |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-08, D-09](../../specs/stories.md) |
| **Playwright** | [`tests/redigera.spec.js`](../../tests/redigera.spec.js#L96) – *fel vid sparning eller borttagning behåller raden* |

## Förutsättningar

- Inloggad, minst en loggad måltid idag

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Flygplansläge, ändra och tryck **Spara** | Felmeddelande, inget ändrat |
| 2 | Tryck **Ta bort** och bekräfta | Felmeddelande, raden finns kvar |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
