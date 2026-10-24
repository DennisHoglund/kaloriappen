const { test, expect, bild } = require('./hjalp');
const { inloggad, ANVANDARE } = require('./mock');

const U = ANVANDARE.id;
// Mätningar de senaste veckorna (idag = 2026-10-24), plus en gammal i juni
function matningar(api) {
  api.tabeller.kalori_vikt = [
    { user_id: U, datum: '2026-06-15', vikt_kg: 97.0 },
    { user_id: U, datum: '2026-10-01', vikt_kg: 93.4 },
    { user_id: U, datum: '2026-10-05', vikt_kg: 93.0 },
    { user_id: U, datum: '2026-10-09', vikt_kg: 92.7 },
    { user_id: U, datum: '2026-10-13', vikt_kg: 92.9 },
    { user_id: U, datum: '2026-10-17', vikt_kg: 92.3 },
    { user_id: U, datum: '2026-10-21', vikt_kg: 92.0 }
  ];
}
async function oppnaVikt(page) {
  await page.getByRole('button', { name: 'Logga vikt och se graf' }).click();
  await expect(page.locator('#view-vikt')).toBeVisible();
}

test.describe('Vikt', () => {
  test('logga vikt sparar dagens mätning och ny mätning samma dag ersätter', { annotation: { type: 'testfall', description: 'TC-VIK-01' } }, async ({ appen: page, api }) => {
    await oppnaVikt(page);
    await expect(page.getByLabel(/Vikt idag/)).toHaveValue('92,0'); // förifylld med senaste
    await page.getByLabel(/Vikt idag/).fill('91,6');
    await page.getByRole('button', { name: 'Spara vikt' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
    await expect(page.locator('#toast')).toHaveText('Vikt 91,6 kg sparad');
    await oppnaVikt(page);
    await expect(page.getByLabel(/Vikt idag/)).toHaveValue('91,6');
    await page.getByLabel(/Vikt idag/).fill('91,4');
    await page.getByRole('button', { name: 'Spara vikt' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
    expect(api.tabeller.kalori_vikt.filter((v) => v.datum === '2026-10-24')).toEqual([{ user_id: U, datum: '2026-10-24', vikt_kg: 91.4 }]);
  });

  test('ny vikt uppdaterar dagsmålet', { annotation: { type: 'testfall', description: 'TC-VIK-02' } }, async ({ appen: page }) => {
    await expect(page.locator('#ida-mal')).toHaveText('1 970');
    await oppnaVikt(page);
    await page.getByLabel(/Vikt idag/).fill('80');
    await page.getByRole('button', { name: 'Spara vikt' }).click();
    await expect(page.locator('#ida-mal')).toHaveText('1 800'); // (10·80 + 6,25·182 − 5·46 + 5) × 1,375 − 550 ≈ 1 805 → 1 800
    await expect(page.locator('#ida-vikt')).toHaveText('80,0 kg');
  });

  test('grafen visar mätningar, 7-dagars medel och målvikt', { annotation: { type: 'testfall', description: 'TC-VIK-03' } }, async ({ page, api }) => {
    matningar(api);
    await inloggad(page);
    await page.goto('./');
    await oppnaVikt(page);
    const graf = page.locator('#vik-graf svg');
    await expect(graf).toHaveAttribute('aria-label', /^Vikt från 93,4 till 92,0 kg mellan 1 okt\.? och 21 okt\.?, målvikt 85,0 kg$/);
    await expect(graf.locator('.graf-punkt')).toHaveCount(6); // juni ligger utanför 30 dagar
    await expect(graf.locator('.graf-medel')).toHaveCount(1);
    await expect(graf.locator('.graf-mal')).toHaveCount(1);
    await expect(graf.locator('text', { hasText: 'Mål 85,0' })).toHaveCount(1);
    await expect(page.locator('.vik-rad').first()).toContainText('92,0 kg');
    await bild(page, 'Viktgraf');
  });

  test('perioden kan väljas: 30 dagar, 90 dagar eller allt', { annotation: { type: 'testfall', description: 'TC-VIK-04' } }, async ({ page, api }) => {
    matningar(api);
    await inloggad(page);
    await page.goto('./');
    await oppnaVikt(page);
    await expect(page.locator('.graf-punkt')).toHaveCount(6);
    await page.locator('label[for="vik-period-90"]').click();
    await expect(page.locator('.graf-punkt')).toHaveCount(6);
    await page.locator('label[for="vik-period-0"]').click();
    await expect(page.locator('.graf-punkt')).toHaveCount(7);
    await expect(page.locator('#vik-graf svg')).toHaveAttribute('aria-label', /^Vikt från 97,0 till 92,0/);
  });

  test('med bara en mätning visas en förklaring i stället för graf', { annotation: { type: 'testfall', description: 'TC-VIK-06' } }, async ({ appen: page }) => {
    await oppnaVikt(page);
    await expect(page.locator('.graf-tom')).toHaveText('Logga minst två mätningar för att se en graf.');
    await expect(page.locator('#vik-graf svg')).toHaveCount(0);
  });

  test('ogiltig vikt stoppas', { annotation: { type: 'testfall', description: 'TC-VIK-07' } }, async ({ appen: page, api }) => {
    await oppnaVikt(page);
    for (const v of ['12', '400', 'tung']) {
      await page.getByLabel(/Vikt idag/).fill(v);
      await page.getByRole('button', { name: 'Spara vikt' }).click();
      await expect(page.locator('#vik-msg')).toHaveText('Vikten ska vara mellan 30 och 300 kg.');
    }
    expect(api.tabeller.kalori_vikt).toHaveLength(1);
  });

  test('vikt på en tidigare dag sparas på den dagen', { annotation: { type: 'testfall', description: 'TC-VIK-08' } }, async ({ appen: page, api }) => {
    await page.getByRole('button', { name: 'Föregående dag' }).click();
    await oppnaVikt(page);
    await expect(page.locator('#vik-datum')).toHaveText(/23 okt/);
    await page.locator('#vik-vikt').fill('92,2');
    await page.getByRole('button', { name: 'Spara vikt' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
    expect(api.tabeller.kalori_vikt.find((v) => v.datum === '2026-10-23').vikt_kg).toBe(92.2);
  });

  test('viktkortet i dagsöversikten visar senaste vikt och förändring', { annotation: { type: 'testfall', description: 'TC-VIK-09' } }, async ({ page, api }) => {
    matningar(api);
    await inloggad(page);
    await page.goto('./');
    await expect(page.locator('#ida-vikt')).toHaveText('92,0 kg');
    await expect(page.locator('#ida-vikt-info')).toHaveText(/^Senast 21 okt\.? · −5,0 kg sedan 15 juni$/);
  });
});
