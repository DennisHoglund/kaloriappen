[← Testplan](../index.md)

# TC-LAG-05 · Ge mig andra förslag ger nya rätter

| | |
|---|---|
| **Område** | Laga mat |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-17 AC3](../../specs/stories.md) |
| **Playwright** | [`tests/laga.spec.js`](../../tests/laga.spec.js#L96) – *Ge mig andra förslag ger nya rätter* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck Ge mig andra förslag | Nya rätter, inte samma som nyss |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
