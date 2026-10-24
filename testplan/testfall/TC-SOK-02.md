[← Testplan](../index.md)

# TC-SOK-02 · Sökningen bryr sig inte om versaler och accenter

| | |
|---|---|
| **Område** | Logga mat |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-06 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/sokning.spec.js`](../../tests/sokning.spec.js#L8) – *sökningen bryr sig inte om versaler och accenter och klarar flera ord* |

## Förutsättningar

- Inloggad med profil

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Sök `agg` | **Ägg kokt** hittas |
| 2 | Sök `kyckling kokt` | Bara kokt kyckling visas (alla ord måste finnas) |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
