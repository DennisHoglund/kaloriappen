// Mockar allt externt så att testerna är snabba, stabila och aldrig rör riktig data:
// CDN-bibliotek och Supabase (auth, databas). Bildanalys och livsmedel läggs till i senare tasks.
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SUPABASE = 'https://sjdznlmnvubqscftdkoj.supabase.co';
const STORAGE_KEY = 'sb-sjdznlmnvubqscftdkoj-auth-token';

const ANVANDARE = {
  id: '11111111-2222-3333-4444-555555555555',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'test@kaloriappen.se',
  app_metadata: { provider: 'email' },
  user_metadata: {},
  created_at: '2026-01-01T00:00:00Z'
};
const LOSENORD = 'blabar123';

function b64url(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function session() {
  const exp = Math.floor(Date.now() / 1000) + 3600 * 24;
  const token = b64url({ alg: 'HS256', typ: 'JWT' }) + '.' +
    b64url({ sub: ANVANDARE.id, email: ANVANDARE.email, role: 'authenticated', aud: 'authenticated', exp }) + '.signatur';
  return { access_token: token, token_type: 'bearer', expires_in: 3600 * 24, expires_at: exp, refresh_token: 'refresh', user: ANVANDARE };
}

const CDN = [
  [/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js/, 'node_modules/@supabase/supabase-js/dist/umd/supabase.js', 'application/javascript']
];

// Standarddata: en ifylld profil och en vikt, så att appen hamnar på dagsöversikten efter inloggning.
// Tester som vill börja från noll tömmer tabellerna innan page.goto.
function standardData() {
  return {
    kalori_profil: [{ user_id: ANVANDARE.id, fodelsedatum: '1980-05-01', kon: 'man', langd_cm: 182, aktivitet: 'latt', malvikt_kg: 85, takt_kg_vecka: 0.5, uppdaterad: '2026-10-20T08:00:00Z' }],
    kalori_vikt: [{ user_id: ANVANDARE.id, datum: '2026-10-20', vikt_kg: 92 }],
    kalori_maltid: [], kalori_maltid_rad: [], kalori_traning: []
  };
}

// Primärnycklar för upsert
const NYCKLAR = { kalori_profil: ['user_id'], kalori_vikt: ['user_id', 'datum'] };

// Tolkar PostgREST-filter som supabase-js skickar: kolumn=eq.värde, order=kol.desc, limit=N
function filtrera(rader, params) {
  let ut = rader.slice();
  for (const [k, v] of params) {
    if (['select', 'order', 'limit', 'offset', 'on_conflict', 'columns'].includes(k)) continue;
    if (v === 'not.is.null') { ut = ut.filter((r) => r[k] != null); continue; }
    if (v === 'is.null') { ut = ut.filter((r) => r[k] == null); continue; }
    const lista = v.match(/^in\.\((.*)\)$/);
    if (lista) { const tillatna = new Set(lista[1].split(',').map((x) => x.replace(/^"|"$/g, ''))); ut = ut.filter((r) => tillatna.has(String(r[k]))); continue; }
    const m = v.match(/^(eq|gte|lte|gt|lt|neq)\.(.*)$/);
    if (!m) continue;
    const [, op, val] = m;
    ut = ut.filter((r) => {
      const a = r[k] == null ? '' : String(r[k]);
      if (op === 'eq') return a === val;
      if (op === 'neq') return a !== val;
      if (op === 'gte') return a >= val;
      if (op === 'lte') return a <= val;
      if (op === 'gt') return a > val;
      if (op === 'lt') return a < val;
      return true;
    });
  }
  const order = params.get('order');
  if (order) {
    const [kol, riktning] = order.split('.');
    ut.sort((x, y) => String(x[kol]).localeCompare(String(y[kol])) * (riktning === 'desc' ? -1 : 1));
  }
  const limit = params.get('limit');
  if (limit) ut = ut.slice(0, Number(limit));
  return ut;
}

// Installerar alla mockar på sidan. Returnerar ett "api" med databasens tillstånd och loggade anrop.
async function mocka(page, data = standardData()) {
  const api = {
    tabeller: data, anrop: [], nere: false, felVidSparning: false,
    // Bildanalysen: { status, body } som Edge Function svarar med
    analys: { status: 200, body: { rader: [{ namn: 'Köttbullar', gram: 150, kcal: 330 }, { namn: 'Kokt potatis', gram: 200, kcal: 156 }, { namn: 'Lingonsylt', gram: 30, kcal: 48 }], modell: 'gemini-flash-lite-latest' } },
    analysAnrop: [], uppladdade: [], borttagnaFoton: [], uppladdningFel: false
  };

  await page.route(/cdn\.jsdelivr\.net/, (route) => {
    const hit = CDN.find(([re]) => re.test(route.request().url()));
    if (!hit) return route.abort();
    return route.fulfill({ path: path.join(ROOT, hit[1]), contentType: hit[2] });
  });

  // Liten fast livsmedelsfil så att testerna inte påverkas när Livsmedelsverkets data uppdateras
  await page.route(/\/data\/livsmedel\.json$/, (route) => api.livsmedelNere
    ? route.abort('internetdisconnected')
    : route.fulfill({ path: path.join(__dirname, 'data', 'livsmedel-fixtur.json'), contentType: 'application/json' }));

  // Typsnitt och annat okänt externt stoppas så att inget läcker ut till nätet
  await page.route(/fonts\.googleapis\.com|fonts\.gstatic\.com/, (route) => route.abort());

  await page.route(SUPABASE + '/**', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const p = url.pathname;
    const m = req.method();
    api.anrop.push({ metod: m, sokvag: p + url.search });

    if (api.nere) return route.abort('internetdisconnected');
    if (m === 'OPTIONS') return route.fulfill({ status: 200, headers: cors() });

    // ---- Auth ----
    if (p === '/auth/v1/token') {
      const body = req.postDataJSON() || {};
      if (body.email === ANVANDARE.email && body.password === LOSENORD) return json(route, 200, session());
      return json(route, 400, { code: 400, error_code: 'invalid_credentials', msg: 'Invalid login credentials' });
    }
    if (p === '/auth/v1/user') return json(route, 200, ANVANDARE);
    if (p === '/auth/v1/logout') return route.fulfill({ status: 204, headers: cors() });

    // ---- Edge Function: bildanalys ----
    if (p === '/functions/v1/kalori-analys' && m === 'POST') {
      api.analysAnrop.push({ body: req.postDataJSON(), auth: req.headers()['authorization'] });
      return json(route, api.analys.status, api.analys.body);
    }

    // ---- Foton ----
    if (p.startsWith('/storage/v1/object/kalori-foton/') && (m === 'POST' || m === 'PUT')) {
      if (api.uppladdningFel) return json(route, 500, { message: 'Testfel vid uppladdning' });
      const fil = decodeURIComponent(p.replace('/storage/v1/object/kalori-foton/', ''));
      api.uppladdade.push({ fil, storlek: (req.postDataBuffer() || Buffer.alloc(0)).length, typ: req.headers()['content-type'] });
      return json(route, 200, { Key: 'kalori-foton/' + fil, Id: fil });
    }
    if (p === '/storage/v1/object/sign/kalori-foton' && m === 'POST') {
      const { paths } = req.postDataJSON();
      return json(route, 200, paths.map((x) => ({ path: x, signedURL: '/object/sign/kalori-foton/' + x + '?token=test', error: null })));
    }
    if (p === '/storage/v1/object/kalori-foton' && m === 'DELETE') {
      api.borttagnaFoton.push(...((req.postDataJSON() || {}).prefixes || []));
      return json(route, 200, []);
    }
    if (p.startsWith('/storage/v1/object/sign/kalori-foton/')) {
      return route.fulfill({ path: path.join(__dirname, 'data', 'tallrik.jpg'), contentType: 'image/jpeg', headers: cors() });
    }

    // ---- Databas: generisk tabell per namn ----
    const t = p.match(/^\/rest\/v1\/(kalori_[a-z_]+)$/);
    if (t) {
      const namn = t[1];
      const rader = api.tabeller[namn] || (api.tabeller[namn] = []);
      const params = url.searchParams;
      const retur = (req.headers()['prefer'] || '').includes('return=representation');
      if (m !== 'GET' && m !== 'HEAD' && api.felVidSparning) return json(route, 500, { message: 'Testfel vid sparning' });

      if (m === 'GET' || m === 'HEAD') {
        const ut = filtrera(rader, params);
        const objekt = (req.headers()['accept'] || '').includes('vnd.pgrst.object');
        if (objekt) return ut.length === 1 ? json(route, 200, ut[0]) : json(route, 406, { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' });
        return json(route, 200, m === 'HEAD' ? '' : ut, { 'content-range': '0-' + (ut.length - 1) + '/' + ut.length });
      }
      if (m === 'POST') {
        const nycklar = (params.get('on_conflict') || '').split(',').filter(Boolean);
        const nya = [].concat(req.postDataJSON()).map((r) => ({ user_id: ANVANDARE.id, ...r }));
        const upsert = (req.headers()['prefer'] || '').includes('resolution=merge-duplicates');
        for (const r of nya) {
          const k = nycklar.length ? nycklar : (NYCKLAR[namn] || ['id']);
          const i = upsert ? rader.findIndex((x) => k.every((kol) => String(x[kol]) === String(r[kol]))) : -1;
          if (i >= 0) rader[i] = { ...rader[i], ...r }; else rader.push(r);
        }
        return retur ? json(route, 201, nya) : route.fulfill({ status: 201, headers: cors() });
      }
      if (m === 'PATCH') {
        const andra = req.postDataJSON();
        const traffar = filtrera(rader, params);
        traffar.forEach((r) => Object.assign(r, andra));
        return retur ? json(route, 200, traffar) : route.fulfill({ status: 204, headers: cors() });
      }
      if (m === 'DELETE') {
        const bort = new Set(filtrera(rader, params));
        api.tabeller[namn] = rader.filter((r) => !bort.has(r));
        return route.fulfill({ status: 204, headers: cors() });
      }
    }

    return json(route, 404, { message: 'Ej mockat: ' + m + ' ' + p });
  });

  return api;
}

function cors() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
    'access-control-allow-methods': 'GET,POST,PATCH,PUT,DELETE,HEAD,OPTIONS',
    'access-control-expose-headers': 'content-range'
  };
}

function json(route, status, body, extra) {
  return route.fulfill({ status, headers: { ...cors(), ...(extra || {}) }, contentType: 'application/json', body: typeof body === 'string' ? body : JSON.stringify(body) });
}

// Lägger in en inloggad session innan sidan laddas (snabbare än att logga in via formuläret)
async function inloggad(page) {
  const s = session();
  // Bara vid första sidladdningen, så att en utloggning inte "loggar in" igen vid omladdning
  await page.addInitScript(([key, val]) => {
    try {
      if (sessionStorage.getItem('kalori-test-inloggad')) return;
      sessionStorage.setItem('kalori-test-inloggad', '1');
      localStorage.setItem(key, val);
    } catch (e) {}
  }, [STORAGE_KEY, JSON.stringify(s)]);
}

module.exports = { mocka, inloggad, standardData, ANVANDARE, LOSENORD };
