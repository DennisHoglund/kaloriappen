[← Testplan](../index.md)

# TC-LIV-02 · Filen byggs sorterad på svenska och utan ogiltiga rader

| | |
|---|---|
| **Område** | Livsmedelsdata |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md D-07, US-06](../../specs/stories.md) |
| **Playwright** | [`tests/livsmedel.spec.js`](../../tests/livsmedel.spec.js#L18) – *filen byggs sorterad på svenska och utan ogiltiga rader* |

## Förutsättningar

- Ingen (enhetstest)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Sök på ett livsmedel som börjar på Å, Ä eller Ö (T-08) | Listan sorteras med Å, Ä, Ö sist som i ett svenskt lexikon |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
