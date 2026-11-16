[← Testplan](../index.md)

# TC-BOK-05 · Tom receptbok och fel vid hämtning

| | |
|---|---|
| **Område** | Receptbok |
| **Prioritet** | Låg |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-20](../../specs/stories.md) |
| **Playwright** | [`tests/receptbok.spec.js`](../../tests/receptbok.spec.js#L82) – *tom receptbok och fel vid hämtning* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Öppna tom receptbok | Tips om hur man sparar recept |
| 2 | Utan nät | Felmeddelande |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
