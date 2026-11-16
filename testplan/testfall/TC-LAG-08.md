[← Testplan](../index.md)

# TC-LAG-08 · Misslyckat recept kan försökas igen

| | |
|---|---|
| **Område** | Laga mat |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-18 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/laga.spec.js`](../../tests/laga.spec.js#L154) – *misslyckat recept kan försökas igen* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Receptet tar för lång tid | Meddelande och Försök igen |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
