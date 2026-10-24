[← Testplan](../index.md)

# TC-TRA-08 · Ändra och ta bort ett pass

| | |
|---|---|
| **Område** | Träning |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-11 AC4](../../specs/stories.md) |
| **Playwright** | [`tests/traning.spec.js`](../../tests/traning.spec.js#L68) – *ändra och ta bort ett pass* |

## Förutsättningar

- Inloggad med profil (vikten används för förbränningen)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck på ett pass, ändra tiden och spara | Uppdaterat |
| 2 | Tryck på passet, **Ta bort** och bekräfta | Passet försvinner |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
