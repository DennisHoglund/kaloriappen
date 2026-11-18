[← Testplan](../index.md)

# TC-BIL-01 · Tryck på bilden visar den stora bilden i helskärm

| | |
|---|---|
| **Område** | Matfoto i helskärm |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-21 AC1, D-29](../../specs/stories.md) |
| **Playwright** | [`tests/bildvisare.spec.js`](../../tests/bildvisare.spec.js#L18) – *tryck på bilden visar den stora bilden i helskärm* |

## Förutsättningar

- Inloggad. `schema.sql` körd efter 2026-11-18. Måltid fotad med appen version 1.4 eller senare

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck på fotot i dagsöversikten | Bilden visas stort i helskärm, skarp |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
