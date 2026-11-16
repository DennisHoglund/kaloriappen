// Tester för Edge Function kalori-recept med låtsas-Supabase Auth och låtsas-Gemini (körs i Node).
const { test, expect } = require('@playwright/test');
const F = require('../supabase/functions/kalori-recept/index.ts');

const ENV = { SUPABASE_URL: 'https://projekt.supabase.co', SUPABASE_ANON_KEY: 'publik', KALORI_GEMINI_KEY: 'hemlig' };
const geminiSvar = (data) => ({ candidates: [{ content: { parts: [{ text: JSON.stringify(data) }] } }] });
const svarMed = (data) => () => new Response(JSON.stringify(geminiSvar(data)));

function hanterare({ env = ENV, inloggad = true, gemini } = {}) {
  const anrop = [];
  const fetch = async (url, init = {}) => {
    anrop.push({ url: String(url), init });
    if (String(url).endsWith('/auth/v1/user')) return new Response(inloggad ? '{"id":"u1"}' : '{}', { status: inloggad ? 200 : 401 });
    return gemini(String(url), init);
  };
  return { h: F.skapaHanterare({ env: (k) => env[k], fetch }), anrop };
}
const post = (body, auth = 'Bearer token') => new Request('https://x/functions/v1/kalori-recept', {
  method: 'POST', headers: { authorization: auth, 'content-type': 'application/json' }, body: JSON.stringify(body)
});
const geminiBody = (anrop) => JSON.parse(anrop.find((a) => a.url.includes('generativelanguage')).init.body);

const FORSLAG = [
  { namn: 'Kycklinggryta med paprika', beskrivning: 'Krämig gryta', kcalPortion: 520, tidMin: 35, portioner: 4, saknas: ['grädde'] },
  { namn: 'Ugnsbakad lax', beskrivning: 'Med citron', kcalPortion: 430, tidMin: 25, portioner: 2, saknas: [] },
  { namn: 'Wok', beskrivning: 'Snabb', kcalPortion: 610.6, tidMin: 15, portioner: 3 }
];
const RECEPT = {
  namn: 'Kycklinggryta med paprika', beskrivning: 'Krämig gryta', portioner: 4, kcalPortion: 520, tidMin: 35,
  ingredienser: [{ namn: 'Kycklingfilé', mangd: 600, enhet: 'g' }, { namn: 'Paprika', mangd: 2, enhet: 'st' }, { namn: 'Salt', mangd: null, enhet: '' }],
  steg: ['Strimla kycklingen.', 'Bryn i olja.', 'Häll i grädden och låt puttra 15 min.']
};

test.describe('Recept (Edge Function)', () => {
  test('ingredienser hittas på en eller flera bilder', { annotation: { type: 'testfall', description: 'TC-REF-01' } }, async () => {
    const { h, anrop } = hanterare({ gemini: svarMed({ ingredienser: ['Kycklingfilé', 'paprika', 'Paprika', ' ', 'Lök'] }) });
    const r = await h(post({ uppgift: 'ingredienser', bilder: ['QUJD', 'REVG'] }));
    expect(r.status).toBe(200);
    expect((await r.json()).ingredienser).toEqual(['Kycklingfilé', 'Paprika', 'Lök']); // dubbletter och tomma bort
    const body = geminiBody(anrop);
    const delar = body.contents[0].parts;
    expect(delar.filter((p) => p.inline_data)).toHaveLength(2);
    expect(delar[0].text).toContain('ingredienser');
    expect(body.generationConfig.responseMimeType).toBe('application/json');
    expect(body.generationConfig.thinkingConfig).toEqual({ thinkingLevel: 'minimal' });
    expect(anrop.find((a) => a.url.includes('generativelanguage')).url).toContain('gemini-flash-lite-latest');
  });

  test('förslag på rätter utifrån ingredienser, Kvar och redan visade rätter', { annotation: { type: 'testfall', description: 'TC-REF-02' } }, async () => {
    const { h, anrop } = hanterare({ gemini: svarMed({ forslag: FORSLAG }) });
    const r = await h(post({ uppgift: 'forslag', ingredienser: ['Kycklingfilé', 'Paprika'], kvarKcal: 980, undvik: ['Kycklingsallad'] }));
    expect(r.status).toBe(200);
    const { forslag } = await r.json();
    expect(forslag).toHaveLength(3);
    expect(forslag[0]).toEqual(FORSLAG[0]);
    expect(forslag[2]).toEqual({ ...FORSLAG[2], kcalPortion: 611, saknas: [] });
    const prompt = geminiBody(anrop).contents[0].parts[0].text;
    expect(prompt).toContain('Kycklingfilé, Paprika');
    expect(prompt).toContain('980');
    expect(prompt).toContain('Kycklingsallad');
    expect(prompt).toMatch(/salt, peppar, olja, smör/i); // basvaror antas finnas (D-25)
  });

  test('recept med mängder och steg för vald rätt', { annotation: { type: 'testfall', description: 'TC-REF-03' } }, async () => {
    const { h, anrop } = hanterare({ gemini: svarMed({ recept: RECEPT }) });
    const r = await h(post({ uppgift: 'recept', ratt: { namn: 'Kycklinggryta med paprika', beskrivning: 'Krämig gryta', portioner: 4 }, ingredienser: ['Kycklingfilé'] }));
    expect(r.status).toBe(200);
    const { recept } = await r.json();
    expect(recept.namn).toBe('Kycklinggryta med paprika');
    expect(recept.portioner).toBe(4);
    expect(recept.kcalPortion).toBe(520);
    expect(recept.ingredienser).toEqual([{ namn: 'Kycklingfilé', mangd: 600, enhet: 'g' }, { namn: 'Paprika', mangd: 2, enhet: 'st' }, { namn: 'Salt', mangd: null, enhet: '' }]);
    expect(recept.steg).toHaveLength(3);
    const prompt = geminiBody(anrop).contents[0].parts[0].text;
    expect(prompt).toContain('Kycklinggryta med paprika');
    expect(prompt).toContain('4 portioner');
  });

  test('ogiltiga svar från modellen rensas', { annotation: { type: 'testfall', description: 'TC-REF-04' } }, async () => {
    expect(F.tolkaForslag(geminiSvar({ forslag: [{ namn: '', kcalPortion: 100, portioner: 2 }, { namn: 'X', kcalPortion: -5, portioner: 2 }, ...FORSLAG, FORSLAG[0], FORSLAG[1]] })))
      .toHaveLength(4); // högst 4, tomt namn och negativa kcal bort
    expect(F.tolkaRecept(geminiSvar({ recept: { ...RECEPT, steg: [] } }))).toBeNull();
    expect(F.tolkaRecept(geminiSvar({ recept: { ...RECEPT, portioner: 50 } })).portioner).toBe(20);
    expect(F.tolkaIngredienser({ candidates: [{ content: { parts: [{ text: 'inte json' }] } }] })).toEqual([]);
    let r = await hanterare({ gemini: svarMed({ ingredienser: [] }) }).h(post({ uppgift: 'ingredienser', bilder: ['QUJD'] }));
    expect(r.status).toBe(422);
    expect((await r.json()).fel).toBe('tom');
    r = await hanterare({ gemini: svarMed({ forslag: [] }) }).h(post({ uppgift: 'forslag', ingredienser: ['Sten'] }));
    expect(r.status).toBe(422);
  });

  test('inloggning, felaktiga anrop, kvot och tidsgräns', { annotation: { type: 'testfall', description: 'TC-REF-05' } }, async () => {
    const aldrig = () => { throw new Error('ska inte anropas'); };
    let r = await hanterare({ inloggad: false, gemini: aldrig }).h(post({ uppgift: 'forslag', ingredienser: ['Ägg'] }));
    expect(r.status).toBe(401);
    for (const fel of [{ uppgift: 'okand' }, { uppgift: 'ingredienser', bilder: [] }, { uppgift: 'ingredienser', bilder: ['a', 'b', 'c', 'd', 'e'] },
      { uppgift: 'forslag', ingredienser: [] }, { uppgift: 'recept', ingredienser: ['Ägg'] }]) {
      r = await hanterare({ gemini: aldrig }).h(post(fel));
      expect(r.status, JSON.stringify(fel)).toBe(400);
    }
    r = await hanterare({ env: { ...ENV, KALORI_GEMINI_KEY: '' }, gemini: aldrig }).h(post({ uppgift: 'forslag', ingredienser: ['Ägg'] }));
    expect(r.status).toBe(500);
    r = await hanterare({ gemini: () => new Response('{}', { status: 429 }) }).h(post({ uppgift: 'forslag', ingredienser: ['Ägg'] }));
    expect(r.status).toBe(429);
    r = await hanterare({ gemini: () => { const e = new Error('tid'); e.name = 'TimeoutError'; throw e; } }).h(post({ uppgift: 'forslag', ingredienser: ['Ägg'] }));
    expect(r.status).toBe(504);
    const text = await (await hanterare({ gemini: svarMed({ forslag: FORSLAG }) }).h(post({ uppgift: 'forslag', ingredienser: ['Ägg'] }))).text();
    expect(text).not.toContain('hemlig');
  });
});
