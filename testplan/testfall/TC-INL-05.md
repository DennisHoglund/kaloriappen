[← Testplan](../index.md)

# TC-INL-05 · Inloggningen finns kvar efter omstart

| | |
|---|---|
| **Område** | Inloggning |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-01](../../specs/stories.md) |
| **Playwright** | [`tests/inloggning.spec.js`](../../tests/inloggning.spec.js#L44) – *inloggningen finns kvar efter omstart* |

## Förutsättningar

- Inloggad

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Stäng appen helt (svep bort den) och öppna igen | Du är fortfarande inloggad |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
