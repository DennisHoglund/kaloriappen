[← Testplan](../index.md)

# TC-FOT-11 · Ogiltiga rader stoppas

| | |
|---|---|
| **Område** | Fota mat |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-05](../../specs/stories.md) |
| **Playwright** | [`tests/foto.spec.js`](../../tests/foto.spec.js#L143) – *ogiltiga rader stoppas innan något sparas* |

## Förutsättningar

- Inloggad, Edge Function `kalori-analys` driftsatt (TC-ANA-07)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Töm ett namn och tryck **Spara** | **Alla rader behöver ett namn.** |
| 2 | Ange 0 gram | Meddelande om mängden med radens namn |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
