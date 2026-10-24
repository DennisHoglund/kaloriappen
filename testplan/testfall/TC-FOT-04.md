[← Testplan](../index.md)

# TC-FOT-04 · Ta bort och lägga till rader

| | |
|---|---|
| **Område** | Fota mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-05 AC2](../../specs/stories.md) |
| **Playwright** | [`tests/foto.spec.js`](../../tests/foto.spec.js#L59) – *ta bort och lägga till rader uppdaterar summan* |

## Förutsättningar

- Inloggad, Edge Function `kalori-analys` driftsatt (TC-ANA-07)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck **×** på en rad | Raden försvinner, totalen minskar |
| 2 | Tryck **+ Lägg till rad** och fyll i | Raden räknas in i totalen |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
