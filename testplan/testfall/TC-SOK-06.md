[← Testplan](../index.md)

# TC-SOK-06 · Senaste livsmedel visas för snabbval

| | |
|---|---|
| **Område** | Logga mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-06 AC3](../../specs/stories.md) |
| **Playwright** | [`tests/logga-mat.spec.js`](../../tests/logga-mat.spec.js#L67) – *senaste livsmedel visas för snabbval med förra mängden* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Logga något och tryck **Logga mat** igen | Under **Senaste** finns livsmedlet |
| 2 | Tryck på det | Förra mängden är förifylld |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
