[← Testplan](../index.md)

# TC-TEM-02 · Mörkt läge följer telefonens inställning

| | |
|---|---|
| **Område** | Tema |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md D-11](../../specs/stories.md) |
| **Playwright** | [`tests/tema.spec.js`](../../tests/tema.spec.js#L21) – *mörkt läge följer telefonens inställning* |

## Förutsättningar

- Temaknappen står på **Auto**

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Slå på mörkt läge i iPhone (Inställningar → Skärm och ljusstyrka) | Appen är mörkblå (#0E1430) och statusfältet smälter in |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
