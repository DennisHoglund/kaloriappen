// Vikt (US-09, US-10): logga vikt (en mätning per dag, ny ersätter gammal) och graf mot målvikten.
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const B = window.KaloriBerakning;
  const fmt = (x, d = 1) => Number(x).toLocaleString('sv-SE', { minimumFractionDigits: d, maximumFractionDigits: d });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let sb = null;
  let userId = null;
  let klar = null;
  let malvikt = () => null;
  let matningar = [];  // [{ datum, vikt }] stigande
  let period = 30;     // dagar, 0 = allt
  let datum = null;

  function kortDatum(d) {
    const [a, m, dd] = d.split('-').map(Number);
    return new Date(Date.UTC(a, m - 1, dd, 12)).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  }

  async function hamta() {
    const { data, error } = await sb.from('kalori_vikt').select('datum,vikt_kg').eq('user_id', userId).order('datum', { ascending: true });
    if (error) throw error;
    return data.map((x) => ({ datum: x.datum, vikt: Number(x.vikt_kg) }));
  }

  // Ritar grafen som SVG: mätningar (punkter), 7-dagars medel (linje) och målvikt (streckad)
  function ritaGraf() {
    const idag = window.KaloriApp.idag();
    const urval = period ? matningar.filter((x) => B.dagarMellan(x.datum, idag) < period) : matningar;
    const mal = malvikt();
    const ruta = $('vik-graf');
    if (urval.length < 2) {
      ruta.innerHTML = '<p class="muted small graf-tom">Logga minst två mätningar för att se en graf.</p>';
      return;
    }
    const medel = B.glidandeMedel(matningar, 7).filter((m) => urval.some((u) => u.datum === m.datum));
    const W = 340, H = 190, VL = 40, HO = 10, UPP = 12, NER = 26;
    const vikter = urval.map((x) => x.vikt).concat(mal ? [mal] : []);
    const lo = Math.floor(Math.min(...vikter) - 0.5), hi = Math.ceil(Math.max(...vikter) + 0.5);
    const start = urval[0].datum, dagar = Math.max(1, B.dagarMellan(start, urval[urval.length - 1].datum));
    const x = (d) => VL + (W - VL - HO) * B.dagarMellan(start, d) / dagar;
    const y = (v) => UPP + (H - UPP - NER) * (hi - v) / (hi - lo);
    const r = (n) => Math.round(n * 10) / 10;

    const punkter = urval.map((p) => `<circle class="graf-punkt" cx="${r(x(p.datum))}" cy="${r(y(p.vikt))}" r="3"></circle>`).join('');
    const linje = medel.map((m) => r(x(m.datum)) + ',' + r(y(m.medel))).join(' ');
    const malLinje = mal ? `<line class="graf-mal" x1="${VL}" x2="${W - HO}" y1="${r(y(mal))}" y2="${r(y(mal))}"></line>` +
      `<text class="graf-text" x="${W - HO}" y="${r(y(mal)) - 4}" text-anchor="end">Mål ${fmt(mal)}</text>` : '';
    const forsta = urval[0].vikt, sista = urval[urval.length - 1].vikt;
    const etikett = `Vikt från ${fmt(forsta)} till ${fmt(sista)} kg mellan ${kortDatum(start)} och ${kortDatum(urval[urval.length - 1].datum)}` + (mal ? `, målvikt ${fmt(mal)} kg` : '');
    ruta.innerHTML = `<svg class="graf" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(etikett)}">
      <line class="graf-axel" x1="${VL}" x2="${W - HO}" y1="${H - NER}" y2="${H - NER}"></line>
      <text class="graf-text" x="${VL - 6}" y="${r(y(hi)) + 4}" text-anchor="end">${hi}</text>
      <text class="graf-text" x="${VL - 6}" y="${r(y(lo)) + 4}" text-anchor="end">${lo}</text>
      <text class="graf-text" x="${VL}" y="${H - 8}">${esc(kortDatum(start))}</text>
      <text class="graf-text" x="${W - HO}" y="${H - 8}" text-anchor="end">${esc(kortDatum(urval[urval.length - 1].datum))}</text>
      ${malLinje}
      <polyline class="graf-medel" points="${linje}"></polyline>
      ${punkter}
    </svg>`;
  }

  function ritaLista() {
    $('vik-lista').innerHTML = matningar.slice(-10).reverse().map((m) =>
      `<li class="vik-rad"><span>${esc(kortDatum(m.datum))}</span><span class="num">${fmt(m.vikt)} kg</span></li>`).join('');
  }

  function setMsg(text, kind) {
    $('vik-msg').textContent = text || '';
    $('vik-msg').className = 'msg' + (kind ? ' ' + kind : '');
  }

  async function oppna(opts = {}) {
    datum = opts.datum || window.KaloriApp.idag();
    $('vik-datum').textContent = datum === window.KaloriApp.idag() ? 'idag' : kortDatum(datum);
    setMsg('');
    window.KaloriApp.visa('view-vikt');
    try {
      matningar = await hamta();
    } catch (e) {
      matningar = [];
      setMsg('Kunde inte hämta vikterna. Kontrollera nätet.', 'error');
    }
    const dagens = matningar.find((m) => m.datum === datum);
    const senaste = matningar[matningar.length - 1];
    $('vik-vikt').value = dagens ? fmt(dagens.vikt) : (senaste ? fmt(senaste.vikt) : '');
    ritaGraf();
    ritaLista();
  }

  async function spara(e) {
    e.preventDefault();
    const v = Number($('vik-vikt').value.trim().replace(',', '.'));
    if (!(v >= 30 && v <= 300)) { setMsg('Vikten ska vara mellan 30 och 300 kg.', 'error'); return; }
    const knapp = $('form-vikt').querySelector('button[type="submit"]');
    knapp.disabled = true;
    setMsg('Sparar…');
    const { error } = await sb.from('kalori_vikt').upsert({ user_id: userId, datum, vikt_kg: Math.round(v * 10) / 10 }, { onConflict: 'user_id,datum' });
    knapp.disabled = false;
    if (error) { setMsg('Kunde inte spara. Kontrollera nätet och försök igen.', 'error'); return; }
    window.KaloriApp.toast('Vikt ' + fmt(v) + ' kg sparad');
    if (klar) klar();
  }

  // Liten sammanfattning till dagsöversikten
  async function sammanfattning() {
    const m = await hamta();
    if (!m.length) return null;
    const sista = m[m.length - 1];
    const forsta = m[0];
    return { vikt: sista.vikt, datum: sista.datum, forandring: Math.round((sista.vikt - forsta.vikt) * 10) / 10, sedan: forsta.datum, antal: m.length };
  }

  function setup(klient, opts) {
    sb = klient;
    klar = opts.klar;
    malvikt = opts.malvikt;
    $('form-vikt').addEventListener('submit', spara);
    $('vik-tillbaka').addEventListener('click', () => { if (opts.avbryt) opts.avbryt(); });
    document.querySelectorAll('input[name="vik-period"]').forEach((r) => r.addEventListener('change', () => { period = Number(r.value); ritaGraf(); }));
  }

  window.KaloriVikt = { setup, setUser(id) { userId = id; }, oppna, sammanfattning, kortDatum };
})();
