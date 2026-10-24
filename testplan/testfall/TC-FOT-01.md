[← Testplan](../index.md)

# TC-FOT-01 · Fotot analyseras och förslaget visas

| | |
|---|---|
| **Område** | Fota mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-04 AC1–2](../../specs/stories.md) |
| **Playwright** | [`tests/foto.spec.js`](../../tests/foto.spec.js#L26) – *fotot analyseras och förslaget visas med namn, gram och kcal* |

## Förutsättningar

- Inloggad, Edge Function `kalori-analys` driftsatt (TC-ANA-07)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck **Fota maten** och fota en tallrik | Snurra "Analyserar bilden …", sedan förslag med namn, gram och kcal per del och totalt |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
