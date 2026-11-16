[← Testplan](../index.md)

# TC-BOK-01 · Receptboken visar stjärnor, kcal, tid, antal gånger och anteckning

| | |
|---|---|
| **Område** | Receptbok |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-20 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/receptbok.spec.js`](../../tests/receptbok.spec.js#L28) – *receptboken visar stjärnor, kcal, tid, antal gånger och anteckning* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Översikten → Receptbok → | Recepten med stjärnor, kcal/portion, tid, lagad N ggr, senast och anteckning |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
