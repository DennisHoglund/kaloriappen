[← Testplan](../index.md)

# TC-SOK-01 · Sökningen kräver minst 2 tecken

| | |
|---|---|
| **Område** | Logga mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-06 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/logga-mat.spec.js`](../../tests/logga-mat.spec.js#L10) – *sökningen kräver minst 2 tecken* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck **Logga mat** och skriv en bokstav | Inga träffar, tipset **Skriv minst 2 tecken.** |
| 2 | Skriv `hav` | Havregryn och havregrynsgröt med kcal/100 g |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
