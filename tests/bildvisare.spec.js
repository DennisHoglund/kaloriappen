// Se matfotot stort: tryck på bilden i dagsöversikten → helskärm (US-21, D-29)
const { test, expect, bild } = require('./hjalp');
const { ANVANDARE, inloggad } = require('./mock');

const U = ANVANDARE.id;
const maltid = (id, typ, o = {}) => ({ id, user_id: U, tid: '2026-10-24T09:00:00Z', typ, kalla: 'foto', miniatyr: U + '/' + id + '.jpg', bild: U + '/' + id + '-stor.jpg', ...o });
const rad = (id, maltidId, namn) => ({ id, maltid_id: maltidId, user_id: U, namn, livsmedel_nr: null, gram: 150, kcal: 330 });

async function oppna(page, api, maltider) {
  api.tabeller.kalori_maltid = maltider;
  api.tabeller.kalori_maltid_rad = maltider.map((m, i) => rad('r' + i, m.id, 'Rätt ' + i));
  await inloggad(page);
  await page.goto('./');
}
const visare = (page) => page.locator('#bildvisare');

test.describe('Matfoto i helskärm', () => {
  test('tryck på bilden visar den stora bilden i helskärm', { annotation: { type: 'testfall', description: 'TC-BIL-01' } }, async ({ page, api }) => {
    await oppna(page, api, [maltid('m1', 'lunch')]);
    await expect(visare(page)).toBeHidden();
    const tumme = page.getByRole('button', { name: 'Visa foto av lunch i helskärm' });
    await tumme.click();
    await expect(visare(page)).toBeVisible();
    const stor = page.locator('#bildvisare img');
    await expect(stor).toHaveAttribute('src', new RegExp(U + '/m1-stor\\.jpg\\?token=test'));
    await expect(stor).toHaveJSProperty('complete', true);
    const ruta = await stor.boundingBox();
    const sida = page.viewportSize();
    expect(ruta.width).toBeGreaterThan(sida.width * 0.9); // fyller bredden
    await bild(page, 'Matfoto i helskärm');
  });

  test('stängs med ✕, tryck bredvid bilden och Esc', { annotation: { type: 'testfall', description: 'TC-BIL-02' } }, async ({ page, api }) => {
    await oppna(page, api, [maltid('m1', 'lunch')]);
    const tumme = page.getByRole('button', { name: 'Visa foto av lunch i helskärm' });
    await tumme.click();
    await page.getByRole('button', { name: 'Stäng bild' }).click();
    await expect(visare(page)).toBeHidden();
    await expect(tumme).toBeFocused(); // fokus tillbaka
    await tumme.click();
    await page.keyboard.press('Escape');
    await expect(visare(page)).toBeHidden();
    await tumme.click();
    const sida = page.viewportSize();
    await page.mouse.click(sida.width / 2, sida.height - 20); // svart kant under bilden
    await expect(visare(page)).toBeHidden();
    await expect(page.locator('#view-app')).toBeVisible();
  });

  test('dubbeltryck zoomar in och ut', { annotation: { type: 'testfall', description: 'TC-BIL-03' } }, async ({ page, api }) => {
    await oppna(page, api, [maltid('m1', 'lunch')]);
    await page.getByRole('button', { name: 'Visa foto av lunch i helskärm' }).click();
    const img = page.locator('#bildvisare img');
    await expect(img).toHaveJSProperty('complete', true);
    const fore = (await img.boundingBox()).width;
    await img.dblclick();
    await expect(page.locator('#bildvisare .bv-zoom')).toHaveClass(/zoomad/);
    expect((await img.boundingBox()).width).toBeGreaterThan(fore * 2);
    await img.dblclick();
    await expect(page.locator('#bildvisare .bv-zoom')).not.toHaveClass(/zoomad/);
    await expect(visare(page)).toBeVisible(); // zoom stänger inte
  });

  test('äldre måltid utan stor bild visar miniatyren, varje bild öppnar sin egen', { annotation: { type: 'testfall', description: 'TC-BIL-04' } }, async ({ page, api }) => {
    await oppna(page, api, [maltid('m1', 'lunch', { bild: null }), maltid('m2', 'lunch', { tid: '2026-10-24T10:00:00Z' })]);
    const tummar = page.locator('section.maltid[data-typ="lunch"] .maltid-bilder button');
    await expect(tummar).toHaveCount(2);
    await tummar.nth(0).click();
    await expect(page.locator('#bildvisare img')).toHaveAttribute('src', new RegExp(U + '/m1\\.jpg\\?token=test'));
    await page.keyboard.press('Escape');
    await tummar.nth(1).click();
    await expect(page.locator('#bildvisare img')).toHaveAttribute('src', new RegExp(U + '/m2-stor\\.jpg\\?token=test'));
    await expect(page.locator('#bildvisare .bv-antal')).toHaveCount(0); // ingen karusell (D-29)
  });
});
