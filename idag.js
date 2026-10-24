// Dagsöversikt (US-07): ätit, mål och kvar, måltider per typ, bläddra mellan dagar.
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const B = window.KaloriBerakning;
  const fmt = (x, d = 0) => Number(x).toLocaleString('sv-SE', { maximumFractionDigits: d });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const TYPER = [['frukost', 'Frukost'], ['lunch', 'Lunch'], ['middag', 'Middag'], ['mellanmal', 'Mellanmål']];

  let sb = null;
  let userId = null;
  let datum = null;
  let mal = null;
  let laddning = 0;

  function datumText(d) {
    const idag = window.KaloriApp.idag();
    if (d === idag) return 'Idag';
    if (d === B.flyttaDag(idag, -1)) return 'Igår';
    const [a, m, dd] = d.split('-').map(Number);
    const t = new Date(Date.UTC(a, m - 1, dd, 12)).toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  async function hamtaDag(d) {
    const [start, slut] = B.dygnUTC(d);
    const m = await sb.from('kalori_maltid').select('id,tid,typ,kalla,miniatyr').eq('user_id', userId).gte('tid', start).lt('tid', slut).order('tid');
    if (m.error) throw m.error;
    if (!m.data.length) return [];
    const r = await sb.from('kalori_maltid_rad').select('id,maltid_id,namn,gram,kcal').in('maltid_id', m.data.map((x) => x.id));
    if (r.error) throw r.error;
    const maltider = m.data.map((x) => ({ ...x, rader: r.data.filter((y) => y.maltid_id === x.id) }));
    // Signerade länkar till miniatyrerna (privat bucket). Fel här ska inte stoppa översikten.
    const sokvagar = maltider.map((x) => x.miniatyr).filter(Boolean);
    if (sokvagar.length) {
      try {
        const s = await sb.storage.from('kalori-foton').createSignedUrls(sokvagar, 3600);
        const url = new Map((s.data || []).filter((x) => x.signedUrl).map((x) => [x.path, x.signedUrl]));
        maltider.forEach((x) => { x.bildUrl = url.get(x.miniatyr) || null; });
      } catch (e) { /* utan bilder */ }
    }
    return maltider;
  }

  let senaste = [];

  function rita(maltider) {
    senaste = maltider;
    const atit = maltider.reduce((s, m) => s + m.rader.reduce((t, r) => t + Number(r.kcal), 0), 0);
    $('ida-atit').textContent = fmt(atit);
    $('ida-mal').textContent = mal ? fmt(mal) : '–';
    const kvar = mal ? mal - atit : null;
    $('ida-kvar').textContent = kvar === null ? '–' : fmt(Math.abs(kvar));
    $('ida-kvar-etikett').textContent = kvar !== null && kvar < 0 ? 'Över' : 'Kvar';
    $('ida-kvar-ruta').classList.toggle('over', kvar !== null && kvar < 0);
    const andel = mal ? Math.min(100, Math.round(atit / mal * 100)) : 0;
    $('ida-stapel-fyllning').style.width = andel + '%';
    $('ida-stapel').setAttribute('aria-label', mal ? fmt(atit) + ' av ' + fmt(mal) + ' kcal, ' + andel + ' procent' : fmt(atit) + ' kcal');
    $('ida-stapel').classList.toggle('over', kvar !== null && kvar < 0);

    $('ida-maltider').innerHTML = TYPER.map(([typ, namn]) => {
      const dessa = maltider.filter((m) => m.typ === typ);
      const rader = dessa.flatMap((m) => m.rader.map((r) => ({ ...r, kalla: m.kalla })));
      const bilder = dessa.filter((m) => m.bildUrl).map((m) => `<img src="${esc(m.bildUrl)}" alt="Foto av ${namn.toLowerCase()}" loading="lazy">`).join('');
      const summa = rader.reduce((s, r) => s + Number(r.kcal), 0);
      const lista = rader.map((r) =>
        `<li><button type="button" class="rad-knapp" data-id="${esc(r.id)}" aria-label="Ändra ${esc(r.namn)}, ${fmt(r.gram)} gram, ${fmt(r.kcal)} kcal">` +
        `<span class="rad-namn">${esc(r.namn)}</span><span class="rad-gram num">${fmt(r.gram)} g</span><span class="rad-kcal num">${fmt(r.kcal)}</span></button></li>`).join('');
      return `<section class="maltid" data-typ="${typ}" aria-label="${namn}">
        <header class="maltid-huvud"><h3>${namn}</h3><span class="num">${rader.length ? fmt(summa) + ' kcal' : ''}</span></header>
        ${bilder ? `<div class="maltid-bilder">${bilder}</div>` : ''}
        ${rader.length ? `<ul class="rader">${lista}</ul>` : `<p class="muted small tom">Inte loggat</p>`}
        <button type="button" class="lagg-till" data-typ="${typ}">+ Lägg till ${namn.toLowerCase()}</button>
      </section>`;
    }).join('');
  }

  async function visa(opts = {}) {
    if (opts.datum) datum = opts.datum;
    if (!datum) datum = window.KaloriApp.idag();
    if ('mal' in opts) mal = opts.mal;
    const idag = window.KaloriApp.idag();
    if (datum > idag) datum = idag;
    $('ida-datum').textContent = datumText(datum);
    $('ida-nasta').disabled = datum >= idag;
    $('ida-tillbaka-idag').hidden = datum === idag;
    $('ida-fel').hidden = true;
    const nr = ++laddning;
    try {
      const maltider = await hamtaDag(datum);
      if (nr === laddning) rita(maltider);
    } catch (e) {
      if (nr === laddning) { rita([]); $('ida-fel').hidden = false; }
    }
  }

  function setup(klient, opts) {
    sb = klient;
    $('ida-forra').addEventListener('click', () => visa({ datum: B.flyttaDag(datum, -1) }));
    $('ida-nasta').addEventListener('click', () => visa({ datum: B.flyttaDag(datum, 1) }));
    $('ida-tillbaka-idag').addEventListener('click', () => visa({ datum: window.KaloriApp.idag() }));
    $('ida-maltider').addEventListener('click', (e) => {
      const b = e.target.closest('button.lagg-till');
      if (b) { opts.loggaMat({ typ: b.dataset.typ, datum }); return; }
      const r = e.target.closest('button.rad-knapp');
      if (r) {
        const rad = senaste.flatMap((m) => m.rader).find((x) => String(x.id) === r.dataset.id);
        if (rad) opts.redigera(rad);
      }
    });
    $('btn-logga-mat').addEventListener('click', () => opts.loggaMat({ datum }));
  }

  window.KaloriIdag = { setup, visa, setUser(id) { userId = id; datum = null; }, get datum() { return datum; } };
})();
