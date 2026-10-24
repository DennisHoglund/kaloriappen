const { test, expect, bild } = require('./hjalp');
const { inloggad, ANVANDARE } = require('./mock');

const U = ANVANDARE.id;
// Standardprofilen väger 92 kg och har dagsmål 1 970 kcal

async function oppnaTraning(page) {
  await page.getByRole('button', { name: '+ Logga träning' }).click();
  await expect(page.locator('#view-traning')).toBeVisible();
}
const valjTyp = (page, typ) => page.locator('#form-traning').getByText(typ, { exact: true }).click();

test.describe('Träning', () => {
  test('logga löpning med tid och sträcka visar tempo och förbränning', { annotation: { type: 'testfall', description: 'TC-TRA-04' } }, async ({ appen: page, api }) => {
    await oppnaTraning(page);
    await valjTyp(page, 'Löpning');
    await page.getByLabel('Tid (minuter)').fill('30');
    await page.getByLabel('Sträcka (km)').fill('5,2');
    await expect(page.locator('#tra-info')).toHaveText('Tempo 5:46 min/km');
    await expect(page.locator('#tra-kcal')).toHaveText('475');
    await bild(page, 'Logga löpning');
    await page.getByLabel('Kommentar (valfritt)').fill('Runt sjön');
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
    await expect(page.locator('#toast')).toHaveText('Löpning sparad (≈ 475 kcal)');
    expect(api.tabeller.kalori_traning).toEqual([expect.objectContaining({
      user_id: U, datum: '2026-10-24', typ: 'lopning', minuter: 30, km: 5.2, kommentar: 'Runt sjön', kcal: 475
    })]);
  });

  test('styrketräning loggas med bara tid', { annotation: { type: 'testfall', description: 'TC-TRA-05' } }, async ({ appen: page, api }) => {
    await oppnaTraning(page);
    await valjTyp(page, 'Styrka');
    await expect(page.locator('#tra-km-falt')).toBeHidden();
    await page.getByLabel('Tid (minuter)').fill('45');
    await expect(page.locator('#tra-kcal')).toHaveText('345');
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
    expect(api.tabeller.kalori_traning[0]).toMatchObject({ typ: 'styrka', minuter: 45, km: null, kcal: 345 });
  });

  test('cykling visar fart i km/h', { annotation: { type: 'testfall', description: 'TC-TRA-06' } }, async ({ appen: page }) => {
    await oppnaTraning(page);
    await valjTyp(page, 'Cykling');
    await page.getByLabel('Tid (minuter)').fill('60');
    await page.getByLabel('Sträcka (km)').fill('21,5');
    await expect(page.locator('#tra-info')).toHaveText('Fart 21,5 km/h');
    await expect(page.locator('#tra-kcal')).toHaveText('736'); // 8,0 × 92 × 1
  });

  test('träningen visas i dagsöversikten men ändrar inte kvar att äta', { annotation: { type: 'testfall', description: 'TC-TRA-07' } }, async ({ page, api }) => {
    api.tabeller.kalori_traning = [
      { id: 't1', user_id: U, datum: '2026-10-24', typ: 'lopning', minuter: 30, km: 5.2, kommentar: null, kcal: 473 },
      { id: 't2', user_id: U, datum: '2026-10-24', typ: 'styrka', minuter: 45, km: null, kommentar: 'Ben', kcal: 345 },
      { id: 't3', user_id: U, datum: '2026-10-23', typ: 'promenad', minuter: 60, km: 5, kommentar: null, kcal: 322 }
    ];
    await inloggad(page);
    await page.goto('./');
    await expect(page.locator('#ida-tra-summa')).toHaveText('≈ 818 kcal');
    await expect(page.locator('#ida-traning .rad-namn')).toHaveText(['Löpning', 'Styrketräning · Ben']);
    await expect(page.locator('#ida-traning .rad-gram').first()).toHaveText('30 min · 5,2 km · 5:46 /km');
    await expect(page.locator('#ida-kvar')).toHaveText('1 970'); // brända kcal räknas inte in (D-13)
    await bild(page, 'Träning i dagsöversikten');
    await page.getByRole('button', { name: 'Föregående dag' }).click();
    await expect(page.locator('#ida-traning .rad-namn')).toHaveText(['Promenad']);
  });

  test('ändra och ta bort ett pass', { annotation: { type: 'testfall', description: 'TC-TRA-08' } }, async ({ page, api }) => {
    api.tabeller.kalori_traning = [{ id: 't1', user_id: U, datum: '2026-10-24', typ: 'lopning', minuter: 30, km: 5.2, kommentar: null, kcal: 473 }];
    await inloggad(page);
    await page.goto('./');
    await page.getByRole('button', { name: /Ändra Löpning/ }).click();
    await expect(page.locator('#tra-rubrik')).toHaveText('Ändra träning');
    await expect(page.getByLabel('Tid (minuter)')).toHaveValue('30');
    await expect(page.getByLabel('Sträcka (km)')).toHaveValue('5,2');
    await page.getByLabel('Tid (minuter)').fill('28');
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#ida-traning .rad-gram')).toHaveText('28 min · 5,2 km · 5:23 /km');
    expect(api.tabeller.kalori_traning).toHaveLength(1);
    expect(api.tabeller.kalori_traning[0].minuter).toBe(28);
    await page.getByRole('button', { name: /Ändra Löpning/ }).click();
    await page.getByRole('button', { name: 'Ta bort' }).click();
    await expect(page.locator('#tra-fraga')).toHaveText('Ta bort löpning 28 min?');
    await page.locator('#tra-ja').click();
    // Texten finns alltid i sidan men är dold när det finns pass – kontrollera att den syns och att listan är tom
    await expect(page.locator('#ida-tra-tom')).toBeVisible();
    await expect(page.locator('#ida-traning li')).toHaveCount(0);
    expect(api.tabeller.kalori_traning).toHaveLength(0);
  });

  test('ogiltiga värden stoppas', { annotation: { type: 'testfall', description: 'TC-TRA-09' } }, async ({ appen: page, api }) => {
    await oppnaTraning(page);
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#tra-msg')).toHaveText('Välj typ av träning.');
    await valjTyp(page, 'Promenad');
    await page.getByLabel('Tid (minuter)').fill('0');
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#tra-msg')).toHaveText('Ange tiden i hela minuter (1–1 440).');
    await page.getByLabel('Tid (minuter)').fill('40');
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#tra-msg')).toHaveText('Ange sträckan i km (t.ex. 5,2).');
    expect(api.tabeller.kalori_traning).toHaveLength(0);
  });

  test('träning på en tidigare dag sparas på den dagen', { annotation: { type: 'testfall', description: 'TC-TRA-10' } }, async ({ appen: page, api }) => {
    await page.getByRole('button', { name: 'Föregående dag' }).click();
    await oppnaTraning(page);
    await valjTyp(page, 'Styrka');
    await page.getByLabel('Tid (minuter)').fill('50');
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#ida-datum')).toHaveText('Igår');
    await expect(page.locator('#ida-traning .rad-namn')).toHaveText(['Styrketräning']);
    expect(api.tabeller.kalori_traning[0].datum).toBe('2026-10-23');
  });

  test('sparfel behåller det man fyllt i', { annotation: { type: 'testfall', description: 'TC-TRA-11' } }, async ({ appen: page, api }) => {
    await oppnaTraning(page);
    await valjTyp(page, 'Styrka');
    await page.getByLabel('Tid (minuter)').fill('45');
    api.felVidSparning = true;
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#tra-msg')).toHaveText('Kunde inte spara. Kontrollera nätet och försök igen.');
    await expect(page.getByLabel('Tid (minuter)')).toHaveValue('45');
  });
});
