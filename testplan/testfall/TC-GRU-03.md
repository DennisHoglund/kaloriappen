[← Testplan](../index.md)

# TC-GRU-03 · Alla filer i service workerns appskal finns

| | |
|---|---|
| **Område** | Grund |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/plan.md](../../specs/plan.md) |
| **Playwright** | [`tests/grund.spec.js`](../../tests/grund.spec.js#L24) – *alla filer i service workerns appskal finns* |

## Förutsättningar

- Ingen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Kör testet i CI | Varje fil i `SHELL` i `sw.js` svarar 200 |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
