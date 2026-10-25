[← Testplan](../index.md)

# TC-TRA-17 · Gång på löpband med hastighet och lutning

| | |
|---|---|
| **Område** | Träning |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-11 AC1, AC5, D-23](../../specs/stories.md) |
| **Playwright** | [`tests/traning.spec.js`](../../tests/traning.spec.js#L126) – *gång på löpband med hastighet och lutning räknar sträcka och förbränning* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-10-25 (ny typ och kolumn)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | **+ Logga träning** → **Gång på löpband**, ange tid, hastighet och lutning | Sträckan och ≈ kcal visas direkt. Högre lutning ger högre förbränning |
| 2 | Spara | Passet visas med hastighet, lutning och sträcka |
| 3 | Tryck på passet | Hastighet och lutning är ifyllda |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
