[← Testplan](../index.md)

# TC-INL-02 · Fel lösenord ger tydligt felmeddelande

| | |
|---|---|
| **Område** | Inloggning |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-01](../../specs/stories.md) |
| **Playwright** | [`tests/inloggning.spec.js`](../../tests/inloggning.spec.js#L14) – *fel lösenord ger ett tydligt felmeddelande* |

## Förutsättningar

- Utloggad (tryck **Logga ut**)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ange din e-post och ett felaktigt lösenord, tryck **Logga in** | Rött meddelande: **Fel e-post eller lösenord.** |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
