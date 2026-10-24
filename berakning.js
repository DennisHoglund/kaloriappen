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

  const api = { AKTIVITET, GOLV, KCAL_PER_KG, alder, bmr, maxTakt, dagsmal, dygnUTC, flyttaDag };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KaloriBerakning = api;
})(typeof window !== 'undefined' ? window : globalThis);
