[← Testplan](../index.md)

# TC-BOK-09 · Ta bort ett recept efter bekräftelse

| | |
|---|---|
| **Område** | Receptbok |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-19 AC5](../../specs/stories.md) |
| **Playwright** | [`tests/receptbok.spec.js`](../../tests/receptbok.spec.js#L180) – *ta bort ett recept efter bekräftelse* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ändra → Ta bort receptet → Ta bort | Receptet försvinner ur receptboken |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
