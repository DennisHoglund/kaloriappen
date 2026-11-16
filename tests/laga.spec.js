// Laga mat: ingredienser från foto, förslag, recept, logga en portion och Hur blev det? (US-16–US-19)
const path = require('path');
const { test, expect, bild } = require('./hjalp');
const { ANVANDARE } = require('./mock');

const TALLRIK = path.join(__dirname, 'data', 'tallrik.jpg'); // 1600 × 1200
const U = ANVANDARE.id;

const sparat = (namn, o = {}) => ({ id: 'rec-' + namn.length, user_id: U, namn, beskrivning: '', portioner: 4, kcal_portion: 500, tid_min: 30,
  ingredienser: [], steg: ['Laga.'], betyg: null, anteckning: null, antal_lagad: 0, senast_lagad: null, ...o });

async function lagaMat(page) {
  await page.locator('#btn-laga').click();
  await expect(page.locator('#view-laga')).toBeVisible();
}
async function fotaIngredienser(page, filer = [TALLRIK]) {
  await page.locator('#lag-foto-input').setInputFiles(filer);
  await expect(page.locator('#lag-chips .chip')).not.toHaveCount(0);
}
async function tillForslag(page) {
  await lagaMat(page);
  await fotaIngredienser(page);
  await page.locator('#lag-foresla').click();
  await expect(page.locator('#lag-forslag')).toBeVisible();
}
const chips = (page) => page.locator('#lag-chips .chip span');

test.describe('Laga mat', () => {
  test('ingredienser hittas på flera foton och går att ta bort', { annotation: { type: 'testfall', description: 'TC-LAG-01' } }, async ({ appen: page, api }) => {
    await lagaMat(page);
    await expect(page.locator('#lag-foresla')).toBeDisabled();
    await fotaIngredienser(page, [TALLRIK, TALLRIK]);
    await expect(chips(page)).toHaveText(['Kycklingfilé', 'Röd paprika', 'Gul lök']);
    expect(api.receptAnrop[0].body.uppgift).toBe('ingredienser');
    expect(api.receptAnrop[0].body.bilder).toHaveLength(2);
    const storlek = Buffer.from(api.receptAnrop[0].body.bilder[0], 'base64').length;
    expect(storlek).toBeLessThan(400 * 1024); // krympt innan den skickas
    await expect(page.locator('#lag-fota-text')).toHaveText('+ Fota fler');
    await bild(page, 'Ingredienser från foto');
    await page.getByRole('button', { name: 'Ta bort Gul lök' }).click();
    await expect(chips(page)).toHaveText(['Kycklingfilé', 'Röd paprika']);
    // Fler foton lägger till, utan dubbletter
    api.recept.ingredienser = { status: 200, body: { ingredienser: ['Röd paprika', 'Vitlök'] } };
    await page.locator('#lag-foto-input').setInputFiles(TALLRIK);
    await expect(chips(page)).toHaveText(['Kycklingfilé', 'Röd paprika', 'Vitlök']);
  });

  test('ingredienser kan skrivas in för hand', { annotation: { type: 'testfall', description: 'TC-LAG-02' } }, async ({ appen: page }) => {
    await lagaMat(page);
    await page.locator('#lag-ny').fill('lax');
    await page.locator('#lag-ny').press('Enter');
    await page.locator('#lag-ny').fill('citron, dill, Lax');
    await page.getByRole('button', { name: '+ Lägg till' }).click();
    await expect(chips(page)).toHaveText(['Lax', 'Citron', 'Dill']);
    await expect(page.locator('#lag-ny')).toHaveValue('');
    await expect(page.locator('#lag-foresla')).toBeEnabled();
  });

  test('misslyckad analys visar ett meddelande och man kan skriva in själv', { annotation: { type: 'testfall', description: 'TC-LAG-03' } }, async ({ appen: page, api }) => {
    api.recept.ingredienser = { status: 422, body: { fel: 'tom', meddelande: 'Hittade inga ingredienser. Skriv in dem själv.' } };
    await lagaMat(page);
    await page.locator('#lag-foto-input').setInputFiles(TALLRIK);
    await expect(page.locator('#lag-msg')).toContainText('Hittade inga ingredienser');
    await expect(page.locator('#lag-msg')).toHaveClass(/error/);
    api.recept.ingredienser = { status: 429, body: { fel: 'kvot', meddelande: 'Dagens gratisanrop är slut. Försök senare.' } };
    await page.locator('#lag-foto-input').setInputFiles(TALLRIK);
    await expect(page.locator('#lag-msg')).toContainText('gratisanrop är slut');
    await page.locator('#lag-ny').fill('Ägg');
    await page.locator('#lag-ny').press('Enter');
    await expect(chips(page)).toHaveText(['Ägg']);
    await expect(page.locator('#lag-msg')).toHaveText('');
  });

  test('förslag visar kcal, tid, portioner, vad som saknas och om det passar Kvar', { annotation: { type: 'testfall', description: 'TC-LAG-04' } }, async ({ appen: page, api }) => {
    await lagaMat(page);
    await expect(page.locator('#lag-kvar')).toHaveText('Kvar idag: 1 970 kcal – förslagen anpassas efter det.');
    await fotaIngredienser(page);
    await page.locator('#lag-foresla').click();
    await expect(page.locator('#lag-forslag')).toBeVisible();
    const f = api.receptAnrop.find((a) => a.body.uppgift === 'forslag').body;
    expect(f).toEqual({ uppgift: 'forslag', ingredienser: ['Kycklingfilé', 'Röd paprika', 'Gul lök'], kvarKcal: 1970, undvik: [] });
    const kort = page.locator('#lag-forslag-lista .recept-kort-knapp');
    await expect(kort).toHaveCount(3);
    await expect(kort.nth(0)).toContainText('Kyckling- och paprikawok');
    await expect(kort.nth(0)).toContainText('560 kcal/portion · 20 min · 2 portioner');
    await expect(kort.nth(0).locator('.marke')).toHaveText('Passar Kvar');
    await expect(kort.nth(1)).toContainText('Saknas: matlagningsgrädde');
    await expect(kort.nth(2).locator('.marke')).toHaveText('Över Kvar');
    await expect(page.locator('#lag-forslag-intro')).toContainText('Med kycklingfilé, röd paprika, gul lök. Kvar idag: 1 970 kcal.');
    await bild(page, 'Förslag på rätter');
    await page.locator('#lag-tillbaka').click(); // ← Ingredienser
    await expect(page.locator('#lag-ing')).toBeVisible();
    await expect(chips(page)).toHaveCount(3);
  });

  test('Ge mig andra förslag ger nya rätter', { annotation: { type: 'testfall', description: 'TC-LAG-05' } }, async ({ appen: page, api }) => {
    await tillForslag(page);
    api.recept.forslag = { status: 200, body: { forslag: [{ namn: 'Fylld paprika', beskrivning: 'I ugn.', kcalPortion: 480, tidMin: 45, portioner: 2, saknas: [] }] } };
    await page.locator('#lag-andra').click();
    await expect(page.locator('#lag-forslag-lista .recept-kort-namn')).toHaveText(['Fylld paprika']);
    const andra = api.receptAnrop.filter((a) => a.body.uppgift === 'forslag')[1].body;
    expect(andra.undvik).toEqual(['Kyckling- och paprikawok', 'Kycklinggryta med paprika', 'Kycklingbiryani']);
  });

  test('recept ur receptboken som passar ingredienserna visas först', { annotation: { type: 'testfall', description: 'TC-LAG-06' } }, async ({ page, api }) => {
    api.tabeller.kalori_recept = [
      sparat('Kycklinggryta med paprika', { betyg: 5, antal_lagad: 6, kcal_portion: 520, ingredienser: [{ namn: 'Kycklingfilé', mangd: 600, enhet: 'g' }, { namn: 'Röd paprika', mangd: 2, enhet: 'st' }] }),
      sparat('Stekt ris med kyckling', { betyg: 3, ingredienser: [{ namn: 'Kyckling', mangd: 300, enhet: 'g' }] }),
      sparat('Laxpasta', { betyg: 5, ingredienser: [{ namn: 'Lax', mangd: 300, enhet: 'g' }] })
    ];
    const { inloggad } = require('./mock');
    await inloggad(page);
    await page.goto('./');
    await lagaMat(page);
    await expect(page.locator('#lag-bok')).toBeHidden();
    await fotaIngredienser(page);
    await expect(page.locator('#lag-bok')).toBeVisible();
    await expect(page.locator('#lag-bok-antal')).toHaveText('2 passar');
    await expect(page.locator('#lag-bok-lista .recept-kort-namn')).toHaveText(['Kycklinggryta med paprika', 'Stekt ris med kyckling']);
    await expect(page.locator('#lag-bok-lista .recept-kort-knapp').first()).toContainText('lagad 6 ggr');
    await bild(page, 'Från din receptbok');
    await page.locator('#lag-bok-lista .recept-kort-knapp').first().click();
    await expect(page.locator('#rec-namn')).toHaveText('Kycklinggryta med paprika');
    await expect(page.locator('#rec-andra')).toBeVisible();
    await page.locator('#rec-tillbaka').click();
    await expect(page.locator('#lag-ing')).toBeVisible();
  });

  test('valt förslag blir ett recept och portionerna räknar om mängderna', { annotation: { type: 'testfall', description: 'TC-LAG-07' } }, async ({ appen: page, api }) => {
    await tillForslag(page);
    await page.locator('#lag-forslag-lista .recept-kort-knapp').first().click();
    await expect(page.locator('#rec-innehall')).toBeVisible();
    const r = api.receptAnrop.find((a) => a.body.uppgift === 'recept').body;
    expect(r.ratt).toEqual({ namn: 'Kyckling- och paprikawok', beskrivning: 'Snabb wok med vitlök och soja.', portioner: 2 });
    expect(r.ingredienser).toEqual(['Kycklingfilé', 'Röd paprika', 'Gul lök']);
    await expect(page.locator('#rec-namn')).toHaveText('Kyckling- och paprikawok');
    await expect(page.locator('#rec-kcal')).toHaveText('560');
    await expect(page.locator('#rec-tid')).toHaveText('20');
    await expect(page.locator('#rec-betyg')).toContainText('inte betygsatt');
    await expect(page.locator('#rec-ingredienser li')).toHaveText(['Kycklingfilé300 g', 'Röd paprika1 st', 'Jasminris1,5 dl', 'Saltefter smak']);
    await expect(page.locator('#rec-steg li')).toHaveCount(3);
    await expect(page.locator('#rec-logga')).toHaveText('Logga en portion (560 kcal)');
    await expect(page.locator('#rec-spara')).toBeVisible();
    await bild(page, 'Receptet');
    await page.locator('#rec-fler').click();
    await page.locator('#rec-fler').click();
    await expect(page.locator('#rec-portioner')).toHaveText('4');
    await expect(page.locator('#rec-ingredienser li')).toHaveText(['Kycklingfilé600 g', 'Röd paprika2 st', 'Jasminris3 dl', 'Saltefter smak']);
    await expect(page.locator('#rec-kcal')).toHaveText('560'); // per portion oförändrat
    await page.locator('#rec-tillbaka').click();
    await expect(page.locator('#lag-forslag')).toBeVisible();
  });

  test('misslyckat recept kan försökas igen', { annotation: { type: 'testfall', description: 'TC-LAG-08' } }, async ({ appen: page, api }) => {
    await tillForslag(page);
    const ok = api.recept.recept;
    api.recept.recept = { status: 504, body: { fel: 'tid', meddelande: 'Det tog för lång tid. Försök igen.' } };
    await page.locator('#lag-forslag-lista .recept-kort-knapp').first().click();
    await expect(page.locator('#rec-feltext')).toHaveText('Det tog för lång tid. Försök igen.');
    await expect(page.locator('#rec-spara')).toBeHidden();
    api.recept.recept = ok;
    await page.locator('#rec-forsok').click();
    await expect(page.locator('#rec-namn')).toHaveText('Kyckling- och paprikawok');
  });

  test('Spara i receptboken sparar receptet', { annotation: { type: 'testfall', description: 'TC-LAG-09' } }, async ({ appen: page, api }) => {
    await tillForslag(page);
    await page.locator('#lag-forslag-lista .recept-kort-knapp').first().click();
    await page.locator('#rec-spara').click();
    await expect(page.locator('#rec-andra')).toBeVisible();
    await expect(page.locator('#rec-spara')).toBeHidden();
    await expect(page.locator('#toast')).toHaveText('Sparat i receptboken');
    expect(api.tabeller.kalori_recept).toHaveLength(1);
    expect(api.tabeller.kalori_recept[0]).toMatchObject({ user_id: U, namn: 'Kyckling- och paprikawok', portioner: 2, kcal_portion: 560, tid_min: 20,
      betyg: null, antal_lagad: 0, steg: ['Koka riset.', 'Strimla kyckling och paprika.', 'Woka allt på hög värme.'] });
    expect(api.tabeller.kalori_recept[0].ingredienser[0]).toEqual({ namn: 'Kycklingfilé', mangd: 300, enhet: 'g' });
  });

  test('logga en portion och sätt betyg sparar receptet i receptboken', { annotation: { type: 'testfall', description: 'TC-LAG-10' } }, async ({ appen: page, api }) => {
    await tillForslag(page);
    await page.locator('#lag-forslag-lista .recept-kort-knapp').first().click();
    await page.locator('#rec-logga').click();
    await expect(page.locator('#view-app')).toBeVisible();
    // Måltiden: receptets namn och kcal per portion, föreslagen måltid efter klockan (10:00 → lunch)
    expect(api.tabeller.kalori_maltid).toHaveLength(1);
    expect(api.tabeller.kalori_maltid[0]).toMatchObject({ typ: 'lunch', kalla: 'recept' });
    expect(api.tabeller.kalori_maltid_rad[0]).toMatchObject({ namn: 'Kyckling- och paprikawok', kcal: 560, gram: 225, livsmedel_nr: null });
    await expect(page.locator('#ida-atit')).toHaveText('560');
    await expect(page.locator('#ida-betyg')).toBeVisible();
    await expect(page.locator('#ida-betyg-loggad')).toHaveText('Kyckling- och paprikawok loggad till lunch (560 kcal)');
    expect(api.tabeller.kalori_recept).toHaveLength(0); // inget sparat ännu
    // Spara betyg utan stjärnor går inte
    await page.locator('#ida-betyg-spara').click();
    await expect(page.locator('#ida-betyg-msg')).toHaveText('Välj antal stjärnor.');
    await page.getByRole('radio', { name: '4 stjärnor' }).click();
    await page.locator('#ida-betyg-anteckning').fill('Mer vitlök');
    await bild(page, 'Hur blev det?');
    await page.locator('#ida-betyg-spara').click();
    await expect(page.locator('#ida-betyg')).toBeHidden();
    await expect(page.locator('#toast')).toHaveText('Betyget sparat i receptboken');
    expect(api.tabeller.kalori_recept[0]).toMatchObject({ namn: 'Kyckling- och paprikawok', betyg: 4, anteckning: 'Mer vitlök', antal_lagad: 1, senast_lagad: '2026-10-24' });
  });

  test('Hoppa över sparar inget', { annotation: { type: 'testfall', description: 'TC-LAG-11' } }, async ({ appen: page, api }) => {
    await tillForslag(page);
    await page.locator('#lag-forslag-lista .recept-kort-knapp').first().click();
    await page.locator('#rec-logga').click();
    await expect(page.locator('#ida-betyg')).toBeVisible();
    await page.locator('#ida-betyg-hoppa').click();
    await expect(page.locator('#ida-betyg')).toBeHidden();
    expect(api.tabeller.kalori_recept).toHaveLength(0);
    expect(api.tabeller.kalori_maltid).toHaveLength(1); // måltiden är loggad ändå
  });

  test('fel vid loggning visar meddelande och inget sparas', { annotation: { type: 'testfall', description: 'TC-LAG-12' } }, async ({ appen: page, api }) => {
    await tillForslag(page);
    await page.locator('#lag-forslag-lista .recept-kort-knapp').first().click();
    api.felVidSparning = true;
    await page.locator('#rec-logga').click();
    await expect(page.locator('#rec-msg')).toHaveText('Kunde inte logga. Kontrollera nätet och försök igen.');
    await expect(page.locator('#view-recept')).toBeVisible();
    await page.locator('#rec-spara').click();
    await expect(page.locator('#rec-msg')).toHaveText('Kunde inte spara receptet. Kontrollera nätet och försök igen.');
    expect(api.tabeller.kalori_maltid).toHaveLength(0);
    expect(api.tabeller.kalori_recept).toHaveLength(0);
  });
});
