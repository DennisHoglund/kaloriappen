[← Testplan](../index.md)

# TC-LAG-09 · Spara i receptboken sparar receptet

| | |
|---|---|
| **Område** | Laga mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-19 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/laga.spec.js`](../../tests/laga.spec.js#L166) – *Spara i receptboken sparar receptet* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck Spara | Sparat i receptboken, knappen blir Ändra |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
