// Enhetstester för berakning.js – rena funktioner, ingen webbläsare behövs.
const { test, expect } = require('@playwright/test');
const B = require('../berakning.js');

const DENNIS = { kon: 'man', viktKg: 92, langdCm: 182, fodelsedatum: '1980-05-01', aktivitet: 'latt', taktKgVecka: 0.5 };
const IDAG = '2026-10-24';

test.describe('Beräkning', () => {
  test('ålder räknas från födelsedatum och ändras på födelsedagen', { annotation: { type: 'testfall', description: 'TC-BER-01' } }, () => {
    expect(B.alder('1980-05-01', '2026-10-24')).toBe(46);
    expect(B.alder('1980-05-01', '2026-04-30')).toBe(45);
    expect(B.alder('1980-05-01', '2026-05-01')).toBe(46);
    expect(B.alder('2000-02-29', '2026-02-28')).toBe(25);
  });

  test('BMR enligt Mifflin-St Jeor för man och kvinna', { annotation: { type: 'testfall', description: 'TC-BER-02' } }, () => {
    expect(B.bmr({ kon: 'man', viktKg: 92, langdCm: 182, alder: 46 })).toBeCloseTo(1832.5, 1);
    expect(B.bmr({ kon: 'kvinna', viktKg: 70, langdCm: 165, alder: 40 })).toBeCloseTo(1370.25, 2);
  });

  test('dagsmål = underhåll minus underskott för vald takt, avrundat till 10', { annotation: { type: 'testfall', description: 'TC-BER-03' } }, () => {
    const r = B.dagsmal(DENNIS, IDAG);
    expect(r.underhall).toBeCloseTo(2519.7, 1);       // 1832,5 × 1,375 (lätt aktiv)
    expect(r.underskott).toBeCloseTo(550, 0);         // 0,5 kg × 7 700 / 7
    expect(r.mal).toBe(1970);
    expect(r.golv).toBe(false);
    expect(r.taktBegransad).toBe(false);
    // Högre aktivitet ger högre mål
    expect(B.dagsmal({ ...DENNIS, aktivitet: 'hog' }, IDAG).mal).toBeGreaterThan(r.mal);
  });

  test('takten begränsas till högst 1 % av kroppsvikten per vecka', { annotation: { type: 'testfall', description: 'TC-BER-04' } }, () => {
    const r = B.dagsmal({ ...DENNIS, viktKg: 60, taktKgVecka: 0.75 }, IDAG);
    expect(r.taktKgVecka).toBeCloseTo(0.6, 5);
    expect(r.taktBegransad).toBe(true);
    expect(r.underskott).toBeCloseTo(660, 0);
    expect(B.maxTakt(92)).toBeCloseTo(0.92, 5);
  });

  test('dagsmålet går aldrig under golvet 1 500 (man) / 1 200 (kvinna)', { annotation: { type: 'testfall', description: 'TC-BER-05' } }, () => {
    const kvinna = B.dagsmal({ kon: 'kvinna', viktKg: 50, langdCm: 160, fodelsedatum: '1966-01-01', aktivitet: 'stillasittande', taktKgVecka: 0.5 }, IDAG);
    expect(kvinna.mal).toBe(1200);
    expect(kvinna.golv).toBe(true);
    const man = B.dagsmal({ kon: 'man', viktKg: 58, langdCm: 165, fodelsedatum: '1950-01-01', aktivitet: 'stillasittande', taktKgVecka: 0.5 }, IDAG);
    expect(man.mal).toBe(1500);
    expect(man.golv).toBe(true);
    expect(B.GOLV).toEqual({ man: 1500, kvinna: 1200 });
  });

  test('ofullständig profil ger inget dagsmål', { annotation: { type: 'testfall', description: 'TC-BER-06' } }, () => {
    expect(B.dagsmal({ ...DENNIS, viktKg: null }, IDAG)).toBeNull();
    expect(B.dagsmal({ ...DENNIS, kon: 'annat' }, IDAG)).toBeNull();
    expect(B.dagsmal({ ...DENNIS, aktivitet: 'okand' }, IDAG)).toBeNull();
    expect(B.dagsmal({ ...DENNIS, fodelsedatum: '' }, IDAG)).toBeNull();
  });

  test('ett dygn räknas i svensk tid, även när sommartiden slutar', { annotation: { type: 'testfall', description: 'TC-IDA-07' } }, () => {
    expect(B.dygnUTC('2026-10-24')).toEqual(['2026-10-23T22:00:00.000Z', '2026-10-24T22:00:00.000Z']);
    expect(B.dygnUTC('2026-10-25')).toEqual(['2026-10-24T22:00:00.000Z', '2026-10-25T23:00:00.000Z']); // 25 timmar
    expect(B.dygnUTC('2026-03-29')).toEqual(['2026-03-28T23:00:00.000Z', '2026-03-29T22:00:00.000Z']); // 23 timmar
    expect(B.dygnUTC('2027-01-15')).toEqual(['2027-01-14T23:00:00.000Z', '2027-01-15T23:00:00.000Z']);
    expect(B.flyttaDag('2026-10-24', -1)).toBe('2026-10-23');
    expect(B.flyttaDag('2026-11-01', -1)).toBe('2026-10-31');
    expect(B.flyttaDag('2026-12-31', 1)).toBe('2027-01-01');
  });

  test('MET för träning: styrka, promenad, löpning efter tempo och cykling efter fart', { annotation: { type: 'testfall', description: 'TC-TRA-01' } }, () => {
    expect(B.met('styrka', 45)).toBe(5.0);
    expect(B.met('promenad', 60, 5)).toBe(3.5);
    expect(B.met('lopning', 60, 8)).toBeCloseTo(8.3, 1);     // 8 km/h (7:30 min/km)
    expect(B.met('lopning', 30, 5)).toBeCloseTo(10.0, 1);    // 10 km/h (6:00 min/km)
    expect(B.met('lopning', 60, 13)).toBeCloseTo(11.9, 1);   // 13 km/h
    expect(B.met('lopning', 60, 6)).toBe(6.0);               // lugn jogg under 8 km/h
    expect(B.met('lopning', 60, 20)).toBe(14.5);             // tak
    expect(B.met('cykling', 60, 15)).toBe(4.0);
    expect(B.met('cykling', 60, 18)).toBe(6.8);
    expect(B.met('cykling', 60, 21)).toBe(8.0);
    expect(B.met('cykling', 60, 24)).toBe(10.0);
    expect(B.met('cykling', 60, 30)).toBe(12.0);
    expect(B.met('okand', 30)).toBeNull();
  });

  test('förbränd energi = MET × vikt × timmar', { annotation: { type: 'testfall', description: 'TC-TRA-02' } }, () => {
    expect(B.forbranning({ typ: 'styrka', minuter: 45, viktKg: 92 })).toBe(345);          // 5 × 92 × 0,75
    expect(B.forbranning({ typ: 'promenad', minuter: 60, km: 5, viktKg: 92 })).toBe(322); // 3,5 × 92 × 1
    expect(B.forbranning({ typ: 'lopning', minuter: 30, km: 5, viktKg: 92 })).toBe(461);  // ≈ 10,0 × 92 × 0,5
    expect(B.forbranning({ typ: 'lopning', minuter: 30, viktKg: 92 })).toBeNull();        // löpning kräver sträcka
    expect(B.forbranning({ typ: 'styrka', minuter: 45, viktKg: null })).toBeNull();
  });

  test('tempo och fart räknas från tid och sträcka', { annotation: { type: 'testfall', description: 'TC-TRA-03' } }, () => {
    expect(B.tempo(30, 5.2)).toBe('5:46');
    expect(B.tempo(25, 5)).toBe('5:00');
    expect(B.tempo(59.5, 10)).toBe('5:57');
    expect(B.fart(60, 21.5)).toBe(21.5);
    expect(B.fart(45, 15)).toBe(20);
    expect(B.tempo(30, 0)).toBeNull();
  });

  test('glidande medel över 7 dagar jämnar ut dagliga svängningar', { annotation: { type: 'testfall', description: 'TC-VIK-05' } }, () => {
    const p = [
      { datum: '2026-10-01', vikt: 93.0 },
      { datum: '2026-10-03', vikt: 92.0 },
      { datum: '2026-10-05', vikt: 92.6 },
      { datum: '2026-10-07', vikt: 91.8 },  // 01–07: 93,0 92,0 92,6 91,8
      { datum: '2026-10-09', vikt: 91.6 }   // 03–09: 92,0 92,6 91,8 91,6 (01 faller bort)
    ];
    expect(B.glidandeMedel(p, 7).map((x) => x.medel)).toEqual([93.0, 92.5, 92.5, 92.4, 92.0]);
    expect(B.glidandeMedel([], 7)).toEqual([]);
    // osorterad indata sorteras
    expect(B.glidandeMedel([p[1], p[0]], 7).map((x) => x.datum)).toEqual(['2026-10-01', '2026-10-03']);
  });

  test('dagar mellan två datum', { annotation: { type: 'testfall', description: 'TC-VIK-10' } }, () => {
    expect(B.dagarMellan('2026-10-01', '2026-10-24')).toBe(23);
    expect(B.dagarMellan('2026-10-24', '2026-10-24')).toBe(0);
    expect(B.dagarMellan('2026-10-25', '2026-10-26')).toBe(1); // över sommartidsbytet
  });

  test('ISO-vecka med måndag som första dag', { annotation: { type: 'testfall', description: 'TC-TRA-12' } }, () => {
    expect(B.vecka('2026-10-24')).toEqual({ nummer: 43, start: '2026-10-19', slut: '2026-10-25' }); // lördag
    expect(B.vecka('2026-10-19')).toEqual({ nummer: 43, start: '2026-10-19', slut: '2026-10-25' }); // måndag
    expect(B.vecka('2026-10-25')).toEqual({ nummer: 43, start: '2026-10-19', slut: '2026-10-25' }); // söndag
    expect(B.vecka('2027-01-01')).toEqual({ nummer: 53, start: '2026-12-28', slut: '2027-01-03' }); // 2026 har vecka 53
    expect(B.vecka('2025-12-31')).toEqual({ nummer: 1, start: '2025-12-29', slut: '2026-01-04' });
  });

  test('gång på löpband: MET från hastighet och lutning (ACSM)', { annotation: { type: 'testfall', description: 'TC-TRA-16' } }, () => {
    // VO2 = 3,5 + 0,1·S + 1,8·S·G (S i m/min, G som andel), MET = VO2 / 3,5
    expect(B.met('lopband', 60, 5, 0)).toBeCloseTo(3.38, 2);    // 5 km/h plant
    expect(B.met('lopband', 60, 5, 10)).toBeCloseTo(7.67, 2);   // 5 km/h, 10 %
    expect(B.met('lopband', 60, 6, 12)).toBeCloseTo(10.03, 2);  // 6 km/h, 12 %
    expect(B.met('lopband', 60, 5)).toBeCloseTo(3.38, 2);       // utan lutning = plant
    expect(B.forbranning({ typ: 'lopband', minuter: 45, km: 4.125, lutning: 8, viktKg: 92 })).toBe(510); // 5,5 km/h, 8 %
    expect(B.forbranning({ typ: 'lopband', minuter: 45, km: 4.125, lutning: 0, viktKg: 92 })).toBeLessThan(300);
    expect(B.strackaFran(45, 5.5)).toBe(4.13);
    expect(B.strackaFran(30, 0)).toBeNull();
  });

  test('dagens status: i mål, under, för lite, över och inget loggat', { annotation: { type: 'testfall', description: 'TC-STA-01' } }, () => {
    const S = (atit, harMat = true) => B.dagStatus(atit, 1970, 1500, harMat);
    expect(S(1850)).toBe('i-mal');      // 94 %
    expect(S(1773)).toBe('i-mal');      // precis 90 %
    expect(S(2068)).toBe('i-mal');      // precis 105 %
    expect(S(2069)).toBe('over');
    expect(S(1700)).toBe('under');      // 86 %, över golvet
    expect(S(1500)).toBe('under');      // precis golvet räknas inte som för lite
    expect(S(1499)).toBe('for-lite');
    expect(S(0, false)).toBe('inget');
    expect(B.dagStatus(1000, 1200, 1200, true)).toBe('for-lite'); // kvinna med mål på golvet
    expect(B.dagStatus(1500, null, 1500, true)).toBeNull();        // inget mål
  });

  test('datum i svensk tid för en tidpunkt', { annotation: { type: 'testfall', description: 'TC-STA-02' } }, () => {
    expect(B.datumFor('2026-10-23T21:30:00Z')).toBe('2026-10-23'); // 23:30 fredag
    expect(B.datumFor('2026-10-23T22:30:00Z')).toBe('2026-10-24'); // 00:30 lördag
    expect(B.datumFor('2026-10-25T23:30:00Z')).toBe('2026-10-26'); // vintertid: 00:30 måndag
  });
});
