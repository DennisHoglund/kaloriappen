// Tester för Edge Function kalori-analys med låtsas-Supabase Auth och låtsas-Gemini (körs i Node).
const { test, expect } = require('@playwright/test');
const F = require('../supabase/functions/kalori-analys/index.ts');

const ENV = { SUPABASE_URL: 'https://projekt.supabase.co', SUPABASE_ANON_KEY: 'publik', KALORI_GEMINI_KEY: 'hemlig' };
const geminiSvar = (rader) => ({ candidates: [{ content: { parts: [{ text: JSON.stringify(rader) }] } }] });

// Bygger en hanterare med låtsas-fetch. gemini = (url, init) => Response
function hanterare({ env = ENV, inloggad = true, gemini } = {}) {
  const anrop = [];
  const fetch = async (url, init = {}) => {
    anrop.push({ url: String(url), init });
    if (String(url).endsWith('/auth/v1/user')) return new Response(inloggad ? '{"id":"u1"}' : '{}', { status: inloggad ? 200 : 401 });
    return gemini(String(url), init);
  };
  return { h: F.skapaHanterare({ env: (k) => env[k], fetch }), anrop };
}

const post = (body, auth = 'Bearer token') => new Request('https://x/functions/v1/kalori-analys', {
  method: 'POST', headers: { authorization: auth, 'content-type': 'application/json' }, body: JSON.stringify(body)
});

test.describe('Bildanalys (Edge Function)', () => {
  test('bilden skickas till Gemini och svaret blir rader med namn, gram och kcal', { annotation: { type: 'testfall', description: 'TC-ANA-01' } }, async () => {
    const { h, anrop } = hanterare({ gemini: () => new Response(JSON.stringify(geminiSvar([
      { namn: 'Kokt potatis', gram: 152, kcal: 118.4 }, { namn: 'Köttbullar', gram: 120, kcal: 270 }
    ]))) });
    const res = await h(post({ bild: 'QUJD', mime: 'image/jpeg' }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ rader: [{ namn: 'Kokt potatis', gram: 152, kcal: 118 }, { namn: 'Köttbullar', gram: 120, kcal: 270 }], modell: 'gemini-flash-latest' });
    const g = anrop.find((a) => a.url.includes('generativelanguage'));
    expect(g.url).toBe('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent');
    expect(g.init.headers['x-goog-api-key']).toBe('hemlig');
    const body = JSON.parse(g.init.body);
    expect(body.contents[0].parts[1]).toEqual({ inline_data: { mime_type: 'image/jpeg', data: 'QUJD' } });
    expect(body.generationConfig.responseMimeType).toBe('application/json');
    expect(body.contents[0].parts[0].text).toContain('svenskt namn');
  });

  test('bara inloggade får anropa och nyckeln skickas aldrig tillbaka', { annotation: { type: 'testfall', description: 'TC-ANA-02' } }, async () => {
    const { h, anrop } = hanterare({ inloggad: false, gemini: () => { throw new Error('ska inte anropas'); } });
    let res = await h(post({ bild: 'QUJD' }));
    expect(res.status).toBe(401);
    expect((await res.json()).fel).toBe('behorighet');
    res = await h(post({ bild: 'QUJD' }, ''));
    expect(res.status).toBe(401);
    expect(anrop.some((a) => a.url.includes('generativelanguage'))).toBe(false);
    const ok = hanterare({ gemini: () => new Response(JSON.stringify(geminiSvar([{ namn: 'Äpple', gram: 150, kcal: 72 }]))) });
    const text = await (await ok.h(post({ bild: 'QUJD' }))).text();
    expect(text).not.toContain('hemlig');
  });

  test('slut på gratiskvot, fel och tidsgräns ger tydliga felkoder', { annotation: { type: 'testfall', description: 'TC-ANA-03' } }, async () => {
    let r = await hanterare({ gemini: () => new Response('{}', { status: 429 }) }).h(post({ bild: 'QUJD' }));
    expect(r.status).toBe(429);
    expect(await r.json()).toMatchObject({ fel: 'kvot' });
    r = await hanterare({ gemini: () => new Response('{}', { status: 500 }) }).h(post({ bild: 'QUJD' }));
    expect(r.status).toBe(502);
    expect((await r.json()).fel).toBe('analys');
    r = await hanterare({ gemini: () => { const e = new Error('tid'); e.name = 'TimeoutError'; throw e; } }).h(post({ bild: 'QUJD' }));
    expect(r.status).toBe(504);
    expect((await r.json()).fel).toBe('tid');
  });

  test('ingen mat på bilden och ogiltiga svar hanteras', { annotation: { type: 'testfall', description: 'TC-ANA-04' } }, async () => {
    let r = await hanterare({ gemini: () => new Response(JSON.stringify(geminiSvar([]))) }).h(post({ bild: 'QUJD' }));
    expect(r.status).toBe(422);
    expect((await r.json()).fel).toBe('tom');
    // Konstigt svar från modellen: orimliga värden tas bort
    expect(F.tolkaSvar(geminiSvar([{ namn: '', gram: 100, kcal: 50 }, { namn: 'Sten', gram: 99999, kcal: 1 }, { namn: 'Bröd', gram: 40, kcal: 100 }])))
      .toEqual([{ namn: 'Bröd', gram: 40, kcal: 100 }]);
    expect(F.tolkaSvar({ candidates: [{ content: { parts: [{ text: 'inte json' }] } }] })).toEqual([]);
    expect(F.tolkaSvar(null)).toEqual([]);
    expect(F.tolkaSvar(geminiSvar(Array.from({ length: 15 }, (_, i) => ({ namn: 'Del ' + i, gram: 10, kcal: 10 }))))).toHaveLength(10);
  });

  test('saknad bild, för stor bild och saknad nyckel stoppas', { annotation: { type: 'testfall', description: 'TC-ANA-05' } }, async () => {
    const g = () => { throw new Error('ska inte anropas'); };
    let r = await hanterare({ gemini: g }).h(post({}));
    expect(r.status).toBe(400);
    r = await hanterare({ gemini: g }).h(post({ bild: 'A'.repeat(F.MAX_BILD_TECKEN + 1) }));
    expect(r.status).toBe(413);
    r = await hanterare({ env: { ...ENV, KALORI_GEMINI_KEY: '' }, gemini: g }).h(post({ bild: 'QUJD' }));
    expect(r.status).toBe(500);
    expect((await r.json()).fel).toBe('konfig');
    r = await hanterare({ gemini: g }).h(new Request('https://x', { method: 'OPTIONS' }));
    expect(r.headers.get('access-control-allow-origin')).toBe('*');
  });

  test('modellen kan bytas med en secret', { annotation: { type: 'testfall', description: 'TC-ANA-06' } }, async () => {
    const { h, anrop } = hanterare({ env: { ...ENV, KALORI_GEMINI_MODELL: 'gemini-2.5-flash' }, gemini: () => new Response(JSON.stringify(geminiSvar([{ namn: 'Äpple', gram: 150, kcal: 72 }]))) });
    const r = await h(post({ bild: 'QUJD' }));
    expect((await r.json()).modell).toBe('gemini-2.5-flash');
    expect(anrop.at(-1).url).toContain('/models/gemini-2.5-flash:generateContent');
  });
});
