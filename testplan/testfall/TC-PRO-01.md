[← Testplan](../index.md)

# TC-PRO-01 · Ny användare guidas till profilen

| | |
|---|---|
| **Område** | Profil |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-02 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/profil.spec.js`](../../tests/profil.spec.js#L25) – *ny användare guidas till profilen* |

## Förutsättningar

- Inloggad med ett konto som inte har någon profil i Kaloriappen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Logga in första gången | Rubriken **Välkommen! Fyll i din profil** och en förklaring visas. Ingen Avbryt-knapp |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
