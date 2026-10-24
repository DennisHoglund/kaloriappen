[← Testplan](../index.md)

# TC-TRA-04 · Logga löpning med tempo och förbränning

| | |
|---|---|
| **Område** | Träning |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-11 AC1, AC3, US-12 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/traning.spec.js`](../../tests/traning.spec.js#L14) – *logga löpning med tid och sträcka visar tempo och förbränning* |

## Förutsättningar

- Inloggad med profil (vikten används för förbränningen)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck **+ Logga träning**, välj **Löpning**, ange tid och sträcka | Tempo och ≈ kcal visas direkt |
| 2 | Tryck **Spara** | Passet syns under **Träning** i dagsöversikten |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
