[← Testplan](../index.md)

# TC-SOK-07 · Ogiltig mängd stoppas

| | |
|---|---|
| **Område** | Logga mat |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-06](../../specs/stories.md) |
| **Playwright** | [`tests/logga-mat.spec.js`](../../tests/logga-mat.spec.js#L90) – *ogiltig mängd stoppas innan något sparas* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ange 0, 6000 eller bokstäver och tryck **Spara** | **Ange en mängd mellan 1 och 5 000 gram.** Inget sparas |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
