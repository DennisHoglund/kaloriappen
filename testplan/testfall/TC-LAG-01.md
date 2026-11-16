[← Testplan](../index.md)

# TC-LAG-01 · Ingredienser hittas på flera foton och går att ta bort

| | |
|---|---|
| **Område** | Laga mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-16 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/laga.spec.js`](../../tests/laga.spec.js#L29) – *ingredienser hittas på flera foton och går att ta bort* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Översikten → + Laga mat → Fota ingredienser, välj två bilder | Ingredienserna visas som etiketter |
| 2 | Tryck × på Gul lök | Den försvinner |
| 3 | Fota fler | Nya ingredienser läggs till utan dubbletter |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
