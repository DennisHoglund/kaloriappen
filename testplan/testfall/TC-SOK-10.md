[← Testplan](../index.md)

# TC-SOK-10 · Träffar i början av namnet kommer först

| | |
|---|---|
| **Område** | Logga mat |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-06 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/sokning.spec.js`](../../tests/sokning.spec.js#L17) – *träffar i början av namnet kommer först* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Sök `ris` | Livsmedel som börjar på "Ris" visas före sådana där ris finns mitt i |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
