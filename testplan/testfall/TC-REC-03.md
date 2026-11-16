[← Testplan](../index.md)

# TC-REC-03 · Filter på betyg och sortering

| | |
|---|---|
| **Område** | Recept – beräkningar |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-20 AC2–3](../../specs/stories.md) |
| **Playwright** | [`tests/recept.spec.js`](../../tests/recept.spec.js#L42) – *filter på betyg och sortering* |

## Förutsättningar

- Rena funktioner i recept.js, testas i Node

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Filtrera ★4+ och sortera på alla fyra sätt | Rätt recept i rätt ordning, originalet ändras inte |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
