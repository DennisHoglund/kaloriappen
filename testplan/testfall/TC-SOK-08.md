[← Testplan](../index.md)

# TC-SOK-08 · Sparfel behåller valet

| | |
|---|---|
| **Område** | Logga mat |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-06, D-09](../../specs/stories.md) |
| **Playwright** | [`tests/logga-mat.spec.js`](../../tests/logga-mat.spec.js#L102) – *sparfel behåller valet och lämnar ingen tom måltid* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Slå på flygplansläge och tryck **Spara** | Felmeddelande, valet finns kvar |
| 2 | Slå av och tryck **Spara** | Sparas |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
