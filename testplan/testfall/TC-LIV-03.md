[← Testplan](../index.md)

# TC-LIV-03 · Den sparade livsmedelsfilen är komplett och rimlig

| | |
|---|---|
| **Område** | Livsmedelsdata |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md D-07, US-06](../../specs/stories.md) |
| **Playwright** | [`tests/livsmedel.spec.js`](../../tests/livsmedel.spec.js#L28) – *den sparade livsmedelsfilen är komplett och rimlig* |

## Förutsättningar

- `data/livsmedel.json` finns (skapas av arbetsflödet Uppdatera livsmedel)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | GitHub → **Actions** → **Uppdatera livsmedel** → **Run workflow** | Körningen blir grön. Om något ändrats kommer en commit "Livsmedelsdata uppdaterad från Livsmedelsverket" |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
