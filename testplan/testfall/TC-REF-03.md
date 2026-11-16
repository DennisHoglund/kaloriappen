[← Testplan](../index.md)

# TC-REF-03 · Recept med mängder och steg för vald rätt

| | |
|---|---|
| **Område** | Recept (Edge Function) |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-18 AC1, D-25](../../specs/stories.md) |
| **Playwright** | [`tests/recept-funktion.spec.js`](../../tests/recept-funktion.spec.js#L64) – *recept med mängder och steg för vald rätt* |

## Förutsättningar

- Funktionen testas i Node med låtsas-Gemini

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Be om recept för en vald rätt och 4 portioner | Receptet har ingredienser med mängd och enhet, steg, kcal per portion och tid |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
