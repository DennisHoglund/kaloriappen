[← Testplan](../index.md)

# TC-REC-05 · Passar Kvar och stjärnor

| | |
|---|---|
| **Område** | Recept – beräkningar |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-17 AC2, US-18 AC3](../../specs/stories.md) |
| **Playwright** | [`tests/recept.spec.js`](../../tests/recept.spec.js#L61) – *passar Kvar och stjärnor* |

## Förutsättningar

- Rena funktioner i recept.js, testas i Node

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | 520 kcal mot Kvar 980 och 400 | Passar respektive Över. Vikt per portion räknas från ingredienserna |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
