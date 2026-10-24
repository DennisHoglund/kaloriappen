[← Testplan](../index.md)

# TC-RED-05 · Ta bort en av flera rader behåller måltiden

| | |
|---|---|
| **Område** | Ändra och ta bort |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-08 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/redigera.spec.js`](../../tests/redigera.spec.js#L66) – *ta bort en av flera rader behåller måltiden* |

## Förutsättningar

- Inloggad, minst en loggad måltid idag

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ta bort ett av två livsmedel i en måltid och bekräfta | Livsmedlet försvinner, det andra finns kvar, Ätit minskar |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
