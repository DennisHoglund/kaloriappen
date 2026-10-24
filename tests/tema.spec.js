const { test, expect, bild } = require('./hjalp');

test.describe('Tema', () => {
  test('temaknappen växlar Auto → Ljust → Mörkt och sparar valet', { annotation: { type: 'testfall', description: 'TC-TEM-01' } }, async ({ appen: page }) => {
    const knapp = page.locator('#btn-theme');
    await expect(page.locator('#theme-label')).toHaveText('Auto');
    await knapp.click();
    await expect(page.locator('#theme-label')).toHaveText('Ljust');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await knapp.click();
    await expect(page.locator('#theme-label')).toHaveText('Mörkt');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('#view-app')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#theme-label')).toHaveText('Mörkt');
    await knapp.click();
    await expect(page.locator('#theme-label')).toHaveText('Auto');
  });

  test('mörkt läge följer telefonens inställning', { annotation: { type: 'testfall', description: 'TC-TEM-02' } }, async ({ page, api }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await require('./mock').inloggad(page);
    await page.goto('./');
    await expect(page.locator('#view-app')).toBeVisible();
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(14, 20, 48)');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0E1430');
    await bild(page, 'Inloggad i mörkt läge');
  });

  test('ljust läge har Blåbär-färgerna', { annotation: { type: 'testfall', description: 'TC-TEM-03' } }, async ({ page, api }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('./');
    await expect(page.locator('#view-login')).toBeVisible();
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(244, 246, 252)');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#F4F6FC');
    await bild(page, 'Inloggningen i ljust läge');
  });
});
