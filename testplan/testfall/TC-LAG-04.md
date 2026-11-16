[← Testplan](../index.md)

# TC-LAG-04 · Förslag visar kcal, tid, portioner, vad som saknas och om det passar Kvar

| | |
|---|---|
| **Område** | Laga mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-17 AC1–2](../../specs/stories.md) |
| **Playwright** | [`tests/laga.spec.js`](../../tests/laga.spec.js#L74) – *förslag visar kcal, tid, portioner, vad som saknas och om det passar Kvar* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck Föreslå rätter | 3–4 rätter med kcal/portion, tid, portioner, Saknas och märket Passar Kvar eller Över Kvar |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
