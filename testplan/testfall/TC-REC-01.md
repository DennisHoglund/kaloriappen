[← Testplan](../index.md)

# TC-REC-01 · Mängder räknas om efter antal portioner och avrundas rimligt

| | |
|---|---|
| **Område** | Recept – beräkningar |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-18 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/recept.spec.js`](../../tests/recept.spec.js#L18) – *mängder räknas om efter antal portioner och avrundas rimligt* |

## Förutsättningar

- Rena funktioner i recept.js, testas i Node

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Skala från 4 till 2 och 3 portioner | 600 g → 300 g, 0,75 msk → 1 msk, 250 g → 190 g, "efter smak" oförändrat |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
