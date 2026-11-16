[← Testplan](../index.md)

# TC-LAG-12 · Fel vid loggning visar meddelande och inget sparas

| | |
|---|---|
| **Område** | Laga mat |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-18 AC3](../../specs/stories.md) |
| **Playwright** | [`tests/laga.spec.js`](../../tests/laga.spec.js#L215) – *fel vid loggning visar meddelande och inget sparas* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Logga utan nät | Kunde inte logga, inget sparas |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
