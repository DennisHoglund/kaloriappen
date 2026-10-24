[← Testplan](../index.md)

# TC-SOK-12 · Tillbaka stänger utan att spara

| | |
|---|---|
| **Område** | Logga mat |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-06](../../specs/stories.md) |
| **Playwright** | [`tests/logga-mat.spec.js`](../../tests/logga-mat.spec.js#L123) – *tillbaka stänger sökningen utan att spara* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Välj ett livsmedel, tryck **← Sök igen** och sedan **← Tillbaka** | Startsidan, inget sparat |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
