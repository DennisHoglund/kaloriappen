# Testplan · Kaloriappen

Testfall för Kaloriappen som docs-as-code. Varje testfall har steg-för-steg-instruktioner så att det kan köras manuellt på telefonen.
Automatiserade testfall körs dessutom av Playwright vid varje commit och är kopplade via sitt ID.

| | |
|---|---|
| **Testfall** | 31 |
| **Automatiserade** | 29 (körs på iPhone/WebKit och Android/Chromium) |
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

## Profil

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-PRO-01](testfall/TC-PRO-01.md) | [Ny användare guidas till profilen](testfall/TC-PRO-01.md) | Hög | 🤖 |
| [TC-PRO-02](testfall/TC-PRO-02.md) | [Dagsmålet visas direkt medan man fyller i](testfall/TC-PRO-02.md) | Hög | 🤖 |
| [TC-PRO-03](testfall/TC-PRO-03.md) | [Spara sparar profil och startvikt och visar dagsmålet](testfall/TC-PRO-03.md) | Hög | 🤖 |
| [TC-PRO-04](testfall/TC-PRO-04.md) | [Ändra profil räknar om dagsmålet](testfall/TC-PRO-04.md) | Hög | 🤖 |
| [TC-PRO-05](testfall/TC-PRO-05.md) | [Avbryt lämnar profilen oförändrad](testfall/TC-PRO-05.md) | Medel | 🤖 |
| [TC-PRO-06](testfall/TC-PRO-06.md) | [För lågt mål sätts till golvet med förklaring](testfall/TC-PRO-06.md) | Hög | 🤖 |
| [TC-PRO-07](testfall/TC-PRO-07.md) | [För hög takt sänks till 1 % av vikten med förklaring](testfall/TC-PRO-07.md) | Hög | 🤖 |
| [TC-PRO-08](testfall/TC-PRO-08.md) | [Ogiltiga värden stoppas innan något sparas](testfall/TC-PRO-08.md) | Medel | 🤖 |
| [TC-PRO-09](testfall/TC-PRO-09.md) | [Sparfel behåller det man fyllt i](testfall/TC-PRO-09.md) | Medel | 🤖 |

## Beräkning

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-BER-01](testfall/TC-BER-01.md) | [Ålder räknas från födelsedatum](testfall/TC-BER-01.md) | Medel | 🤖 |
| [TC-BER-02](testfall/TC-BER-02.md) | [BMR enligt Mifflin-St Jeor](testfall/TC-BER-02.md) | Hög | 🤖 |
| [TC-BER-03](testfall/TC-BER-03.md) | [Dagsmål med underskott för vald takt](testfall/TC-BER-03.md) | Hög | 🤖 |
| [TC-BER-04](testfall/TC-BER-04.md) | [Takten begränsas till 1 % av kroppsvikten](testfall/TC-BER-04.md) | Hög | 🤖 |
| [TC-BER-05](testfall/TC-BER-05.md) | [Dagsmålet går aldrig under golvet](testfall/TC-BER-05.md) | Hög | 🤖 |
| [TC-BER-06](testfall/TC-BER-06.md) | [Ofullständig profil ger inget dagsmål](testfall/TC-BER-06.md) | Medel | 🤖 |

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
