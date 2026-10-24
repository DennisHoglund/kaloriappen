[← Testplan](../index.md)

# TC-PRO-04 · Ändra profil räknar om dagsmålet

| | |
|---|---|
| **Område** | Profil |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-02 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/profil.spec.js`](../../tests/profil.spec.js#L57) – *ändra profil räknar om dagsmålet* |

## Förutsättningar

- Profil finns

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck **Ändra profil** | Formuläret visas ifyllt, rubriken **Din profil** |
| 2 | Byt aktivitet och tryck **Spara** | Nytt dagsmål visas |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
