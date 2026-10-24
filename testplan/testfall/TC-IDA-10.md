[← Testplan](../index.md)

# TC-IDA-10 · Fel vid hämtning ger begripligt meddelande

| | |
|---|---|
| **Område** | Dagsöversikt |
| **Prioritet** | Låg |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md D-09](../../specs/stories.md) |
| **Playwright** | [`tests/idag.spec.js`](../../tests/idag.spec.js#L121) – *fel vid hämtning ger begripligt meddelande* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Slå på flygplansläge och bläddra till en annan dag | **Kunde inte hämta dagens måltider. Kontrollera nätet.** |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
