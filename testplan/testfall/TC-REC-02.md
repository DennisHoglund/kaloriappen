[← Testplan](../index.md)

# TC-REC-02 · Sök på namn, ingredienser och anteckning oavsett versaler och accenter

| | |
|---|---|
| **Område** | Recept – beräkningar |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-20 AC1, D-27](../../specs/stories.md) |
| **Playwright** | [`tests/recept.spec.js`](../../tests/recept.spec.js#L33) – *sök på namn, ingredienser och anteckning oavsett versaler och accenter* |

## Förutsättningar

- Rena funktioner i recept.js, testas i Node

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Sök "CREME", "agg mjolk" och "chili" | Träffar på ingrediens, alla ord och anteckning |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
