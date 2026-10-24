[← Testplan](../index.md)

# TC-BER-04 · Takten begränsas till 1 % av kroppsvikten

| | |
|---|---|
| **Område** | Beräkning |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-03](../../specs/stories.md), [plan.md avsnitt 5](../../specs/plan.md) |
| **Playwright** | [`tests/berakning.spec.js`](../../tests/berakning.spec.js#L32) – *takten begränsas till högst 1 % av kroppsvikten per vecka* |

## Förutsättningar

- Enhetstest av `berakning.js`. Stegen nedan kontrolleras i appen när profilen finns (T-06).

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Vikt 60 kg, takt 0,75 kg/vecka | Takten sänks till 0,6 kg/vecka och appen förklarar varför |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
