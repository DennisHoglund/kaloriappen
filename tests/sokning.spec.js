// Enhetstester för sökningen i livsmedel.js – ren funktion, ingen webbläsare.
const { test, expect } = require('@playwright/test');
const L = require('../livsmedel.js');
const LISTA = require('./data/livsmedel-fixtur.json').livsmedel;
const namn = (r) => r.map((x) => x[1]);

test.describe('Sökning', () => {
  test('sökningen bryr sig inte om versaler och accenter och klarar flera ord', { annotation: { type: 'testfall', description: 'TC-SOK-02' } }, () => {
    expect(namn(L.sok(LISTA, 'KYCKLING'))).toEqual(['Kyckling bröstfilé kokt u. skinn', 'Kyckling bröstfilé färsk stekt u. skinn']); // kortast först
    expect(namn(L.sok(LISTA, 'kyckling kokt'))).toEqual(['Kyckling bröstfilé kokt u. skinn']);
    expect(namn(L.sok(LISTA, 'agg'))).toEqual(['Ägg kokt']);         // ä hittas med a
    expect(namn(L.sok(LISTA, 'mjölk'))).toEqual(['Mjölk fett 3% berikad']);
    expect(L.sok(LISTA, 'k')).toEqual([]);                           // minst 2 tecken
    expect(L.sok(LISTA, '  ')).toEqual([]);
  });

  test('träffar i början av namnet kommer först', { annotation: { type: 'testfall', description: 'TC-SOK-10' } }, () => {
    // "havregryn" börjar både "Havregryn fullkorn" och "Havregrynsgröt"; "ris" finns i början av "Ris à la Malta"
    expect(namn(L.sok(LISTA, 'havregryn'))).toEqual(['Havregryn fullkorn', 'Havregrynsgröt fullkorn']);
    expect(namn(L.sok(LISTA, 'ris')).at(0)).toBe('Ris à la Malta m. grädde fett 40%');
    expect(L.sok(LISTA, 'a', 5)).toHaveLength(0);
    expect(L.sok(LISTA, 'fett')).toHaveLength(4);
    expect(L.sok(LISTA, 'fett', 2)).toHaveLength(2); // max antal träffar
  });

  test('kcal räknas från kcal per 100 g och gram', { annotation: { type: 'testfall', description: 'TC-SOK-11' } }, () => {
    expect(L.kcalFor(66, 250)).toBe(165);
    expect(L.kcalFor(136, 55)).toBe(74.8);
    expect(L.kcalFor(100, 0)).toBe(0);
  });
});
