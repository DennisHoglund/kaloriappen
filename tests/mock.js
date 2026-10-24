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

// Installerar alla mockar på sidan. Returnerar ett "api" med databasens tillstånd och loggade anrop.
async function mocka(page, data = {}) {
  const api = { tabeller: { ...data }, anrop: [], nere: false };

  await page.route(/cdn\.jsdelivr\.net/, (route) => {
    const hit = CDN.find(([re]) => re.test(route.request().url()));
    if (!hit) return route.abort();
    return route.fulfill({ path: path.join(ROOT, hit[1]), contentType: hit[2] });
  });

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

    // ---- Databas: enkel generisk tabell per namn ----
    const t = p.match(/^\/rest\/v1\/(kalori_[a-z_]+)$/);
    if (t) {
      const rader = api.tabeller[t[1]] || (api.tabeller[t[1]] = []);
      if (m === 'GET' || m === 'HEAD') return json(route, 200, m === 'HEAD' ? '' : rader, { 'content-range': '0-' + (rader.length - 1) + '/' + rader.length });
      if (m === 'POST') {
        [].concat(req.postDataJSON()).forEach((r) => rader.push({ user_id: ANVANDARE.id, ...r }));
        return route.fulfill({ status: 201, headers: cors() });
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

module.exports = { mocka, inloggad, ANVANDARE, LOSENORD };
