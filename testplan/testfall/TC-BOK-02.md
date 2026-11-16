[← Testplan](../index.md)

# TC-BOK-02 · Fritextsök i namn, ingredienser och anteckning

| | |
|---|---|
| **Område** | Receptbok |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [specs/stories.md US-20 AC1](../../specs/stories.md) |
| **Playwright** | [`tests/receptbok.spec.js`](../../tests/receptbok.spec.js#L41) – *fritextsök i namn, ingredienser och anteckning* |

## Förutsättningar

- Inloggad med profil. `schema.sql` körd efter 2026-11-16 och Edge Function `kalori-recept` driftsatt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Sök "creme", "vitlök chili", "artsoppa" | Rätt recept oavsett versaler och å, ä, ö |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
