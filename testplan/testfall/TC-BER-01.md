[← Testplan](../index.md)

# TC-BER-01 · Ålder räknas från födelsedatum

| | |
|---|---|
| **Område** | Beräkning |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-03](../../specs/stories.md), [plan.md avsnitt 5](../../specs/plan.md) |
| **Playwright** | [`tests/berakning.spec.js`](../../tests/berakning.spec.js#L9) – *ålder räknas från födelsedatum och ändras på födelsedagen* |

## Förutsättningar

- Enhetstest av `berakning.js`. Stegen nedan kontrolleras i appen när profilen finns (T-06).

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Ange ett födelsedatum i profilen dagen före din födelsedag och kontrollera dagsmålet | Ålder = antal fyllda år |
| 2 | Ändra datumet så att födelsedagen är idag | Åldern ökar med ett år och dagsmålet sjunker något |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
