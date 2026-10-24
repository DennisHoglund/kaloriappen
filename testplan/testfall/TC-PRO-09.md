[← Testplan](../index.md)

# TC-PRO-09 · Sparfel behåller det man fyllt i

| | |
|---|---|
| **Område** | Profil |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-02, D-09](../../specs/stories.md) |
| **Playwright** | [`tests/profil.spec.js`](../../tests/profil.spec.js#L104) – *sparfel behåller det man fyllt i* |

## Förutsättningar

- Profilformuläret ifyllt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Slå på flygplansläge och tryck **Spara** | Felmeddelande, formuläret är kvar ifyllt |
| 2 | Slå av flygplansläge och tryck **Spara** igen | Sparas och dagsmålet visas |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
