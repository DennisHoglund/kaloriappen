[← Testplan](../index.md)

# TC-REF-02 · Förslag på rätter utifrån ingredienser, Kvar och redan visade rätter

| | |
|---|---|
| **Område** | Recept (Edge Function) |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-17 AC1–3, D-25](../../specs/stories.md) |
| **Playwright** | [`tests/recept-funktion.spec.js`](../../tests/recept-funktion.spec.js#L49) – *förslag på rätter utifrån ingredienser, Kvar och redan visade rätter* |

## Förutsättningar

- Funktionen testas i Node med låtsas-Gemini

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Be om förslag med ingredienser, Kvar 980 och en rätt att undvika | Prompten innehåller ingredienserna, 980 kcal, rätten som ska undvikas och basvarorna |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
