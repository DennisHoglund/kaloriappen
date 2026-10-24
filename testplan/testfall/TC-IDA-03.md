[← Testplan](../index.md)

# TC-IDA-03 · Bläddra mellan dagar

| | |
|---|---|
| **Område** | Dagsöversikt |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-07 AC3](../../specs/stories.md) |
| **Playwright** | [`tests/idag.spec.js`](../../tests/idag.spec.js#L53) – *bläddra bakåt visar tidigare dagar* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck **‹** | **Igår** med gårdagens måltider |
| 2 | Tryck **‹** igen | Veckodag och datum |
| 3 | Tryck **Tillbaka till idag** | **Idag**. **›** går inte att trycka på idag |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
