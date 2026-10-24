// Fota mat (US-04, US-05): bilden krymps, analyseras av Edge Function kalori-analys,
// förslaget kan justeras och sparas som en måltid med miniatyr (D-10).
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const fmt = (x, d = 0) => Number(x).toLocaleString('sv-SE', { maximumFractionDigits: d });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ANALYS_MAX_PX = 1024;
  const MINIATYR_MAX_PX = 240;
  const MINIATYR_MAX_BYTE = 30 * 1024;

  let sb = null;
  let userId = null;
  let klar = null;
  let rader = [];        // [{ namn, gram, kcal }]
  let miniatyr = null;   // Blob
  let forvaltTyp = null;
  let datum = null;

  // Läser bilden (även HEIC i Safari) till något som kan ritas
  async function lasBild(fil) {
    if (window.createImageBitmap) {
      try { return await createImageBitmap(fil, { imageOrientation: 'from-image' }); } catch (e) { /* prova <img> */ }
    }
    return await new Promise((ok, fel) => {
      const img = new Image();
      img.onload = () => ok(img);
      img.onerror = () => fel(new Error('Kunde inte läsa bilden'));
      img.src = URL.createObjectURL(fil);
    });
  }

  function rita(bild, maxPx) {
    const w = bild.width || bild.naturalWidth;
    const h = bild.height || bild.naturalHeight;
    const skala = Math.min(1, maxPx / Math.max(w, h));
    const c = document.createElement('canvas');
    c.width = Math.round(w * skala);
    c.height = Math.round(h * skala);
    c.getContext('2d').drawImage(bild, 0, 0, c.width, c.height);
    return c;
  }

  const tillBlob = (c, q) => new Promise((ok) => c.toBlob(ok, 'image/jpeg', q));

  // Miniatyr: sänk kvaliteten stegvis tills den är högst 30 kB
  async function skapaMiniatyr(bild) {
    const c = rita(bild, MINIATYR_MAX_PX);
    let blob = null;
    for (const q of [0.75, 0.6, 0.45, 0.3]) {
      blob = await tillBlob(c, q);
      if (blob && blob.size <= MINIATYR_MAX_BYTE) break;
    }
    return blob;
  }

  function summa() {
    return rader.reduce((s, r) => s + (Number(r.kcal) || 0), 0);
  }

  function visaRader() {
    $('fot-rader').innerHTML = rader.map((r, i) => `
      <li class="fot-rad" data-i="${i}">
        <label class="visually-hidden" for="fot-namn-${i}">Livsmedel ${i + 1}</label>
        <input id="fot-namn-${i}" class="fot-namn" data-falt="namn" type="text" value="${esc(r.namn)}" placeholder="Vad är det?" autocomplete="off">
        <div class="fot-tal">
          <label for="fot-gram-${i}">Gram</label>
          <input id="fot-gram-${i}" data-falt="gram" type="text" inputmode="decimal" value="${fmt(r.gram, 1)}" autocomplete="off">
        </div>
        <div class="fot-tal">
          <label for="fot-kcal-${i}">kcal</label>
          <input id="fot-kcal-${i}" data-falt="kcal" type="text" inputmode="decimal" value="${fmt(r.kcal, 1)}" autocomplete="off">
        </div>
        <button type="button" class="fot-bort" data-i="${i}" aria-label="Ta bort ${esc(r.namn || 'raden')}">×</button>
      </li>`).join('');
    $('fot-summa').textContent = fmt(summa());
  }

  function tal(v) {
    const n = Number(String(v).trim().replace(',', '.'));
    return Number.isFinite(n) ? n : NaN;
  }

  // Ändrad mängd räknar om kcal i samma proportion (US-05 AC1). Ändrad kcal sparas som den är.
  function andrat(e) {
    const li = e.target.closest('.fot-rad');
    if (!li) return;
    const r = rader[Number(li.dataset.i)];
    const falt = e.target.dataset.falt;
    if (falt === 'namn') { r.namn = e.target.value; return; }
    const v = tal(e.target.value);
    if (falt === 'gram') {
      if (v > 0 && r.gram > 0) {
        r.kcal = Math.round(r.kcal / r.gram * v * 10) / 10;
        li.querySelector('[data-falt="kcal"]').value = fmt(r.kcal, 1);
      }
      r.gram = v;
    }
    if (falt === 'kcal') r.kcal = v;
    $('fot-summa').textContent = fmt(summa());
  }

  function setMsg(text, kind) {
    $('fot-msg').textContent = text || '';
    $('fot-msg').className = 'msg' + (kind ? ' ' + kind : '');
  }

  function visaSteg(steg) {
    const vyer = { laddar: 'fot-laddar', fel: 'fot-fel', forslag: 'form-foto' };
    Object.entries(vyer).forEach(([s, id]) => { $(id).hidden = s !== steg; });
  }

  // Felmeddelandet från Edge Function, eller ett allmänt
  async function felText(error) {
    try {
      const svar = error && error.context;
      if (svar && typeof svar.json === 'function') {
        const j = await svar.json();
        if (j && j.meddelande) return j.meddelande + (j.detalj ? ' (' + j.detalj + ')' : '');
      }
    } catch (e) { /* allmänt meddelande nedan */ }
    return 'Bildanalysen fungerade inte just nu. Kontrollera nätet eller logga manuellt.';
  }

  async function analysera(fil) {
    window.KaloriApp.visa('view-foto');
    visaSteg('laddar');
    setMsg('');
    rader = [];
    miniatyr = null;
    let bild;
    try {
      bild = await lasBild(fil);
    } catch (e) {
      $('fot-feltext').textContent = 'Kunde inte läsa bilden. Prova en annan bild.';
      visaSteg('fel');
      return;
    }
    const c = rita(bild, ANALYS_MAX_PX);
    const base64 = c.toDataURL('image/jpeg', 0.8).split(',')[1];
    miniatyr = await skapaMiniatyr(bild).catch(() => null);
    if (miniatyr) $('fot-bild').src = URL.createObjectURL(miniatyr);
    $('fot-bild').hidden = !miniatyr;

    let res;
    try {
      res = await sb.functions.invoke('kalori-analys', { body: { bild: base64, mime: 'image/jpeg' } });
    } catch (e) {
      res = { error: e };
    }
    if (res.error || !res.data || !Array.isArray(res.data.rader)) {
      $('fot-feltext').textContent = await felText(res.error);
      visaSteg('fel');
      return;
    }
    rader = res.data.rader.map((r) => ({ namn: r.namn, gram: Number(r.gram), kcal: Number(r.kcal) }));
    const typ = forvaltTyp || window.KaloriMaltid.foreslagenTyp();
    document.querySelectorAll('input[name="fot-typ"]').forEach((r) => { r.checked = r.value === typ; });
    visaRader();
    visaSteg('forslag');
  }

  async function spara(e) {
    e.preventDefault();
    if (!rader.length) { setMsg('Lägg till minst ett livsmedel eller tryck Tillbaka.', 'error'); return; }
    for (const r of rader) {
      if (!String(r.namn).trim()) { setMsg('Alla rader behöver ett namn.', 'error'); return; }
      if (!(r.gram > 0 && r.gram <= 5000)) { setMsg('Mängden ska vara mellan 1 och 5 000 gram (' + r.namn + ').', 'error'); return; }
      if (!(r.kcal >= 0 && r.kcal <= 10000)) { setMsg('Kontrollera kcal för ' + r.namn + '.', 'error'); return; }
    }
    const typEl = document.querySelector('input[name="fot-typ"]:checked');
    if (!typEl) { setMsg('Välj måltid.', 'error'); return; }

    const knapp = $('form-foto').querySelector('button[type="submit"]');
    knapp.disabled = true;
    setMsg('Sparar…');
    const id = crypto.randomUUID();
    let sokvag = null;
    if (miniatyr) {
      const p = userId + '/' + id + '.jpg';
      const up = await sb.storage.from('kalori-foton').upload(p, miniatyr, { contentType: 'image/jpeg', upsert: true }).catch((err) => ({ error: err }));
      if (!up.error) sokvag = p; // utan miniatyr går det ändå att spara
    }
    try {
      const m = await sb.from('kalori_maltid').insert({ id, user_id: userId, tid: window.KaloriMaltid.tidFor(datum), typ: typEl.value, kalla: 'foto', miniatyr: sokvag });
      if (m.error) throw m.error;
      const r = await sb.from('kalori_maltid_rad').insert(rader.map((x) => ({
        maltid_id: id, user_id: userId, namn: String(x.namn).trim(), livsmedel_nr: null,
        gram: Math.round(x.gram * 10) / 10, kcal: Math.round(x.kcal * 10) / 10
      })));
      if (r.error) {
        await sb.from('kalori_maltid').delete().eq('id', id);
        throw r.error;
      }
    } catch (err) {
      if (sokvag) await sb.storage.from('kalori-foton').remove([sokvag]).catch(() => {});
      knapp.disabled = false;
      setMsg('Kunde inte spara. Kontrollera nätet och försök igen.', 'error');
      return;
    }
    knapp.disabled = false;
    window.KaloriApp.toast('Måltid sparad (' + fmt(summa()) + ' kcal)');
    if (klar) klar();
  }

  function setup(klient, opts) {
    sb = klient;
    klar = opts.klar;
    document.querySelectorAll('.foto-input').forEach((inp) => inp.addEventListener('change', (e) => {
      const fil = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!fil) return;
      // Från dagsöversikten: den dag som visas. Från Logga mat: den dag och måltid som valts där.
      const o = e.target.closest('#view-app') ? { typ: null, datum: window.KaloriIdag.datum } : window.KaloriMaltid.aktuella();
      forvaltTyp = o.typ;
      datum = o.datum;
      analysera(fil);
    }));
    $('fot-rader').addEventListener('input', andrat);
    $('fot-rader').addEventListener('click', (e) => {
      const b = e.target.closest('.fot-bort');
      if (!b) return;
      rader.splice(Number(b.dataset.i), 1);
      visaRader();
    });
    $('fot-lagg-till').addEventListener('click', () => {
      rader.push({ namn: '', gram: 100, kcal: 0 });
      visaRader();
      $('fot-namn-' + (rader.length - 1)).focus();
    });
    $('form-foto').addEventListener('submit', spara);
    $('fot-tillbaka').addEventListener('click', () => { if (opts.avbryt) opts.avbryt(); });
    $('fot-manuellt').addEventListener('click', () => window.KaloriMaltid.oppna({ typ: forvaltTyp, datum }));
  }

  window.KaloriFoto = { setup, setUser(id) { userId = id; } };
})();
