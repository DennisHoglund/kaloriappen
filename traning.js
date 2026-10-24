// Logga, ändra och ta bort träning (US-11, US-12). Förbränningen räknas med vikten när passet loggas
// och sparas, så att historiken inte ändras när vikten ändras. Den påverkar inte dagsmålet (D-13).
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const B = window.KaloriBerakning;
  const fmt = (x, d = 0) => Number(x).toLocaleString('sv-SE', { maximumFractionDigits: d });

  const NAMN = { styrka: 'Styrketräning', lopning: 'Löpning', promenad: 'Promenad', cykling: 'Cykling' };

  let sb = null;
  let userId = null;
  let klar = null;
  let viktKg = () => null;
  let pass = null;   // passet som ändras, null = nytt
  let datum = null;

  function tal(id) {
    const v = $(id).value.trim().replace(',', '.');
    return v === '' ? NaN : Number(v);
  }

  function lasFormular() {
    const typEl = document.querySelector('input[name="tra-typ"]:checked');
    const typ = typEl ? typEl.value : null;
    return { typ, minuter: tal('tra-minuter'), km: typ === 'styrka' ? null : tal('tra-km'), kommentar: $('tra-kommentar').value.trim() };
  }

  function uppdatera() {
    const p = lasFormular();
    $('tra-km-falt').hidden = p.typ === 'styrka';
    const kcal = p.typ ? B.forbranning({ ...p, viktKg: viktKg() }) : null;
    $('tra-kcal').textContent = kcal === null ? '–' : fmt(kcal);
    let info = '';
    if (p.typ === 'lopning' || p.typ === 'promenad') { const t = B.tempo(p.minuter, p.km); if (t) info = 'Tempo ' + t + ' min/km'; }
    if (p.typ === 'cykling') { const f = B.fart(p.minuter, p.km); if (f) info = 'Fart ' + fmt(f, 1) + ' km/h'; }
    $('tra-info').textContent = info;
  }

  function setMsg(text, kind) {
    $('tra-msg').textContent = text || '';
    $('tra-msg').className = 'msg' + (kind ? ' ' + kind : '');
  }

  function oppna(opts = {}) {
    pass = opts.pass || null;
    datum = pass ? pass.datum : (opts.datum || window.KaloriApp.idag());
    $('tra-rubrik').textContent = pass ? 'Ändra träning' : 'Logga träning';
    document.querySelectorAll('input[name="tra-typ"]').forEach((r) => { r.checked = !!pass && r.value === pass.typ; });
    $('tra-minuter').value = pass ? pass.minuter : '';
    $('tra-km').value = pass && pass.km != null ? fmt(pass.km, 2) : '';
    $('tra-kommentar').value = pass && pass.kommentar ? pass.kommentar : '';
    $('tra-ta-bort').hidden = !pass;
    $('tra-bekrafta').hidden = true;
    setMsg('');
    uppdatera();
    window.KaloriApp.visa('view-traning');
  }

  async function spara(e) {
    e.preventDefault();
    const p = lasFormular();
    if (!p.typ) { setMsg('Välj typ av träning.', 'error'); return; }
    if (!(p.minuter >= 1 && p.minuter <= 1440 && Number.isInteger(p.minuter))) { setMsg('Ange tiden i hela minuter (1–1 440).', 'error'); return; }
    if (p.typ !== 'styrka' && !(p.km > 0 && p.km <= 500)) { setMsg('Ange sträckan i km (t.ex. 5,2).', 'error'); return; }
    if (p.kommentar.length > 500) { setMsg('Kommentaren får vara högst 500 tecken.', 'error'); return; }
    const kcal = B.forbranning({ ...p, viktKg: viktKg() });
    if (kcal === null) { setMsg('Kunde inte räkna förbränningen – kontrollera vikten i profilen.', 'error'); return; }

    const rad = { user_id: userId, datum, typ: p.typ, minuter: p.minuter, km: p.typ === 'styrka' ? null : Math.round(p.km * 100) / 100, kommentar: p.kommentar || null, kcal };
    const knapp = $('form-traning').querySelector('button[type="submit"]');
    knapp.disabled = true;
    setMsg('Sparar…');
    const { error } = pass
      ? await sb.from('kalori_traning').update(rad).eq('id', pass.id)
      : await sb.from('kalori_traning').insert({ id: crypto.randomUUID(), ...rad });
    knapp.disabled = false;
    if (error) { setMsg('Kunde inte spara. Kontrollera nätet och försök igen.', 'error'); return; }
    window.KaloriApp.toast(NAMN[p.typ] + ' sparad (≈ ' + fmt(kcal) + ' kcal)');
    if (klar) klar();
  }

  async function taBort() {
    $('tra-ja').disabled = true;
    const { error } = await sb.from('kalori_traning').delete().eq('id', pass.id);
    $('tra-ja').disabled = false;
    if (error) { setMsg('Kunde inte ta bort. Kontrollera nätet och försök igen.', 'error'); return; }
    window.KaloriApp.toast(NAMN[pass.typ] + ' borttagen');
    if (klar) klar();
  }

  function setup(klient, opts) {
    sb = klient;
    klar = opts.klar;
    viktKg = opts.viktKg;
    $('form-traning').addEventListener('input', uppdatera);
    $('form-traning').addEventListener('change', uppdatera);
    $('form-traning').addEventListener('submit', spara);
    $('tra-tillbaka').addEventListener('click', () => { if (opts.avbryt) opts.avbryt(); });
    $('tra-ta-bort').addEventListener('click', () => {
      $('tra-fraga').textContent = 'Ta bort ' + NAMN[pass.typ].toLowerCase() + ' ' + pass.minuter + ' min?';
      $('tra-ta-bort').hidden = true;
      $('tra-bekrafta').hidden = false;
    });
    $('tra-nej').addEventListener('click', () => { $('tra-bekrafta').hidden = true; $('tra-ta-bort').hidden = false; });
    $('tra-ja').addEventListener('click', taBort);
  }

  window.KaloriTraning = { setup, setUser(id) { userId = id; }, oppna, NAMN };
})();
