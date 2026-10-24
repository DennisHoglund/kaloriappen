# Testplan · Kaloriappen

Testfall för Kaloriappen som docs-as-code. Varje testfall har steg-för-steg-instruktioner så att det kan köras manuellt på telefonen.
Automatiserade testfall körs dessutom av Playwright vid varje commit och är kopplade via sitt ID.

| | |
|---|---|
| **Testfall** | 65 |
| **Automatiserade** | 63 (körs på iPhone/WebKit och Android/Chromium) |
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

## Dagsöversikt

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-IDA-01](testfall/TC-IDA-01.md) | [Ätit, mål och kvar för dagen](testfall/TC-IDA-01.md) | Hög | 🤖 |
| [TC-IDA-02](testfall/TC-IDA-02.md) | [Måltiderna grupperas per typ med summa](testfall/TC-IDA-02.md) | Hög | 🤖 |
| [TC-IDA-03](testfall/TC-IDA-03.md) | [Bläddra mellan dagar](testfall/TC-IDA-03.md) | Hög | 🤖 |
| [TC-IDA-04](testfall/TC-IDA-04.md) | [Ny måltid syns direkt](testfall/TC-IDA-04.md) | Hög | 🤖 |
| [TC-IDA-05](testfall/TC-IDA-05.md) | [Över målet visas tydligt](testfall/TC-IDA-05.md) | Medel | 🤖 |
| [TC-IDA-06](testfall/TC-IDA-06.md) | [Måltider kring midnatt hamnar på rätt dag](testfall/TC-IDA-06.md) | Medel | 🤖 |
| [TC-IDA-07](testfall/TC-IDA-07.md) | [Ett dygn räknas i svensk tid](testfall/TC-IDA-07.md) | Medel | 🤖 |
| [TC-IDA-08](testfall/TC-IDA-08.md) | [Lägg till från en måltid förväljer måltiden](testfall/TC-IDA-08.md) | Medel | 🤖 |
| [TC-IDA-09](testfall/TC-IDA-09.md) | [Loggning på en tidigare dag sparas på den dagen](testfall/TC-IDA-09.md) | Medel | 🤖 |
| [TC-IDA-10](testfall/TC-IDA-10.md) | [Fel vid hämtning ger begripligt meddelande](testfall/TC-IDA-10.md) | Låg | 🤖 |

## Ändra och ta bort

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-RED-01](testfall/TC-RED-01.md) | [Tryck på en rad öppnar den med mängden ifylld](testfall/TC-RED-01.md) | Hög | 🤖 |
| [TC-RED-02](testfall/TC-RED-02.md) | [Ändrad mängd räknar om kcal och sparas](testfall/TC-RED-02.md) | Hög | 🤖 |
| [TC-RED-03](testfall/TC-RED-03.md) | [AI-rader kan också ändras](testfall/TC-RED-03.md) | Medel | 🤖 |
| [TC-RED-04](testfall/TC-RED-04.md) | [Ta bort kräver bekräftelse](testfall/TC-RED-04.md) | Hög | 🤖 |
| [TC-RED-05](testfall/TC-RED-05.md) | [Ta bort en av flera rader behåller måltiden](testfall/TC-RED-05.md) | Hög | 🤖 |
| [TC-RED-06](testfall/TC-RED-06.md) | [Ta bort sista raden tar bort hela måltiden](testfall/TC-RED-06.md) | Medel | 🤖 |
| [TC-RED-07](testfall/TC-RED-07.md) | [Ogiltig mängd stoppas](testfall/TC-RED-07.md) | Medel | 🤖 |
| [TC-RED-08](testfall/TC-RED-08.md) | [Fel vid sparning eller borttagning behåller raden](testfall/TC-RED-08.md) | Medel | 🤖 |

## Logga mat

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-SOK-01](testfall/TC-SOK-01.md) | [Sökningen kräver minst 2 tecken](testfall/TC-SOK-01.md) | Hög | 🤖 |
| [TC-SOK-02](testfall/TC-SOK-02.md) | [Sökningen bryr sig inte om versaler och accenter](testfall/TC-SOK-02.md) | Hög | 🤖 |
| [TC-SOK-03](testfall/TC-SOK-03.md) | [Välj livsmedel och ange gram räknar ut kcal](testfall/TC-SOK-03.md) | Hög | 🤖 |
| [TC-SOK-04](testfall/TC-SOK-04.md) | [Spara loggar måltiden](testfall/TC-SOK-04.md) | Hög | 🤖 |
| [TC-SOK-05](testfall/TC-SOK-05.md) | [Måltid föreslås efter tid på dagen](testfall/TC-SOK-05.md) | Medel | 🤖 |
| [TC-SOK-06](testfall/TC-SOK-06.md) | [Senaste livsmedel visas för snabbval](testfall/TC-SOK-06.md) | Hög | 🤖 |
| [TC-SOK-07](testfall/TC-SOK-07.md) | [Ogiltig mängd stoppas](testfall/TC-SOK-07.md) | Medel | 🤖 |
| [TC-SOK-08](testfall/TC-SOK-08.md) | [Sparfel behåller valet](testfall/TC-SOK-08.md) | Medel | 🤖 |
| [TC-SOK-09](testfall/TC-SOK-09.md) | [Källan visas där livsmedel visas](testfall/TC-SOK-09.md) | Medel | 🤖 |
| [TC-SOK-10](testfall/TC-SOK-10.md) | [Träffar i början av namnet kommer först](testfall/TC-SOK-10.md) | Medel | 🤖 |
| [TC-SOK-11](testfall/TC-SOK-11.md) | [kcal räknas från kcal per 100 g och gram](testfall/TC-SOK-11.md) | Hög | 🤖 |
| [TC-SOK-12](testfall/TC-SOK-12.md) | [Tillbaka stänger utan att spara](testfall/TC-SOK-12.md) | Medel | 🤖 |
| [TC-SOK-13](testfall/TC-SOK-13.md) | [Livsmedlen kan inte laddas ger begripligt fel](testfall/TC-SOK-13.md) | Låg | 🤖 |

## Beräkning

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-BER-01](testfall/TC-BER-01.md) | [Ålder räknas från födelsedatum](testfall/TC-BER-01.md) | Medel | 🤖 |
| [TC-BER-02](testfall/TC-BER-02.md) | [BMR enligt Mifflin-St Jeor](testfall/TC-BER-02.md) | Hög | 🤖 |
| [TC-BER-03](testfall/TC-BER-03.md) | [Dagsmål med underskott för vald takt](testfall/TC-BER-03.md) | Hög | 🤖 |
| [TC-BER-04](testfall/TC-BER-04.md) | [Takten begränsas till 1 % av kroppsvikten](testfall/TC-BER-04.md) | Hög | 🤖 |
| [TC-BER-05](testfall/TC-BER-05.md) | [Dagsmålet går aldrig under golvet](testfall/TC-BER-05.md) | Hög | 🤖 |
| [TC-BER-06](testfall/TC-BER-06.md) | [Ofullständig profil ger inget dagsmål](testfall/TC-BER-06.md) | Medel | 🤖 |

## Livsmedelsdata

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-LIV-01](testfall/TC-LIV-01.md) | [kcal per 100 g plockas ur näringsvärdena](testfall/TC-LIV-01.md) | Hög | 🤖 |
| [TC-LIV-02](testfall/TC-LIV-02.md) | [Filen byggs sorterad på svenska och utan ogiltiga rader](testfall/TC-LIV-02.md) | Medel | 🤖 |
| [TC-LIV-03](testfall/TC-LIV-03.md) | [Den sparade livsmedelsfilen är komplett och rimlig](testfall/TC-LIV-03.md) | Hög | 🤖 |

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
