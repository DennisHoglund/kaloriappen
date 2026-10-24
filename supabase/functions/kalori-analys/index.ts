// Kaloriappen – Edge Function kalori-analys (US-04)
// Tar emot ett matfoto från appen, låter Google Gemini (gratisnivån) uppskatta vad som syns,
// hur många gram och hur många kcal, och svarar med { rader: [{ namn, gram, kcal }] }.
//
// Driftsättning (Supabase, Jaktvinds projekt): Edge Functions → Deploy a new function → Via Editor,
// namn kalori-analys, klistra in hela filen, Deploy. Secret: KALORI_GEMINI_KEY (nyckel från Google AI Studio).
// Valfria secrets: KALORI_GEMINI_MODELL (byt modell) och KALORI_GEMINI_TANKANDE (minimal/low/medium/high)
// utan kodändring.
// Funktionen kontrollerar själv att anroparen är inloggad, så "Verify JWT" i inställningarna kan vara av.

export const STANDARDMODELL = 'gemini-flash-latest';
export const MAX_BILD_TECKEN = 2_000_000; // base64, ca 1,5 MB – appen skickar ca 150 kB
export const STANDARDTANKANDE = 'low'; // snabbt svar räcker för att känna igen mat (Gemini 3 tänker annars "medium")
export const TIDSGRANS_MS = 30_000;

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
  'access-control-allow-methods': 'POST, OPTIONS'
};

export const PROMPT = [
  'Du är en erfaren dietist. Titta på bilden och identifiera maten och dryckerna som syns.',
  'För varje del: ge ett kort svenskt namn (t.ex. "Kokt potatis", "Köttbullar", "Brunsås"),',
  'uppskatta mängden i gram utifrån portionsstorlek, tallrik och bestick, och uppskatta kcal för just den mängden.',
  'Dela upp i delar som man skulle väga var för sig, högst 10 delar. Avrunda gram till hela 5 g och kcal till heltal.',
  'Om bilden inte visar mat eller dryck, svara med en tom lista.'
].join(' ');

export const SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      namn: { type: 'STRING' },
      gram: { type: 'NUMBER' },
      kcal: { type: 'NUMBER' }
    },
    required: ['namn', 'gram', 'kcal']
  }
};

// Bygger anropet till Gemini. Temperaturen lämnas på standard (Google avråder från att ändra den för Gemini 3).
export function byggAnrop(bild: string, mime: string, tankande: string = STANDARDTANKANDE) {
  return {
    contents: [{ parts: [{ text: PROMPT }, { inline_data: { mime_type: mime, data: bild } }] }],
    generationConfig: { responseMimeType: 'application/json', responseSchema: SCHEMA, thinkingConfig: { thinkingLevel: tankande } }
  };
}

// Plockar ut och kontrollerar raderna ur Geminis svar. Ogiltiga rader tas bort.
export function tolkaSvar(svar: any): { namn: string; gram: number; kcal: number }[] {
  const text = svar?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('') || '';
  let lista: any;
  try { lista = JSON.parse(text); } catch { return []; }
  if (!Array.isArray(lista)) return [];
  return lista
    .map((r: any) => ({
      namn: String(r?.namn ?? '').trim().slice(0, 100),
      gram: Math.round(Number(r?.gram)),
      kcal: Math.round(Number(r?.kcal))
    }))
    .filter((r) => r.namn && r.gram > 0 && r.gram <= 5000 && r.kcal >= 0 && r.kcal <= 10000)
    .slice(0, 10);
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'content-type': 'application/json' } });
}

type Miljo = { env: (k: string) => string | undefined; fetch: typeof fetch };

export function skapaHanterare({ env, fetch: hamta }: Miljo) {
  return async (req: Request): Promise<Response> => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
    if (req.method !== 'POST') return json(405, { fel: 'metod', meddelande: 'Bara POST.' });

    // Bara inloggade användare får anropa (kontrolleras mot Supabase Auth)
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
    const bild = typeof indata?.bild === 'string' ? indata.bild : '';
    const mime = ['image/jpeg', 'image/png', 'image/webp'].includes(indata?.mime) ? indata.mime : 'image/jpeg';
    if (!bild) return json(400, { fel: 'indata', meddelande: 'Ingen bild skickades.' });
    if (bild.length > MAX_BILD_TECKEN) return json(413, { fel: 'stor', meddelande: 'Bilden är för stor.' });

    const nyckel = env('KALORI_GEMINI_KEY');
    if (!nyckel) return json(500, { fel: 'konfig', meddelande: 'Bildanalysen är inte konfigurerad.' });
    const modell = env('KALORI_GEMINI_MODELL') || STANDARDMODELL;
    const tankande = env('KALORI_GEMINI_TANKANDE') || STANDARDTANKANDE;

    let svar: Response;
    try {
      svar = await hamta(`https://generativelanguage.googleapis.com/v1beta/models/${modell}:generateContent`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': nyckel },
        body: JSON.stringify(byggAnrop(bild, mime, tankande)),
        signal: AbortSignal.timeout(TIDSGRANS_MS)
      });
    } catch (e) {
      const tid = e instanceof Error && (e.name === 'TimeoutError' || e.name === 'AbortError');
      return json(504, { fel: tid ? 'tid' : 'tjanst', meddelande: tid ? 'Analysen tog för lång tid. Försök igen eller sök manuellt.' : 'Kunde inte nå bildanalysen.' });
    }
    if (svar.status === 429) return json(429, { fel: 'kvot', meddelande: 'Dagens gratisanalyser är slut. Försök senare eller logga manuellt.' });
    if (!svar.ok) {
      // Googles felmeddelande hjälper vid felsökning (t.ex. okänd modell eller ogiltig inställning)
      const detalj = await svar.json().then((j: any) => j?.error?.message || '').catch(() => '');
      return json(502, { fel: 'analys', meddelande: 'Bildanalysen svarade med fel (' + svar.status + ').', detalj: String(detalj).slice(0, 300) });
    }

    const rader = tolkaSvar(await svar.json().catch(() => null));
    if (!rader.length) return json(422, { fel: 'tom', meddelande: 'Hittade ingen mat på bilden.' });
    return json(200, { rader, modell, tankande });
  };
}

// I Supabase (Deno) startas servern. I testerna (Node) importeras bara funktionerna.
declare const Deno: any;
if (typeof Deno !== 'undefined') {
  Deno.serve(skapaHanterare({ env: (k) => Deno.env.get(k), fetch }));
}
