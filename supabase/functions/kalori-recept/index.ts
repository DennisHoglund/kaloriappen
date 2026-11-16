// Kaloriappen – Edge Function kalori-recept (US-16–US-18, D-25)
// Tre uppgifter med Google Gemini (gratisnivån), alla med JSON-svar:
//   ingredienser  { bilder: [base64, …] }                         → { ingredienser: [namn, …] }
//   forslag       { ingredienser, kvarKcal?, undvik? }            → { forslag: [{ namn, beskrivning, kcalPortion, tidMin, portioner, saknas }] }
//   recept        { ratt: { namn, beskrivning, portioner }, ingredienser } → { recept: { namn, …, ingredienser: [{ namn, mangd, enhet }], steg } }
//
// Driftsättning (Supabase, Jaktvinds projekt): Edge Functions → Deploy a new function → Via Editor,
// namn kalori-recept, klistra in hela filen, Deploy. Stäng av "Verify JWT" (funktionen kontrollerar själv).
// Samma secrets som kalori-analys: KALORI_GEMINI_KEY, valfritt KALORI_GEMINI_MODELL och KALORI_GEMINI_TANKANDE.

export const STANDARDMODELL = 'gemini-flash-lite-latest';
export const STANDARDTANKANDE = 'minimal';
export const TIDSGRANS_MS = 30_000;
export const MAX_BILDER = 4;
export const MAX_BILD_TECKEN = 2_000_000; // per bild, base64
export const BASVAROR = 'salt, peppar, olja, smör, mjöl och vatten';

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
  'access-control-allow-methods': 'POST, OPTIONS'
};

const S = { type: 'STRING' }, N = { type: 'NUMBER' }, I = { type: 'INTEGER' };
const lista = (items: unknown) => ({ type: 'ARRAY', items });
const objekt = (properties: Record<string, unknown>, required: string[]) => ({ type: 'OBJECT', properties, required });

export const SCHEMAN: Record<string, unknown> = {
  ingredienser: objekt({ ingredienser: lista(S) }, ['ingredienser']),
  forslag: objekt({
    forslag: lista(objekt({ namn: S, beskrivning: S, kcalPortion: I, tidMin: I, portioner: I, saknas: lista(S) },
      ['namn', 'beskrivning', 'kcalPortion', 'tidMin', 'portioner', 'saknas']))
  }, ['forslag']),
  recept: objekt({
    recept: objekt({
      namn: S, beskrivning: S, portioner: I, kcalPortion: I, tidMin: I,
      ingredienser: lista(objekt({ namn: S, mangd: { type: 'NUMBER', nullable: true }, enhet: S }, ['namn', 'enhet'])),
      steg: lista(S)
    }, ['namn', 'beskrivning', 'portioner', 'kcalPortion', 'tidMin', 'ingredienser', 'steg'])
  }, ['recept'])
};

const text = (v: unknown, max = 200) => String(v ?? '').trim().slice(0, max);
const unika = (l: string[]) => {
  const sett = new Set<string>();
  return l.filter((x) => { const k = x.toLowerCase(); if (!x || sett.has(k)) return false; sett.add(k); return true; });
};
const stor = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const mellan = (v: unknown, min: number, max: number) => Math.min(max, Math.max(min, Math.round(Number(v))));

export function promptFor(uppgift: string, d: any): string {
  if (uppgift === 'ingredienser') {
    return [
      'Du är en erfaren kock. Titta på bilderna och lista de ingredienser (råvaror och matvaror) som syns.',
      'Ge korta svenska namn i singular grundform, t.ex. "Kycklingfilé", "Paprika", "Gul lök", "Crème fraiche".',
      'Ta inte med förpackningar, kärl eller annat som inte är mat. Högst 25 ingredienser. Om ingen mat syns, svara med en tom lista.'
    ].join(' ');
  }
  if (uppgift === 'forslag') {
    return [
      'Du är en erfaren kock och dietist. Föreslå 4 olika middagsrätter (husmanskost eller vardagsmat) som går att laga av i huvudsak dessa ingredienser:',
      d.ingredienser.join(', ') + '.',
      'Anta att ' + BASVAROR + ' finns hemma.',
      'För varje rätt: svenskt namn, en mening som beskriver rätten, ungefärlig kcal per portion, total tid i minuter, antal portioner,',
      'och vilka viktiga ingredienser som saknas (tom lista om inget saknas, högst 3).',
      d.kvarKcal != null ? 'Användaren har ' + Math.round(d.kvarKcal) + ' kcal kvar i dag – ha med minst två rätter som ryms i det.' : '',
      d.undvik.length ? 'Föreslå inte dessa rätter igen: ' + d.undvik.join(', ') + '.' : ''
    ].filter(Boolean).join(' ');
  }
  return [
    'Du är en erfaren kock och dietist. Skriv ett recept på svenska för rätten "' + d.ratt.namn + '"' + (d.ratt.beskrivning ? ' (' + d.ratt.beskrivning + ')' : '') + ',',
    'för ' + d.ratt.portioner + ' portioner. Använd i första hand dessa ingredienser: ' + d.ingredienser.join(', ') + '. Anta att ' + BASVAROR + ' finns hemma.',
    'Ange varje ingrediens med mängd och enhet för alla portioner tillsammans. Använd svenska enheter: g, kg, dl, l, msk, tsk, krm, st.',
    'För "efter smak" (t.ex. salt) ange mängd null och tom enhet.',
    'Skriv 3–10 korta steg i rätt ordning. Uppskatta kcal per portion och total tid i minuter.'
  ].join(' ');
}

export function byggAnrop(uppgift: string, d: any, tankande: string = STANDARDTANKANDE) {
  const delar: any[] = [{ text: promptFor(uppgift, d) }];
  if (uppgift === 'ingredienser') for (const b of d.bilder) delar.push({ inline_data: { mime_type: 'image/jpeg', data: b } });
  return {
    contents: [{ parts: delar }],
    generationConfig: { responseMimeType: 'application/json', responseSchema: SCHEMAN[uppgift], thinkingConfig: { thinkingLevel: tankande } }
  };
}

function las(svar: any): any {
  const t = svar?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('') || '';
  try { return JSON.parse(t); } catch { return null; }
}

export function tolkaIngredienser(svar: any): string[] {
  const l = las(svar)?.ingredienser;
  if (!Array.isArray(l)) return [];
  return unika(l.map((x: unknown) => stor(text(x, 60)))).slice(0, 25);
}

export function tolkaForslag(svar: any) {
  const l = las(svar)?.forslag;
  if (!Array.isArray(l)) return [];
  return l
    .map((f: any) => ({
      namn: text(f?.namn, 100),
      beskrivning: text(f?.beskrivning, 300),
      kcalPortion: Math.round(Number(f?.kcalPortion)),
      tidMin: mellan(f?.tidMin || 30, 1, 1440),
      portioner: mellan(f?.portioner || 2, 1, 20),
      saknas: Array.isArray(f?.saknas) ? unika(f.saknas.map((x: unknown) => text(x, 60))).slice(0, 5) : []
    }))
    .filter((f: any) => f.namn && f.kcalPortion >= 0 && f.kcalPortion <= 5000)
    .slice(0, 4);
}

export function tolkaRecept(svar: any) {
  const r = las(svar)?.recept;
  if (!r) return null;
  const ingredienser = (Array.isArray(r.ingredienser) ? r.ingredienser : [])
    .map((i: any) => {
      const m = i?.mangd == null || i.mangd === '' ? null : Number(i.mangd);
      return { namn: text(i?.namn, 100), mangd: m != null && isFinite(m) && m > 0 ? m : null, enhet: text(i?.enhet, 10) };
    })
    .filter((i: any) => i.namn)
    .slice(0, 40);
  const steg = (Array.isArray(r.steg) ? r.steg : []).map((s: unknown) => text(s, 500)).filter(Boolean).slice(0, 20);
  const kcal = Math.round(Number(r.kcalPortion));
  if (!text(r.namn) || !ingredienser.length || !steg.length || !(kcal >= 0 && kcal <= 5000)) return null;
  return {
    namn: text(r.namn, 100), beskrivning: text(r.beskrivning, 300),
    portioner: mellan(r.portioner || 2, 1, 20), kcalPortion: kcal, tidMin: mellan(r.tidMin || 30, 1, 1440),
    ingredienser, steg
  };
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'content-type': 'application/json' } });
}

// Kontrollerar indata. Svarar med { d } eller { fel }.
export function kontrollera(indata: any): { d?: any; fel?: string } {
  const strangar = (v: unknown, max: number) => Array.isArray(v) ? unika(v.map((x) => text(x, 60))).slice(0, max) : [];
  const u = indata?.uppgift;
  if (u === 'ingredienser') {
    const b = Array.isArray(indata.bilder) ? indata.bilder.filter((x: unknown) => typeof x === 'string' && x) : [];
    if (!b.length) return { fel: 'Ingen bild skickades.' };
    if (b.length > MAX_BILDER) return { fel: 'Högst ' + MAX_BILDER + ' bilder åt gången.' };
    if (b.some((x: string) => x.length > MAX_BILD_TECKEN)) return { fel: 'En bild är för stor.' };
    return { d: { bilder: b } };
  }
  const ingredienser = strangar(indata?.ingredienser, 40);
  if (u === 'forslag') {
    if (!ingredienser.length) return { fel: 'Lägg till minst en ingrediens.' };
    const k = Number(indata.kvarKcal);
    return { d: { ingredienser, kvarKcal: indata.kvarKcal != null && isFinite(k) ? k : null, undvik: strangar(indata.undvik, 20) } };
  }
  if (u === 'recept') {
    const namn = text(indata?.ratt?.namn, 100);
    if (!namn) return { fel: 'Ingen rätt vald.' };
    return { d: { ratt: { namn, beskrivning: text(indata.ratt.beskrivning, 300), portioner: mellan(indata.ratt.portioner || 2, 1, 20) }, ingredienser } };
  }
  return { fel: 'Okänd uppgift.' };
}

type Miljo = { env: (k: string) => string | undefined; fetch: typeof fetch };

export function skapaHanterare({ env, fetch: hamta }: Miljo) {
  return async (req: Request): Promise<Response> => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
    if (req.method !== 'POST') return json(405, { fel: 'metod', meddelande: 'Bara POST.' });

    const auth = req.headers.get('authorization') || '';
    if (!auth.startsWith('Bearer ')) return json(401, { fel: 'behorighet', meddelande: 'Logga in igen.' });
    try {
      const u = await hamta(env('SUPABASE_URL') + '/auth/v1/user', {
        headers: { authorization: auth, apikey: env('SUPABASE_ANON_KEY') || '' },
        signal: AbortSignal.timeout(5000)
      });
      if (!u.ok) return json(401, { fel: 'behorighet', meddelande: 'Logga in igen.' });
    } catch {
      return json(503, { fel: 'tjanst', meddelande: 'Kunde inte kontrollera inloggningen.' });
    }

    let indata: any;
    try { indata = await req.json(); } catch { return json(400, { fel: 'indata', meddelande: 'Ogiltigt anrop.' }); }
    const { d, fel } = kontrollera(indata);
    if (fel) return json(400, { fel: 'indata', meddelande: fel });
    const uppgift = indata.uppgift;

    const nyckel = env('KALORI_GEMINI_KEY');
    if (!nyckel) return json(500, { fel: 'konfig', meddelande: 'Receptfunktionen är inte konfigurerad.' });
    const modell = env('KALORI_GEMINI_MODELL') || STANDARDMODELL;
    const tankande = env('KALORI_GEMINI_TANKANDE') || STANDARDTANKANDE;

    let svar: Response;
    try {
      svar = await hamta(`https://generativelanguage.googleapis.com/v1beta/models/${modell}:generateContent`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': nyckel },
        body: JSON.stringify(byggAnrop(uppgift, d, tankande)),
        signal: AbortSignal.timeout(TIDSGRANS_MS)
      });
    } catch (e) {
      const tid = e instanceof Error && (e.name === 'TimeoutError' || e.name === 'AbortError');
      return json(504, { fel: tid ? 'tid' : 'tjanst', meddelande: tid ? 'Det tog för lång tid. Försök igen.' : 'Kunde inte nå AI-tjänsten.' });
    }
    if (svar.status === 429) return json(429, { fel: 'kvot', meddelande: 'Dagens gratisanrop är slut. Försök senare.' });
    if (!svar.ok) {
      const detalj = await svar.json().then((j: any) => j?.error?.message || '').catch(() => '');
      return json(502, { fel: 'analys', meddelande: 'AI-tjänsten svarade med fel (' + svar.status + ').', detalj: String(detalj).slice(0, 300) });
    }
    const data = await svar.json().catch(() => null);

    if (uppgift === 'ingredienser') {
      const ingredienser = tolkaIngredienser(data);
      if (!ingredienser.length) return json(422, { fel: 'tom', meddelande: 'Hittade inga ingredienser. Skriv in dem själv.' });
      return json(200, { ingredienser });
    }
    if (uppgift === 'forslag') {
      const forslag = tolkaForslag(data);
      if (!forslag.length) return json(422, { fel: 'tom', meddelande: 'Fick inga förslag. Försök igen eller ändra ingredienserna.' });
      return json(200, { forslag });
    }
    const recept = tolkaRecept(data);
    if (!recept) return json(422, { fel: 'tom', meddelande: 'Kunde inte skapa receptet. Försök igen.' });
    return json(200, { recept });
  };
}

declare const Deno: any;
if (typeof Deno !== 'undefined') {
  Deno.serve(skapaHanterare({ env: (k) => Deno.env.get(k), fetch }));
}
