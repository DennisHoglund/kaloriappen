[← Testplan](../index.md)

# TC-INL-07 · Ingen kontakt med servern ger ett begripligt fel

| | |
|---|---|
| **Område** | Inloggning |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-01](../../specs/stories.md) |
| **Playwright** | [`tests/inloggning.spec.js`](../../tests/inloggning.spec.js#L58) – *ingen kontakt med servern ger ett begripligt fel* |

## Förutsättningar

- Utloggad (tryck **Logga ut**)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Slå på flygplansläge, ange uppgifter och tryck **Logga in** | **Ingen kontakt med servern. Kontrollera nätet och försök igen.** Knappen går att trycka igen |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
