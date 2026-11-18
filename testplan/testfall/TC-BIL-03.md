[← Testplan](../index.md)

# TC-BIL-03 · Dubbeltryck zoomar in och ut

| | |
|---|---|
| **Område** | Matfoto i helskärm |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-21 AC3](../../specs/stories.md) |
| **Playwright** | [`tests/bildvisare.spec.js`](../../tests/bildvisare.spec.js#L50) – *dubbeltryck zoomar in och ut* |

## Förutsättningar

- Inloggad. `schema.sql` körd efter 2026-11-18. Måltid fotad med appen version 1.4 eller senare

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Dubbeltryck på bilden | Zoomar in |
| 2 | Dubbeltryck igen | Zoomar ut |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
