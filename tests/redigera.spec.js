const { test, expect, bild } = require('./hjalp');
const { inloggad, ANVANDARE } = require('./mock');

const U = ANVANDARE.id;
async function oppna(page, api) {
  api.tabeller.kalori_maltid = [
    { id: 'f1', user_id: U, tid: '2026-10-24T05:30:00Z', typ: 'frukost', kalla: 'manuell' },
    { id: 'l1', user_id: U, tid: '2026-10-24T09:45:00Z', typ: 'lunch', kalla: 'foto' }
  ];
  api.tabeller.kalori_maltid_rad = [
    { id: 'r1', maltid_id: 'f1', user_id: U, namn: 'Havregrynsgröt fullkorn', livsmedel_nr: 677, gram: 300, kcal: 198 },
    { id: 'r2', maltid_id: 'f1', user_id: U, namn: 'Banan', livsmedel_nr: 553, gram: 120, kcal: 114 },
    { id: 'r3', maltid_id: 'l1', user_id: U, namn: 'Pasta med köttfärssås', livsmedel_nr: null, gram: 400, kcal: 620 }
  ];
  await inloggad(page);
  await page.goto('./');
  await expect(page.locator('#ida-atit')).toHaveText('932');
}
const mangd = (page) => page.locator('#form-redigera').getByLabel('Mängd (gram)');

test.describe('Ändra och ta bort', () => {
  test('tryck på en rad öppnar den med mängden ifylld', { annotation: { type: 'testfall', description: 'TC-RED-01' } }, async ({ page, api }) => {
    await oppna(page, api);
    await page.getByRole('button', { name: /Ändra Banan/ }).click();
    await expect(page.locator('#view-redigera')).toBeVisible();
    await expect(page.locator('#red-namn')).toHaveText('Banan');
    await expect(mangd(page)).toHaveValue('120');
    await expect(page.locator('#red-kcal')).toHaveText('114');
    await bild(page, 'Ändra rad');
  });

  test('ändrad mängd räknar om kcal i samma proportion och sparas', { annotation: { type: 'testfall', description: 'TC-RED-02' } }, async ({ page, api }) => {
    await oppna(page, api);
    await page.getByRole('button', { name: /Ändra Havregrynsgröt/ }).click();
    await mangd(page).fill('150');
    await expect(page.locator('#red-kcal')).toHaveText('99');
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
    await expect(page.locator('#toast')).toHaveText('Havregrynsgröt fullkorn ändrad till 150 g');
    await expect(page.locator('#ida-atit')).toHaveText('833');
    expect(api.tabeller.kalori_maltid_rad.find((r) => r.id === 'r1')).toMatchObject({ gram: 150, kcal: 99 });
  });

  test('AI-rader utan livsmedel kan också ändras', { annotation: { type: 'testfall', description: 'TC-RED-03' } }, async ({ page, api }) => {
    await oppna(page, api);
    await page.getByRole('button', { name: /Ändra Pasta/ }).click();
    await mangd(page).fill('300');
    await expect(page.locator('#red-kcal')).toHaveText('465');
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#ida-atit')).toHaveText('777');
  });

  test('ta bort kräver bekräftelse och avbryt behåller raden', { annotation: { type: 'testfall', description: 'TC-RED-04' } }, async ({ page, api }) => {
    await oppna(page, api);
    await page.getByRole('button', { name: /Ändra Banan/ }).click();
    await page.getByRole('button', { name: 'Ta bort' }).click();
    await expect(page.locator('#red-fraga')).toHaveText('Ta bort Banan?');
    await bild(page, 'Bekräfta borttagning');
    await page.getByRole('button', { name: 'Avbryt' }).click();
    await expect(page.locator('#red-bekrafta')).toBeHidden();
    expect(api.tabeller.kalori_maltid_rad).toHaveLength(3);
    await page.getByRole('button', { name: '← Tillbaka' }).click();
    await expect(page.locator('#ida-atit')).toHaveText('932');
  });

  test('ta bort en av flera rader behåller måltiden', { annotation: { type: 'testfall', description: 'TC-RED-05' } }, async ({ page, api }) => {
    await oppna(page, api);
    await page.getByRole('button', { name: /Ändra Banan/ }).click();
    await page.getByRole('button', { name: 'Ta bort' }).click();
    await page.locator('#red-ja').click();
    await expect(page.locator('#toast')).toHaveText('Banan borttagen');
    await expect(page.locator('#ida-atit')).toHaveText('818');
    await expect(page.locator('section.maltid[data-typ="frukost"] .rad-namn')).toHaveText(['Havregrynsgröt fullkorn']);
    expect(api.tabeller.kalori_maltid.map((m) => m.id)).toEqual(['f1', 'l1']);
  });

  test('ta bort sista raden tar bort hela måltiden', { annotation: { type: 'testfall', description: 'TC-RED-06' } }, async ({ page, api }) => {
    await oppna(page, api);
    await page.getByRole('button', { name: /Ändra Pasta/ }).click();
    await page.getByRole('button', { name: 'Ta bort' }).click();
    await page.locator('#red-ja').click();
    await expect(page.locator('#ida-atit')).toHaveText('312');
    await expect(page.locator('section.maltid[data-typ="lunch"] .tom')).toHaveText('Inte loggat');
    expect(api.tabeller.kalori_maltid.map((m) => m.id)).toEqual(['f1']);
  });

  test('ogiltig mängd stoppas', { annotation: { type: 'testfall', description: 'TC-RED-07' } }, async ({ page, api }) => {
    await oppna(page, api);
    await page.getByRole('button', { name: /Ändra Banan/ }).click();
    await mangd(page).fill('0');
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#red-msg')).toHaveText('Ange en mängd mellan 1 och 5 000 gram.');
    expect(api.tabeller.kalori_maltid_rad.find((r) => r.id === 'r2').gram).toBe(120);
  });

  test('fel vid sparning eller borttagning behåller raden', { annotation: { type: 'testfall', description: 'TC-RED-08' } }, async ({ page, api }) => {
    await oppna(page, api);
    await page.getByRole('button', { name: /Ändra Banan/ }).click();
    api.felVidSparning = true;
    await mangd(page).fill('200');
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#red-msg')).toHaveText('Kunde inte spara. Kontrollera nätet och försök igen.');
    await page.getByRole('button', { name: 'Ta bort' }).click();
    await page.locator('#red-ja').click();
    await expect(page.locator('#red-msg')).toHaveText('Kunde inte ta bort. Kontrollera nätet och försök igen.');
    expect(api.tabeller.kalori_maltid_rad).toHaveLength(3);
  });
});
