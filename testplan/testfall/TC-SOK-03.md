[← Testplan](../index.md)

# TC-SOK-03 · Välj livsmedel och ange gram räknar ut kcal

| | |
|---|---|
| **Område** | Logga mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-06 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/logga-mat.spec.js`](../../tests/logga-mat.spec.js#L22) – *välj livsmedel och ange gram räknar ut kcal* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Välj **Havregrynsgröt fullkorn** | 100 g förifyllt, 66 kcal |
| 2 | Ändra till 250 | 165 kcal direkt. Decimalkomma fungerar |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
