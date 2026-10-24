[← Testplan](../index.md)

# TC-IDA-01 · Ätit, mål och kvar för dagen

| | |
|---|---|
| **Område** | Dagsöversikt |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-07 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/idag.spec.js`](../../tests/idag.spec.js#L32) – *visar ätit, mål och kvar för dagen* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Logga några livsmedel och gå till startsidan | Ätit = summan, Mål = dagsmålet, Kvar = mål − ätit. Stapeln fylls i motsvarande grad |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
