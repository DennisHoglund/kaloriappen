[← Testplan](../index.md)

# TC-TRA-09 · Ogiltiga värden stoppas

| | |
|---|---|
| **Område** | Träning |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-11](../../specs/stories.md) |
| **Playwright** | [`tests/traning.spec.js`](../../tests/traning.spec.js#L91) – *ogiltiga värden stoppas* |

## Förutsättningar

- Inloggad med profil (vikten används för förbränningen)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Spara utan typ, med 0 minuter eller utan sträcka för promenad | Tydligt meddelande, inget sparas |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
