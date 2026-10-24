[← Testplan](../index.md)

# TC-FOT-12 · Foto från en tidigare dag sparas på den dagen

| | |
|---|---|
| **Område** | Fota mat |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md D-21](../../specs/stories.md) |
| **Playwright** | [`tests/foto.spec.js`](../../tests/foto.spec.js#L156) – *foto från en tidigare dag sparas på den dagen* |

## Förutsättningar

- Inloggad, Edge Function `kalori-analys` driftsatt (TC-ANA-07)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Bläddra till igår och fota | Måltiden hamnar på gårdagen |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
