[← Testplan](../index.md)

# TC-BOK-04 · Sortering på betyg, senast lagad, flest gånger och lägst kcal

| | |
|---|---|
| **Område** | Receptbok |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-20 AC3](../../specs/stories.md) |
| **Playwright** | [`tests/receptbok.spec.js`](../../tests/receptbok.spec.js#L72) – *sortering på betyg, senast lagad, flest gånger och lägst kcal* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Byt sortering | Ordningen ändras |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
