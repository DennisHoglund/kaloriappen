[← Testplan](../index.md)

# TC-REF-04 · Ogiltiga svar från modellen rensas

| | |
|---|---|
| **Område** | Recept (Edge Function) |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md D-25](../../specs/stories.md) |
| **Playwright** | [`tests/recept-funktion.spec.js`](../../tests/recept-funktion.spec.js#L79) – *ogiltiga svar från modellen rensas* |

## Förutsättningar

- Funktionen testas i Node med låtsas-Gemini

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Låt modellen svara med tomma namn, negativa kcal eller för många förslag | Ogiltiga rader tas bort, högst 4 förslag, tomt svar ger felkod 422 |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
