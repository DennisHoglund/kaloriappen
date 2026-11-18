[← Testplan](../index.md)

# TC-BIL-02 · Stängs med ✕, tryck bredvid bilden och Esc

| | |
|---|---|
| **Område** | Matfoto i helskärm |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-21 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/bildvisare.spec.js`](../../tests/bildvisare.spec.js#L33) – *stängs med ✕, tryck bredvid bilden och Esc* |

## Förutsättningar

- Inloggad. `schema.sql` körd efter 2026-11-18. Måltid fotad med appen version 1.4 eller senare

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck ✕ | Stängs |
| 2 | Öppna igen och tryck på den svarta kanten | Stängs |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
