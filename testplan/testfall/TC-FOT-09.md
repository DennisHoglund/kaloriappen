[← Testplan](../index.md)

# TC-FOT-09 · Ta bort sista raden tar bort miniatyren

| | |
|---|---|
| **Område** | Fota mat |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md D-10, US-08, D-29](../../specs/stories.md) |
| **Playwright** | [`tests/foto.spec.js`](../../tests/foto.spec.js#L130) – *ta bort sista raden tar bort miniatyren och den stora bilden* |

## Förutsättningar

- Inloggad, Edge Function `kalori-analys` driftsatt (TC-ANA-07)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ta bort alla rader i en fotomåltid | Måltiden och bilden försvinner |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
