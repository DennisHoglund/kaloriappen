[← Testplan](../index.md)

# TC-PRO-07 · För hög takt sänks till 1 % av vikten med förklaring

| | |
|---|---|
| **Område** | Profil |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-03 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/profil.spec.js`](../../tests/profil.spec.js#L85) – *för hög takt sänks till 1 % av vikten med förklaring* |

## Förutsättningar

- Profilformuläret öppet

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ange vikt 60 kg och takt 0,75 kg/v | Förklaringen **Takten är sänkt till 0,6 kg/vecka** visas |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
