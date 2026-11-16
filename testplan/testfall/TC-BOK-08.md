[← Testplan](../index.md)

# TC-BOK-08 · Ogiltiga värden när man ändrar stoppas

| | |
|---|---|
| **Område** | Receptbok |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-19 AC4](../../specs/stories.md) |
| **Playwright** | [`tests/receptbok.spec.js`](../../tests/receptbok.spec.js#L155) – *ogiltiga värden när man ändrar stoppas* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tomt namn, 0 portioner, 9 000 kcal, ingrediens utan namn | Tydligt meddelande, inget sparas |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
