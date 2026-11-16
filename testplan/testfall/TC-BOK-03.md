[← Testplan](../index.md)

# TC-BOK-03 · Filter på stjärnor

| | |
|---|---|
| **Område** | Receptbok |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-20 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/receptbok.spec.js`](../../tests/receptbok.spec.js#L57) – *filter på stjärnor* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Välj ★4+ och ★5 | Bara recept med minst det betyget |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
