// Profil och onboarding (US-02, US-03 AC3). Visar dagsmålet direkt medan man fyller i.
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const B = window.KaloriBerakning;
  const kcal = (x) => Math.round(x).toLocaleString('sv-SE');

  let sb = null;
  let userId = null;
  let klar = null;   // anropas efter sparning
  let avbryt = null; // anropas vid Avbryt (bara när profilen redan finns)

  // Läser ett tal där både komma och punkt fungerar som decimaltecken
  function tal(id) {
    const v = $(id).value.trim().replace(',', '.');
    return v === '' ? null : Number(v);
  }

  function valt(namn) {
    const el = document.querySelector('input[name="' + namn + '"]:checked');
    return el ? el.value : null;
  }

  function lasFormular() {
    return {
      fodelsedatum: $('pro-fodd').value,
      kon: valt('pro-kon'),
      langdCm: tal('pro-langd'),
      aktivitet: $('pro-aktivitet').value,
      viktKg: tal('pro-vikt'),
      malviktKg: tal('pro-malvikt'),
      taktKgVecka: Number(valt('pro-takt'))
    };
  }

  // Kontrollerar värdena mot samma gränser som databasen. Returnerar ett felmeddelande eller null.
  function kontrollera(p, idag) {
    if (!p.fodelsedatum) return 'Ange ditt födelsedatum.';
    const ar = B.alder(p.fodelsedatum, idag);
    if (ar === null || ar < 15 || ar > 110) return 'Kontrollera födelsedatumet.';
    if (!p.kon) return 'Välj kön (behövs för beräkningen).';
    if (!(p.langdCm >= 100 && p.langdCm <= 250)) return 'Längden ska vara mellan 100 och 250 cm.';
    if (!p.aktivitet) return 'Välj aktivitetsnivå.';
    if (!(p.viktKg >= 30 && p.viktKg <= 300)) return 'Vikten ska vara mellan 30 och 300 kg.';
    if (!(p.malviktKg >= 30 && p.malviktKg <= 300)) return 'Målvikten ska vara mellan 30 och 300 kg.';
    if (![0.25, 0.5, 0.75].includes(p.taktKgVecka)) return 'Välj takt.';
    return null;
  }

  function visaForhandsvisning() {
    const r = B.dagsmal(lasFormular(), window.KaloriApp.idag());
    $('pro-mal').textContent = r ? kcal(r.mal) : '–';
    const noter = [];
    if (r && r.taktBegransad) noter.push('Takten är sänkt till ' + r.taktKgVecka.toLocaleString('sv-SE', { maximumFractionDigits: 2 }) + ' kg/vecka – högst 1 % av kroppsvikten är säkert.');
    if (r && r.golv) noter.push('Målet är satt till lägsta säkra nivå (' + kcal(r.mal) + ' kcal). Beräkningen gav lägre, men så lite rekommenderas inte utan stöd från vården.');
    if (r) noter.push('Underhåll ≈ ' + kcal(r.underhall) + ' kcal/dag, underskott ' + kcal(r.underskott) + ' kcal/dag.');
    $('pro-noter').textContent = noter.join(' ');
    $('pro-noter').hidden = !r;
  }

  function setMsg(text, kind) {
    $('pro-msg').textContent = text || '';
    $('pro-msg').className = 'msg' + (kind ? ' ' + kind : '');
  }

  // Fyller formuläret. profil och vikt kan vara null (ny användare).
  function oppna(profil, viktKg, onboarding) {
    $('pro-rubrik').textContent = onboarding ? 'Välkommen! Fyll i din profil' : 'Din profil';
    $('pro-intro').hidden = !onboarding;
    $('pro-avbryt').hidden = onboarding;
    $('pro-fodd').value = profil ? profil.fodelsedatum : '';
    document.querySelectorAll('input[name="pro-kon"]').forEach((r) => { r.checked = !!profil && r.value === profil.kon; });
    $('pro-langd').value = profil ? profil.langd_cm : '';
    $('pro-aktivitet').value = profil ? profil.aktivitet : '';
    $('pro-vikt').value = viktKg != null ? String(viktKg).replace('.', ',') : '';
    $('pro-malvikt').value = profil ? String(profil.malvikt_kg).replace('.', ',') : '';
    const takt = profil ? Number(profil.takt_kg_vecka) : 0.5;
    document.querySelectorAll('input[name="pro-takt"]').forEach((r) => { r.checked = Number(r.value) === takt; });
    setMsg('');
    visaForhandsvisning();
    window.KaloriApp.visa('view-profil');
  }

  async function spara(e) {
    e.preventDefault();
    const p = lasFormular();
    const idag = window.KaloriApp.idag();
    const fel = kontrollera(p, idag);
    if (fel) { setMsg(fel, 'error'); return; }

    const knapp = $('form-profil').querySelector('button[type="submit"]');
    knapp.disabled = true;
    setMsg('Sparar…');
    try {
      const r1 = await sb.from('kalori_profil').upsert({
        user_id: userId, fodelsedatum: p.fodelsedatum, kon: p.kon, langd_cm: p.langdCm, aktivitet: p.aktivitet,
        malvikt_kg: p.malviktKg, takt_kg_vecka: p.taktKgVecka, uppdaterad: new Date().toISOString()
      }, { onConflict: 'user_id' });
      if (r1.error) throw r1.error;
      // Vikten sparas som dagens mätning – senaste mätningen är alltid den aktuella vikten (US-09 AC2)
      const r2 = await sb.from('kalori_vikt').upsert({ user_id: userId, datum: idag, vikt_kg: p.viktKg }, { onConflict: 'user_id,datum' });
      if (r2.error) throw r2.error;
    } catch (err) {
      knapp.disabled = false;
      setMsg('Kunde inte spara. Kontrollera nätet och försök igen – det du fyllt i finns kvar.', 'error');
      return;
    }
    knapp.disabled = false;
    setMsg('');
    if (klar) klar();
  }

  // Hämtar profil och senaste vikt för användaren
  async function hamta() {
    const [p, v] = await Promise.all([
      sb.from('kalori_profil').select('*').eq('user_id', userId).maybeSingle(),
      sb.from('kalori_vikt').select('datum,vikt_kg').eq('user_id', userId).order('datum', { ascending: false }).limit(1)
    ]);
    if (p.error) throw p.error;
    if (v.error) throw v.error;
    return { profil: p.data, viktKg: v.data && v.data[0] ? Number(v.data[0].vikt_kg) : null };
  }

  function setup(klient, opts) {
    sb = klient;
    klar = opts.klar;
    avbryt = opts.avbryt;
    $('form-profil').addEventListener('submit', spara);
    $('form-profil').addEventListener('input', visaForhandsvisning);
    $('form-profil').addEventListener('change', visaForhandsvisning);
    $('pro-avbryt').addEventListener('click', () => { if (avbryt) avbryt(); });
  }

  window.KaloriProfil = { setup, setUser(id) { userId = id; }, hamta, oppna, kontrollera };
})();
