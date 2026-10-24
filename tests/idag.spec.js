const { test, expect, bild } = require('./hjalp');
const { inloggad, ANVANDARE } = require('./mock');

const U = ANVANDARE.id;
// Måltider: två idag (lördag 24/10), en igår och en precis kring midnatt
function maltider(api) {
  api.tabeller.kalori_maltid = [
    { id: 'f1', user_id: U, tid: '2026-10-24T05:30:00Z', typ: 'frukost', kalla: 'manuell' },
    { id: 'l1', user_id: U, tid: '2026-10-24T09:45:00Z', typ: 'lunch', kalla: 'manuell' },
    { id: 'g1', user_id: U, tid: '2026-10-23T16:00:00Z', typ: 'middag', kalla: 'manuell' },
    { id: 'n1', user_id: U, tid: '2026-10-23T21:30:00Z', typ: 'mellanmal', kalla: 'manuell' }, // 23:30 svensk tid fredag
    { id: 'n2', user_id: U, tid: '2026-10-23T22:30:00Z', typ: 'mellanmal', kalla: 'manuell' }  // 00:30 svensk tid lördag
  ];
  api.tabeller.kalori_maltid_rad = [
    { id: 'r1', maltid_id: 'f1', user_id: U, namn: 'Havregrynsgröt fullkorn', livsmedel_nr: 677, gram: 300, kcal: 198 },
    { id: 'r2', maltid_id: 'f1', user_id: U, namn: 'Banan', livsmedel_nr: 553, gram: 120, kcal: 114 },
    { id: 'r3', maltid_id: 'l1', user_id: U, namn: 'Kyckling bröstfilé kokt u. skinn', livsmedel_nr: 3594, gram: 200, kcal: 312 },
    { id: 'r4', maltid_id: 'g1', user_id: U, namn: 'Lax gravad', livsmedel_nr: 1285, gram: 150, kcal: 249 },
    { id: 'r5', maltid_id: 'n1', user_id: U, namn: 'Smör fett 80%', livsmedel_nr: 29, gram: 10, kcal: 76.6 },
    { id: 'r6', maltid_id: 'n2', user_id: U, namn: 'Äpple m. skal', livsmedel_nr: 588, gram: 150, kcal: 72 }
  ];
}

async function oppna(page, api) {
  maltider(api);
  await inloggad(page);
  await page.goto('./');
  await expect(page.locator('#view-app')).toBeVisible();
}

test.describe('Dagsöversikt', () => {
  test('visar ätit, mål och kvar för dagen', { annotation: { type: 'testfall', description: 'TC-IDA-01' } }, async ({ page, api }) => {
    await oppna(page, api);
    await expect(page.locator('#ida-datum')).toHaveText('Idag');
    await expect(page.locator('#ida-atit')).toHaveText('696');  // 198 + 114 + 312 + 72
    await expect(page.locator('#ida-mal')).toHaveText('1 970');
    await expect(page.locator('#ida-kvar')).toHaveText('1 274');
    await expect(page.locator('#ida-stapel')).toHaveAttribute('aria-label', /^696 av 1\s970 kcal, 35 procent$/);
    await bild(page, 'Dagsöversikt');
  });

  test('måltiderna grupperas per typ med summa', { annotation: { type: 'testfall', description: 'TC-IDA-02' } }, async ({ page, api }) => {
    await oppna(page, api);
    const frukost = page.locator('section.maltid[data-typ="frukost"]');
    await expect(frukost.locator('.maltid-huvud')).toContainText('312 kcal');
    await expect(frukost.locator('.rad-namn')).toHaveText(['Havregrynsgröt fullkorn', 'Banan']);
    await expect(frukost.locator('.rad').first()).toContainText('300 g');
    await expect(page.locator('section.maltid[data-typ="lunch"] .maltid-huvud')).toContainText('312 kcal');
    await expect(page.locator('section.maltid[data-typ="middag"] .tom')).toHaveText('Inte loggat');
    await expect(page.locator('section.maltid[data-typ="mellanmal"] .rad-namn')).toHaveText(['Äpple m. skal']);
  });

  test('bläddra bakåt visar tidigare dagar', { annotation: { type: 'testfall', description: 'TC-IDA-03' } }, async ({ page, api }) => {
    await oppna(page, api);
    await expect(page.getByRole('button', { name: 'Nästa dag' })).toBeDisabled();
    await page.getByRole('button', { name: 'Föregående dag' }).click();
    await expect(page.locator('#ida-datum')).toHaveText('Igår');
    await expect(page.locator('#ida-atit')).toHaveText('326'); // 249 + 76,6
    await expect(page.locator('section.maltid[data-typ="middag"] .rad-namn')).toHaveText(['Lax gravad']);
    await page.getByRole('button', { name: 'Föregående dag' }).click();
    await expect(page.locator('#ida-datum')).toHaveText('Torsdag 22 oktober');
    await expect(page.locator('#ida-atit')).toHaveText('0');
    await page.getByRole('button', { name: 'Tillbaka till idag' }).click();
    await expect(page.locator('#ida-datum')).toHaveText('Idag');
    await expect(page.getByRole('button', { name: 'Tillbaka till idag' })).toBeHidden();
    await bild(page, 'Tillbaka till idag');
  });

  test('ny måltid syns direkt i översikten', { annotation: { type: 'testfall', description: 'TC-IDA-04' } }, async ({ appen: page }) => {
    await expect(page.locator('#ida-atit')).toHaveText('0');
    await page.getByRole('button', { name: 'Logga mat' }).click();
    await page.getByLabel('Sök livsmedel').fill('ägg');
    await page.getByRole('button', { name: /Ägg kokt/ }).click();
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#ida-atit')).toHaveText('136');
    await expect(page.locator('section.maltid[data-typ="lunch"] .rad-namn')).toHaveText(['Ägg kokt']);
  });

  test('över målet visas tydligt', { annotation: { type: 'testfall', description: 'TC-IDA-05' } }, async ({ page, api }) => {
    maltider(api);
    api.tabeller.kalori_maltid_rad.push({ id: 'r9', maltid_id: 'l1', user_id: U, namn: 'Smör fett 80%', livsmedel_nr: 29, gram: 200, kcal: 1532 });
    await inloggad(page);
    await page.goto('./');
    await expect(page.locator('#ida-atit')).toHaveText('2 228');
    await expect(page.locator('#ida-kvar-etikett')).toHaveText('Över');
    await expect(page.locator('#ida-kvar')).toHaveText('258');
    await expect(page.locator('#ida-kvar-ruta')).toHaveClass(/over/);
    await bild(page, 'Över målet');
  });

  test('måltider kring midnatt hamnar på rätt dag', { annotation: { type: 'testfall', description: 'TC-IDA-06' } }, async ({ page, api }) => {
    await oppna(page, api);
    // 00:30 svensk tid lördag räknas till idag, 23:30 fredag till igår
    await expect(page.locator('section.maltid[data-typ="mellanmal"] .rad-namn')).toHaveText(['Äpple m. skal']);
    await page.getByRole('button', { name: 'Föregående dag' }).click();
    await expect(page.locator('section.maltid[data-typ="mellanmal"] .rad-namn')).toHaveText(['Smör fett 80%']);
  });

  test('lägg till från en måltid förväljer måltiden', { annotation: { type: 'testfall', description: 'TC-IDA-08' } }, async ({ appen: page, api }) => {
    await page.getByRole('button', { name: '+ Lägg till middag' }).click();
    await page.getByLabel('Sök livsmedel').fill('lax');
    await page.getByRole('button', { name: /Lax gravad/ }).click();
    await expect(page.locator('#val-typ-middag')).toBeChecked();
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('section.maltid[data-typ="middag"] .rad-namn')).toHaveText(['Lax gravad']);
    expect(api.tabeller.kalori_maltid[0].typ).toBe('middag');
  });

  test('loggning på en tidigare dag sparas på den dagen', { annotation: { type: 'testfall', description: 'TC-IDA-09' } }, async ({ appen: page, api }) => {
    await page.getByRole('button', { name: 'Föregående dag' }).click();
    await expect(page.locator('#ida-datum')).toHaveText('Igår');
    await page.getByRole('button', { name: '+ Lägg till frukost' }).click();
    await page.getByLabel('Sök livsmedel').fill('banan');
    await page.getByRole('button', { name: /Banan/ }).click();
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#ida-datum')).toHaveText('Igår');
    await expect(page.locator('section.maltid[data-typ="frukost"] .rad-namn')).toHaveText(['Banan']);
    expect(api.tabeller.kalori_maltid[0].tid).toBe('2026-10-23T10:00:00.000Z'); // kl 12 svensk tid fredag
  });

  test('fel vid hämtning ger begripligt meddelande', { annotation: { type: 'testfall', description: 'TC-IDA-10' } }, async ({ appen: page, api }) => {
    api.nere = true;
    await page.getByRole('button', { name: 'Föregående dag' }).click();
    await expect(page.locator('#ida-fel')).toHaveText('Kunde inte hämta dagens måltider. Kontrollera nätet.');
  });
});
