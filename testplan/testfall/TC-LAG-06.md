[← Testplan](../index.md)

# TC-LAG-06 · Recept ur receptboken som passar ingredienserna visas först

| | |
|---|---|
| **Område** | Laga mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-17 AC4](../../specs/stories.md) |
| **Playwright** | [`tests/laga.spec.js`](../../tests/laga.spec.js#L105) – *recept ur receptboken som passar ingredienserna visas först* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ha sparade recept, fota ingredienser | Från din receptbok visar recepten som passar, flest träffar och bäst betyg först |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
