[← Testplan](../index.md)

# TC-INL-03 · Ogiltig e-post stoppas innan något skickas

| | |
|---|---|
| **Område** | Inloggning |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-01](../../specs/stories.md) |
| **Playwright** | [`tests/inloggning.spec.js`](../../tests/inloggning.spec.js#L25) – *ogiltig e-post stoppas innan något skickas* |

## Förutsättningar

- Utloggad (tryck **Logga ut**)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Skriv `inte-en-adress` som e-post och valfritt lösenord, tryck **Logga in** | **Ange en giltig e-postadress.** visas direkt |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
