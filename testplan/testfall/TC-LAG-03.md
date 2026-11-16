[← Testplan](../index.md)

# TC-LAG-03 · Misslyckad analys visar ett meddelande och man kan skriva in själv

| | |
|---|---|
| **Område** | Laga mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-16 AC3](../../specs/stories.md) |
| **Playwright** | [`tests/laga.spec.js`](../../tests/laga.spec.js#L59) – *misslyckad analys visar ett meddelande och man kan skriva in själv* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Fota något som inte är mat | Tydligt meddelande, det går att skriva in ingredienser |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
