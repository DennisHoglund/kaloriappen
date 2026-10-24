[← Testplan](../index.md)

# TC-TRA-07 · Träningen visas men ändrar inte kvar att äta

| | |
|---|---|
| **Område** | Träning |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-12 AC2–3, D-13](../../specs/stories.md) |
| **Playwright** | [`tests/traning.spec.js`](../../tests/traning.spec.js#L51) – *träningen visas i dagsöversikten men ändrar inte kvar att äta* |

## Förutsättningar

- Inloggad med profil (vikten används för förbränningen)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Logga träning och titta på dagsöversikten | **Träning** visar passen och ≈ kcal. **Kvar** är oförändrat |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
