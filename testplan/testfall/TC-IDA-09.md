[← Testplan](../index.md)

# TC-IDA-09 · Loggning på en tidigare dag sparas på den dagen

| | |
|---|---|
| **Område** | Dagsöversikt |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-07, D-21](../../specs/stories.md) |
| **Playwright** | [`tests/idag.spec.js`](../../tests/idag.spec.js#L109) – *loggning på en tidigare dag sparas på den dagen* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Bläddra till igår och lägg till något | Det hamnar på gårdagen (kl 12), inte idag |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
