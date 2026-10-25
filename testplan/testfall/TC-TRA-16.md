[← Testplan](../index.md)

# TC-TRA-16 · Gång på löpband: MET från hastighet och lutning

| | |
|---|---|
| **Område** | Träning |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-12 AC1, D-23](../../specs/stories.md) |
| **Playwright** | [`tests/berakning.spec.js`](../../tests/berakning.spec.js#L128) – *gång på löpband: MET från hastighet och lutning (ACSM)* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-10-25 (ny typ och kolumn)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Räkna för hand med ACSM: 5 km/h, 10 % | (3,5 + 8,33 + 15,0) / 3,5 ≈ 7,7 MET |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
