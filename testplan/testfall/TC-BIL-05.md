[← Testplan](../index.md)

# TC-BIL-05 · Matfoto i helskärm på iPhone

| | |
|---|---|
| **Område** | Matfoto i helskärm |
| **Prioritet** | Hög |
| **Typ** | 🖐️ Manuell |
| **Krav** | [specs/stories.md US-21 AC1–3](../../specs/stories.md) |
| **Automatiskt** | Logiken är automattestad. Här testas pekgesterna, som bara finns på riktig skärm |

## Förutsättningar

- Inloggad. `schema.sql` körd efter 2026-11-18. Måltid fotad med appen version 1.4 eller senare

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Fota en måltid och spara | Miniatyren syns i översikten |
| 2 | Tryck på miniatyren | Skarp bild i helskärm |
| 3 | Nyp för att zooma, dubbeltryck | Zoomar |
| 4 | Dra nedåt | Bilden glider ner och stängs |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
