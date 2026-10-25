const { test, expect, bild } = require('./hjalp');
const { inloggad, ANVANDARE } = require('./mock');

const U = ANVANDARE.id;
// Vecka 43: mån 19 – sön 25 okt. Idag = lördag 24. Dagsmål 1 970, golv 1 500 (standardprofilen).
function vecka(api) {
  const dag = (id, datum, typ, kcal) => [
    { id, user_id: U, tid: datum + 'T10:00:00Z', typ, kalla: 'manuell' },
    { id: 'r' + id, maltid_id: id, user_id: U, namn: 'Mat ' + id, livsmedel_nr: null, gram: 100, kcal }
  ];
  const d = [
    dag('m1', '2026-10-19', 'lunch', 1850),   // i mål (94 %)
    dag('m2', '2026-10-20', 'lunch', 1700),   // under målet (86 %)
    dag('m3', '2026-10-21', 'lunch', 2200),   // över målet (112 %)
    dag('m4', '2026-10-22', 'lunch', 990),    // för lite (under golvet)
    // fredag 23: inget loggat
    dag('m6', '2026-10-24', 'frukost', 500)   // idag, pågår
  ];
  api.tabeller.kalori_maltid = d.map((x) => x[0]);
  api.tabeller.kalori_maltid_rad = d.map((x) => x[1]);
  api.tabeller.kalori_traning = [{ id: 't1', user_id: U, datum: '2026-10-22', typ: 'lopning', minuter: 120, km: 20, kommentar: null, kcal: 1200 }];
}
async function oppna(page, api) {
  vecka(api);
  await inloggad(page);
  await page.goto('./');
  await expect(page.locator('#ida-vecka-rubrik')).toHaveText('Vecka 43');
}
const tillDag = (page, d) => page.locator(`.prick-knapp[data-datum="${d}"]`).click();

test.describe('Dagens status och veckan', () => {
  test('idag visas ingen status, Kvar gäller', { annotation: { type: 'testfall', description: 'TC-STA-03' } }, async ({ page, api }) => {
    await oppna(page, api);
    await expect(page.locator('#ida-status')).toBeHidden();
    await expect(page.locator('#ida-idag-info')).toHaveText('Dagens status visas när dagen är slut. Under dagen gäller Kvar.');
    await expect(page.locator('#ida-kvar')).toHaveText('1 470');
    await bild(page, 'Idag med veckan');
  });

  test('avslutad dag i mål får grönt märke', { annotation: { type: 'testfall', description: 'TC-STA-04' } }, async ({ page, api }) => {
    await oppna(page, api);
    await tillDag(page, '2026-10-19');
    await expect(page.locator('#ida-datum')).toHaveText('Måndag 19 oktober');
    await expect(page.locator('#ida-status')).toHaveClass(/status-i-mal/);
    await expect(page.locator('#ida-status-namn')).toHaveText('I mål');
    await expect(page.locator('#ida-status-tal')).toHaveText('1 850 av 1 970 kcal');
    await expect(page.locator('#ida-idag-info')).toBeHidden();
    await bild(page, 'Avslutad dag i mål');
  });

  test('under målet och över målet', { annotation: { type: 'testfall', description: 'TC-STA-05' } }, async ({ page, api }) => {
    await oppna(page, api);
    await tillDag(page, '2026-10-20');
    await expect(page.locator('#ida-status-namn')).toHaveText('Under målet');
    await expect(page.locator('#ida-not')).toBeHidden();
    await tillDag(page, '2026-10-21');
    await expect(page.locator('#ida-status-namn')).toHaveText('Över målet');
    await expect(page.locator('#ida-status-tal')).toHaveText('2 200 av 1 970 kcal');
    await expect(page.locator('#ida-status')).toHaveClass(/status-over/);
  });

  test('för lite visar vänlig förklaring och nämner träningen', { annotation: { type: 'testfall', description: 'TC-STA-06' } }, async ({ page, api }) => {
    await oppna(page, api);
    await tillDag(page, '2026-10-22');
    await expect(page.locator('#ida-status-namn')).toHaveText('För lite');
    await expect(page.locator('#ida-not-text')).toHaveText('Under 1 500 kcal är för lite för att gå ner i vikt på ett hållbart sätt – kroppen tar då av musklerna och återhämtningen blir sämre.');
    await expect(page.locator('#ida-not-traning')).toHaveText('Du tränade 120 minuter den här dagen. Ät gärna lite mer dagar med träning.');
    await bild(page, 'För lite');
  });

  test('avslutad dag utan mat visar Inget loggat', { annotation: { type: 'testfall', description: 'TC-STA-07' } }, async ({ page, api }) => {
    await oppna(page, api);
    await tillDag(page, '2026-10-23');
    await expect(page.locator('#ida-status-namn')).toHaveText('Inget loggat');
    await expect(page.locator('#ida-status-tal')).toHaveText('');
    await expect(page.locator('#ida-not')).toBeHidden();
    // Utan mat alls frågas inte efter enskilda måltider
    await expect(page.locator('section.maltid.saknas')).toHaveCount(0);
  });

  test('saknade måltider på en avslutad dag: glömde du logga?', { annotation: { type: 'testfall', description: 'TC-STA-08' } }, async ({ page, api }) => {
    await oppna(page, api);
    await tillDag(page, '2026-10-22');
    await expect(page.locator('section.maltid[data-typ="frukost"] .tom')).toHaveText('Inte loggat – glömde du logga?');
    await expect(page.locator('section.maltid[data-typ="middag"]')).toHaveClass(/saknas/);
    await expect(page.locator('section.maltid[data-typ="mellanmal"] .tom')).toHaveText('Inte loggat');
    // Idag frågas inte
    await page.getByRole('button', { name: 'Tillbaka till idag' }).click();
    await expect(page.locator('section.maltid[data-typ="lunch"] .tom')).toHaveText('Inte loggat');
    await expect(page.locator('section.maltid.saknas')).toHaveCount(0);
  });

  test('veckans prickar visar status, idag som ring och kommande dagar tomma', { annotation: { type: 'testfall', description: 'TC-VEC-01' } }, async ({ page, api }) => {
    await oppna(page, api);
    const p = page.locator('.prick-knapp');
    await expect(p).toHaveCount(7);
    await expect(p.nth(0)).toHaveClass(/status-i-mal/);
    await expect(p.nth(1)).toHaveClass(/status-under/);
    await expect(p.nth(2)).toHaveClass(/status-over/);
    await expect(p.nth(3)).toHaveClass(/status-for-lite/);
    await expect(p.nth(4)).toHaveClass(/status-inget/);
    await expect(p.nth(5)).toHaveClass(/idag/);
    await expect(p.nth(6)).toHaveClass(/kommande/);
    await expect(p.nth(6)).toBeDisabled();
    await expect(p.nth(0)).toHaveAttribute('aria-label', /^Måndag 19\/10: i mål, 1\s850 kcal$/);
    await expect(p.nth(0).locator('.prick-cirkel')).toHaveText('✓');
  });

  test('veckan visar dagar i mål och snitt mot målet', { annotation: { type: 'testfall', description: 'TC-VEC-02' } }, async ({ page, api }) => {
    await oppna(page, api);
    // Avslutade dagar med mat: mån–tor (fredag tom räknas inte). I mål = i mål + under målet.
    await expect(page.locator('#ida-vecka-imal')).toHaveText('i mål 2 av 4 dagar');
    await expect(page.locator('#ida-vecka-snitt')).toHaveText(/^Snitt 1\s685 kcal\/dag · mål 1\s970$/); // (1850+1700+2200+990)/4
  });

  test('tryck på en prick visar den dagen', { annotation: { type: 'testfall', description: 'TC-VEC-03' } }, async ({ page, api }) => {
    await oppna(page, api);
    await tillDag(page, '2026-10-20');
    await expect(page.locator('#ida-datum')).toHaveText('Tisdag 20 oktober');
    await expect(page.locator('.prick-knapp[data-datum="2026-10-20"]')).toHaveClass(/vald/);
    await expect(page.locator('#ida-atit')).toHaveText('1 700');
  });
});
