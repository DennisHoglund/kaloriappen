[← Testplan](../index.md)

# TC-DB-03 · Databasen hålls vaken

| | |
|---|---|
| **Område** | Databas |
| **Prioritet** | Hög |
| **Typ** | 🖐️ Manuell |
| **Krav** | [specs/stories.md D-28](../../specs/stories.md) |
| **Automatiskt** | `tests/schema.sh` kontrollerar att anon kan anropa `kalori_keepalive()` och att den svarar `ok` |

## Förutsättningar

- `schema.sql` körd efter 2026-11-18 i Jaktvinds projekt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | GitHub → kaloriappen → **Actions** → **Håll databasen vaken** → **Run workflow** | Jobbet blir grönt och loggen visar `Svar: "ok"` |
| 2 | Titta på Actions efter några dagar | Jobbet har körts av sig självt varannan dag, grönt |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
