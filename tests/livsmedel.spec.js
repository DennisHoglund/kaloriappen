// Tester för hämtningen av Livsmedelsverkets data och den sparade filen data/livsmedel.json.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { kcalPer100g, bygg } = require('../scripts/hamta-livsmedel.js');

const NARING = require('./data/naringsvarden-1.json');
const LISTA = require('./data/livsmedel-lista.json').livsmedel;

test.describe('Livsmedelsdata', () => {
  test('kcal per 100 g plockas ur Livsmedelsverkets näringsvärden', { annotation: { type: 'testfall', description: 'TC-LIV-01' } }, () => {
    expect(kcalPer100g(NARING)).toBe(884); // Nöt talg, riktigt svar från API:et
    expect(kcalPer100g(NARING.filter((n) => n.enhet !== 'kcal'))).toBeNull(); // bara kJ → inget värde
    expect(kcalPer100g([{ euroFIRkod: 'ENERC', enhet: 'kcal', varde: 50, viktGram: 50 }])).toBe(100);
    expect(kcalPer100g(null)).toBeNull();
  });

  test('filen byggs sorterad på svenska och utan ogiltiga rader', { annotation: { type: 'testfall', description: 'TC-LIV-02' } }, () => {
    const lista = [...LISTA, { nummer: 9001, namn: 'Ärtsoppa' }, { nummer: 9002, namn: 'Ägg' }, { nummer: 9003, namn: 'Öl' }, { nummer: 9004, namn: 'Ål' }, { nummer: 9005, namn: 'Saknar kcal' }];
    const kcal = new Map([[1, 884], [2, 800], [3, 900], [9001, 66], [9002, 140], [9003, 40], [9004, 230], [9006, 1]]);
    const d = bygg(lista, kcal, '2026-10-24');
    expect(d.kalla).toBe('Livsmedelsverkets livsmedelsdatabas');
    expect(d.licens).toBe('CC BY 4.0');
    expect(d.livsmedel.map((r) => r[1])).toEqual(['Gris ister', 'Gris späck', 'Nöt talg', 'Ål', 'Ägg', 'Ärtsoppa', 'Öl']);
    expect(d.antal).toBe(7);
  });

  test('den sparade livsmedelsfilen är komplett och rimlig', { annotation: { type: 'testfall', description: 'TC-LIV-03' } }, () => {
    const d = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'livsmedel.json'), 'utf8'));
    expect(d.kalla).toBe('Livsmedelsverkets livsmedelsdatabas');
    expect(d.antal).toBeGreaterThanOrEqual(2000);
    expect(d.livsmedel).toHaveLength(d.antal);
    for (const [nr, namn, kcal] of d.livsmedel) {
      expect(Number.isInteger(nr)).toBe(true);
      expect(typeof namn).toBe('string');
      expect(kcal).toBeGreaterThanOrEqual(0);
      expect(kcal).toBeLessThanOrEqual(1000);
    }
    const nummer = new Set(d.livsmedel.map((r) => r[0]));
    expect(nummer.size).toBe(d.antal); // inga dubbletter
    expect(fs.statSync(path.join(__dirname, '..', 'data', 'livsmedel.json')).size).toBeLessThan(250 * 1024);
  });
});
