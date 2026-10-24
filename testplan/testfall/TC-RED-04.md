[← Testplan](../index.md)

# TC-RED-04 · Ta bort kräver bekräftelse

| | |
|---|---|
| **Område** | Ändra och ta bort |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-08 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/redigera.spec.js`](../../tests/redigera.spec.js#L53) – *ta bort kräver bekräftelse och avbryt behåller raden* |

## Förutsättningar

- Inloggad, minst en loggad måltid idag

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck **Ta bort** | Frågan **Ta bort …?** med Avbryt och Ta bort |
| 2 | Tryck **Avbryt** | Inget tas bort |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
