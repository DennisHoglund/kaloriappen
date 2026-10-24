[← Testplan](../index.md)

# TC-FOT-07 · Ingen mat eller ingen kontakt ger begripligt fel

| | |
|---|---|
| **Område** | Fota mat |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-04 AC3](../../specs/stories.md) |
| **Playwright** | [`tests/foto.spec.js`](../../tests/foto.spec.js#L99) – *ingen mat på bilden eller ingen kontakt ger begripligt fel* |

## Förutsättningar

- Inloggad, Edge Function `kalori-analys` driftsatt (TC-ANA-07)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Fota något som inte är mat | **Hittade ingen mat på bilden.** |
| 2 | Fota i flygplansläge | Meddelande om att analysen inte fungerade |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
