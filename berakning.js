// Beräkningar som rena funktioner (US-03). Fungerar både i webbläsaren (window.KaloriBerakning)
// och i Node (require), så att de kan enhetstestas utan webbläsare.
(function (root) {
  'use strict';

  // Aktivitetsfaktorer för underhållsbehov
  const AKTIVITET = { stillasittande: 1.2, latt: 1.375, mattlig: 1.55, hog: 1.725 };

  // Säker miniminivå för dagsmålet (D-17)
  const GOLV = { man: 1500, kvinna: 1200 };

  // Ungefär så många kcal motsvarar ett kilo kroppsfett
  const KCAL_PER_KG = 7700;

  // Ålder i hela år på ett visst datum (ÅÅÅÅ-MM-DD)
  function alder(fodelsedatum, idag) {
    const [fa, fm, fd] = String(fodelsedatum).split('-').map(Number);
    const [ia, im, id] = String(idag).split('-').map(Number);
    if (!fa || !ia) return null;
    let ar = ia - fa;
    if (im < fm || (im === fm && id < fd)) ar--;
    return ar;
  }

  // Basalmetabolism enligt Mifflin-St Jeor
  function bmr({ kon, viktKg, langdCm, alder }) {
    const bas = 10 * viktKg + 6.25 * langdCm - 5 * alder;
    return kon === 'kvinna' ? bas - 161 : bas + 5;
  }

  // Högsta tillåtna viktminskning per vecka: 1 % av kroppsvikten
  function maxTakt(viktKg) {
    return viktKg * 0.01;
  }

  function avrunda10(x) {
    return Math.round(x / 10) * 10;
  }

  // Dagligt kalorimål. Returnerar null om profilen är ofullständig.
  function dagsmal(p, idag) {
    if (!p || !GOLV[p.kon] || !AKTIVITET[p.aktivitet]) return null;
    if (!(p.viktKg > 0) || !(p.langdCm > 0) || !(p.taktKgVecka >= 0)) return null;
    const ar = alder(p.fodelsedatum, idag);
    if (ar === null || ar < 0) return null;

    const b = bmr({ kon: p.kon, viktKg: p.viktKg, langdCm: p.langdCm, alder: ar });
    const underhall = b * AKTIVITET[p.aktivitet];
    const tak = maxTakt(p.viktKg);
    const takt = Math.min(p.taktKgVecka, tak);
    const underskott = takt * KCAL_PER_KG / 7;
    const beraknat = avrunda10(underhall - underskott);
    const golv = GOLV[p.kon];

    return {
      mal: Math.max(beraknat, golv),
      bmr: b,
      underhall,
      underskott,
      taktKgVecka: takt,
      taktBegransad: p.taktKgVecka > tak,
      golv: beraknat < golv,
      alder: ar
    };
  }

  // Minuter som Stockholm ligger före UTC vid ett visst ögonblick (60 eller 120)
  function stockholmOffset(ms) {
    const delar = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Stockholm', hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date(ms));
    const v = Object.fromEntries(delar.map((d) => [d.type, d.value]));
    return (Date.UTC(+v.year, +v.month - 1, +v.day, +v.hour, +v.minute) - Math.floor(ms / 60000) * 60000) / 60000;
  }

  // UTC-tid för midnatt svensk tid ett visst datum
  function midnattUTC(datum) {
    const [a, m, d] = datum.split('-').map(Number);
    const naiv = Date.UTC(a, m - 1, d);
    return naiv - stockholmOffset(naiv - 2 * 3600000) * 60000;
  }

  // [början, slut) för ett dygn svensk tid (D-15), som ISO-strängar i UTC
  function dygnUTC(datum) {
    return [new Date(midnattUTC(datum)).toISOString(), new Date(midnattUTC(flyttaDag(datum, 1))).toISOString()];
  }

  // Datum ± antal dagar (ÅÅÅÅ-MM-DD)
  function flyttaDag(datum, dagar) {
    const [a, m, d] = datum.split('-').map(Number);
    return new Date(Date.UTC(a, m - 1, d + dagar)).toISOString().slice(0, 10);
  }

  // ---------- Träning (US-11, US-12) ----------
  // MET-värden ur Compendium of Physical Activities. Löpning interpoleras efter fart (km/h).
  const LOPNING = [[8, 8.3], [9.7, 9.8], [11.3, 11.0], [12.9, 11.8], [16.1, 14.5]];

  function fart(minuter, km) {
    if (!(minuter > 0) || !(km > 0)) return null;
    return Math.round(km / (minuter / 60) * 10) / 10;
  }

  // Tempo som "m:ss" per km
  function tempo(minuter, km) {
    if (!(minuter > 0) || !(km > 0)) return null;
    const s = Math.round(minuter * 60 / km);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  function met(typ, minuter, km) {
    if (typ === 'styrka') return 5.0;
    if (typ === 'promenad') return 3.5;
    const v = km > 0 && minuter > 0 ? km / (minuter / 60) : null;
    if (typ === 'lopning') {
      if (v === null) return null;
      if (v < LOPNING[0][0]) return 6.0;
      for (let i = 1; i < LOPNING.length; i++) {
        const [v1, m1] = LOPNING[i - 1];
        const [v2, m2] = LOPNING[i];
        if (v <= v2) return Math.round((m1 + (v - v1) / (v2 - v1) * (m2 - m1)) * 100) / 100;
      }
      return LOPNING[LOPNING.length - 1][1];
    }
    if (typ === 'cykling') {
      if (v === null) return null;
      if (v < 16) return 4.0;
      if (v < 19) return 6.8;
      if (v < 22) return 8.0;
      if (v < 25.5) return 10.0;
      return 12.0;
    }
    return null;
  }

  // Uppskattad förbränning i kcal = MET × vikt × timmar. Alla typer utom styrka kräver sträcka.
  function forbranning({ typ, minuter, km, viktKg }) {
    if (!(minuter > 0) || !(viktKg > 0)) return null;
    if (typ !== 'styrka' && !(km > 0)) return null;
    const m = met(typ, minuter, km);
    return m === null ? null : Math.round(m * viktKg * minuter / 60);
  }

  const api = { AKTIVITET, GOLV, KCAL_PER_KG, alder, bmr, maxTakt, dagsmal, dygnUTC, flyttaDag, met, forbranning, tempo, fart };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KaloriBerakning = api;
})(typeof window !== 'undefined' ? window : globalThis);
