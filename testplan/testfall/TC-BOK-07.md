[← Testplan](../index.md)

# TC-BOK-07 · Allt i ett sparat recept går att ändra

| | |
|---|---|
| **Område** | Receptbok |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-19 AC4](../../specs/stories.md) |
| **Playwright** | [`tests/receptbok.spec.js`](../../tests/receptbok.spec.js#L117) – *allt i ett sparat recept går att ändra* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ändra namn, portioner, kcal, tid, betyg, anteckning, ingredienser och steg, Spara | Allt sparas och syns i receptet |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
