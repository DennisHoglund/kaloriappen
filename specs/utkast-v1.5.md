# Kaloriappen – utkast v1.5: fibrer och förslag på rätter

Status: **utkast** (2026-11-01). Väntar på gap-genomgång. Flyttas in i `stories.md` när stories är godkända och testfall finns,
eftersom `tests/sparbarhet.js` kräver testfall för varje acceptanskriterium där.

Underlag: DN/NYT-artikeln om fibrer (2026).

## Nya beslut

| ID | Beslut |
|---|---|
| D-25 | **Fibrer** loggas bredvid kcal på varje rad. Källa: Livsmedelsverkets värde för fibrer (EuroFIR `FIBT`) i manuell sökning och förslag, Geminis uppskattning för foto. Underlag: DN/NYT-artikeln om fibrer (2026) |
| D-26 | Fibermål: standard **25 g (kvinna) / 35 g (man)**, inom rekommenderade 21–38 g. Kan ändras i profilen. Fibermålet är vägledande – ingen status ”För lite” som för kcal |
| D-27 | Upptrappning (valfri): målet börjar på nuvarande snitt + 5 g och höjs 5 g per vecka tills fibermålet nås, för att undvika gaser och uppblåsthet |
| D-28 | Förslag på rätter är en **egen, kurerad lista** i tabellen `kalori_ratt` (gemensam, läsbar för inloggade, skrivs bara via `schema.sql`/seed). Näringsvärden räknas fram från ingredienser i Livsmedelsverkets data – inte AI-genererade. 0 kr extra |
| D-29 | Startlistan: ca 20 rätter, minst 4 per måltidstyp, alla minst 6 g fibrer per portion (mellanmål minst 3 g), byggda på artikelns tips (bönor/linser, fullkorn, bär, nötter, frön, avokado, hummus, fiberrika grönsaker) |

## Stories

### US-16 Fibrer i loggen
Som användare vill jag se hur mycket fibrer jag ätit så att jag kommer upp i rekommenderad mängd.
- **AC1** Given manuell sökning, Then visas fibrer/100 g bredvid kcal/100 g, och vald mängd ger fibrer i gram.
- **AC2** Given en fotoanalys, Then returnerar analysen uppskattade fibrer (g) per rad, och de kan justeras som kcal.
- **AC3** Given att jag ändrar mängd på en rad (US-05, US-08), Then räknas fibrer om proportionellt.
- **AC4** Given en rad som saknar fibervärde (t.ex. äldre loggar), Then räknas den som 0 g och dagssumman märks ”minst”.

### US-17 Fibermål i dagsöversikten
Som användare vill jag se dagens fibrer mot ett mål så att jag vet om jag behöver lägga till något.
- **AC1** Given dagsöversikten, Then visas dagens fibrer (g) mot fibermålet bredvid kcal.
- **AC2** Given profilen, Then kan jag ändra fibermålet (15–50 g); standard enligt D-26.
- **AC3** Given att jag slår på upptrappning, Then gäller veckans mål enligt D-27 och dagsöversikten visar ”vecka N av upptrappning”.
- **AC4** Given att jag är under fibermålet, Then visas ingen varning i gult/rött – bara hur många gram som är kvar (D-26).

### US-18 Förslag på hälsosamma rätter
Som användare vill jag bläddra bland fiberrika rätter så att jag får idéer på vad jag kan äta.
- **AC1** Given fliken Förslag, Then visas rätter grupperade per måltidstyp (frukost, lunch, mellanmål, middag), förvald efter klockan (D-20).
- **AC2** Given en rätt, Then visas namn, kort beskrivning, ingredienser med gram, kcal och fibrer per portion.
- **AC3** Given en rätt, When jag trycker ”Logga”, Then öppnas justera-vyn (US-05) med rättens ingredienser som rader, så att jag kan ändra mängd innan jag sparar.
- **AC4** Given förslagslistan, Then anges källan (Livsmedelsverket, CC BY 4.0) för näringsvärdena.

### US-19 Förslag som passar dagen
Som användare vill jag att förslagen tar hänsyn till hur dagen ser ut så att jag väljer rätt.
- **AC1** Given idag, Then markeras rätter som ryms i ”kvar att äta” och rätter som inte ryms tonas ned (döljs inte).
- **AC2** Given att dagens fibrer ligger under fibermålet, Then sorteras rätterna med mest fibrer per 100 kcal först.
- **AC3** Given en tidigare dag (bläddrat bakåt), Then sorteras listan som standard, utan markering.

## Öppna frågor (❓)


| ID | Fråga | Förslag |
|---|---|---|
| Q-01 | Ska fibrer visas som en egen ring/stapel eller som en rad under kcal? | En smal stapel under kcal-ringen |
| Q-02 | Ska fibrer räknas med i dagens status (US-14) eller veckan (US-15)? | Nej i v1.5 – bara visas. Kan läggas till senare |
| Q-03 | Ska rätterna kunna sparas som favoriter, eller egna rätter läggas till? | Senare (v1.6). Startlistan räcker för att prova |
| Q-04 | Ska upptrappning vara på som standard? | Av – slås på i profilen |
| Q-05 | Ska Gemini kunna ge ”fler idéer” utöver listan? | Inte i v1.5 (osäkra värden, drar på gratiskvoten) |
