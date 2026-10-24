[← Testplan](../index.md)

# TC-BER-02 · BMR enligt Mifflin-St Jeor

| | |
|---|---|
| **Område** | Beräkning |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-03](../../specs/stories.md), [plan.md avsnitt 5](../../specs/plan.md) |
| **Playwright** | [`tests/berakning.spec.js`](../../tests/berakning.spec.js#L16) – *BMR enligt Mifflin-St Jeor för man och kvinna* |

## Förutsättningar

- Enhetstest av `berakning.js`. Stegen nedan kontrolleras i appen när profilen finns (T-06).

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Räkna för hand: man 92 kg, 182 cm, 46 år | 10·92 + 6,25·182 − 5·46 + 5 = 1 832,5 kcal |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
