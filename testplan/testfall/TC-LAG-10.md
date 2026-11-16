[← Testplan](../index.md)

# TC-LAG-10 · Logga en portion och sätt betyg sparar receptet i receptboken

| | |
|---|---|
| **Område** | Laga mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-18 AC3, US-19 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/laga.spec.js`](../../tests/laga.spec.js#L179) – *logga en portion och sätt betyg sparar receptet i receptboken* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck Logga en portion | Måltiden loggas med receptets namn och kcal, Hur blev det? visas |
| 2 | Välj 4 stjärnor, skriv anteckning, Spara betyg | Receptet sparas med betyg, lagad 1 gång |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
