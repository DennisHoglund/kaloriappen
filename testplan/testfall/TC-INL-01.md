[← Testplan](../index.md)

# TC-INL-01 · Inloggningen visas när man inte är inloggad

| | |
|---|---|
| **Område** | Inloggning |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-01](../../specs/stories.md) |
| **Playwright** | [`tests/inloggning.spec.js`](../../tests/inloggning.spec.js#L5) – *visar inloggningen när man inte är inloggad* |

## Förutsättningar

- Utloggad (tryck **Logga ut**)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Öppna appen | Inloggningen visas med blåbärsikonen, rubriken **Kaloriappen** och fälten E-post och Lösenord |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
