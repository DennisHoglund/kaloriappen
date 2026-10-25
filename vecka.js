// Träningshistorik per vecka (US-13): total tid per typ, total sträcka och alla pass, bläddra vecka för vecka.
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const B = window.KaloriBerakning;
  const fmt = (x, d = 0) => Number(x).toLocaleString('sv-SE', { maximumFractionDigits: d });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ORDNING = ['styrka', 'lopning', 'promenad', 'cykling', 'lopband'];

  let sb = null;
  let userId = null;
  let datum = null; // valfri dag i veckan som visas

  function tid(min) {
    const h = Math.floor(min / 60), m = min % 60;
    return h ? h + ' h' + (m ? ' ' + m + ' min' : '') : m + ' min';
  }

  function kort(d) {
    const [a, m, dd] = d.split('-').map(Number);
    return new Date(Date.UTC(a, m - 1, dd, 12)).toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
  }

  async function visa() {
    const v = B.vecka(datum);
    const idag = window.KaloriApp.idag();
    $('vec-rubrik').textContent = 'Vecka ' + v.nummer;
    $('vec-datum').textContent = kort(v.start) + ' – ' + kort(v.slut);
    $('vec-nasta').disabled = v.slut >= idag;
    $('vec-fel').hidden = true;
    let pass = [];
    try {
      const r = await sb.from('kalori_traning').select('*').eq('user_id', userId).gte('datum', v.start).lte('datum', v.slut).order('datum');
      if (r.error) throw r.error;
      pass = r.data;
    } catch (e) {
      $('vec-fel').hidden = false;
    }
    const T = window.KaloriTraning.NAMN;
    const totalMin = pass.reduce((s, p) => s + p.minuter, 0);
    const totalKm = pass.reduce((s, p) => s + (p.km ? Number(p.km) : 0), 0);
    const totalKcal = pass.reduce((s, p) => s + Number(p.kcal), 0);
    $('vec-pass').textContent = fmt(pass.length);
    $('vec-tid').textContent = tid(totalMin);
    $('vec-km').textContent = fmt(totalKm, 1);
    $('vec-kcal').textContent = '≈ ' + fmt(totalKcal) + ' kcal';
    $('vec-typer').innerHTML = ORDNING.filter((t) => pass.some((p) => p.typ === t)).map((t) => {
      const dessa = pass.filter((p) => p.typ === t);
      const km = dessa.reduce((s, p) => s + (p.km ? Number(p.km) : 0), 0);
      return `<li class="vec-typ" data-typ="${t}"><span class="rad-namn">${esc(T[t])}</span><span class="num">${dessa.length} pass · ${tid(dessa.reduce((s, p) => s + p.minuter, 0))}${km ? ' · ' + fmt(km, 1) + ' km' : ''}</span></li>`;
    }).join('');
    $('vec-lista').innerHTML = pass.map((p) =>
      `<li class="vik-rad"><span>${esc(kort(p.datum))} · ${esc(T[p.typ])}</span><span class="num">${tid(p.minuter)}${p.km != null ? ' · ' + fmt(p.km, 2) + ' km' : ''}</span></li>`).join('');
    $('vec-tom').hidden = pass.length > 0;
  }

  function oppna(opts = {}) {
    datum = opts.datum || window.KaloriApp.idag();
    window.KaloriApp.visa('view-vecka');
    return visa();
  }

  function setup(klient, opts) {
    sb = klient;
    $('vec-forra').addEventListener('click', () => { datum = B.flyttaDag(B.vecka(datum).start, -7); visa(); });
    $('vec-nasta').addEventListener('click', () => { datum = B.flyttaDag(B.vecka(datum).start, 7); visa(); });
    $('vec-tillbaka').addEventListener('click', () => { if (opts.avbryt) opts.avbryt(); });
  }

  window.KaloriVecka = { setup, setUser(id) { userId = id; }, oppna };
})();
