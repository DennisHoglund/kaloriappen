[← Testplan](../index.md)

# TC-IDA-02 · Måltiderna grupperas per typ med summa

| | |
|---|---|
| **Område** | Dagsöversikt |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-07 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/idag.spec.js`](../../tests/idag.spec.js#L42) – *måltiderna grupperas per typ med summa* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Logga till frukost och lunch | Varje måltid visar sina livsmedel med gram och kcal och en summa. Tomma måltider: **Inte loggat** |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
