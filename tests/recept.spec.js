// Enhetstester för recept.js: skala mängder, sök, filter, sortering och matchning (T-22).
const { test, expect } = require('@playwright/test');
const R = require('../recept.js');

const r = (namn, o = {}) => ({ id: namn, namn, portioner: 4, kcal_portion: 500, betyg: null, antal_lagad: 0, senast_lagad: null, anteckning: '', ingredienser: [], ...o });
const BOK = [
  r('Kycklinggryta med paprika', { betyg: 4, antal_lagad: 3, senast_lagad: '2026-10-20', kcal_portion: 520, anteckning: 'Mer chili nästa gång',
    ingredienser: [{ namn: 'Kycklingfilé', mangd: 600, enhet: 'g' }, { namn: 'Paprika', mangd: 2, enhet: 'st' }, { namn: 'Crème fraiche', mangd: 2, enhet: 'dl' }] }),
  r('Ugnsbakad lax', { betyg: 5, antal_lagad: 1, senast_lagad: '2026-10-22', kcal_portion: 430,
    ingredienser: [{ namn: 'Laxfilé', mangd: 500, enhet: 'g' }, { namn: 'Citron', mangd: 1, enhet: 'st' }] }),
  r('Pannkakor', { betyg: 3, antal_lagad: 6, senast_lagad: '2026-09-01', kcal_portion: 380,
    ingredienser: [{ namn: 'Ägg', mangd: 3, enhet: 'st' }, { namn: 'Mjölk', mangd: 6, enhet: 'dl' }] }),
  r('Omelett med paprika', { kcal_portion: 300, ingredienser: [{ namn: 'Ägg', mangd: 3, enhet: 'st' }, { namn: 'Röd paprika', mangd: 0.5, enhet: 'st' }] })
];
const namn = (l) => l.map((x) => x.namn);

test.describe('Recept – beräkningar', () => {
  test('mängder räknas om efter antal portioner och avrundas rimligt', { annotation: { type: 'testfall', description: 'TC-REC-01' } }, () => {
    const ing = BOK[0].ingredienser.concat({ namn: 'Salt', mangd: null, enhet: '' }, { namn: 'Mjöl', mangd: 1, enhet: 'msk' });
    expect(R.skala(ing, 4, 2)).toEqual([
      { namn: 'Kycklingfilé', mangd: 300, enhet: 'g' }, { namn: 'Paprika', mangd: 1, enhet: 'st' },
      { namn: 'Crème fraiche', mangd: 1, enhet: 'dl' }, { namn: 'Salt', mangd: null, enhet: '' }, { namn: 'Mjöl', mangd: 0.5, enhet: 'msk' }]);
    expect(R.skala(ing, 4, 3).map((i) => i.mangd)).toEqual([450, 1.5, 1.5, null, 1]); // 0,75 msk → 1
    expect(R.skala([{ namn: 'Smör', mangd: 30, enhet: 'g' }], 4, 3)[0].mangd).toBe(23);
    expect(R.skala([{ namn: 'Mjöl', mangd: 250, enhet: 'g' }], 4, 3)[0].mangd).toBe(190); // ≥ 100 g till närmaste 5
    expect(R.skala(ing, 4, 4)).toEqual(ing);
    expect(R.visaMangd(1.5, 'dl')).toBe('1,5 dl');
    expect(R.visaMangd(300, 'g')).toBe('300 g');
    expect(R.visaMangd(null, '')).toBe('efter smak');
    expect(R.visaMangd(2, 'st')).toBe('2 st');
  });

  test('sök på namn, ingredienser och anteckning oavsett versaler och accenter', { annotation: { type: 'testfall', description: 'TC-REC-02' } }, () => {
    expect(namn(R.sok(BOK, 'paprika'))).toEqual(['Kycklinggryta med paprika', 'Omelett med paprika']);
    expect(namn(R.sok(BOK, 'CREME'))).toEqual(['Kycklinggryta med paprika']);
    expect(namn(R.sok(BOK, 'agg mjolk'))).toEqual(['Pannkakor']);             // alla ord måste finnas
    expect(namn(R.sok(BOK, 'chili'))).toEqual(['Kycklinggryta med paprika']); // anteckningen
    expect(R.sok(BOK, 'lax tacos')).toEqual([]);
    expect(R.sok(BOK, '  ')).toHaveLength(4);
  });

  test('filter på betyg och sortering', { annotation: { type: 'testfall', description: 'TC-REC-03' } }, () => {
    expect(R.filtrera(BOK, 0)).toHaveLength(4);
    expect(namn(R.filtrera(BOK, 4))).toEqual(['Kycklinggryta med paprika', 'Ugnsbakad lax']);
    expect(namn(R.filtrera(BOK, 5))).toEqual(['Ugnsbakad lax']);
    expect(namn(R.sortera(BOK, 'betyg'))).toEqual(['Ugnsbakad lax', 'Kycklinggryta med paprika', 'Pannkakor', 'Omelett med paprika']);
    expect(namn(R.sortera(BOK, 'senast'))).toEqual(['Ugnsbakad lax', 'Kycklinggryta med paprika', 'Pannkakor', 'Omelett med paprika']);
    expect(namn(R.sortera(BOK, 'flest'))).toEqual(['Pannkakor', 'Kycklinggryta med paprika', 'Ugnsbakad lax', 'Omelett med paprika']);
    expect(namn(R.sortera(BOK, 'kcal'))).toEqual(['Omelett med paprika', 'Pannkakor', 'Ugnsbakad lax', 'Kycklinggryta med paprika']);
    expect(namn(BOK)[0]).toBe('Kycklinggryta med paprika'); // originalet ändras inte
  });

  test('receptboken matchas mot valda ingredienser', { annotation: { type: 'testfall', description: 'TC-REC-04' } }, () => {
    const m = R.matcha(BOK, ['Paprika', 'Kyckling', 'Gul lök']);
    expect(m.map((x) => [x.recept.namn, x.traffar])).toEqual([['Kycklinggryta med paprika', 2], ['Omelett med paprika', 1]]);
    expect(R.matcha(BOK, ['Ägg']).map((x) => x.recept.namn)).toEqual(['Pannkakor', 'Omelett med paprika']); // lika många träffar: bäst betyg först
    expect(R.matcha(BOK, [])).toEqual([]);
    expect(R.matcha(BOK, ['Banan'])).toEqual([]);
  });

  test('passar Kvar och stjärnor', { annotation: { type: 'testfall', description: 'TC-REC-05' } }, () => {
    expect(R.passarKvar(520, 980)).toBe(true);
    expect(R.passarKvar(520, 400)).toBe(false);
    expect(R.passarKvar(520, null)).toBeNull();
    expect(R.stjarnor(4)).toBe('★★★★☆');
    expect(R.stjarnor(null)).toBe('☆☆☆☆☆');
    // Vikt per portion för loggningen: g, kg, ml, dl och l räknas, övrigt hoppas över
    expect(R.gramPerPortion(BOK[0].ingredienser, 4)).toBe(200);   // (600 g + 2 dl) / 4
    expect(R.gramPerPortion([{ namn: 'Ägg', mangd: 3, enhet: 'st' }], 1)).toBe(350); // går inte att räkna → standard
    expect(R.gramPerPortion([{ namn: 'Ris', mangd: 1.2, enhet: 'kg' }], 3)).toBe(400);
  });
});
