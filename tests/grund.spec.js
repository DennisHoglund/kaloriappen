const { test, expect, bild } = require('./hjalp');

test.describe('Grund', () => {
  test('appen startar och visar startsidan', { annotation: { type: 'testfall', description: 'TC-GRU-01' } }, async ({ page, api }) => {
    const fel = [];
    page.on('pageerror', (e) => fel.push(e.message));
    await page.goto('./');
    await expect(page.locator('#view-start')).toBeVisible();
    await expect(page.locator('#view-loading')).toBeHidden();
    await expect(page.getByRole('heading', { name: 'Kaloriappen' })).toBeVisible();
    expect(fel).toEqual([]);
    await bild(page, 'Startsidan');
  });

  test('manifestet beskriver en installerbar app', { annotation: { type: 'testfall', description: 'TC-GRU-02' } }, async ({ page, api }) => {
    const res = await page.request.get('manifest.webmanifest');
    expect(res.ok()).toBeTruthy();
    const m = await res.json();
    expect(m.name).toBe('Kaloriappen');
    expect(m.display).toBe('standalone');
    expect(m.lang).toBe('sv');
  });

  test('ikonerna finns i alla storlekar', { annotation: { type: 'testfall', description: 'TC-GRU-04' } }, async ({ page, api }) => {
    const m = await (await page.request.get('manifest.webmanifest')).json();
    expect(m.icons.map((i) => i.sizes + ' ' + i.purpose)).toEqual(['192x192 any', '512x512 any', '512x512 maskable']);
    for (const fil of [...m.icons.map((i) => i.src), 'icons/apple-touch-icon.png', 'icons/icon.svg']) {
      const res = await page.request.get(fil);
      expect(res.ok(), fil + ' ska finnas').toBeTruthy();
    }
    await page.goto('./');
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', 'icons/apple-touch-icon.png');
  });

  test('alla filer i service workerns appskal finns', { annotation: { type: 'testfall', description: 'TC-GRU-03' } }, async ({ page, api }) => {
    const src = await (await page.request.get('sw.js')).text();
    expect(src).toMatch(/const CACHE = 'kalori-v\d+'/);
    const shell = [...src.match(/const SHELL = \[([\s\S]*?)\]/)[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
    for (const fil of shell) {
      const res = await page.request.get(fil);
      expect(res.ok(), fil + ' ska finnas').toBeTruthy();
    }
  });
});
