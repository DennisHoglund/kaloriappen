[← Testplan](../index.md)

# TC-BER-06 · Ofullständig profil ger inget dagsmål

| | |
|---|---|
| **Område** | Beräkning |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-03](../../specs/stories.md), [plan.md avsnitt 5](../../specs/plan.md) |
| **Playwright** | [`tests/berakning.spec.js`](../../tests/berakning.spec.js#L50) – *ofullständig profil ger inget dagsmål* |

## Förutsättningar

- Enhetstest av `berakning.js`. Stegen nedan kontrolleras i appen när profilen finns (T-06).

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Lämna ett fält tomt i profilen | Inget dagsmål visas, appen ber dig fylla i profilen |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
