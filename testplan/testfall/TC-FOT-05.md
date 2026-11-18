[← Testplan](../index.md)

# TC-FOT-05 · Spara sparar måltid, rader och miniatyr

| | |
|---|---|
| **Område** | Fota mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-05 AC3–4, US-04, D-10, D-29](../../specs/stories.md) |
| **Playwright** | [`tests/foto.spec.js`](../../tests/foto.spec.js#L72) – *spara sparar måltid, rader, en miniatyr på högst 30 kB och en stor bild på högst 180 kB* |

## Förutsättningar

- Inloggad, Edge Function `kalori-analys` driftsatt (TC-ANA-07)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Välj måltid och tryck **Spara** | Dagsöversikten visar måltiden med en liten bild och alla rader |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
