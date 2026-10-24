const { test, expect, bild } = require('./hjalp');
const { ANVANDARE } = require('./mock');

async function oppnaSok(page) {
  await page.getByRole('button', { name: 'Logga mat' }).click();
  await expect(page.locator('#view-sok')).toBeVisible();
}

test.describe('Logga mat', () => {
  test('sökningen kräver minst 2 tecken', { annotation: { type: 'testfall', description: 'TC-SOK-01' } }, async ({ appen: page }) => {
    await oppnaSok(page);
    await expect(page.locator('#sok-tips')).toHaveText('Skriv minst 2 tecken.');
    await page.getByLabel('Sök livsmedel').fill('h');
    await expect(page.locator('.traff')).toHaveCount(0);
    await page.getByLabel('Sök livsmedel').fill('hav');
    await expect(page.locator('.traff')).toHaveCount(2);
    await expect(page.locator('.traff').first()).toContainText('Havregryn fullkorn');
    await expect(page.locator('.traff').first()).toContainText('375 kcal/100 g');
    await bild(page, 'Sökresultat');
  });

  test('välj livsmedel och ange gram räknar ut kcal', { annotation: { type: 'testfall', description: 'TC-SOK-03' } }, async ({ appen: page }) => {
    await oppnaSok(page);
    await page.getByLabel('Sök livsmedel').fill('gröt');
    await page.getByRole('button', { name: /Havregrynsgröt fullkorn/ }).click();
    await expect(page.locator('#val-namn')).toHaveText('Havregrynsgröt fullkorn');
    await expect(page.locator('#form-val').getByLabel('Mängd (gram)')).toHaveValue('100');
    await expect(page.locator('#val-kcal')).toHaveText('66');
    await page.locator('#form-val').getByLabel('Mängd (gram)').fill('250');
    await expect(page.locator('#val-kcal')).toHaveText('165');
    await page.locator('#form-val').getByLabel('Mängd (gram)').fill('37,5');
    await expect(page.locator('#val-kcal')).toHaveText('25');
    await bild(page, 'Ange mängd');
  });

  test('spara loggar måltiden med typ, livsmedel, gram och kcal', { annotation: { type: 'testfall', description: 'TC-SOK-04' } }, async ({ appen: page, api }) => {
    await oppnaSok(page);
    await page.getByLabel('Sök livsmedel').fill('ägg');
    await page.getByRole('button', { name: /Ägg kokt/ }).click();
    await page.locator('#form-val').getByLabel('Mängd (gram)').fill('120');
    await page.locator('#form-val').getByText('Frukost', { exact: true }).click();
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
    await expect(page.locator('#toast')).toHaveText('Ägg kokt (163 kcal) sparat till frukost');
    expect(api.tabeller.kalori_maltid).toHaveLength(1);
    expect(api.tabeller.kalori_maltid[0]).toMatchObject({ user_id: ANVANDARE.id, typ: 'frukost', kalla: 'manuell' });
    expect(api.tabeller.kalori_maltid_rad).toEqual([expect.objectContaining({
      maltid_id: api.tabeller.kalori_maltid[0].id, user_id: ANVANDARE.id, namn: 'Ägg kokt', livsmedel_nr: 2205, gram: 120, kcal: 163.2
    })]);
    await bild(page, 'Sparat');
  });

  test('måltid föreslås efter tid på dagen', { annotation: { type: 'testfall', description: 'TC-SOK-05' } }, async ({ appen: page }) => {
    // Klockan står på 10:00 i testerna → lunch
    await oppnaSok(page);
    await page.getByLabel('Sök livsmedel').fill('banan');
    await page.getByRole('button', { name: /Banan/ }).click();
    await expect(page.locator('#val-typ-lunch')).toBeChecked();
    const typ = (h) => page.evaluate((t) => window.KaloriMaltid.foreslagenTyp(new Date(t)), '2026-10-24T' + h + ':00+02:00');
    expect(await typ('07:30')).toBe('frukost');
    expect(await typ('12:00')).toBe('lunch');
    expect(await typ('15:00')).toBe('mellanmal');
    expect(await typ('18:30')).toBe('middag');
    expect(await typ('22:00')).toBe('mellanmal');
  });

  test('senaste livsmedel visas för snabbval med förra mängden', { annotation: { type: 'testfall', description: 'TC-SOK-06' } }, async ({ page, api }) => {
    api.tabeller.kalori_maltid = [
      { id: 'm1', user_id: ANVANDARE.id, tid: '2026-10-23T07:00:00Z', typ: 'frukost', kalla: 'manuell' },
      { id: 'm2', user_id: ANVANDARE.id, tid: '2026-10-24T06:00:00Z', typ: 'frukost', kalla: 'manuell' },
      { id: 'm3', user_id: ANVANDARE.id, tid: '2026-10-22T11:00:00Z', typ: 'lunch', kalla: 'foto' }
    ];
    api.tabeller.kalori_maltid_rad = [
      { id: 'r1', maltid_id: 'm1', user_id: ANVANDARE.id, namn: 'Havregrynsgröt fullkorn', livsmedel_nr: 677, gram: 300, kcal: 198 },
      { id: 'r2', maltid_id: 'm2', user_id: ANVANDARE.id, namn: 'Banan', livsmedel_nr: 553, gram: 120, kcal: 114 },
      { id: 'r3', maltid_id: 'm2', user_id: ANVANDARE.id, namn: 'Havregrynsgröt fullkorn', livsmedel_nr: 677, gram: 250, kcal: 165 },
      { id: 'r4', maltid_id: 'm3', user_id: ANVANDARE.id, namn: 'Pasta med köttfärssås', livsmedel_nr: null, gram: 400, kcal: 620 }
    ];
    await require('./mock').inloggad(page);
    await page.goto('./');
    await oppnaSok(page);
    await expect(page.locator('#sok-rubrik')).toHaveText('Senaste');
    await expect(page.locator('.traff-namn')).toHaveText(['Banan', 'Havregrynsgröt fullkorn']); // unika, nyast först, inga AI-rader
    await page.getByRole('button', { name: /Havregrynsgröt/ }).click();
    await expect(page.locator('#form-val').getByLabel('Mängd (gram)')).toHaveValue('250');
    await expect(page.locator('#val-kcal')).toHaveText('165');
    await bild(page, 'Senaste');
  });

  test('ogiltig mängd stoppas innan något sparas', { annotation: { type: 'testfall', description: 'TC-SOK-07' } }, async ({ appen: page, api }) => {
    await oppnaSok(page);
    await page.getByLabel('Sök livsmedel').fill('smör');
    await page.getByRole('button', { name: /Smör/ }).click();
    for (const v of ['0', '6000', 'mycket']) {
      await page.locator('#form-val').getByLabel('Mängd (gram)').fill(v);
      await page.getByRole('button', { name: 'Spara' }).click();
      await expect(page.locator('#val-msg')).toHaveText('Ange en mängd mellan 1 och 5 000 gram.');
    }
    expect(api.tabeller.kalori_maltid).toHaveLength(0);
  });

  test('sparfel behåller valet och lämnar ingen tom måltid', { annotation: { type: 'testfall', description: 'TC-SOK-08' } }, async ({ appen: page, api }) => {
    await oppnaSok(page);
    await page.getByLabel('Sök livsmedel').fill('lax');
    await page.getByRole('button', { name: /Lax gravad/ }).click();
    await page.locator('#form-val').getByLabel('Mängd (gram)').fill('80');
    api.felVidSparning = true;
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#val-msg')).toHaveText('Kunde inte spara. Kontrollera nätet och försök igen.');
    await expect(page.locator('#form-val').getByLabel('Mängd (gram)')).toHaveValue('80');
    expect(api.tabeller.kalori_maltid).toHaveLength(0);
    api.felVidSparning = false;
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
    expect(api.tabeller.kalori_maltid_rad).toHaveLength(1);
  });

  test('källan Livsmedelsverket visas där livsmedel visas', { annotation: { type: 'testfall', description: 'TC-SOK-09' } }, async ({ appen: page }) => {
    await oppnaSok(page);
    await expect(page.locator('#view-sok .kalla')).toHaveText('Livsmedelsdata: Livsmedelsverkets livsmedelsdatabas (CC BY 4.0)');
  });

  test('tillbaka stänger sökningen utan att spara', { annotation: { type: 'testfall', description: 'TC-SOK-12' } }, async ({ appen: page, api }) => {
    await oppnaSok(page);
    await page.getByLabel('Sök livsmedel').fill('banan');
    await page.getByRole('button', { name: /Banan/ }).click();
    await page.getByRole('button', { name: '← Sök igen' }).click();
    await expect(page.locator('.traff')).toHaveCount(1);
    await page.getByRole('button', { name: '← Tillbaka' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
    expect(api.tabeller.kalori_maltid).toHaveLength(0);
  });

  test('livsmedlen kan inte laddas ger begripligt fel', { annotation: { type: 'testfall', description: 'TC-SOK-13' } }, async ({ appen: page, api }) => {
    api.livsmedelNere = true;
    await oppnaSok(page);
    await expect(page.locator('#sok-fel')).toHaveText('Kunde inte ladda livsmedlen. Kontrollera nätet och försök igen.');
  });
});
