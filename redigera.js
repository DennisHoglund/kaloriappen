// Ändra mängd eller ta bort en loggad rad (US-08). Tas sista raden bort försvinner hela måltiden.
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const fmt = (x, d = 0) => Number(x).toLocaleString('sv-SE', { maximumFractionDigits: d });

  let sb = null;
  let klar = null;
  let rad = null; // { id, maltid_id, namn, gram, kcal }

  function gram() {
    const v = $('red-gram').value.trim().replace(',', '.');
    return v === '' ? NaN : Number(v);
  }

  // Ny kcal i samma proportion som den sparade raden (gäller även AI-rader utan livsmedelsnummer)
  function nyKcal(g) {
    return Math.round(Number(rad.kcal) / Number(rad.gram) * g * 10) / 10;
  }

  function setMsg(text, kind) {
    $('red-msg').textContent = text || '';
    $('red-msg').className = 'msg' + (kind ? ' ' + kind : '');
  }

  function raknaOm() {
    const g = gram();
    $('red-kcal').textContent = g > 0 ? fmt(nyKcal(g)) : '–';
  }

  function oppna(r) {
    rad = r;
    $('red-namn').textContent = r.namn;
    $('red-gram').value = fmt(r.gram, 1);
    $('red-bekrafta').hidden = true;
    $('red-ta-bort').hidden = false;
    setMsg('');
    raknaOm();
    window.KaloriApp.visa('view-redigera');
  }

  async function spara(e) {
    e.preventDefault();
    const g = gram();
    if (!(g > 0 && g <= 5000)) { setMsg('Ange en mängd mellan 1 och 5 000 gram.', 'error'); return; }
    const knapp = $('form-redigera').querySelector('button[type="submit"]');
    knapp.disabled = true;
    setMsg('Sparar…');
    const { error } = await sb.from('kalori_maltid_rad').update({ gram: g, kcal: nyKcal(g) }).eq('id', rad.id);
    knapp.disabled = false;
    if (error) { setMsg('Kunde inte spara. Kontrollera nätet och försök igen.', 'error'); return; }
    window.KaloriApp.toast(rad.namn + ' ändrad till ' + fmt(g, 1) + ' g');
    if (klar) klar();
  }

  async function taBort() {
    const knapp = $('red-ja');
    knapp.disabled = true;
    setMsg('Tar bort…');
    try {
      const r = await sb.from('kalori_maltid_rad').delete().eq('id', rad.id);
      if (r.error) throw r.error;
      const kvar = await sb.from('kalori_maltid_rad').select('id').eq('maltid_id', rad.maltid_id);
      if (!kvar.error && kvar.data.length === 0) {
        // Sista raden: ta bort måltiden och dess miniatyr
        const m = await sb.from('kalori_maltid').select('miniatyr').eq('id', rad.maltid_id).maybeSingle();
        if (m.data && m.data.miniatyr) await sb.storage.from('kalori-foton').remove([m.data.miniatyr]).catch(() => {});
        await sb.from('kalori_maltid').delete().eq('id', rad.maltid_id);
      }
    } catch (err) {
      knapp.disabled = false;
      setMsg('Kunde inte ta bort. Kontrollera nätet och försök igen.', 'error');
      return;
    }
    knapp.disabled = false;
    window.KaloriApp.toast(rad.namn + ' borttagen');
    if (klar) klar();
  }

  function setup(klient, opts) {
    sb = klient;
    klar = opts.klar;
    $('red-gram').addEventListener('input', raknaOm);
    $('form-redigera').addEventListener('submit', spara);
    $('red-tillbaka').addEventListener('click', () => { if (opts.avbryt) opts.avbryt(); });
    $('red-ta-bort').addEventListener('click', () => {
      $('red-fraga').textContent = 'Ta bort ' + rad.namn + '?';
      $('red-ta-bort').hidden = true;
      $('red-bekrafta').hidden = false;
      $('red-ja').focus();
    });
    $('red-nej').addEventListener('click', () => { $('red-bekrafta').hidden = true; $('red-ta-bort').hidden = false; });
    $('red-ja').addEventListener('click', taBort);
  }

  window.KaloriRedigera = { setup, oppna };
})();
