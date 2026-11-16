[← Testplan](../index.md)

# TC-LAG-02 · Ingredienser kan skrivas in för hand

| | |
|---|---|
| **Område** | Laga mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-16 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/laga.spec.js`](../../tests/laga.spec.js#L48) – *ingredienser kan skrivas in för hand* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Skriv "citron, dill" och tryck + Lägg till | Båda läggs till, dubbletter hoppas över |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
