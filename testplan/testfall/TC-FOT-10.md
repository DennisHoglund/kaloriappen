[← Testplan](../index.md)

# TC-FOT-10 · Miniatyr som inte kan laddas upp stoppar inte sparningen

| | |
|---|---|
| **Område** | Fota mat |
| **Prioritet** | Låg |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md D-10](../../specs/stories.md) |
| **Playwright** | [`tests/foto.spec.js`](../../tests/foto.spec.js#L134) – *miniatyr som inte går att ladda upp stoppar inte sparningen* |

## Förutsättningar

- Inloggad, Edge Function `kalori-analys` driftsatt (TC-ANA-07)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | (Simuleras i test) | Måltiden sparas utan bild |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
