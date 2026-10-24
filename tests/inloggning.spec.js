const { test, expect, bild } = require('./hjalp');
const { ANVANDARE, LOSENORD } = require('./mock');

test.describe('Inloggning', () => {
  test('visar inloggningen när man inte är inloggad', { annotation: { type: 'testfall', description: 'TC-INL-01' } }, async ({ page, api }) => {
    await page.goto('./');
    await expect(page.locator('#view-login')).toBeVisible();
    await expect(page.getByLabel('E-post')).toBeVisible();
    await expect(page.getByLabel('Lösenord')).toBeVisible();
    await expect(page.locator('#view-app')).toBeHidden();
    await bild(page, 'Inloggningssidan');
  });

  test('fel lösenord ger ett tydligt felmeddelande', { annotation: { type: 'testfall', description: 'TC-INL-02' } }, async ({ page, api }) => {
    await page.goto('./');
    await page.getByLabel('E-post').fill(ANVANDARE.email);
    await page.getByLabel('Lösenord').fill('fel-losenord');
    await page.getByRole('button', { name: 'Logga in' }).click();
    await expect(page.locator('#login-msg')).toHaveText('Fel e-post eller lösenord.');
    await expect(page.locator('#login-msg')).toHaveClass(/error/);
    await expect(page.locator('#view-app')).toBeHidden();
    await bild(page, 'Fel lösenord');
  });

  test('ogiltig e-post stoppas innan något skickas', { annotation: { type: 'testfall', description: 'TC-INL-03' } }, async ({ page, api }) => {
    await page.goto('./');
    await page.getByLabel('E-post').fill('inte-en-adress');
    await page.getByLabel('Lösenord').fill(LOSENORD);
    await page.getByRole('button', { name: 'Logga in' }).click();
    await expect(page.locator('#login-msg')).toHaveText('Ange en giltig e-postadress.');
    expect(api.anrop.filter((a) => a.sokvag.startsWith('/auth/v1/token'))).toHaveLength(0);
  });

  test('rätt uppgifter loggar in', { annotation: { type: 'testfall', description: 'TC-INL-04' } }, async ({ page, api }) => {
    await page.goto('./');
    await page.getByLabel('E-post').fill('  ' + ANVANDARE.email.toUpperCase() + ' ');
    await page.getByLabel('Lösenord').fill(LOSENORD);
    await page.getByRole('button', { name: 'Logga in' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
    await expect(page.locator('#user-email')).toHaveText(ANVANDARE.email);
    await bild(page, 'Inloggad');
  });

  test('inloggningen finns kvar efter omstart', { annotation: { type: 'testfall', description: 'TC-INL-05' } }, async ({ appen: page }) => {
    await page.reload();
    await expect(page.locator('#view-app')).toBeVisible();
    await expect(page.locator('#view-login')).toBeHidden();
  });

  test('logga ut tar en tillbaka till inloggningen', { annotation: { type: 'testfall', description: 'TC-INL-06' } }, async ({ appen: page }) => {
    await page.getByRole('button', { name: 'Logga ut' }).click();
    await expect(page.locator('#view-login')).toBeVisible();
    await page.reload();
    await expect(page.locator('#view-login')).toBeVisible();
  });

  test('ingen kontakt med servern ger ett begripligt fel', { annotation: { type: 'testfall', description: 'TC-INL-07' } }, async ({ page, api }) => {
    await page.goto('./');
    api.nere = true;
    await page.getByLabel('E-post').fill(ANVANDARE.email);
    await page.getByLabel('Lösenord').fill(LOSENORD);
    await page.getByRole('button', { name: 'Logga in' }).click();
    await expect(page.locator('#login-msg')).toHaveText('Ingen kontakt med servern. Kontrollera nätet och försök igen.');
    await expect(page.getByRole('button', { name: 'Logga in' })).toBeEnabled();
  });
});
