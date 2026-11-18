# Kaloriappen – User stories

Status: **v1.6** (2026-11-18) – tillägg: håll databasen vaken (D-28). v1.5: recept (US-16–US-20, D-25–D-27).

## Beslut

| ID | Beslut |
|---|---|
| D-01 | iPhone-PWA på GitHub Pages, repo `kaloriappen` |
| D-02 | Kalorier tas fram via foto + AI-uppskattning, med möjlighet att justera och söka livsmedel manuellt |
| D-03 | Dagligt kalorimål beräknas utifrån profil och önskad viktminskningstakt |
| D-04 | Vikt loggas över tid och visas i graf mot målvikt |
| D-05 | Supabase: delar befintligt projekt (samma som Jaktvind/Svampkartan). Allt eget har prefixet `kalori_`, bucketen heter `kalori-foton` (se D-14) |
| D-06 | **0 kr extra i drift.** Bildanalys med Google Gemini Flash (gratisnivå) via Supabase Edge Function. Leverantören kapslas in så att den kan bytas |
| D-07 | Manuell sökning mot Livsmedelsverkets livsmedelsdatabas (gratis API, CC BY 4.0, källa anges i appen) |
| D-08 | Inga streckkoder |
| D-09 | v1 kräver nät. Offline-kö kan läggas till senare |
| D-10 | En liten miniatyr av matfotot (ca 20–30 kB) sparas i Supabase Storage och visas i loggen. Originalbilden sparas inte |
| D-11 | Design: **C · Blåbär**. Mörkt: bakgrund #0E1430, kort #182042, accent #8C9BFF. Ljust: bakgrund #F4F6FC, kort #FFFFFF, accent #4F5FD9. IBM Plex Sans, siffror i Plex Mono. Följer telefonen, temaknapp Auto/Ljust/Mörkt. Ikon: tre blåbär på mörkblå botten |
| D-12 | Träning loggas: styrketräning, löpning, promenad, cykling. Styrka = bara tid; löpning/promenad/cykling = tid + sträcka |
| D-13 | Brända kcal visas separat men ändrar **inte** dagsmålet |
| D-14 | Supabase: Jaktvinds projekt (delas med Svampkartan och Appspec). Tabellprefix `kalori_` i `public` i stället för eget schema, som i Svampkartan, så att API-inställningarna i det delade projektet inte behöver ändras. RLS på alla tabeller |
| D-15 | Ett dygn = 00:00–23:59 svensk tid (Europe/Stockholm). Svenskt talformat (decimalkomma, mellanslag som tusentalsavgränsare) |
| D-16 | Inloggning: e-post + lösenord (`signInWithPassword`), samma konto som i Svampkartan/Jaktvind |
| D-17 | Säker miniminivå för dagsmålet: 1 500 kcal (man) / 1 200 kcal (kvinna) |
| D-18 | Gemini gratisnivå accepteras, inklusive att Google kan använda matfotona |
| D-19 | Profilen lagrar födelsedatum; åldern räknas fram |
| D-20 | Sökningen ignorerar versaler och accenter (å/ä/ö hittas med a/o). Föreslagen måltid efter klockan: frukost före 10, lunch 10–14, mellanmål 14–17, middag 17–21, annars mellanmål |
| D-21 | Bläddrar man till en tidigare dag och loggar mat sparas måltiden den dagen kl 12 svensk tid. Logga ut ligger i profilen |
| D-22 | Bildanalys med Gemini Flash-Lite och minimalt tänkande (vanliga Flash var för långsam på gratisnivån). Träning byggs före vikt (T-15/T-16 före T-13/T-14) |
| D-23 | Ny träningstyp **Gång på löpband** (`lopband`): tid, hastighet (1–10 km/h) och lutning (0–15 %). Sträckan räknas ut (hastighet × tid). Förbränning med ACSM:s gångekvation, som tar hänsyn till både fart och lutning |
| D-24 | Dagens status för **avslutade dagar** (före idag): **I mål** 90–105 % av dagsmålet, **Under målet** under 90 % men minst golvet, **För lite** under golvet (1 500/1 200), **Över målet** över 105 %, **Inget loggat** om ingen mat loggats. I mål och Under målet räknas som "i mål" i veckan. Idag visas ingen status. Status räknas mot nuvarande dagsmål (historiska mål sparas inte). Över målet och För lite visas i gult, inte rött |
| D-25 | Recept skapas av Gemini Flash-Lite i en ny Edge Function `kalori-recept` med tre uppgifter: ingredienser från bilder, förslag på rätter och recept. Basvaror (salt, peppar, olja, smör, mjöl) antas finnas hemma. Svenska namn och svenska mått (g, dl, msk, tsk, st) |
| D-26 | Receptboken: ett recept sparas när man trycker Spara eller sätter betyg efter att ha loggat en portion. Ett betyg (1–5) per recept, går att ändra. Allt i ett sparat recept går att ändra. Egna recept utan AI byggs inte nu. Var och en har sin egen receptbok (RLS) |
| D-27 | Sökningen i receptboken görs i telefonen på alla användarens recept, med samma normalisering som livsmedelssökningen (versaler och accenter spelar ingen roll, alla ord måste finnas) |
| D-28 | Jaktvinds Supabase-projekt (gratis) pausas efter 7 dagar utan aktivitet. GitHub Actions (`hall-vaken.yml`) anropar funktionen `kalori_keepalive()` varannan dag. Den returnerar bara `ok` och är det enda `anon` får anropa. Det håller hela projektet vaket, även för Jaktvind och Svampkartan |

## Stories

### US-01 Logga in
Som användare vill jag logga in så att min data är privat och finns på alla enheter.
- **AC1** Given att jag inte är inloggad, When jag öppnar appen, Then visas inloggningssidan.
- **AC2** Given att jag är inloggad, When jag öppnar appen igen, Then kommer jag direkt till dagsöversikten.
- **AC3** Given två användare, When de loggar data, Then ser var och en bara sin egen data (RLS).

### US-02 Profil
Som användare vill jag ange vikt, längd, födelsedatum, kön, aktivitetsnivå, målvikt och önskad takt så att appen kan räkna ut mitt dagsmål.
- **AC1** Given första inloggningen, When ingen profil finns, Then guidas jag till att fylla i profilen.
- **AC2** Given att profilen är sparad, When jag ändrar ett värde, Then räknas dagsmålet om direkt.

### US-03 Beräknat dagsmål
Som användare vill jag få ett dagligt kalorimål så att jag går ner i vikt i vald takt.
- **AC1** Given en ifylld profil, When målet beräknas, Then används BMR (Mifflin-St Jeor) × aktivitetsfaktor minus underskott för vald takt.
- **AC2** Given vald takt, Then kan takten väljas mellan 0,25 / 0,5 / 0,75 kg per vecka (max 1 % av kroppsvikten/vecka).
- **AC3** Given att beräknat mål blir lägre än en säker miniminivå, Then sätts målet till miniminivån (D-17: 1 500 kcal man / 1 200 kcal kvinna) och jag får en förklaring.

### US-04 Fota mat
Som användare vill jag fota min mat så att kalorierna uppskattas utan att jag behöver söka.
- **AC1** Given dagsöversikten, When jag trycker "Fota", Then öppnas kameran (eller bildvalet).
- **AC2** Given en tagen bild, When analysen är klar, Then visas identifierade livsmedel med uppskattad mängd (g) och kcal per rad.
- **AC3** Given att analysen misslyckas eller tar för lång tid, Then får jag ett tydligt felmeddelande och kan logga manuellt i stället.
- **AC4** Given analysen, Then anropas AI:n via en server-funktion så att ingen API-nyckel finns i klienten.

### US-05 Justera och bekräfta
Som användare vill jag kunna rätta AI:ns uppskattning innan den sparas så att loggen blir rätt.
- **AC1** Given en uppskattning, When jag ändrar mängd, Then räknas kcal om proportionellt.
- **AC2** Given en uppskattning, When jag tar bort eller lägger till en rad, Then uppdateras summan.
- **AC3** Given att jag trycker "Spara", Then loggas måltiden med tidpunkt och måltidstyp (frukost/lunch/middag/mellanmål).
- **AC4** Given en fotobaserad måltid, When den sparas, Then sparas en miniatyr (max ca 30 kB) som visas på posten i loggen.

### US-06 Manuell sökning
Som användare vill jag söka efter ett livsmedel och ange mängd så att jag kan logga utan foto.
- **AC1** Given sökfältet, When jag skriver minst 2 tecken, Then visas matchande livsmedel med kcal/100 g.
- **AC2** Given ett valt livsmedel, When jag anger mängd i gram, Then visas kcal och det kan sparas.
- **AC3** Given ett livsmedel jag loggat tidigare, Then visas det under "Senaste" för snabbval.

### US-07 Dagsöversikt
Som användare vill jag se dagens intag mot mitt mål så att jag vet hur mycket jag har kvar.
- **AC1** Given dagens loggar, Then visas summa kcal, dagsmål och kvar att äta.
- **AC2** Given dagens loggar, Then visas de grupperade per måltidstyp.
- **AC3** Given att jag bläddrar bakåt, Then kan jag se tidigare dagar.

### US-08 Redigera och ta bort
Som användare vill jag ändra eller ta bort en loggad måltid så att felregistreringar kan rättas.
- **AC1** Given en loggad post, When jag ändrar mängd, Then uppdateras kcal och dagssumman.
- **AC2** Given en loggad post, When jag tar bort den och bekräftar, Then försvinner den från summan.

### US-09 Logga vikt
Som användare vill jag logga min vikt så att jag kan följa utvecklingen.
- **AC1** Given vikt-sidan, When jag anger vikt för dagens datum, Then sparas den (en mätning per dag, ny ersätter gammal).
- **AC2** Given en ny vikt, Then uppdateras profilens aktuella vikt och dagsmålet räknas om.

### US-10 Viktgraf
Som användare vill jag se en graf över min vikt så att jag ser trenden mot målvikten.
- **AC1** Given minst 2 mätningar, Then visas en linjegraf med vikt över tid och en linje för målvikt.
- **AC2** Given grafen, Then kan jag välja period: 30 dagar / 90 dagar / allt.
- **AC3** Given grafen, Then visas ett glidande medelvärde (7 dagar) så att dagliga svängningar jämnas ut.

### US-11 Logga träning
Som användare vill jag logga vad jag tränat och hur länge så att jag ser min aktivitet bredvid kosten.
- **AC1** Given träningsvyn, When jag väljer typ, Then kan jag välja styrketräning, löpning, promenad, cykling eller gång på löpband.
- **AC2** Given styrketräning, When jag loggar, Then anger jag tid i minuter och valfri kommentar.
- **AC3** Given löpning, promenad eller cykling, When jag loggar, Then anger jag tid i minuter och sträcka i km, och tempo (min/km) eller hastighet (km/h för cykling) räknas ut och visas.
- **AC4** Given en loggad träning, Then kan jag ändra eller ta bort den.
- **AC5** Given gång på löpband, When jag loggar, Then anger jag tid, hastighet (km/h) och lutning (%), och sträckan räknas ut och visas.

### US-12 Uppskattad förbränning
Som användare vill jag se ungefär hur mycket jag förbränt så att jag förstår vad träningen ger.
- **AC1** Given en loggad träning, Then uppskattas kcal med MET-värde × min vikt (kg) × tid (h), där MET beror på typ och, för löpning och cykling, på tempo. För gång på löpband räknas MET från hastighet och lutning.
- **AC2** Given dagsöversikten, Then visas dagens träning och brända kcal separat, märkt som uppskattning.
- **AC3** Given brända kcal, Then ändras **inte** dagsmålet eller "kvar att äta" (D-13).

### US-13 Träningshistorik
Som användare vill jag se min träning över tid så att jag ser om jag håller i det.
- **AC1** Given träningsvyn, Then visas veckans pass med total tid per typ och total sträcka.
- **AC2** Given historiken, Then kan jag bläddra bakåt vecka för vecka.

### US-14 Dagens status
Som användare vill jag se hur det gick en avslutad dag så att jag får återkoppling utan att räkna själv.
- **AC1** Given en avslutad dag med loggad mat, Then visas ett statusmärke med ätit av mål: I mål, Under målet, För lite eller Över målet enligt D-24.
- **AC2** Given en avslutad dag utan loggad mat, Then visas Inget loggat (inte Under målet).
- **AC3** Given idag, Then visas ingen status – Kvar gäller tills dagen är slut.
- **AC4** Given status För lite, Then visas en vänlig förklaring, och om dagen hade träning nämns den.
- **AC5** Given en avslutad dag med loggad mat där frukost, lunch eller middag saknas, Then visas "Inte loggat – glömde du logga?" för den måltiden.

### US-15 Veckan i dagsöversikten
Som användare vill jag se veckans dagar på en gång så att jag ser helheten och inte bara enskilda dagar.
- **AC1** Given dagsöversikten, Then visas veckans dagar (måndag–söndag) som prickar med symbol för status, idag som en tom ring och kommande dagar tomma.
- **AC2** Given veckan, Then visas hur många avslutade dagar med loggad mat som var i mål och snittet i kcal/dag mot dagsmålet.
- **AC3** Given en prick för en dag, When jag trycker på den, Then visas den dagen.

### US-16 Ingredienser från foto
Som användare vill jag fota det jag har hemma så att appen vet vilka ingredienser jag kan laga mat av.
- **AC1** Given Laga mat, When jag fotar en eller flera bilder, Then visas de ingredienser som hittades och var och en går att ta bort.
- **AC2** Given listan, When jag skriver in en ingrediens, Then läggs den till.
- **AC3** Given att analysen misslyckas, Then visas ett tydligt meddelande och jag kan skriva in ingredienserna själv.

### US-17 Förslag på rätter
Som användare vill jag få förslag på rätter av mina ingredienser så att jag vet vad jag kan laga.
- **AC1** Given minst en ingrediens, When jag ber om förslag, Then visas 3–4 rätter med namn, beskrivning, kcal per portion, tid, portioner och vad som saknas.
- **AC2** Given förslagen, Then visas om kcal per portion ryms i dagens Kvar (Passar Kvar eller Över Kvar).
- **AC3** Given förslagen, When jag ber om andra förslag, Then visas nya rätter som inte redan visats.
- **AC4** Given sparade recept som innehåller någon av ingredienserna, Then visas de först under Från din receptbok, flest matchande ingredienser och bäst betyg först.

### US-18 Recept och logga en portion
Som användare vill jag få ett recept på rätten jag valt och kunna logga det jag äter.
- **AC1** Given en rätt, When jag väljer den, Then visas ett recept med ingredienser och mängder, steg för steg, kcal per portion och tid.
- **AC2** Given ett recept, When jag ändrar antal portioner, Then räknas mängderna om och kcal per portion är oförändrad.
- **AC3** Given ett recept, When jag trycker Logga en portion, Then loggas en måltid med receptets namn och kcal per portion, med föreslagen måltid efter klockan.

### US-19 Receptbok
Som användare vill jag spara, betygsätta och ändra recept så att jag hittar mina favoriter igen.
- **AC1** Given ett recept, When jag trycker Spara i receptboken, Then sparas det i min receptbok.
- **AC2** Given att jag loggat en portion, Then frågar appen Hur blev det? med 1–5 stjärnor och anteckning. Spara betyg sparar receptet med betyget, Hoppa över sparar inget betyg.
- **AC3** Given ett sparat recept, When jag loggar en portion, Then ökar Lagad antal gånger och Senast lagad blir dagens datum.
- **AC4** Given ett sparat recept, When jag ändrar namn, beskrivning, portioner, kcal per portion, tid, ingredienser, steg, betyg eller anteckning och sparar, Then sparas ändringarna.
- **AC5** Given ett sparat recept, When jag tar bort det och bekräftar, Then försvinner det ur receptboken.
- **AC6** Given två användare, Then ser var och en bara sina egna recept.

### US-20 Sök i receptboken
Som användare vill jag söka och filtrera i receptboken så att jag snabbt hittar rätt recept.
- **AC1** Given receptboken, When jag skriver i sökfältet, Then visas recept där alla ord finns i namn, ingredienser eller anteckning, oavsett versaler och accenter.
- **AC2** Given receptboken, When jag väljer Alla, ★3+, ★4+ eller ★5, Then visas bara recept med minst det betyget.
- **AC3** Given receptboken, When jag väljer sortering, Then sorteras recepten på bäst betyg, senast lagad, flest gånger lagad eller lägst kcal.

## Öppna frågor (❓)

Inga. Stories godkända som underlag för plan och tasks.
