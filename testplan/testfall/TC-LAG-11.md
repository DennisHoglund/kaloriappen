[← Testplan](../index.md)

# TC-LAG-11 · Hoppa över sparar inget

| | |
|---|---|
| **Område** | Laga mat |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-19 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/laga.spec.js`](../../tests/laga.spec.js#L204) – *Hoppa över sparar inget* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Logga en portion och tryck Hoppa över | Inget recept sparas, måltiden finns kvar |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
