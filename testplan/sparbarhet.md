# Spårbarhet · Kaloriappen

Varje acceptanskriterium i [specs/stories.md](../specs/stories.md) och testfallen som verifierar det.
Genereras av `tests/sparbarhet.js` (`npm run testplan`). Redigera inte för hand.

| | |
|---|---|
| **Acceptanskriterier** | 38 |
| **Med testfall** | 38 |
| **Utan testfall** | 0 |


## US-01 Logga in

| AC | Kriterium | Testfall |
|---|---|---|
| AC1 | Given att jag inte är inloggad, When jag öppnar appen, Then visas inloggningssidan. | [TC-INL-01](testfall/TC-INL-01.md) 🤖 |
| AC2 | Given att jag är inloggad, When jag öppnar appen igen, Then kommer jag direkt till dagsöversikten. | [TC-INL-04](testfall/TC-INL-04.md) 🤖, [TC-INL-05](testfall/TC-INL-05.md) 🤖 |
| AC3 | Given två användare, When de loggar data, Then ser var och en bara sin egen data (RLS). | [TC-DB-01](testfall/TC-DB-01.md) 🖐️ |

## US-02 Profil

| AC | Kriterium | Testfall |
|---|---|---|
| AC1 | Given första inloggningen, When ingen profil finns, Then guidas jag till att fylla i profilen. | [TC-PRO-01](testfall/TC-PRO-01.md) 🤖 |
| AC2 | Given att profilen är sparad, When jag ändrar ett värde, Then räknas dagsmålet om direkt. | [TC-PRO-02](testfall/TC-PRO-02.md) 🤖, [TC-PRO-04](testfall/TC-PRO-04.md) 🤖 |

## US-03 Beräknat dagsmål

| AC | Kriterium | Testfall |
|---|---|---|
| AC1 | Given en ifylld profil, When målet beräknas, Then används BMR (Mifflin-St Jeor) × aktivitetsfaktor minus underskott för vald takt. | [TC-PRO-02](testfall/TC-PRO-02.md) 🤖 |
| AC2 | Given vald takt, Then kan takten väljas mellan 0,25 / 0,5 / 0,75 kg per vecka (max 1 % av kroppsvikten/vecka). | [TC-PRO-07](testfall/TC-PRO-07.md) 🤖 |
| AC3 | Given att beräknat mål blir lägre än en säker miniminivå, Then sätts målet till miniminivån (D-17: 1 500 kcal man / 1 200 kcal kvinna) och jag får en förklaring. | [TC-PRO-06](testfall/TC-PRO-06.md) 🤖 |

## US-04 Fota mat

| AC | Kriterium | Testfall |
|---|---|---|
| AC1 | Given dagsöversikten, When jag trycker "Fota", Then öppnas kameran (eller bildvalet). | [TC-FOT-01](testfall/TC-FOT-01.md) 🤖 |
| AC2 | Given en tagen bild, When analysen är klar, Then visas identifierade livsmedel med uppskattad mängd (g) och kcal per rad. | [TC-ANA-01](testfall/TC-ANA-01.md) 🤖, [TC-FOT-01](testfall/TC-FOT-01.md) 🤖 |
| AC3 | Given att analysen misslyckas eller tar för lång tid, Then får jag ett tydligt felmeddelande och kan logga manuellt i stället. | [TC-ANA-03](testfall/TC-ANA-03.md) 🤖, [TC-ANA-04](testfall/TC-ANA-04.md) 🤖, [TC-FOT-06](testfall/TC-FOT-06.md) 🤖, [TC-FOT-07](testfall/TC-FOT-07.md) 🤖 |
| AC4 | Given analysen, Then anropas AI:n via en server-funktion så att ingen API-nyckel finns i klienten. | [TC-ANA-02](testfall/TC-ANA-02.md) 🤖, [TC-ANA-07](testfall/TC-ANA-07.md) 🖐️ |

## US-05 Justera och bekräfta

| AC | Kriterium | Testfall |
|---|---|---|
| AC1 | Given en uppskattning, When jag ändrar mängd, Then räknas kcal om proportionellt. | [TC-FOT-03](testfall/TC-FOT-03.md) 🤖 |
| AC2 | Given en uppskattning, When jag tar bort eller lägger till en rad, Then uppdateras summan. | [TC-FOT-04](testfall/TC-FOT-04.md) 🤖 |
| AC3 | Given att jag trycker "Spara", Then loggas måltiden med tidpunkt och måltidstyp (frukost/lunch/middag/mellanmål). | [TC-FOT-05](testfall/TC-FOT-05.md) 🤖, [TC-IDA-08](testfall/TC-IDA-08.md) 🤖, [TC-SOK-04](testfall/TC-SOK-04.md) 🤖, [TC-SOK-05](testfall/TC-SOK-05.md) 🤖 |
| AC4 | Given en fotobaserad måltid, When den sparas, Then sparas en miniatyr (max ca 30 kB) som visas på posten i loggen. | [TC-FOT-05](testfall/TC-FOT-05.md) 🤖, [TC-FOT-08](testfall/TC-FOT-08.md) 🤖 |

## US-06 Manuell sökning

| AC | Kriterium | Testfall |
|---|---|---|
| AC1 | Given sökfältet, When jag skriver minst 2 tecken, Then visas matchande livsmedel med kcal/100 g. | [TC-SOK-01](testfall/TC-SOK-01.md) 🤖, [TC-SOK-02](testfall/TC-SOK-02.md) 🤖, [TC-SOK-10](testfall/TC-SOK-10.md) 🤖 |
| AC2 | Given ett valt livsmedel, When jag anger mängd i gram, Then visas kcal och det kan sparas. | [TC-SOK-03](testfall/TC-SOK-03.md) 🤖, [TC-SOK-04](testfall/TC-SOK-04.md) 🤖, [TC-SOK-11](testfall/TC-SOK-11.md) 🤖 |
| AC3 | Given ett livsmedel jag loggat tidigare, Then visas det under "Senaste" för snabbval. | [TC-SOK-06](testfall/TC-SOK-06.md) 🤖 |

## US-07 Dagsöversikt

| AC | Kriterium | Testfall |
|---|---|---|
| AC1 | Given dagens loggar, Then visas summa kcal, dagsmål och kvar att äta. | [TC-IDA-01](testfall/TC-IDA-01.md) 🤖, [TC-IDA-04](testfall/TC-IDA-04.md) 🤖, [TC-IDA-05](testfall/TC-IDA-05.md) 🤖 |
| AC2 | Given dagens loggar, Then visas de grupperade per måltidstyp. | [TC-IDA-02](testfall/TC-IDA-02.md) 🤖 |
| AC3 | Given att jag bläddrar bakåt, Then kan jag se tidigare dagar. | [TC-IDA-03](testfall/TC-IDA-03.md) 🤖 |

## US-08 Redigera och ta bort

| AC | Kriterium | Testfall |
|---|---|---|
| AC1 | Given en loggad post, When jag ändrar mängd, Then uppdateras kcal och dagssumman. | [TC-RED-01](testfall/TC-RED-01.md) 🤖, [TC-RED-02](testfall/TC-RED-02.md) 🤖, [TC-RED-03](testfall/TC-RED-03.md) 🤖 |
| AC2 | Given en loggad post, When jag tar bort den och bekräftar, Then försvinner den från summan. | [TC-RED-04](testfall/TC-RED-04.md) 🤖, [TC-RED-05](testfall/TC-RED-05.md) 🤖, [TC-RED-06](testfall/TC-RED-06.md) 🤖 |

## US-09 Logga vikt

| AC | Kriterium | Testfall |
|---|---|---|
| AC1 | Given vikt-sidan, When jag anger vikt för dagens datum, Then sparas den (en mätning per dag, ny ersätter gammal). | [TC-VIK-01](testfall/TC-VIK-01.md) 🤖 |
| AC2 | Given en ny vikt, Then uppdateras profilens aktuella vikt och dagsmålet räknas om. | [TC-PRO-03](testfall/TC-PRO-03.md) 🤖, [TC-VIK-02](testfall/TC-VIK-02.md) 🤖 |

## US-10 Viktgraf

| AC | Kriterium | Testfall |
|---|---|---|
| AC1 | Given minst 2 mätningar, Then visas en linjegraf med vikt över tid och en linje för målvikt. | [TC-VIK-03](testfall/TC-VIK-03.md) 🤖, [TC-VIK-06](testfall/TC-VIK-06.md) 🤖 |
| AC2 | Given grafen, Then kan jag välja period: 30 dagar / 90 dagar / allt. | [TC-VIK-04](testfall/TC-VIK-04.md) 🤖 |
| AC3 | Given grafen, Then visas ett glidande medelvärde (7 dagar) så att dagliga svängningar jämnas ut. | [TC-VIK-03](testfall/TC-VIK-03.md) 🤖, [TC-VIK-05](testfall/TC-VIK-05.md) 🤖 |

## US-11 Logga träning

| AC | Kriterium | Testfall |
|---|---|---|
| AC1 | Given träningsvyn, When jag väljer typ, Then kan jag välja styrketräning, löpning, promenad eller cykling. | [TC-TRA-04](testfall/TC-TRA-04.md) 🤖 |
| AC2 | Given styrketräning, When jag loggar, Then anger jag tid i minuter och valfri kommentar. | [TC-TRA-05](testfall/TC-TRA-05.md) 🤖 |
| AC3 | Given löpning, promenad eller cykling, When jag loggar, Then anger jag tid i minuter och sträcka i km, och tempo (min/km) eller hastighet (km/h för cykling) räknas ut och visas. | [TC-TRA-03](testfall/TC-TRA-03.md) 🤖, [TC-TRA-04](testfall/TC-TRA-04.md) 🤖, [TC-TRA-06](testfall/TC-TRA-06.md) 🤖 |
| AC4 | Given en loggad träning, Then kan jag ändra eller ta bort den. | [TC-TRA-08](testfall/TC-TRA-08.md) 🤖 |

## US-12 Uppskattad förbränning

| AC | Kriterium | Testfall |
|---|---|---|
| AC1 | Given en loggad träning, Then uppskattas kcal med MET-värde × min vikt (kg) × tid (h), där MET beror på typ och, för löpning och cykling, på tempo. | [TC-TRA-01](testfall/TC-TRA-01.md) 🤖, [TC-TRA-02](testfall/TC-TRA-02.md) 🤖, [TC-TRA-04](testfall/TC-TRA-04.md) 🤖 |
| AC2 | Given dagsöversikten, Then visas dagens träning och brända kcal separat, märkt som uppskattning. | [TC-TRA-07](testfall/TC-TRA-07.md) 🤖 |
| AC3 | Given brända kcal, Then ändras **inte** dagsmålet eller "kvar att äta" (D-13). | [TC-TRA-07](testfall/TC-TRA-07.md) 🤖 |

## US-13 Träningshistorik

| AC | Kriterium | Testfall |
|---|---|---|
| AC1 | Given träningsvyn, Then visas veckans pass med total tid per typ och total sträcka. | [TC-TRA-13](testfall/TC-TRA-13.md) 🤖 |
| AC2 | Given historiken, Then kan jag bläddra bakåt vecka för vecka. | [TC-TRA-14](testfall/TC-TRA-14.md) 🤖 |

## Testfall som gäller hela storyn

- US-04: [TC-ANA-05](testfall/TC-ANA-05.md) 🤖, [TC-FOT-02](testfall/TC-FOT-02.md) 🤖, [TC-FOT-05](testfall/TC-FOT-05.md) 🤖, [TC-FOT-13](testfall/TC-FOT-13.md) 🖐️
- US-03: [TC-BER-01](testfall/TC-BER-01.md) 🤖, [TC-BER-02](testfall/TC-BER-02.md) 🤖, [TC-BER-03](testfall/TC-BER-03.md) 🤖, [TC-BER-04](testfall/TC-BER-04.md) 🤖, [TC-BER-05](testfall/TC-BER-05.md) 🤖, [TC-BER-06](testfall/TC-BER-06.md) 🤖
- US-08: [TC-FOT-09](testfall/TC-FOT-09.md) 🤖, [TC-RED-07](testfall/TC-RED-07.md) 🤖, [TC-RED-08](testfall/TC-RED-08.md) 🤖
- US-05: [TC-FOT-11](testfall/TC-FOT-11.md) 🤖, [TC-FOT-13](testfall/TC-FOT-13.md) 🖐️
- US-07: [TC-IDA-09](testfall/TC-IDA-09.md) 🤖
- US-01: [TC-INL-02](testfall/TC-INL-02.md) 🤖, [TC-INL-03](testfall/TC-INL-03.md) 🤖, [TC-INL-06](testfall/TC-INL-06.md) 🤖, [TC-INL-07](testfall/TC-INL-07.md) 🤖, [TC-INL-08](testfall/TC-INL-08.md) 🖐️
- US-06: [TC-LIV-01](testfall/TC-LIV-01.md) 🤖, [TC-LIV-02](testfall/TC-LIV-02.md) 🤖, [TC-LIV-03](testfall/TC-LIV-03.md) 🤖, [TC-SOK-07](testfall/TC-SOK-07.md) 🤖, [TC-SOK-08](testfall/TC-SOK-08.md) 🤖, [TC-SOK-12](testfall/TC-SOK-12.md) 🤖, [TC-SOK-13](testfall/TC-SOK-13.md) 🤖
- US-02: [TC-PRO-03](testfall/TC-PRO-03.md) 🤖, [TC-PRO-05](testfall/TC-PRO-05.md) 🤖, [TC-PRO-08](testfall/TC-PRO-08.md) 🤖, [TC-PRO-09](testfall/TC-PRO-09.md) 🤖
- US-11: [TC-TRA-09](testfall/TC-TRA-09.md) 🤖, [TC-TRA-10](testfall/TC-TRA-10.md) 🤖
- US-13: [TC-TRA-12](testfall/TC-TRA-12.md) 🤖, [TC-TRA-15](testfall/TC-TRA-15.md) 🤖
- US-09: [TC-VIK-07](testfall/TC-VIK-07.md) 🤖, [TC-VIK-08](testfall/TC-VIK-08.md) 🤖
- US-10: [TC-VIK-09](testfall/TC-VIK-09.md) 🤖, [TC-VIK-10](testfall/TC-VIK-10.md) 🤖
