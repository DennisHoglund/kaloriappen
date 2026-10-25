[← Testplan](../index.md)

# TC-TRA-18 · Löpband: ogiltig hastighet eller lutning stoppas

| | |
|---|---|
| **Område** | Träning |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-11 AC5](../../specs/stories.md) |
| **Playwright** | [`tests/traning.spec.js`](../../tests/traning.spec.js#L151) – *löpband: ogiltig hastighet eller lutning stoppas* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-10-25 (ny typ och kolumn)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ange hastighet 12 eller lutning 20 | Tydligt meddelande, inget sparas |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
