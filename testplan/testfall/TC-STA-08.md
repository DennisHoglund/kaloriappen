[← Testplan](../index.md)

# TC-STA-08 · Saknade måltider: glömde du logga?

| | |
|---|---|
| **Område** | Dagens status |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-14 AC5](../../specs/stories.md) |
| **Playwright** | [`tests/status.spec.js`](../../tests/status.spec.js#L81) – *saknade måltider på en avslutad dag: glömde du logga?* |

## Förutsättningar

- Inloggad med profil och några dagars loggad mat

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Bläddra till en dag med bara lunch loggad | Frukost och middag: **Inte loggat – glömde du logga?** (streckade). Idag frågas inte |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
