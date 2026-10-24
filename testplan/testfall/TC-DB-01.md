[← Testplan](../index.md)

# TC-DB-01 · Databasschemat körs i Supabase

| | |
|---|---|
| **Område** | Databas |
| **Prioritet** | Hög |
| **Typ** | 🖐️ Manuell |
| **Krav** | [specs/plan.md avsnitt 4](../../specs/plan.md), US-01 AC3 |
| **Automatiskt** | Rättigheter och regler testas i CI av `tests/schema.sh` mot en tom Postgres |

## Förutsättningar

- Inloggad på supabase.com i Jaktvinds projekt (samma som Svampkartan)

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Öppna **SQL Editor** → **New query**, klistra in hela `supabase/schema.sql` och tryck **Run** | "Success. No rows returned" |
| 2 | Tryck **Run** en gång till | Samma resultat, inga fel (filen går att köra om) |
| 3 | Öppna **Table Editor** | Tabellerna `kalori_profil`, `kalori_vikt`, `kalori_maltid`, `kalori_maltid_rad` och `kalori_traning` finns, alla märkta **RLS enabled** |
| 4 | Kontrollera de andra apparnas tabeller | `logg`, `platser` och `svamp_fynd` finns kvar och är orörda |
| 5 | Öppna **Storage** | Bucketen `kalori-foton` finns och är **Private** |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
