[← Testplan](../index.md)

# TC-INL-04 · Rätt uppgifter loggar in

| | |
|---|---|
| **Område** | Inloggning |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-01 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/inloggning.spec.js`](../../tests/inloggning.spec.js#L34) – *rätt uppgifter loggar in* |

## Förutsättningar

- Utloggad (tryck **Logga ut**)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ange samma e-post och lösenord som i Svampkartan, tryck **Logga in** | Appen visas med din e-post. Stora bokstäver och mellanslag i e-posten spelar ingen roll |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
