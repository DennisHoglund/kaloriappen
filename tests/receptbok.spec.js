// Receptboken: lista, sök, filter, sortering, logga igen, ändra allt och ta bort (US-19, US-20)
const { test, expect, bild } = require('./hjalp');
const { ANVANDARE, inloggad } = require('./mock');

const U = ANVANDARE.id;
const recept = (id, namn, o = {}) => ({ id, user_id: U, namn, beskrivning: '', portioner: 4, kcal_portion: 500, tid_min: 30,
  ingredienser: [], steg: ['Laga.'], betyg: null, anteckning: null, antal_lagad: 0, senast_lagad: null, ...o });
const BOK = () => [
  recept('r1', 'Kycklinggryta med paprika', { betyg: 5, antal_lagad: 6, senast_lagad: '2026-10-12', kcal_portion: 520, tid_min: 35, anteckning: 'Mer vitlök, halva chilin',
    ingredienser: [{ namn: 'Kycklingfilé', mangd: 600, enhet: 'g' }, { namn: 'Röd paprika', mangd: 2, enhet: 'st' }, { namn: 'Crème fraiche', mangd: 2, enhet: 'dl' }],
    steg: ['Strimla kycklingen.', 'Bryn i olja.', 'Häll i crème fraiche.'] }),
  recept('r2', 'Kyckling- och paprikawok', { betyg: 4, antal_lagad: 3, senast_lagad: '2026-10-15', kcal_portion: 560, tid_min: 20, portioner: 2,
    ingredienser: [{ namn: 'Kycklingfilé', mangd: 300, enhet: 'g' }] }),
  recept('r3', 'Pannkakor', { betyg: 3, antal_lagad: 1, senast_lagad: '2026-10-02', kcal_portion: 380, ingredienser: [{ namn: 'Ägg', mangd: 3, enhet: 'st' }, { namn: 'Mjölk', mangd: 6, enhet: 'dl' }] }),
  recept('r4', 'Ärtsoppa', { kcal_portion: 300 })
];

async function oppnaBok(page, api, bok = BOK()) {
  api.tabeller.kalori_recept = bok;
  await inloggad(page);
  await page.goto('./');
  await page.locator('#btn-receptbok').click();
  await expect(page.locator('#view-receptbok')).toBeVisible();
}
const namn = (page) => page.locator('#bok-lista .recept-kort-namn');

test.describe('Receptbok', () => {
  test('receptboken visar stjärnor, kcal, tid, antal gånger och anteckning', { annotation: { type: 'testfall', description: 'TC-BOK-01' } }, async ({ page, api }) => {
    await oppnaBok(page, api);
    await expect(namn(page)).toHaveText(['Kycklinggryta med paprika', 'Kyckling- och paprikawok', 'Pannkakor', 'Ärtsoppa']);
    await expect(page.locator('#bok-antal')).toHaveText('4 recept');
    const forsta = page.locator('#bok-lista .recept-kort-knapp').first();
    await expect(forsta.locator('.stjarnor')).toHaveText('★★★★★');
    await expect(forsta).toContainText('520 kcal/portion · 35 min · lagad 6 ggr · senast 12 okt.');
    await expect(forsta).toContainText('”Mer vitlök, halva chilin”');
    await expect(page.locator('#bok-lista .recept-kort-knapp').nth(2)).toContainText('lagad 1 gång');
    await expect(page.locator('#bok-lista .recept-kort-knapp').nth(3).locator('.stjarnor')).toHaveAttribute('aria-label', 'Inget betyg');
    await bild(page, 'Receptboken');
  });

  test('fritextsök i namn, ingredienser och anteckning', { annotation: { type: 'testfall', description: 'TC-BOK-02' } }, async ({ page, api }) => {
    await oppnaBok(page, api);
    await page.locator('#bok-sok').fill('paprika');
    await expect(namn(page)).toHaveText(['Kycklinggryta med paprika', 'Kyckling- och paprikawok']);
    await page.locator('#bok-sok').fill('CREME');      // ingrediens, utan accent
    await expect(namn(page)).toHaveText(['Kycklinggryta med paprika']);
    await page.locator('#bok-sok').fill('vitlök chili'); // anteckningen, alla ord
    await expect(namn(page)).toHaveText(['Kycklinggryta med paprika']);
    await page.locator('#bok-sok').fill('artsoppa');
    await expect(namn(page)).toHaveText(['Ärtsoppa']);
    await page.locator('#bok-sok').fill('tacos');
    await expect(namn(page)).toHaveCount(0);
    await expect(page.locator('#bok-tom')).toHaveText('Inga recept matchar.');
    await expect(page.locator('#bok-antal')).toHaveText('0 recept');
  });

  test('filter på stjärnor', { annotation: { type: 'testfall', description: 'TC-BOK-03' } }, async ({ page, api }) => {
    await oppnaBok(page, api);
    await page.locator('label[for="bok-betyg-4"]').click();
    await expect(namn(page)).toHaveText(['Kycklinggryta med paprika', 'Kyckling- och paprikawok']);
    await page.locator('label[for="bok-betyg-5"]').click();
    await expect(namn(page)).toHaveText(['Kycklinggryta med paprika']);
    await page.locator('label[for="bok-betyg-3"]').click();
    await expect(namn(page)).toHaveCount(3);
    await page.locator('#bok-sok').fill('kyckling'); // sök och filter tillsammans
    await page.locator('label[for="bok-betyg-5"]').click();
    await expect(namn(page)).toHaveText(['Kycklinggryta med paprika']);
    await page.locator('label[for="bok-betyg-0"]').click();
    await expect(namn(page)).toHaveCount(2);
  });

  test('sortering på betyg, senast lagad, flest gånger och lägst kcal', { annotation: { type: 'testfall', description: 'TC-BOK-04' } }, async ({ page, api }) => {
    await oppnaBok(page, api);
    await page.locator('#bok-sortera').selectOption('senast');
    await expect(namn(page)).toHaveText(['Kyckling- och paprikawok', 'Kycklinggryta med paprika', 'Pannkakor', 'Ärtsoppa']);
    await page.locator('#bok-sortera').selectOption('flest');
    await expect(namn(page)).toHaveText(['Kycklinggryta med paprika', 'Kyckling- och paprikawok', 'Pannkakor', 'Ärtsoppa']);
    await page.locator('#bok-sortera').selectOption('kcal');
    await expect(namn(page)).toHaveText(['Ärtsoppa', 'Pannkakor', 'Kycklinggryta med paprika', 'Kyckling- och paprikawok']);
  });

  test('tom receptbok och fel vid hämtning', { annotation: { type: 'testfall', description: 'TC-BOK-05' } }, async ({ page, api }) => {
    await oppnaBok(page, api, []);
    await expect(page.locator('#bok-tom')).toContainText('Inga recept ännu');
    await page.locator('#bok-laga').click();
    await expect(page.locator('#view-laga')).toBeVisible();
    await page.locator('#lag-tillbaka').click();
    api.nere = true;
    await page.locator('#btn-receptbok').click();
    await expect(page.locator('#bok-fel')).toBeVisible();
  });

  test('sparat recept loggas igen: antal gånger och senast lagad uppdateras', { annotation: { type: 'testfall', description: 'TC-BOK-06' } }, async ({ page, api }) => {
    await oppnaBok(page, api);
    await page.locator('#bok-lista .recept-kort-knapp').first().click();
    await expect(page.locator('#rec-namn')).toHaveText('Kycklinggryta med paprika');
    await expect(page.locator('#rec-betyg')).toContainText('5 av 5');
    await expect(page.locator('#rec-anteckning')).toHaveText('”Mer vitlök, halva chilin”');
    await expect(page.locator('#rec-lagad')).toHaveText('Lagad 6 ggr · senast 12 okt.');
    await expect(page.locator('#rec-spara')).toBeHidden();
    await bild(page, 'Sparat recept');
    await page.locator('#rec-logga').click();
    await expect(page.locator('#view-app')).toBeVisible();
    const r1 = api.tabeller.kalori_recept.find((r) => r.id === 'r1');
    expect(r1).toMatchObject({ antal_lagad: 7, senast_lagad: '2026-10-24' });
    expect(api.tabeller.kalori_maltid_rad[0]).toMatchObject({ namn: 'Kycklinggryta med paprika', kcal: 520, gram: 200 });
    // Betyget är förvalt och kan ändras
    await expect(page.getByRole('radio', { name: '5 stjärnor' })).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('#ida-betyg-anteckning')).toHaveValue('Mer vitlök, halva chilin');
    await page.getByRole('radio', { name: '3 stjärnor' }).click();
    await page.locator('#ida-betyg-spara').click();
    await expect(page.locator('#ida-betyg')).toBeHidden();
    expect(api.tabeller.kalori_recept.find((r) => r.id === 'r1')).toMatchObject({ betyg: 3, antal_lagad: 7 });
    expect(api.tabeller.kalori_recept).toHaveLength(4); // inget nytt recept
  });

  test('allt i ett sparat recept går att ändra', { annotation: { type: 'testfall', description: 'TC-BOK-07' } }, async ({ page, api }) => {
    await oppnaBok(page, api);
    await page.locator('#bok-lista .recept-kort-knapp').first().click();
    await page.locator('#rec-andra').click();
    await expect(page.locator('#view-recept-andra')).toBeVisible();
    await expect(page.locator('#rea-namn')).toHaveValue('Kycklinggryta med paprika');
    await expect(page.locator('#rea-betyg-5')).toBeChecked();
    await expect(page.locator('#rea-ingredienser li')).toHaveCount(3);
    await page.locator('#rea-namn').fill('Kycklinggryta deluxe');
    await page.locator('#rea-beskrivning').fill('Med extra allt');
    await page.locator('#rea-portioner').fill('6');
    await page.locator('#rea-kcal').fill('480');
    await page.locator('#rea-tid').fill('40');
    await page.locator('label[for="rea-betyg-4"]').click();
    await page.locator('#rea-anteckning').fill('Bättre med ris');
    await page.locator('#rea-ing-mangd-0').fill('900');
    await page.getByRole('button', { name: 'Ta bort Crème fraiche' }).click();
    await page.locator('#rea-ny-ing').click();
    await page.locator('#rea-ing-namn-2').fill('Kokosmjölk');
    await page.locator('#rea-ing-mangd-2').fill('2,5');
    await page.locator('#rea-ing-enhet-2').fill('dl');
    await page.getByRole('button', { name: 'Ta bort steg 2' }).click();
    await page.locator('#rea-nytt-steg').click();
    await page.locator('#rea-steg-2').fill('Servera med ris.');
    await bild(page, 'Ändra recept');
    await page.locator('#form-recept button[type="submit"]').click();
    await expect(page.locator('#view-recept')).toBeVisible();
    await expect(page.locator('#rec-namn')).toHaveText('Kycklinggryta deluxe');
    await expect(page.locator('#rec-portioner')).toHaveText('6');
    const r1 = api.tabeller.kalori_recept.find((r) => r.id === 'r1');
    expect(r1).toMatchObject({ namn: 'Kycklinggryta deluxe', beskrivning: 'Med extra allt', portioner: 6, kcal_portion: 480, tid_min: 40, betyg: 4, anteckning: 'Bättre med ris',
      antal_lagad: 6, senast_lagad: '2026-10-12' });
    expect(r1.ingredienser).toEqual([{ namn: 'Kycklingfilé', mangd: 900, enhet: 'g' }, { namn: 'Röd paprika', mangd: 2, enhet: 'st' }, { namn: 'Kokosmjölk', mangd: 2.5, enhet: 'dl' }]);
    expect(r1.steg).toEqual(['Strimla kycklingen.', 'Häll i crème fraiche.', 'Servera med ris.']);
    await page.locator('#rec-tillbaka').click();
    await expect(namn(page).first()).toHaveText('Kycklinggryta deluxe');
  });

  test('ogiltiga värden när man ändrar stoppas', { annotation: { type: 'testfall', description: 'TC-BOK-08' } }, async ({ page, api }) => {
    await oppnaBok(page, api);
    await page.locator('#bok-lista .recept-kort-knapp').first().click();
    await page.locator('#rec-andra').click();
    const spara = page.locator('#form-recept button[type="submit"]');
    await page.locator('#rea-namn').fill('');
    await spara.click();
    await expect(page.locator('#rea-msg')).toHaveText('Receptet behöver ett namn.');
    await page.locator('#rea-namn').fill('Gryta');
    await page.locator('#rea-portioner').fill('0');
    await spara.click();
    await expect(page.locator('#rea-msg')).toHaveText('Portioner ska vara ett heltal mellan 1 och 20.');
    await page.locator('#rea-portioner').fill('4');
    await page.locator('#rea-kcal').fill('9000');
    await spara.click();
    await expect(page.locator('#rea-msg')).toContainText('kcal per portion');
    await page.locator('#rea-kcal').fill('500');
    await page.locator('#rea-ing-namn-0').fill('');
    await spara.click();
    await expect(page.locator('#rea-msg')).toHaveText('Alla ingredienser behöver ett namn.');
    expect(api.tabeller.kalori_recept.find((r) => r.id === 'r1').namn).toBe('Kycklinggryta med paprika');
    await page.locator('#rea-tillbaka').click();
    await expect(page.locator('#rec-namn')).toHaveText('Kycklinggryta med paprika');
  });

  test('ta bort ett recept efter bekräftelse', { annotation: { type: 'testfall', description: 'TC-BOK-09' } }, async ({ page, api }) => {
    await oppnaBok(page, api);
    await page.locator('#bok-lista .recept-kort-knapp').nth(2).click();
    await page.locator('#rec-andra').click();
    await page.locator('#rea-ta-bort').click();
    await expect(page.locator('#rea-fraga')).toHaveText('Ta bort Pannkakor ur receptboken?');
    await page.locator('#rea-nej').click();
    expect(api.tabeller.kalori_recept).toHaveLength(4);
    await page.locator('#rea-ta-bort').click();
    await page.locator('#rea-ja').click();
    await expect(page.locator('#view-receptbok')).toBeVisible();
    await expect(namn(page)).toHaveText(['Kycklinggryta med paprika', 'Kyckling- och paprikawok', 'Ärtsoppa']);
    expect(api.tabeller.kalori_recept.map((r) => r.id)).toEqual(['r1', 'r2', 'r4']);
  });
});
