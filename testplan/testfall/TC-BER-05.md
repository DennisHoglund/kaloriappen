[← Testplan](../index.md)

# TC-BER-05 · Dagsmålet går aldrig under golvet

| | |
|---|---|
| **Område** | Beräkning |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-03](../../specs/stories.md), [plan.md avsnitt 5](../../specs/plan.md) |
| **Playwright** | [`tests/berakning.spec.js`](../../tests/berakning.spec.js#L40) – *dagsmålet går aldrig under golvet 1 500 (man) / 1 200 (kvinna)* |

## Förutsättningar

- Enhetstest av `berakning.js`. Stegen nedan kontrolleras i appen när profilen finns (T-06).

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ange en profil som ger mycket lågt mål (liten, äldre, stillasittande) | Målet blir 1 500 (man) eller 1 200 (kvinna) och appen förklarar varför |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
