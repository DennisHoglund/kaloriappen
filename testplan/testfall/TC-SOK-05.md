[← Testplan](../index.md)

# TC-SOK-05 · Måltid föreslås efter tid på dagen

| | |
|---|---|
| **Område** | Logga mat |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-05 AC3](../../specs/stories.md) |
| **Playwright** | [`tests/logga-mat.spec.js`](../../tests/logga-mat.spec.js#L53) – *måltid föreslås efter tid på dagen* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Logga mat på morgonen, vid lunch, eftermiddag och kväll | Frukost före 10, lunch 10–14, mellanmål 14–17, middag 17–21, annars mellanmål. Går alltid att ändra |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
