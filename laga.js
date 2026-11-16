// Laga mat (US-16, US-17): fota ingredienser, rätta listan, se recept ur receptboken som passar
// och få förslag på rätter från Edge Function kalori-recept.
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const R = window.KaloriRecept;
  const fmt = (x) => Number(x).toLocaleString('sv-SE', { maximumFractionDigits: 0 });
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const MAX_BILDER = 4;
  const BILD_MAX_PX = 1024;

  let sb = null;
  let avbryt = null;
  let ingredienser = [];
  let forslag = [];
  let visade = [];   // namn på alla rätter som visats, så att Ge mig andra förslag ger nya (US-17 AC3)
  let steg = 'ing';

  function setMsg(id, text, kind) {
    $(id).textContent = text || '';
    $(id).className = 'msg' + (kind ? ' ' + kind : '');
  }

  const kvar = () => window.KaloriIdag.kvarIdag;

  function laggTill(namn) {
    const n = String(namn).trim().slice(0, 60);
    if (!n) return false;
    const stor = n.charAt(0).toUpperCase() + n.slice(1);
    if (ingredienser.some((x) => x.toLowerCase() === stor.toLowerCase())) return false;
    ingredienser.push(stor);
    return true;
  }

  function ritaIngredienser() {
    $('lag-chips').innerHTML = ingredienser.map((x, i) =>
      `<li class="chip"><span>${esc(x)}</span><button type="button" class="chip-bort" data-i="${i}" aria-label="Ta bort ${esc(x)}">×</button></li>`).join('');
    $('lag-ing-rubrik').textContent = ingredienser.length ? 'Det här har du' : 'Ingredienser';
    $('lag-fota-text').textContent = ingredienser.length ? '+ Fota fler' : 'Fota ingredienser';
    $('lag-foresla').disabled = !ingredienser.length;
    ritaMatchning();
  }

  // Sparade recept som passar ingredienserna (US-17 AC4)
  function ritaMatchning() {
    const bok = window.KaloriReceptbok.bok;
    const m = bok ? R.matcha(bok, ingredienser).slice(0, 3) : [];
    $('lag-bok').hidden = !m.length;
    $('lag-bok-antal').textContent = m.length === 1 ? '1 passar' : m.length + ' passar';
    $('lag-bok-lista').innerHTML = m.map((x) => window.KaloriReceptbok.kort(x.recept)).join('');
  }

  function visaSteg(s) {
    steg = s;
    $('lag-ing').hidden = s !== 'ing';
    $('lag-forslag').hidden = s !== 'forslag';
    $('lag-rubrik').textContent = s === 'forslag' ? 'Förslag' : 'Laga mat';
    $('lag-tillbaka').textContent = s === 'forslag' ? '← Ingredienser' : '← Tillbaka';
    window.scrollTo(0, 0);
  }

  function laddar(text) {
    $('lag-laddar').hidden = !text;
    if (text) $('lag-laddar-text').textContent = text;
    $('lag-foresla').disabled = !!text || !ingredienser.length;
    $('lag-fota').classList.toggle('inaktiv', !!text);
  }

  function oppna() {
    ingredienser = [];
    forslag = [];
    visade = [];
    window.KaloriApp.visa('view-laga');
    visaSteg('ing');
    laddar(null);
    setMsg('lag-msg', '');
    const k = kvar();
    $('lag-kvar').textContent = k != null && k > 0 ? 'Kvar idag: ' + fmt(k) + ' kcal – förslagen anpassas efter det.' : '';
    ritaIngredienser();
    window.KaloriReceptbok.hamta().then(ritaMatchning).catch(() => {}); // utan receptboken går det ändå att få förslag
  }

  // ---------- Ingredienser från foto (US-16) ----------
  async function fotat(filer) {
    if (filer.length > MAX_BILDER) {
      setMsg('lag-msg', 'Högst ' + MAX_BILDER + ' bilder åt gången. De första ' + MAX_BILDER + ' används.');
      filer = filer.slice(0, MAX_BILDER);
    } else setMsg('lag-msg', '');
    laddar(filer.length > 1 ? 'Letar ingredienser på ' + filer.length + ' bilder …' : 'Letar ingredienser …');
    let bilder;
    try {
      bilder = [];
      for (const f of filer) {
        const c = window.KaloriFoto.rita(await window.KaloriFoto.lasBild(f), BILD_MAX_PX);
        bilder.push(c.toDataURL('image/jpeg', 0.8).split(',')[1]);
      }
    } catch (e) {
      laddar(null);
      setMsg('lag-msg', 'Kunde inte läsa bilden. Prova en annan bild eller skriv in ingredienserna.', 'error');
      return;
    }
    let res;
    try {
      res = await sb.functions.invoke('kalori-recept', { body: { uppgift: 'ingredienser', bilder } });
    } catch (e) { res = { error: e }; }
    laddar(null);
    if (res.error || !res.data || !Array.isArray(res.data.ingredienser)) {
      const t = await window.KaloriFoto.felText(res.error);
      setMsg('lag-msg', (t.startsWith('Bildanalysen fungerade inte') ? 'Kunde inte hitta ingredienserna.' : t) + ' Skriv in dem själv nedan.', 'error');
      return;
    }
    const nya = res.data.ingredienser.filter(laggTill).length;
    ritaIngredienser();
    setMsg('lag-msg', nya ? '' : 'Inga nya ingredienser hittades.');
  }

  // ---------- Förslag (US-17) ----------
  function ritaForslag() {
    const k = kvar();
    $('lag-forslag-intro').textContent = 'Med ' + ingredienser.map((x) => x.toLowerCase()).join(', ') + '.' + (k != null && k > 0 ? ' Kvar idag: ' + fmt(k) + ' kcal.' : '');
    $('lag-forslag-lista').innerHTML = forslag.map((f, i) => {
      const passar = R.passarKvar(f.kcalPortion, k != null && k > 0 ? k : null);
      const marke = passar == null ? '' : `<span class="marke ${passar ? 'marke-ok' : 'marke-over'}">${passar ? 'Passar Kvar' : 'Över Kvar'}</span>`;
      return `<li><button type="button" class="recept-kort-knapp" data-i="${i}">
        <span class="recept-kort-huvud"><span class="recept-kort-namn">${esc(f.namn)}</span>${marke}</span>
        ${f.beskrivning ? `<span class="small">${esc(f.beskrivning)}</span>` : ''}
        <span class="muted small num">${fmt(f.kcalPortion)} kcal/portion · ${fmt(f.tidMin)} min · ${fmt(f.portioner)} portioner</span>
        ${f.saknas && f.saknas.length ? `<span class="saknas small">Saknas: ${esc(f.saknas.join(', ').toLowerCase())}</span>` : ''}
      </button></li>`;
    }).join('');
  }

  async function hamtaForslag(andra) {
    if (!ingredienser.length) { setMsg('lag-msg', 'Lägg till minst en ingrediens.', 'error'); return; }
    const msgId = andra ? 'lag-forslag-msg' : 'lag-msg';
    setMsg(msgId, andra ? 'Hämtar nya förslag …' : '');
    if (!andra) laddar('Hittar på rätter …');
    $('lag-andra').disabled = true;
    const k = kvar();
    let res;
    try {
      res = await sb.functions.invoke('kalori-recept', { body: { uppgift: 'forslag', ingredienser, kvarKcal: k != null && k > 0 ? k : null, undvik: andra ? visade : [] } });
    } catch (e) { res = { error: e }; }
    laddar(null);
    $('lag-andra').disabled = false;
    if (res.error || !res.data || !Array.isArray(res.data.forslag)) {
      const t = await window.KaloriFoto.felText(res.error);
      setMsg(msgId, t.startsWith('Bildanalysen fungerade inte') ? 'Det gick inte att få förslag just nu. Kontrollera nätet och försök igen.' : t, 'error');
      return;
    }
    if (!andra) visade = [];
    forslag = res.data.forslag;
    forslag.forEach((f) => { if (!visade.includes(f.namn)) visade.push(f.namn); });
    setMsg(msgId, '');
    ritaForslag();
    if (!andra) visaSteg('forslag');
  }

  function setup(klient, opts) {
    sb = klient;
    avbryt = opts.avbryt;
    $('lag-tillbaka').addEventListener('click', () => (steg === 'forslag' ? visaSteg('ing') : avbryt()));
    $('lag-foto-input').addEventListener('change', (e) => {
      const filer = [...(e.target.files || [])];
      e.target.value = '';
      if (filer.length) fotat(filer);
    });
    $('lag-chips').addEventListener('click', (e) => {
      const b = e.target.closest('.chip-bort');
      if (!b) return;
      ingredienser.splice(Number(b.dataset.i), 1);
      ritaIngredienser();
    });
    $('form-lag-ny').addEventListener('submit', (e) => {
      e.preventDefault();
      // Flera på en gång går också: "lök, vitlök"
      $('lag-ny').value.split(',').forEach(laggTill);
      $('lag-ny').value = '';
      setMsg('lag-msg', '');
      ritaIngredienser();
    });
    $('lag-foresla').addEventListener('click', () => hamtaForslag(false));
    $('lag-andra').addEventListener('click', () => hamtaForslag(true));
    $('lag-bok-lista').addEventListener('click', (e) => {
      const b = e.target.closest('.recept-kort-knapp');
      const bok = window.KaloriReceptbok.bok;
      const r = b && bok && bok.find((x) => String(x.id) === b.dataset.id);
      if (r) window.KaloriReceptbok.visa(r, { tillbaka: () => { window.KaloriApp.visa('view-laga'); visaSteg('ing'); } });
    });
    $('lag-forslag-lista').addEventListener('click', (e) => {
      const b = e.target.closest('.recept-kort-knapp');
      const f = b && forslag[Number(b.dataset.i)];
      if (f) window.KaloriReceptbok.franForslag(f, ingredienser, { tillbaka: () => { window.KaloriApp.visa('view-laga'); visaSteg('forslag'); } });
    });
  }

  window.KaloriLaga = { setup, oppna };
})();
