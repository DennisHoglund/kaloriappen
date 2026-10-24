[← Testplan](../index.md)

# TC-GRU-02 · Manifestet beskriver en installerbar app

| | |
|---|---|
| **Område** | Grund |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/plan.md](../../specs/plan.md) |
| **Playwright** | [`tests/grund.spec.js`](../../tests/grund.spec.js#L15) – *manifestet beskriver en installerbar app* |

## Förutsättningar

- Safari på iPhone

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Öppna appen i Safari, tryck **Dela** → **Lägg till på hemskärmen** | Namnet **Kalorier** föreslås |
| 2 | Öppna appen från hemskärmen | Appen öppnas i helskärm utan Safaris adressfält |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
