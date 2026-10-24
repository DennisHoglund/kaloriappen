[← Testplan](../index.md)

# TC-TRA-05 · Styrketräning loggas med bara tid

| | |
|---|---|
| **Område** | Träning |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-11 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/traning.spec.js`](../../tests/traning.spec.js#L31) – *styrketräning loggas med bara tid* |

## Förutsättningar

- Inloggad med profil (vikten används för förbränningen)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Välj **Styrka** | Fältet för sträcka försvinner |
| 2 | Ange tid och spara | Passet sparas utan sträcka |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
