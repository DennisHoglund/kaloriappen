[← Testplan](../index.md)

# TC-REF-01 · Ingredienser hittas på en eller flera bilder

| | |
|---|---|
| **Område** | Recept (Edge Function) |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-16 AC1, D-25](../../specs/stories.md) |
| **Playwright** | [`tests/recept-funktion.spec.js`](../../tests/recept-funktion.spec.js#L35) – *ingredienser hittas på en eller flera bilder* |

## Förutsättningar

- Funktionen testas i Node med låtsas-Gemini

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Skicka två bilder med uppgift ingredienser | Gemini får båda bilderna, svaret blir en lista utan dubbletter |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
