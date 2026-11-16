[← Testplan](../index.md)

# TC-BOK-06 · Sparat recept loggas igen: antal gånger och senast lagad uppdateras

| | |
|---|---|
| **Område** | Receptbok |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-19 AC2–3](../../specs/stories.md) |
| **Playwright** | [`tests/receptbok.spec.js`](../../tests/receptbok.spec.js#L93) – *sparat recept loggas igen: antal gånger och senast lagad uppdateras* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Öppna ett sparat recept och logga en portion | Lagad +1, senast lagad idag, betyget förvalt i Hur blev det? |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
