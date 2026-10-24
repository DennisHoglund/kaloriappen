# Testplan · Kaloriappen

Testfall för Kaloriappen som docs-as-code. Varje testfall har steg-för-steg-instruktioner så att det kan köras manuellt på telefonen.
Automatiserade testfall körs dessutom av Playwright vid varje commit och är kopplade via sitt ID.

| | |
|---|---|
| **Testfall** | 16 |
| **Automatiserade** | 14 (körs på iPhone/WebKit och Android/Chromium) |
| **Manuella** | 2 (kräver riktig iPhone eller riktig Supabase) |
| **Senaste testrapport** | [dennishoglund.github.io/kaloriappen/rapport/](https://dennishoglund.github.io/kaloriappen/rapport/) |
| **Krav** | [specs/stories.md](../specs/stories.md) |

**Typ:** 🤖 automatiserad · 🖐️ manuell  **Prioritet:** Hög = måste fungera, Medel = viktig, Låg = bekvämlighet

## Grund

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-GRU-01](testfall/TC-GRU-01.md) | [Appen startar utan fel](testfall/TC-GRU-01.md) | Hög | 🤖 |
| [TC-GRU-02](testfall/TC-GRU-02.md) | [Manifestet beskriver en installerbar app](testfall/TC-GRU-02.md) | Medel | 🤖 |
| [TC-GRU-03](testfall/TC-GRU-03.md) | [Alla filer i service workerns appskal finns](testfall/TC-GRU-03.md) | Medel | 🤖 |
| [TC-GRU-04](testfall/TC-GRU-04.md) | [Ikonerna finns i alla storlekar](testfall/TC-GRU-04.md) | Medel | 🤖 |

## Inloggning

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-INL-01](testfall/TC-INL-01.md) | [Inloggningen visas när man inte är inloggad](testfall/TC-INL-01.md) | Hög | 🤖 |
| [TC-INL-02](testfall/TC-INL-02.md) | [Fel lösenord ger tydligt felmeddelande](testfall/TC-INL-02.md) | Hög | 🤖 |
| [TC-INL-03](testfall/TC-INL-03.md) | [Ogiltig e-post stoppas innan något skickas](testfall/TC-INL-03.md) | Medel | 🤖 |
| [TC-INL-04](testfall/TC-INL-04.md) | [Rätt uppgifter loggar in](testfall/TC-INL-04.md) | Hög | 🤖 |
| [TC-INL-05](testfall/TC-INL-05.md) | [Inloggningen finns kvar efter omstart](testfall/TC-INL-05.md) | Hög | 🤖 |
| [TC-INL-06](testfall/TC-INL-06.md) | [Logga ut](testfall/TC-INL-06.md) | Medel | 🤖 |
| [TC-INL-07](testfall/TC-INL-07.md) | [Ingen kontakt med servern ger ett begripligt fel](testfall/TC-INL-07.md) | Medel | 🤖 |
| [TC-INL-08](testfall/TC-INL-08.md) | [Logga in med riktigt konto och Face ID](testfall/TC-INL-08.md) | Hög | 🖐️ |

## Tema

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-TEM-01](testfall/TC-TEM-01.md) | [Temaknappen växlar Auto → Ljust → Mörkt och sparar valet](testfall/TC-TEM-01.md) | Medel | 🤖 |
| [TC-TEM-02](testfall/TC-TEM-02.md) | [Mörkt läge följer telefonens inställning](testfall/TC-TEM-02.md) | Medel | 🤖 |
| [TC-TEM-03](testfall/TC-TEM-03.md) | [Ljust läge har Blåbär-färgerna](testfall/TC-TEM-03.md) | Medel | 🤖 |

## Databas

Rättigheter och regler i `supabase/schema.sql` testas automatiskt i CI av `tests/schema.sh` (17 kontroller mot en tom Postgres).

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-DB-01](testfall/TC-DB-01.md) | [Databasschemat körs i Supabase](testfall/TC-DB-01.md) | Hög | 🖐️ |
