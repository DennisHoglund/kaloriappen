[← Testplan](../index.md)

# TC-VIK-01 · Logga vikt, ny mätning samma dag ersätter

| | |
|---|---|
| **Område** | Vikt |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-09 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/vikt.spec.js`](../../tests/vikt.spec.js#L23) – *logga vikt sparar dagens mätning och ny mätning samma dag ersätter* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck **Logga vikt och se graf**, ange vikt och **Spara vikt** | Bekräftelse, viktkortet visar vikten |
| 2 | Logga igen samma dag | Den nya ersätter den gamla |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
