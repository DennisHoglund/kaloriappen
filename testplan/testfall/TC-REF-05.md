[← Testplan](../index.md)

# TC-REF-05 · Inloggning, felaktiga anrop, kvot och tidsgräns

| | |
|---|---|
| **Område** | Recept (Edge Function) |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md D-25](../../specs/stories.md) |
| **Playwright** | [`tests/recept-funktion.spec.js`](../../tests/recept-funktion.spec.js#L92) – *inloggning, felaktiga anrop, kvot och tidsgräns* |

## Förutsättningar

- Funktionen testas i Node med låtsas-Gemini

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Anropa utan inloggning, med fel indata, utan nyckel, vid kvot och vid tidsgräns | 401, 400, 500, 429 och 504. Nyckeln syns aldrig i svaret |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
