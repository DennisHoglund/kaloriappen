[← Testplan](../index.md)

# TC-TRA-02 · Förbränd energi = MET × vikt × timmar

| | |
|---|---|
| **Område** | Träning |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-12 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/berakning.spec.js`](../../tests/berakning.spec.js#L83) – *förbränd energi = MET × vikt × timmar* |

## Förutsättningar

- Inloggad med profil (vikten används för förbränningen)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Räkna för hand: styrka 45 min, 92 kg | 5 × 92 × 0,75 = 345 kcal |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
