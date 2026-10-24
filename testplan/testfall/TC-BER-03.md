[← Testplan](../index.md)

# TC-BER-03 · Dagsmål med underskott för vald takt

| | |
|---|---|
| **Område** | Beräkning |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-03](../../specs/stories.md), [plan.md avsnitt 5](../../specs/plan.md) |
| **Playwright** | [`tests/berakning.spec.js`](../../tests/berakning.spec.js#L21) – *dagsmål = underhåll minus underskott för vald takt, avrundat till 10* |

## Förutsättningar

- Enhetstest av `berakning.js`. Stegen nedan kontrolleras i appen när profilen finns (T-06).

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Man 92 kg, 182 cm, 46 år, lätt aktiv, 0,5 kg/vecka | 1 832,5 × 1,375 − 550 ≈ 1 970 kcal |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
