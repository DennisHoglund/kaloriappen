[← Testplan](../index.md)

# TC-SOK-13 · Livsmedlen kan inte laddas ger begripligt fel

| | |
|---|---|
| **Område** | Logga mat |
| **Prioritet** | Låg |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-06, D-09](../../specs/stories.md) |
| **Playwright** | [`tests/logga-mat.spec.js`](../../tests/logga-mat.spec.js#L134) – *livsmedlen kan inte laddas ger begripligt fel* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Öppna **Logga mat** första gången i flygplansläge | **Kunde inte ladda livsmedlen. Kontrollera nätet och försök igen.** |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
