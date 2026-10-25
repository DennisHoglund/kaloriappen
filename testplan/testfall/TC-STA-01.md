[← Testplan](../index.md)

# TC-STA-01 · Dagens status: gränserna

| | |
|---|---|
| **Område** | Dagens status |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-14 AC1–2, D-24](../../specs/stories.md) |
| **Playwright** | [`tests/berakning.spec.js`](../../tests/berakning.spec.js#L140) – *dagens status: i mål, under, för lite, över och inget loggat* |

## Förutsättningar

- Inloggad med profil och några dagars loggad mat

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | (Enhetstest) | 90–105 % i mål, under 90 % men minst golvet under målet, under golvet för lite, över 105 % över målet, ingen mat inget loggat |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
