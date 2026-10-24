[← Testplan](../index.md)

# TC-PRO-03 · Spara sparar profil och startvikt och visar dagsmålet

| | |
|---|---|
| **Område** | Profil |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-02, US-09 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/profil.spec.js`](../../tests/profil.spec.js#L43) – *spara sparar profil och startvikt och visar dagsmålet* |

## Förutsättningar

- Profilformuläret ifyllt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck **Spara** | Dagsmålet visas med vikt, målvikt och takt |
| 2 | Stäng och öppna appen | Samma dagsmål, profilen frågas inte igen |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
