const path = require('path');
const { test, expect, bild } = require('./hjalp');
const { inloggad, ANVANDARE } = require('./mock');

const TALLRIK = path.join(__dirname, 'data', 'tallrik.jpg'); // 1600 × 1200
const U = ANVANDARE.id;

// Bredd och höjd ur en JPEG (SOF-markören)
function jpegStorlek(buf) {
  let i = 2;
  while (i < buf.length) {
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return null;
}

async function fota(page) {
  await page.locator('#btn-fota input').setInputFiles(TALLRIK);
  await expect(page.locator('#view-foto')).toBeVisible();
}

test.describe('Fota mat', () => {
  test('fotot analyseras och förslaget visas med namn, gram och kcal', { annotation: { type: 'testfall', description: 'TC-FOT-01' } }, async ({ appen: page, api }) => {
    await fota(page);
    await expect(page.locator('.fot-rad')).toHaveCount(3);
    await expect(page.locator('#fot-namn-0')).toHaveValue('Köttbullar');
    await expect(page.locator('#fot-gram-0')).toHaveValue('150');
    await expect(page.locator('#fot-kcal-0')).toHaveValue('330');
    await expect(page.locator('#fot-summa')).toHaveText('534');
    await expect(page.locator('#fot-typ-lunch')).toBeChecked();
    await expect(page.locator('#fot-bild')).toBeVisible();
    expect(api.analysAnrop).toHaveLength(1);
    expect(api.analysAnrop[0].auth).toMatch(/^Bearer /);
    await bild(page, 'Förslag från foto');
  });

  test('bilden krymps till högst 1024 px innan den skickas', { annotation: { type: 'testfall', description: 'TC-FOT-02' } }, async ({ appen: page, api }) => {
    await fota(page);
    await expect(page.locator('.fot-rad')).toHaveCount(3);
    const { bild: b64, mime } = api.analysAnrop[0].body;
    expect(mime).toBe('image/jpeg');
    const buf = Buffer.from(b64, 'base64');
    expect(jpegStorlek(buf)).toEqual({ w: 1024, h: 768 });
    expect(buf.length).toBeLessThan(400 * 1024);
  });

  test('ändrad mängd räknar om kcal i samma proportion', { annotation: { type: 'testfall', description: 'TC-FOT-03' } }, async ({ appen: page }) => {
    await fota(page);
    await page.locator('#fot-gram-0').fill('100');
    await expect(page.locator('#fot-kcal-0')).toHaveValue('220');
    await expect(page.locator('#fot-summa')).toHaveText('424');
    await page.locator('#fot-kcal-1').fill('140');
    await expect(page.locator('#fot-summa')).toHaveText('408');
  });

  test('ta bort och lägga till rader uppdaterar summan', { annotation: { type: 'testfall', description: 'TC-FOT-04' } }, async ({ appen: page }) => {
    await fota(page);
    await page.getByRole('button', { name: 'Ta bort Lingonsylt' }).click();
    await expect(page.locator('.fot-rad')).toHaveCount(2);
    await expect(page.locator('#fot-summa')).toHaveText('486');
    await page.getByRole('button', { name: '+ Lägg till rad' }).click();
    await expect(page.locator('#fot-namn-2')).toBeFocused();
    await page.locator('#fot-namn-2').fill('Gurka');
    await page.locator('#fot-gram-2').fill('50');
    await page.locator('#fot-kcal-2').fill('6');
    await expect(page.locator('#fot-summa')).toHaveText('492');
  });

  test('spara sparar måltid, rader och en miniatyr på högst 30 kB', { annotation: { type: 'testfall', description: 'TC-FOT-05' } }, async ({ appen: page, api }) => {
    await fota(page);
    await page.locator('#form-foto').getByText('Middag', { exact: true }).click();
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
    await expect(page.locator('#toast')).toHaveText('Måltid sparad (534 kcal)');
    const m = api.tabeller.kalori_maltid;
    expect(m).toHaveLength(1);
    expect(m[0]).toMatchObject({ user_id: U, typ: 'middag', kalla: 'foto', miniatyr: U + '/' + m[0].id + '.jpg' });
    expect(api.tabeller.kalori_maltid_rad.map((r) => [r.namn, r.gram, r.kcal, r.livsmedel_nr, r.maltid_id]))
      .toEqual([['Köttbullar', 150, 330, null, m[0].id], ['Kokt potatis', 200, 156, null, m[0].id], ['Lingonsylt', 30, 48, null, m[0].id]]);
    expect(api.uppladdade).toHaveLength(1);
    expect(api.uppladdade[0].fil).toBe(m[0].miniatyr);
    expect(api.uppladdade[0].storlek).toBeGreaterThan(0);
    expect(api.uppladdade[0].storlek).toBeLessThanOrEqual(30 * 1024);
    await expect(page.locator('#ida-atit')).toHaveText('534');
  });

  test('slut på gratiskvot visar meddelandet och erbjuder manuell sökning', { annotation: { type: 'testfall', description: 'TC-FOT-06' } }, async ({ appen: page, api }) => {
    api.analys = { status: 429, body: { fel: 'kvot', meddelande: 'Dagens gratisanalyser är slut. Försök senare eller logga manuellt.' } };
    await fota(page);
    await expect(page.locator('#fot-feltext')).toHaveText('Dagens gratisanalyser är slut. Försök senare eller logga manuellt.');
    await bild(page, 'Analysen misslyckades');
    await page.getByRole('button', { name: 'Sök manuellt i stället' }).click();
    await expect(page.locator('#view-sok')).toBeVisible();
  });

  test('ingen mat på bilden eller ingen kontakt ger begripligt fel', { annotation: { type: 'testfall', description: 'TC-FOT-07' } }, async ({ appen: page, api }) => {
    api.analys = { status: 422, body: { fel: 'tom', meddelande: 'Hittade ingen mat på bilden.' } };
    await fota(page);
    await expect(page.locator('#fot-feltext')).toHaveText('Hittade ingen mat på bilden.');
    await page.getByRole('button', { name: '← Tillbaka' }).click();
    api.nere = true;
    await fota(page);
    await expect(page.locator('#fot-feltext')).toHaveText('Bildanalysen fungerade inte just nu. Kontrollera nätet eller logga manuellt.');
    expect(api.tabeller.kalori_maltid).toHaveLength(0);
  });

  test('miniatyren visas i dagsöversikten', { annotation: { type: 'testfall', description: 'TC-FOT-08' } }, async ({ page, api }) => {
    api.tabeller.kalori_maltid = [{ id: 'm1', user_id: U, tid: '2026-10-24T09:00:00Z', typ: 'lunch', kalla: 'foto', miniatyr: U + '/m1.jpg' }];
    api.tabeller.kalori_maltid_rad = [{ id: 'r1', maltid_id: 'm1', user_id: U, namn: 'Köttbullar', livsmedel_nr: null, gram: 150, kcal: 330 }];
    await inloggad(page);
    await page.goto('./');
    const img = page.locator('section.maltid[data-typ="lunch"] .maltid-bilder img');
    await expect(img).toHaveAttribute('src', /kalori-foton\/11111111-2222-3333-4444-555555555555\/m1\.jpg\?token=test/);
    await expect(img).toHaveJSProperty('complete', true);
    await bild(page, 'Miniatyr i dagsöversikten');
  });

  test('ta bort sista raden tar bort miniatyren', { annotation: { type: 'testfall', description: 'TC-FOT-09' } }, async ({ page, api }) => {
    api.tabeller.kalori_maltid = [{ id: 'm1', user_id: U, tid: '2026-10-24T09:00:00Z', typ: 'lunch', kalla: 'foto', miniatyr: U + '/m1.jpg' }];
    api.tabeller.kalori_maltid_rad = [{ id: 'r1', maltid_id: 'm1', user_id: U, namn: 'Köttbullar', livsmedel_nr: null, gram: 150, kcal: 330 }];
    await inloggad(page);
    await page.goto('./');
    await page.getByRole('button', { name: /Ändra Köttbullar/ }).click();
    await page.getByRole('button', { name: 'Ta bort' }).click();
    await page.locator('#red-ja').click();
    await expect(page.locator('#ida-atit')).toHaveText('0');
    expect(api.borttagnaFoton).toEqual([U + '/m1.jpg']);
    expect(api.tabeller.kalori_maltid).toHaveLength(0);
  });

  test('miniatyr som inte går att ladda upp stoppar inte sparningen', { annotation: { type: 'testfall', description: 'TC-FOT-10' } }, async ({ appen: page, api }) => {
    api.uppladdningFel = true;
    await fota(page);
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
    expect(api.tabeller.kalori_maltid[0].miniatyr).toBeNull();
    expect(api.tabeller.kalori_maltid_rad).toHaveLength(3);
  });

  test('ogiltiga rader stoppas innan något sparas', { annotation: { type: 'testfall', description: 'TC-FOT-11' } }, async ({ appen: page, api }) => {
    await fota(page);
    await page.locator('#fot-namn-1').fill('');
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#fot-msg')).toHaveText('Alla rader behöver ett namn.');
    await page.locator('#fot-namn-1').fill('Potatis');
    await page.locator('#fot-gram-1').fill('0');
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#fot-msg')).toHaveText('Mängden ska vara mellan 1 och 5 000 gram (Potatis).');
    expect(api.tabeller.kalori_maltid).toHaveLength(0);
    expect(api.uppladdade).toHaveLength(0);
  });

  test('foto från en tidigare dag sparas på den dagen', { annotation: { type: 'testfall', description: 'TC-FOT-12' } }, async ({ appen: page, api }) => {
    await page.getByRole('button', { name: 'Föregående dag' }).click();
    await fota(page);
    await page.getByRole('button', { name: 'Spara' }).click();
    await expect(page.locator('#ida-datum')).toHaveText('Igår');
    await expect(page.locator('#ida-atit')).toHaveText('534');
    expect(api.tabeller.kalori_maltid[0].tid).toBe('2026-10-23T10:00:00.000Z');
  });
});
