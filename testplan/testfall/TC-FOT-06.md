[← Testplan](../index.md)

# TC-FOT-06 · Slut på gratiskvot erbjuder manuell sökning

| | |
|---|---|
| **Område** | Fota mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-04 AC3](../../specs/stories.md) |
| **Playwright** | [`tests/foto.spec.js`](../../tests/foto.spec.js#L90) – *slut på gratiskvot visar meddelandet och erbjuder manuell sökning* |

## Förutsättningar

- Inloggad, Edge Function `kalori-analys` driftsatt (TC-ANA-07)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | När gratisanalyserna är slut för dagen | Meddelandet om kvoten och knappen **Sök manuellt i stället** |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
