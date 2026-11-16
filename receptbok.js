// Receptbok (US-18–US-20): visa ett recept, logga en portion, Hur blev det?, spara, lista, sök, ändra och ta bort.
// Ett recept har samma form som raden i kalori_recept. Recept som inte är sparade saknar id.
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const R = window.KaloriRecept;
  const fmt = (x, d = 0) => Number(x).toLocaleString('sv-SE', { maximumFractionDigits: d });
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const MAN = ['jan.', 'feb.', 'mars', 'apr.', 'maj', 'juni', 'juli', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'];
  const kortDatum = (iso) => { const [, m, d] = iso.split('-').map(Number); return d + ' ' + MAN[m - 1]; };
  const FALT = ['namn', 'beskrivning', 'portioner', 'kcal_portion', 'tid_min', 'ingredienser', 'steg', 'betyg', 'anteckning', 'antal_lagad', 'senast_lagad'];

  let sb = null;
  let userId = null;
  let tillApp = null;
  let bok = null;            // sparade recept, null = inte hämtade
  let recept = null;         // receptet som visas
  let portioner = 2;         // valt antal portioner i receptvyn
  let tillbaka = null;       // vart ← Tillbaka i receptvyn leder
  let senasteForslag = null; // för Försök igen
  let betygRecept = null;    // receptet i Hur blev det?
  let valtBetyg = 0;

  // ---------- Hämta och spara ----------
  async function hamta() {
    const { data, error } = await sb.from('kalori_recept').select('*').order('namn');
    if (error) throw error;
    bok = data || [];
    return bok;
  }

  const rad = (r) => Object.fromEntries(FALT.filter((f) => f in r).map((f) => [f, r[f]]));

  // Sparar ett nytt recept eller ändringar i ett sparat. Returnerar receptet med id.
  async function spara(r, andringar = {}) {
    if (r.id) {
      const nytt = { ...rad(andringar), uppdaterad: new Date().toISOString() };
      const { error } = await sb.from('kalori_recept').update(nytt).eq('id', r.id);
      if (error) throw error;
      Object.assign(r, andringar);
    } else {
      const ny = { id: crypto.randomUUID(), user_id: userId, ...rad({ antal_lagad: 0, betyg: null, anteckning: null, ...r, ...andringar }) };
      const { error } = await sb.from('kalori_recept').insert(ny);
      if (error) throw error;
      Object.assign(r, ny);
      if (bok) bok.push(r);
    }
    delete r._sok; // sökbar text byggs om
    return r;
  }

  // Svar från Edge Function → receptets form i databasen
  function franFunktion(x) {
    return { namn: x.namn, beskrivning: x.beskrivning || '', portioner: x.portioner, kcal_portion: x.kcalPortion, tid_min: x.tidMin,
      ingredienser: x.ingredienser, steg: x.steg, betyg: null, anteckning: null, antal_lagad: 0, senast_lagad: null };
  }

  async function felText(error) {
    return window.KaloriFoto.felText(error).then((t) => t.replace('Bildanalysen fungerade inte just nu. Kontrollera nätet eller logga manuellt.', 'Det gick inte just nu. Kontrollera nätet och försök igen.'));
  }

  // ---------- Receptvyn ----------
  function visaSteg(steg) {
    $('rec-laddar').hidden = steg !== 'laddar';
    $('rec-fel').hidden = steg !== 'fel';
    $('rec-innehall').hidden = steg !== 'recept';
    $('rec-spara').hidden = steg !== 'recept' || !!(recept && recept.id);
    $('rec-andra').hidden = steg !== 'recept' || !(recept && recept.id);
  }

  function ritaRecept() {
    const r = recept;
    $('rec-namn').textContent = r.namn;
    $('rec-beskrivning').textContent = r.beskrivning || '';
    $('rec-beskrivning').hidden = !r.beskrivning;
    $('rec-betyg').innerHTML = `<span class="stjarnor" aria-hidden="true">${R.stjarnor(r.betyg)}</span> <span class="muted small">${r.betyg ? r.betyg + ' av 5' : 'inte betygsatt'}</span>`;
    $('rec-anteckning').textContent = r.anteckning ? '”' + r.anteckning + '”' : '';
    $('rec-anteckning').hidden = !r.anteckning;
    $('rec-kcal').textContent = fmt(r.kcal_portion);
    $('rec-tid').textContent = r.tid_min ? fmt(r.tid_min) : '–';
    $('rec-portioner').textContent = portioner;
    $('rec-farre').disabled = portioner <= 1;
    $('rec-fler').disabled = portioner >= 20;
    $('rec-ingredienser').innerHTML = R.skala(r.ingredienser, r.portioner, portioner).map((i) =>
      `<li><span>${esc(i.namn)}</span><span class="num muted">${esc(R.visaMangd(i.mangd, i.enhet))}</span></li>`).join('');
    $('rec-steg').innerHTML = (r.steg || []).map((s) => `<li>${esc(s)}</li>`).join('');
    $('rec-lagad').textContent = r.antal_lagad ? 'Lagad ' + lagadText(r) : '';
    $('rec-logga').textContent = 'Logga en portion (' + fmt(r.kcal_portion) + ' kcal)';
    $('rec-msg').textContent = '';
    $('rec-msg').className = 'msg';
  }

  function lagadText(r) {
    return (r.antal_lagad === 1 ? '1 gång' : fmt(r.antal_lagad) + ' ggr') + (r.senast_lagad ? ' · senast ' + kortDatum(r.senast_lagad) : '');
  }

  // Visar ett recept (sparat eller nytt). opts.tillbaka anropas av ← Tillbaka.
  function visa(r, opts = {}) {
    recept = r;
    portioner = r.portioner || 2;
    if (opts.tillbaka) tillbaka = opts.tillbaka;
    window.KaloriApp.visa('view-recept');
    ritaRecept();
    visaSteg('recept');
    window.scrollTo(0, 0);
  }

  // Valt förslag: hämta receptet från Edge Function (US-18 AC1)
  async function franForslag(forslag, ingredienser, opts = {}) {
    senasteForslag = { forslag, ingredienser };
    if (opts.tillbaka) tillbaka = opts.tillbaka;
    recept = null;
    window.KaloriApp.visa('view-recept');
    visaSteg('laddar');
    let res;
    try {
      res = await sb.functions.invoke('kalori-recept', { body: { uppgift: 'recept', ratt: { namn: forslag.namn, beskrivning: forslag.beskrivning, portioner: forslag.portioner }, ingredienser } });
    } catch (e) { res = { error: e }; }
    if (res.error || !res.data || !res.data.recept) {
      $('rec-feltext').textContent = await felText(res.error);
      visaSteg('fel');
      return;
    }
    visa(franFunktion(res.data.recept));
  }

  async function sparaKnapp() {
    const knapp = $('rec-spara');
    knapp.disabled = true;
    try {
      await spara(recept);
    } catch (e) {
      knapp.disabled = false;
      $('rec-msg').textContent = 'Kunde inte spara receptet. Kontrollera nätet och försök igen.';
      $('rec-msg').className = 'msg error';
      return;
    }
    knapp.disabled = false;
    visaSteg('recept');
    window.KaloriApp.toast('Sparat i receptboken');
  }

  // ---------- Logga en portion (US-18 AC3, US-19 AC3) ----------
  async function logga() {
    const r = recept;
    const knapp = $('rec-logga');
    knapp.disabled = true;
    const idag = window.KaloriApp.idag();
    const typ = window.KaloriMaltid.foreslagenTyp();
    const id = crypto.randomUUID();
    try {
      const m = await sb.from('kalori_maltid').insert({ id, user_id: userId, tid: window.KaloriMaltid.tidFor(idag), typ, kalla: 'recept', miniatyr: null });
      if (m.error) throw m.error;
      const rd = await sb.from('kalori_maltid_rad').insert({ maltid_id: id, user_id: userId, namn: r.namn.slice(0, 200), livsmedel_nr: null,
        gram: R.gramPerPortion(r.ingredienser, r.portioner), kcal: r.kcal_portion });
      if (rd.error) { await sb.from('kalori_maltid').delete().eq('id', id); throw rd.error; }
    } catch (e) {
      knapp.disabled = false;
      $('rec-msg').textContent = 'Kunde inte logga. Kontrollera nätet och försök igen.';
      $('rec-msg').className = 'msg error';
      return;
    }
    if (r.id) {
      // Räkningen är inte kritisk – måltiden är redan loggad
      await spara(r, { antal_lagad: (r.antal_lagad || 0) + 1, senast_lagad: idag }).catch(() => {});
    } else {
      r.antal_lagad = 1;
      r.senast_lagad = idag;
    }
    knapp.disabled = false;
    oppnaBetyg(r, typ);
    if (tillApp) tillApp();
  }

  // ---------- Hur blev det? (US-19 AC2) ----------
  const TYPNAMN = { frukost: 'frukost', lunch: 'lunch', middag: 'middag', mellanmal: 'mellanmål' };

  function markeraBetyg(n) {
    valtBetyg = n;
    document.querySelectorAll('#ida-betyg .stjarna').forEach((b) => {
      const v = Number(b.dataset.betyg);
      b.classList.toggle('vald', v <= n);
      b.setAttribute('aria-checked', String(v === n));
    });
  }

  function oppnaBetyg(r, typ) {
    betygRecept = r;
    $('ida-betyg-loggad').textContent = r.namn + ' loggad till ' + TYPNAMN[typ] + ' (' + fmt(r.kcal_portion) + ' kcal)';
    $('ida-betyg-anteckning').value = r.anteckning || '';
    $('ida-betyg-msg').textContent = '';
    $('ida-betyg-msg').className = 'msg';
    markeraBetyg(r.betyg || 0);
    $('ida-betyg').hidden = false;
  }

  async function sparaBetyg() {
    if (!valtBetyg) { $('ida-betyg-msg').textContent = 'Välj antal stjärnor.'; $('ida-betyg-msg').className = 'msg error'; return; }
    const knapp = $('ida-betyg-spara');
    knapp.disabled = true;
    const anteckning = $('ida-betyg-anteckning').value.trim().slice(0, 1000) || null;
    try {
      await spara(betygRecept, { betyg: valtBetyg, anteckning });
    } catch (e) {
      knapp.disabled = false;
      $('ida-betyg-msg').textContent = 'Kunde inte spara betyget. Kontrollera nätet och försök igen.';
      $('ida-betyg-msg').className = 'msg error';
      return;
    }
    knapp.disabled = false;
    $('ida-betyg').hidden = true;
    betygRecept = null;
    window.KaloriApp.toast('Betyget sparat i receptboken');
  }

  // ---------- Receptboken (US-20) ----------
  function kort(r, extra = '') {
    return `<li><button type="button" class="recept-kort-knapp" data-id="${esc(r.id)}">
      <span class="recept-kort-huvud"><span class="recept-kort-namn">${esc(r.namn)}</span>
        <span class="stjarnor" aria-label="${r.betyg ? r.betyg + ' av 5 stjärnor' : 'Inget betyg'}">${R.stjarnor(r.betyg)}</span></span>
      <span class="muted small num">${fmt(r.kcal_portion)} kcal/portion${r.tid_min ? ' · ' + fmt(r.tid_min) + ' min' : ''}${r.antal_lagad ? ' · lagad ' + lagadText(r) : ''}${extra}</span>
      ${r.anteckning ? `<span class="anteckning small">”${esc(r.anteckning)}”</span>` : ''}
    </button></li>`;
  }

  function ritaBok() {
    if (!bok) return;
    const min = Number((document.querySelector('input[name="bok-betyg"]:checked') || {}).value || 0);
    const lista = R.sortera(R.filtrera(R.sok(bok, $('bok-sok').value), min), $('bok-sortera').value);
    $('bok-lista').innerHTML = lista.map((r) => kort(r)).join('');
    $('bok-antal').textContent = lista.length === 1 ? '1 recept' : fmt(lista.length) + ' recept';
    $('bok-tom').hidden = lista.length > 0;
    $('bok-tom').textContent = bok.length ? 'Inga recept matchar.' : 'Inga recept ännu. Tryck + Laga mat, fota det du har hemma och spara recepten du gillar.';
  }

  async function oppnaBok() {
    window.KaloriApp.visa('view-receptbok');
    $('bok-fel').hidden = true;
    ritaBok();
    try {
      await hamta();
    } catch (e) {
      $('bok-fel').hidden = false;
      return;
    }
    ritaBok();
  }

  // ---------- Ändra recept (US-19 AC4–5) ----------
  const tal = (v) => { const s = String(v).trim().replace(',', '.'); return s === '' ? null : Number(s); };

  function ingRad(i, n) {
    return `<li class="rea-ing">
      <label class="visually-hidden" for="rea-ing-namn-${n}">Ingrediens ${n + 1}</label>
      <input id="rea-ing-namn-${n}" data-falt="namn" type="text" value="${esc(i.namn)}" placeholder="Ingrediens" autocomplete="off">
      <label class="visually-hidden" for="rea-ing-mangd-${n}">Mängd</label>
      <input id="rea-ing-mangd-${n}" data-falt="mangd" type="text" inputmode="decimal" value="${i.mangd == null ? '' : esc(String(i.mangd).replace('.', ','))}" placeholder="Mängd" autocomplete="off">
      <label class="visually-hidden" for="rea-ing-enhet-${n}">Enhet</label>
      <input id="rea-ing-enhet-${n}" data-falt="enhet" type="text" value="${esc(i.enhet || '')}" placeholder="g" autocomplete="off">
      <button type="button" class="fot-bort" aria-label="Ta bort ${esc(i.namn || 'raden')}">×</button>
    </li>`;
  }

  function stegRad(s, n) {
    return `<li class="rea-steg">
      <label class="visually-hidden" for="rea-steg-${n}">Steg ${n + 1}</label>
      <textarea id="rea-steg-${n}" rows="2" placeholder="Vad ska göras?">${esc(s)}</textarea>
      <button type="button" class="fot-bort" aria-label="Ta bort steg ${n + 1}">×</button>
    </li>`;
  }

  // Läser formulärets listor så att inget skrivet försvinner när rader läggs till eller tas bort
  function lasIngredienser() {
    return [...document.querySelectorAll('#rea-ingredienser .rea-ing')].map((li) => ({
      namn: li.querySelector('[data-falt="namn"]').value.trim(),
      mangdText: li.querySelector('[data-falt="mangd"]').value,
      enhet: li.querySelector('[data-falt="enhet"]').value.trim()
    }));
  }
  const lasSteg = () => [...document.querySelectorAll('#rea-steg textarea')].map((t) => t.value.trim());

  function ritaListor(ing, steg) {
    $('rea-ingredienser').innerHTML = ing.map((i, n) => ingRad({ ...i, mangd: 'mangdText' in i ? i.mangdText : i.mangd }, n)).join('');
    $('rea-steg').innerHTML = steg.map(stegRad).join('');
  }

  function oppnaAndra() {
    const r = recept;
    window.KaloriApp.visa('view-recept-andra');
    $('rea-namn').value = r.namn;
    $('rea-beskrivning').value = r.beskrivning || '';
    $('rea-portioner').value = r.portioner;
    $('rea-kcal').value = r.kcal_portion;
    $('rea-tid').value = r.tid_min || '';
    $('rea-anteckning').value = r.anteckning || '';
    document.querySelectorAll('input[name="rea-betyg"]').forEach((x) => { x.checked = Number(x.value) === (r.betyg || 0); });
    ritaListor(r.ingredienser || [], r.steg || []);
    $('rea-msg').textContent = '';
    $('rea-msg').className = 'msg';
    $('rea-bekrafta').hidden = true;
    $('rea-ta-bort').hidden = false;
    window.scrollTo(0, 0);
  }

  async function sparaAndra(e) {
    e.preventDefault();
    const fel = (t) => { $('rea-msg').textContent = t; $('rea-msg').className = 'msg error'; };
    const namn = $('rea-namn').value.trim();
    const port = tal($('rea-portioner').value);
    const kcal = tal($('rea-kcal').value);
    const tid = tal($('rea-tid').value);
    if (!namn) return fel('Receptet behöver ett namn.');
    if (!(Number.isInteger(port) && port >= 1 && port <= 20)) return fel('Portioner ska vara ett heltal mellan 1 och 20.');
    if (!(kcal >= 0 && kcal <= 5000)) return fel('kcal per portion ska vara mellan 0 och 5 000.');
    if (tid !== null && !(tid >= 1 && tid <= 1440)) return fel('Tiden ska vara mellan 1 och 1 440 minuter, eller tom.');
    const ingredienser = [];
    for (const i of lasIngredienser()) {
      if (!i.namn && !i.mangdText.trim()) continue; // tom rad
      const m = tal(i.mangdText);
      if (!i.namn) return fel('Alla ingredienser behöver ett namn.');
      if (m !== null && !(m > 0)) return fel('Kontrollera mängden för ' + i.namn + '.');
      ingredienser.push({ namn: i.namn, mangd: m, enhet: i.enhet });
    }
    const betyg = Number((document.querySelector('input[name="rea-betyg"]:checked') || {}).value || 0) || null;
    const andringar = { namn, beskrivning: $('rea-beskrivning').value.trim() || null, portioner: port, kcal_portion: Math.round(kcal),
      tid_min: tid === null ? null : Math.round(tid), ingredienser, steg: lasSteg().filter(Boolean), betyg,
      anteckning: $('rea-anteckning').value.trim() || null };
    const knapp = $('form-recept').querySelector('button[type="submit"]');
    knapp.disabled = true;
    try {
      await spara(recept, andringar);
    } catch (err) {
      knapp.disabled = false;
      return fel('Kunde inte spara. Kontrollera nätet och försök igen.');
    }
    knapp.disabled = false;
    window.KaloriApp.toast('Receptet sparat');
    visa(recept);
  }

  async function taBort() {
    const knapp = $('rea-ja');
    knapp.disabled = true;
    const { error } = await sb.from('kalori_recept').delete().eq('id', recept.id).then((x) => x, (e) => ({ error: e }));
    knapp.disabled = false;
    if (error) {
      $('rea-bekrafta').hidden = true;
      $('rea-ta-bort').hidden = false;
      $('rea-msg').textContent = 'Kunde inte ta bort. Kontrollera nätet och försök igen.';
      $('rea-msg').className = 'msg error';
      return;
    }
    if (bok) bok = bok.filter((x) => x.id !== recept.id);
    window.KaloriApp.toast('Receptet borttaget');
    oppnaBok();
  }

  // ---------- Kopplingar ----------
  function setup(klient, opts) {
    sb = klient;
    tillApp = opts.klar;
    $('rec-tillbaka').addEventListener('click', () => (tillbaka || opts.avbryt)());
    $('rec-farre').addEventListener('click', () => { if (portioner > 1) { portioner--; ritaRecept(); } });
    $('rec-fler').addEventListener('click', () => { if (portioner < 20) { portioner++; ritaRecept(); } });
    $('rec-spara').addEventListener('click', sparaKnapp);
    $('rec-andra').addEventListener('click', oppnaAndra);
    $('rec-logga').addEventListener('click', logga);
    $('rec-forsok').addEventListener('click', () => senasteForslag && franForslag(senasteForslag.forslag, senasteForslag.ingredienser));

    $('ida-betyg').addEventListener('click', (e) => { const b = e.target.closest('.stjarna'); if (b) markeraBetyg(Number(b.dataset.betyg)); });
    $('ida-betyg-spara').addEventListener('click', sparaBetyg);
    $('ida-betyg-hoppa').addEventListener('click', () => { $('ida-betyg').hidden = true; betygRecept = null; });

    $('bok-tillbaka').addEventListener('click', opts.avbryt);
    $('bok-laga').addEventListener('click', opts.laga);
    $('bok-sok').addEventListener('input', ritaBok);
    $('bok-sortera').addEventListener('change', ritaBok);
    document.querySelectorAll('input[name="bok-betyg"]').forEach((x) => x.addEventListener('change', ritaBok));
    $('bok-lista').addEventListener('click', (e) => {
      const b = e.target.closest('.recept-kort-knapp');
      const r = b && bok && bok.find((x) => String(x.id) === b.dataset.id);
      if (r) visa(r, { tillbaka: oppnaBok });
    });

    $('rea-tillbaka').addEventListener('click', () => visa(recept));
    $('form-recept').addEventListener('submit', sparaAndra);
    $('rea-ny-ing').addEventListener('click', () => {
      const ing = lasIngredienser().concat({ namn: '', mangdText: '', enhet: '' });
      ritaListor(ing, lasSteg());
      $('rea-ing-namn-' + (ing.length - 1)).focus();
    });
    $('rea-nytt-steg').addEventListener('click', () => {
      const steg = lasSteg().concat('');
      ritaListor(lasIngredienser(), steg);
      $('rea-steg-' + (steg.length - 1)).focus();
    });
    $('rea-ingredienser').addEventListener('click', (e) => {
      const li = e.target.closest('.fot-bort') && e.target.closest('li');
      if (!li) return;
      const ing = lasIngredienser();
      ing.splice([...li.parentNode.children].indexOf(li), 1);
      ritaListor(ing, lasSteg());
    });
    $('rea-steg').addEventListener('click', (e) => {
      const li = e.target.closest('.fot-bort') && e.target.closest('li');
      if (!li) return;
      const steg = lasSteg();
      steg.splice([...li.parentNode.children].indexOf(li), 1);
      ritaListor(lasIngredienser(), steg);
    });
    $('rea-ta-bort').addEventListener('click', () => {
      $('rea-fraga').textContent = 'Ta bort ' + recept.namn + ' ur receptboken?';
      $('rea-bekrafta').hidden = false;
      $('rea-ta-bort').hidden = true;
    });
    $('rea-nej').addEventListener('click', () => { $('rea-bekrafta').hidden = true; $('rea-ta-bort').hidden = false; });
    $('rea-ja').addEventListener('click', taBort);
  }

  window.KaloriReceptbok = {
    setup, hamta, visa, franForslag, oppnaBok, kort,
    setUser(id) { if (id !== userId) { bok = null; $('ida-betyg').hidden = true; } userId = id; },
    get bok() { return bok; }
  };
})();
