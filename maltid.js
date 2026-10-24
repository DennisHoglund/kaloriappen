// Logga mat: sök livsmedel, ange gram, välj måltid och spara (US-06, US-05 AC3).
// Måltider sparas i kalori_maltid med en eller flera rader i kalori_maltid_rad.
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const L = window.KaloriLivsmedel;
  const fmt = (x, d = 0) => Number(x).toLocaleString('sv-SE', { maximumFractionDigits: d });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const TYPER = [['frukost', 'Frukost'], ['lunch', 'Lunch'], ['middag', 'Middag'], ['mellanmal', 'Mellanmål']];

  let sb = null;
  let userId = null;
  let klar = null;
  let lista = [];
  let senaste = [];  // [{ nr, namn, kcal100, gram }]
  let valt = null;   // { nr, namn, kcal100 }
  let forvaltTyp = null;
  let datum = null;  // dagen måltiden sparas på (null = nu)

  // Föreslagen måltid efter tid på dagen
  function foreslagenTyp(d = new Date()) {
    const h = Number(new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Stockholm', hour: '2-digit', hour12: false }).format(d));
    if (h < 10) return 'frukost';
    if (h < 14) return 'lunch';
    if (h >= 17 && h < 21) return 'middag';
    return 'mellanmal';
  }

  function gram() {
    const v = $('sok-gram').value.trim().replace(',', '.');
    return v === '' ? NaN : Number(v);
  }

  function visaTraffar() {
    const q = $('sok-falt').value;
    const ul = $('sok-traffar');
    const visaSenaste = L.normalisera(q).replace(/ /g, '').length < 2;
    let rader;
    if (visaSenaste) {
      $('sok-rubrik').textContent = senaste.length ? 'Senaste' : '';
      $('sok-tips').hidden = senaste.length > 0;
      rader = senaste.map((s) => [s.nr, s.namn, s.kcal100, s.gram]);
    } else {
      rader = L.sok(lista, q);
      $('sok-rubrik').textContent = rader.length ? rader.length + (rader.length === 40 ? '+ träffar' : ' träffar') : 'Inga träffar';
      $('sok-tips').hidden = true;
    }
    ul.innerHTML = rader.map((r) =>
      `<li><button type="button" class="traff" data-nr="${r[0]}" data-gram="${r[3] || ''}">` +
      `<span class="traff-namn">${esc(r[1])}</span><span class="traff-kcal num">${fmt(r[2])} kcal/100 g</span></button></li>`).join('');
  }

  function valj(nr, forvaltGram) {
    const rad = lista.find((r) => r[0] === nr) || senaste.map((s) => [s.nr, s.namn, s.kcal100]).find((r) => r[0] === nr);
    if (!rad) return;
    valt = { nr: rad[0], namn: rad[1], kcal100: rad[2] };
    $('val-namn').textContent = valt.namn;
    $('val-kcal100').textContent = fmt(valt.kcal100) + ' kcal per 100 g';
    $('sok-gram').value = forvaltGram ? fmt(forvaltGram, 1) : '100';
    const typ = forvaltTyp || foreslagenTyp();
    document.querySelectorAll('input[name="val-typ"]').forEach((r) => { r.checked = r.value === typ; });
    setMsg('');
    raknaOm();
    $('sok-lista').hidden = true;
    $('sok-val').hidden = false;
    $('sok-gram').focus();
  }

  function raknaOm() {
    const g = gram();
    $('val-kcal').textContent = valt && g > 0 ? fmt(L.kcalFor(valt.kcal100, g)) : '–';
  }

  function setMsg(text, kind) {
    $('val-msg').textContent = text || '';
    $('val-msg').className = 'msg' + (kind ? ' ' + kind : '');
  }

  async function spara(e) {
    e.preventDefault();
    const g = gram();
    if (!(g > 0 && g <= 5000)) { setMsg('Ange en mängd mellan 1 och 5 000 gram.', 'error'); return; }
    const typEl = document.querySelector('input[name="val-typ"]:checked');
    if (!typEl) { setMsg('Välj måltid.', 'error'); return; }
    const kcal = L.kcalFor(valt.kcal100, g);
    const id = crypto.randomUUID();
    const knapp = $('form-val').querySelector('button[type="submit"]');
    knapp.disabled = true;
    setMsg('Sparar…');
    try {
      const m = await sb.from('kalori_maltid').insert({ id, user_id: userId, tid: tidFor(datum), typ: typEl.value, kalla: 'manuell' });
      if (m.error) throw m.error;
      const r = await sb.from('kalori_maltid_rad').insert({ maltid_id: id, user_id: userId, namn: valt.namn, livsmedel_nr: valt.nr, gram: g, kcal });
      if (r.error) {
        await sb.from('kalori_maltid').delete().eq('id', id); // ingen tom måltid kvar
        throw r.error;
      }
    } catch (err) {
      knapp.disabled = false;
      setMsg('Kunde inte spara. Kontrollera nätet och försök igen.', 'error');
      return;
    }
    knapp.disabled = false;
    const typNamn = TYPER.find((t) => t[0] === typEl.value)[1].toLowerCase();
    window.KaloriApp.toast(valt.namn + ' (' + fmt(kcal) + ' kcal) sparat till ' + typNamn);
    if (klar) klar();
  }

  // Tid att spara: nu för idag, annars kl 12 svensk tid den valda dagen (D-21)
  function tidFor(d) {
    if (!d || d === window.KaloriApp.idag()) return new Date().toISOString();
    const start = Date.parse(window.KaloriBerakning.dygnUTC(d)[0]);
    return new Date(start + 12 * 3600000).toISOString();
  }

  // Senast loggade livsmedel (unika), nyaste först
  async function hamtaSenaste() {
    const m = await sb.from('kalori_maltid').select('id,tid').eq('user_id', userId).order('tid', { ascending: false }).limit(30);
    if (m.error || !m.data.length) return [];
    const ordning = new Map(m.data.map((x, i) => [x.id, i]));
    const r = await sb.from('kalori_maltid_rad').select('maltid_id,livsmedel_nr,namn,gram,kcal')
      .in('maltid_id', m.data.map((x) => x.id)).not('livsmedel_nr', 'is', null);
    if (r.error) return [];
    const sett = new Set();
    return r.data.sort((a, b) => ordning.get(a.maltid_id) - ordning.get(b.maltid_id)).filter((x) => {
      if (sett.has(x.livsmedel_nr)) return false;
      sett.add(x.livsmedel_nr);
      return true;
    }).slice(0, 8).map((x) => ({ nr: x.livsmedel_nr, namn: x.namn, gram: Number(x.gram), kcal100: Number(x.gram) > 0 ? Math.round(Number(x.kcal) * 1000 / Number(x.gram)) / 10 : 0 }));
  }

  async function oppna(opts = {}) {
    valt = null;
    forvaltTyp = opts.typ || null;
    datum = opts.datum || null;
    $('sok-falt').value = '';
    $('sok-traffar').innerHTML = '';
    $('sok-rubrik').textContent = '';
    $('sok-tips').hidden = false;
    $('sok-val').hidden = true;
    $('sok-lista').hidden = false;
    $('sok-fel').hidden = true;
    window.KaloriApp.visa('view-sok');
    try {
      const [data, sen] = await Promise.all([L.ladda(), hamtaSenaste().catch(() => [])]);
      lista = data.livsmedel;
      senaste = sen;
      visaTraffar();
    } catch (e) {
      $('sok-fel').hidden = false;
    }
    $('sok-falt').focus();
  }

  function setup(klient, opts) {
    sb = klient;
    klar = opts.klar;
    $('sok-falt').addEventListener('input', visaTraffar);
    $('sok-traffar').addEventListener('click', (e) => {
      const b = e.target.closest('button.traff');
      if (b) valj(Number(b.dataset.nr), Number(b.dataset.gram) || null);
    });
    $('sok-gram').addEventListener('input', raknaOm);
    $('form-val').addEventListener('submit', spara);
    $('val-tillbaka').addEventListener('click', () => { $('sok-val').hidden = true; $('sok-lista').hidden = false; $('sok-falt').focus(); });
    $('sok-stang').addEventListener('click', () => { if (opts.avbryt) opts.avbryt(); });
  }

  // Måltid och dag som Logga mat öppnades för (används av fotoflödet)
  function aktuella() { return { typ: forvaltTyp, datum }; }

  window.KaloriMaltid = { setup, setUser(id) { userId = id; }, oppna, foreslagenTyp, tidFor, aktuella };
})();
