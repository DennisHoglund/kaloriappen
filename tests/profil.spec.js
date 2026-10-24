const { test, expect, bild } = require('./hjalp');
const { inloggad, ANVANDARE } = require('./mock');

// Fyller i profilen som en man på 92 kg, 182 cm, född 1980-05-01, lätt aktiv, 0,5 kg/vecka → 1 970 kcal
async function fyllProfil(page, andra = {}) {
  const v = { fodd: '1980-05-01', kon: 'Man', langd: '182', vikt: '92', aktivitet: 'latt', malvikt: '85', takt: '0,5 kg/v', ...andra };
  await page.getByLabel('Födelsedatum').fill(v.fodd);
  await page.locator('#form-profil').getByText(v.kon, { exact: true }).click();
  await page.getByLabel('Längd (cm)').fill(v.langd);
  await page.getByLabel('Vikt nu (kg)').fill(v.vikt);
  await page.getByLabel('Aktivitet till vardags').selectOption(v.aktivitet);
  await page.getByLabel('Målvikt (kg)').fill(v.malvikt);
  await page.locator('#form-profil').getByText(v.takt, { exact: true }).click();
}

async function nyAnvandare(page, api) {
  api.tabeller.kalori_profil = [];
  api.tabeller.kalori_vikt = [];
  await inloggad(page);
  await page.goto('./');
  await expect(page.locator('#view-profil')).toBeVisible();
}

test.describe('Profil', () => {
  test('ny användare guidas till profilen', { annotation: { type: 'testfall', description: 'TC-PRO-01' } }, async ({ page, api }) => {
    await nyAnvandare(page, api);
    await expect(page.getByRole('heading', { name: 'Välkommen! Fyll i din profil' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Avbryt' })).toBeHidden();
    await expect(page.locator('#pro-mal')).toHaveText('–');
    await bild(page, 'Onboarding');
  });

  test('dagsmålet visas direkt medan man fyller i', { annotation: { type: 'testfall', description: 'TC-PRO-02' } }, async ({ page, api }) => {
    await nyAnvandare(page, api);
    await fyllProfil(page);
    await expect(page.locator('#pro-mal')).toHaveText('1 970');
    await expect(page.locator('#pro-noter')).toContainText('Underhåll ≈ 2 520 kcal/dag, underskott 550 kcal/dag');
    await page.locator('#form-profil').getByText('0,75 kg/v', { exact: true }).click();
    await expect(page.locator('#pro-mal')).toHaveText('1 690');
    await bild(page, 'Profil ifylld');
  });

  test('spara sparar profil och startvikt och visar dagsmålet', { annotation: { type: 'testfall', description: 'TC-PRO-03' } }, async ({ page, api }) => {
    await nyAnvandare(page, api);
    await fyllProfil(page, { vikt: '92,4' });
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
    await expect(page.locator('#ida-mal')).toHaveText('1 980'); // 92,4 kg ger lite högre mål än 92
    expect(api.tabeller.kalori_profil).toHaveLength(1);
    expect(api.tabeller.kalori_profil[0]).toMatchObject({ user_id: ANVANDARE.id, kon: 'man', langd_cm: 182, aktivitet: 'latt', malvikt_kg: 85, takt_kg_vecka: 0.5, fodelsedatum: '1980-05-01' });
    expect(api.tabeller.kalori_vikt).toEqual([{ user_id: ANVANDARE.id, datum: '2026-10-24', vikt_kg: 92.4 }]);
    await page.reload();
    await expect(page.locator('#ida-mal')).toHaveText('1 980');
    await bild(page, 'Dagsmålet efter sparad profil');
  });

  test('ändra profil räknar om dagsmålet', { annotation: { type: 'testfall', description: 'TC-PRO-04' } }, async ({ appen: page, api }) => {
    await expect(page.locator('#ida-mal')).toHaveText('1 970');
    await page.getByRole('button', { name: 'Profil', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Din profil' })).toBeVisible();
    await expect(page.getByLabel('Vikt nu (kg)')).toHaveValue('92');
    await page.getByLabel('Aktivitet till vardags').selectOption('mattlig');
    await expect(page.locator('#pro-mal')).toHaveText('2 290');
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#ida-mal')).toHaveText('2 290');
    expect(api.tabeller.kalori_profil).toHaveLength(1);
    expect(api.tabeller.kalori_profil[0].aktivitet).toBe('mattlig');
  });

  test('avbryt lämnar profilen oförändrad', { annotation: { type: 'testfall', description: 'TC-PRO-05' } }, async ({ appen: page, api }) => {
    await page.getByRole('button', { name: 'Profil', exact: true }).click();
    await page.getByLabel('Aktivitet till vardags').selectOption('hog');
    await page.getByRole('button', { name: 'Avbryt' }).click();
    await expect(page.locator('#ida-mal')).toHaveText('1 970');
    expect(api.tabeller.kalori_profil[0].aktivitet).toBe('latt');
  });

  test('för lågt mål sätts till golvet med förklaring', { annotation: { type: 'testfall', description: 'TC-PRO-06' } }, async ({ page, api }) => {
    await nyAnvandare(page, api);
    await fyllProfil(page, { fodd: '1950-01-01', langd: '165', vikt: '58', malvikt: '55', aktivitet: 'stillasittande' });
    await expect(page.locator('#pro-mal')).toHaveText('1 500');
    await expect(page.locator('#pro-noter')).toContainText('lägsta säkra nivå');
  });

  test('för hög takt sänks till 1 % av vikten med förklaring', { annotation: { type: 'testfall', description: 'TC-PRO-07' } }, async ({ page, api }) => {
    await nyAnvandare(page, api);
    await fyllProfil(page, { vikt: '60', malvikt: '55', takt: '0,75 kg/v' });
    await expect(page.locator('#pro-noter')).toContainText('Takten är sänkt till 0,6 kg/vecka');
  });

  test('ogiltiga värden stoppas innan något sparas', { annotation: { type: 'testfall', description: 'TC-PRO-08' } }, async ({ page, api }) => {
    await nyAnvandare(page, api);
    await fyllProfil(page, { langd: '50' });
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#pro-msg')).toHaveText('Längden ska vara mellan 100 och 250 cm.');
    await page.getByLabel('Längd (cm)').fill('182');
    await page.getByLabel('Vikt nu (kg)').fill('');
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#pro-msg')).toHaveText('Vikten ska vara mellan 30 och 300 kg.');
    expect(api.tabeller.kalori_profil).toHaveLength(0);
    expect(api.anrop.filter((a) => a.metod === 'POST' && a.sokvag.startsWith('/rest/'))).toHaveLength(0);
  });

  test('sparfel behåller det man fyllt i', { annotation: { type: 'testfall', description: 'TC-PRO-09' } }, async ({ page, api }) => {
    await nyAnvandare(page, api);
    await fyllProfil(page);
    api.felVidSparning = true;
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#pro-msg')).toHaveText('Kunde inte spara. Kontrollera nätet och försök igen – det du fyllt i finns kvar.');
    await expect(page.locator('#view-profil')).toBeVisible();
    await expect(page.getByLabel('Längd (cm)')).toHaveValue('182');
    await expect(page.getByRole('button', { name: 'Spara' })).toBeEnabled();
    api.felVidSparning = false;
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
  });
});
