const { test, expect, bild } = require('./hjalp');
const { inloggad, ANVANDARE } = require('./mock');

const U = ANVANDARE.id;
function pass(api) {
  api.tabeller.kalori_traning = [
    { id: 't1', user_id: U, datum: '2026-10-19', typ: 'lopning', minuter: 30, km: 5.2, kommentar: null, kcal: 475 },
    { id: 't2', user_id: U, datum: '2026-10-21', typ: 'styrka', minuter: 45, km: null, kommentar: 'Ben', kcal: 345 },
    { id: 't3', user_id: U, datum: '2026-10-23', typ: 'lopning', minuter: 50, km: 8.4, kommentar: null, kcal: 760 },
    { id: 't4', user_id: U, datum: '2026-10-24', typ: 'promenad', minuter: 60, km: 5, kommentar: null, kcal: 322 },
    { id: 't5', user_id: U, datum: '2026-10-14', typ: 'cykling', minuter: 90, km: 30, kommentar: null, kcal: 1104 }  // förra veckan
  ];
}
async function oppnaVecka(page, api) {
  pass(api);
  await inloggad(page);
  await page.goto('./');
  await page.getByRole('button', { name: 'Veckan →' }).click();
  await expect(page.locator('#view-vecka')).toBeVisible();
}

test.describe('Träning per vecka', () => {
  test('veckans pass med total tid, sträcka och tid per typ', { annotation: { type: 'testfall', description: 'TC-TRA-13' } }, async ({ page, api }) => {
    await oppnaVecka(page, api);
    await expect(page.locator('#vec-rubrik')).toHaveText('Vecka 43');
    await expect(page.locator('#vec-pass')).toHaveText('4');
    await expect(page.locator('#vec-tid')).toHaveText('3 h 5 min');
    await expect(page.locator('#vec-km')).toHaveText('18,6');
    await expect(page.locator('#vec-kcal')).toHaveText('≈ 1 902 kcal');
    await expect(page.locator('.vec-typ[data-typ="lopning"]')).toHaveText(/Löpning\s*2 pass · 1 h 20 min · 13,6 km/);
    await expect(page.locator('.vec-typ[data-typ="styrka"]')).toHaveText(/Styrketräning\s*1 pass · 45 min/);
    await expect(page.locator('#vec-lista li')).toHaveCount(4);
    await bild(page, 'Träning per vecka');
  });

  test('bläddra bakåt vecka för vecka', { annotation: { type: 'testfall', description: 'TC-TRA-14' } }, async ({ page, api }) => {
    await oppnaVecka(page, api);
    await expect(page.getByRole('button', { name: 'Nästa vecka' })).toBeDisabled();
    await page.getByRole('button', { name: 'Föregående vecka' }).click();
    await expect(page.locator('#vec-rubrik')).toHaveText('Vecka 42');
    await expect(page.locator('#vec-pass')).toHaveText('1');
    await expect(page.locator('.vec-typ[data-typ="cykling"]')).toContainText('30 km');
    await page.getByRole('button', { name: 'Föregående vecka' }).click();
    await expect(page.locator('#vec-rubrik')).toHaveText('Vecka 41');
    await expect(page.locator('#vec-tom')).toBeVisible();
    await page.getByRole('button', { name: 'Nästa vecka' }).click();
    await page.getByRole('button', { name: 'Nästa vecka' }).click();
    await expect(page.locator('#vec-rubrik')).toHaveText('Vecka 43');
  });

  test('tillbaka går till dagsöversikten', { annotation: { type: 'testfall', description: 'TC-TRA-15' } }, async ({ page, api }) => {
    await oppnaVecka(page, api);
    await page.getByRole('button', { name: '← Tillbaka' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
  });
});
