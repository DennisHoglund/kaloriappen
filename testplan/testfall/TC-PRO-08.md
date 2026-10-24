[← Testplan](../index.md)

# TC-PRO-08 · Ogiltiga värden stoppas innan något sparas

| | |
|---|---|
| **Område** | Profil |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-02](../../specs/stories.md) |
| **Playwright** | [`tests/profil.spec.js`](../../tests/profil.spec.js#L91) – *ogiltiga värden stoppas innan något sparas* |

## Förutsättningar

- Profilformuläret öppet

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ange längd 50 och tryck **Spara** | **Längden ska vara mellan 100 och 250 cm.** Inget sparas |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
