// Gemensamma hjälpfunktioner och fixturer för testerna.
const base = require('@playwright/test');
const { mocka } = require('./mock');

const test = base.test.extend({
  // Mockar allt externt innan varje test. api ger tillgång till "databasen".
  api: async ({ page }, use) => {
    const api = await mocka(page);
    await use(api);
  }
});

// Bifogar en skärmdump till rapporten
async function bild(page, namn) {
  await page.waitForTimeout(250); // låt animationer landa
  await test.info().attach(namn, { body: await page.screenshot(), contentType: 'image/png' });
}

module.exports = { test, expect: base.expect, bild };
