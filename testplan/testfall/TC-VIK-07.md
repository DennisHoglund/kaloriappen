[← Testplan](../index.md)

# TC-VIK-07 · Ogiltig vikt stoppas

| | |
|---|---|
| **Område** | Vikt |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-09](../../specs/stories.md) |
| **Playwright** | [`tests/vikt.spec.js`](../../tests/vikt.spec.js#L81) – *ogiltig vikt stoppas* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ange 12 eller 400 | **Vikten ska vara mellan 30 och 300 kg.** |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
