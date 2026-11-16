[← Testplan](../index.md)

# TC-DB-02 · Receptboken i databasen

| | |
|---|---|
| **Område** | Databas |
| **Prioritet** | Hög |
| **Typ** | 🖐️ Manuell |
| **Krav** | [specs/stories.md US-19 AC6, D-26](../../specs/stories.md) |
| **Automatiskt** | Rättigheter testas i CI av `tests/schema.sh`: var och en ser bara sina egna recept, anon får inget |

## Förutsättningar

- Inloggad på supabase.com i Jaktvinds projekt

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Kör hela `supabase/schema.sql` igen i SQL Editor | "Success. No rows returned" |
| 2 | Öppna **Table Editor** | `kalori_recept` finns och är märkt **RLS enabled** |
| 3 | Kontrollera de andra apparnas tabeller | Orörda |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
