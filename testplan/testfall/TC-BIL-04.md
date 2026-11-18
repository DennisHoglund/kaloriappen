[← Testplan](../index.md)

# TC-BIL-04 · Äldre måltid utan stor bild visar miniatyren, varje bild öppnar sin egen

| | |
|---|---|
| **Område** | Matfoto i helskärm |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-21 AC4, D-29](../../specs/stories.md) |
| **Playwright** | [`tests/bildvisare.spec.js`](../../tests/bildvisare.spec.js#L64) – *äldre måltid utan stor bild visar miniatyren, varje bild öppnar sin egen* |

## Förutsättningar

- Inloggad. `schema.sql` körd efter 2026-11-18. Måltid fotad med appen version 1.4 eller senare

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck på fotot av en måltid fotad före 2026-11-18 | Miniatyren visas, något suddig |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
