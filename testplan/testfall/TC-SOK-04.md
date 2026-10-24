[← Testplan](../index.md)

# TC-SOK-04 · Spara loggar måltiden

| | |
|---|---|
| **Område** | Logga mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-06 AC2, US-05 AC3](../../specs/stories.md) |
| **Playwright** | [`tests/logga-mat.spec.js`](../../tests/logga-mat.spec.js#L36) – *spara loggar måltiden med typ, livsmedel, gram och kcal* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Välj ett livsmedel, ange gram, välj måltid och tryck **Spara** | Tillbaka till startsidan med bekräftelsen "… sparat till …" |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
