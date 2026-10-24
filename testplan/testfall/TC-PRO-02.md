[← Testplan](../index.md)

# TC-PRO-02 · Dagsmålet visas direkt medan man fyller i

| | |
|---|---|
| **Område** | Profil |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-02 AC2, US-03 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/profil.spec.js`](../../tests/profil.spec.js#L33) – *dagsmålet visas direkt medan man fyller i* |

## Förutsättningar

- Profilformuläret öppet

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Fyll i alla fält | **Ditt dagsmål** visas direkt med underhåll och underskott |
| 2 | Byt takt | Dagsmålet ändras direkt |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
