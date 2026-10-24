# Kaloriappen – User stories

Status: **v1.1** (2026-10-24) – stories med acceptanskriterier, granskade för luckor. Nästa steg: `plan.md` och `tasks.md`.

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
- **AC1** Given träningsvyn, When jag väljer typ, Then kan jag välja styrketräning, löpning, promenad eller cykling.
- **AC2** Given styrketräning, When jag loggar, Then anger jag tid i minuter och valfri kommentar.
- **AC3** Given löpning, promenad eller cykling, When jag loggar, Then anger jag tid i minuter och sträcka i km, och tempo (min/km) eller hastighet (km/h för cykling) räknas ut och visas.
- **AC4** Given en loggad träning, Then kan jag ändra eller ta bort den.

### US-12 Uppskattad förbränning
Som användare vill jag se ungefär hur mycket jag förbränt så att jag förstår vad träningen ger.
- **AC1** Given en loggad träning, Then uppskattas kcal med MET-värde × min vikt (kg) × tid (h), där MET beror på typ och, för löpning och cykling, på tempo.
- **AC2** Given dagsöversikten, Then visas dagens träning och brända kcal separat, märkt som uppskattning.
- **AC3** Given brända kcal, Then ändras **inte** dagsmålet eller "kvar att äta" (D-13).

### US-13 Träningshistorik
Som användare vill jag se min träning över tid så att jag ser om jag håller i det.
- **AC1** Given träningsvyn, Then visas veckans pass med total tid per typ och total sträcka.
- **AC2** Given historiken, Then kan jag bläddra bakåt vecka för vecka.

## Öppna frågor (❓)

Inga. Stories godkända som underlag för plan och tasks.
