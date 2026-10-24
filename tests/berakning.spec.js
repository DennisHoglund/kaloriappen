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
});
