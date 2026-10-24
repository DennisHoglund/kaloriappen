[← Testplan](../index.md)

# TC-SOK-11 · kcal räknas från kcal per 100 g och gram

| | |
|---|---|
| **Område** | Logga mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-06 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/sokning.spec.js`](../../tests/sokning.spec.js#L26) – *kcal räknas från kcal per 100 g och gram* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Räkna för hand: 66 kcal/100 g × 250 g | 165 kcal |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
