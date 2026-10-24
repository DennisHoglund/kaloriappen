[← Testplan](../index.md)

# TC-FOT-02 · Bilden krymps innan den skickas

| | |
|---|---|
| **Område** | Fota mat |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-04, D-06](../../specs/stories.md) |
| **Playwright** | [`tests/foto.spec.js`](../../tests/foto.spec.js#L40) – *bilden krymps till högst 1024 px innan den skickas* |

## Förutsättningar

- Inloggad, Edge Function `kalori-analys` driftsatt (TC-ANA-07)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Fota med full upplösning | Analysen går snabbt även på mobilnät (bilden skickas som högst 1024 px) |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
