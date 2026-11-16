[← Testplan](../index.md)

# TC-LAG-07 · Valt förslag blir ett recept och portionerna räknar om mängderna

| | |
|---|---|
| **Område** | Laga mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-18 AC1–2](../../specs/stories.md) |
| **Playwright** | [`tests/laga.spec.js`](../../tests/laga.spec.js#L129) – *valt förslag blir ett recept och portionerna räknar om mängderna* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck på ett förslag | Recept med ingredienser, mängder och steg |
| 2 | Tryck + två gånger | Mängderna dubblas, kcal per portion är oförändrad |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
