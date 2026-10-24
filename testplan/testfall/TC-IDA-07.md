[← Testplan](../index.md)

# TC-IDA-07 · Ett dygn räknas i svensk tid

| | |
|---|---|
| **Område** | Dagsöversikt |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md D-15](../../specs/stories.md) |
| **Playwright** | [`tests/berakning.spec.js`](../../tests/berakning.spec.js#L57) – *ett dygn räknas i svensk tid, även när sommartiden slutar* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Natten mellan 24 och 25 oktober (sommartiden slutar) | Dygnet är 25 timmar, inget hamnar fel |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
