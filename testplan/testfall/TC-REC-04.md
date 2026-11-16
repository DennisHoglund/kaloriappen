[← Testplan](../index.md)

# TC-REC-04 · Receptboken matchas mot valda ingredienser

| | |
|---|---|
| **Område** | Recept – beräkningar |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-17 AC4](../../specs/stories.md) |
| **Playwright** | [`tests/recept.spec.js`](../../tests/recept.spec.js#L53) – *receptboken matchas mot valda ingredienser* |

## Förutsättningar

- Rena funktioner i recept.js, testas i Node

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Matcha mot Paprika, Kyckling och Gul lök | Flest matchande först, sedan bäst betyg |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
