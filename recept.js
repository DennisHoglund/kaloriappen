// Recept: rena funktioner för att skala mängder, söka, filtrera, sortera och matcha receptboken (US-17–US-20).
// Fungerar både i webbläsaren (window.KaloriRecept) och i Node (för enhetstester).
(function (root) {
  'use strict';

  const L = typeof module !== 'undefined' && module.exports ? require('./livsmedel.js') : root.KaloriLivsmedel;
  const norm = (s) => L.normalisera(s || '');
  const sv = (a, b) => String(a).localeCompare(String(b), 'sv');

  // Avrundar en mängd så att den går att mäta upp: gram och ml till heltal (≥ 100 till närmaste 5),
  // kg och liter till en decimal, övrigt (st, dl, msk, tsk, krm) till närmaste halva.
  function avrunda(m, enhet) {
    const e = String(enhet || '').toLowerCase();
    if (e === 'g' || e === 'ml') return m >= 100 ? Math.round(m / 5) * 5 : Math.max(1, Math.round(m));
    if (e === 'kg' || e === 'l') return Math.max(0.1, Math.round(m * 10) / 10);
    return Math.max(0.5, Math.round(m * 2) / 2);
  }

  // Räknar om ingredienserna från ett antal portioner till ett annat
  function skala(ingredienser, fran, till) {
    return (ingredienser || []).map((i) => ({
      ...i,
      mangd: i.mangd == null || fran === till ? i.mangd : avrunda(i.mangd * till / fran, i.enhet)
    }));
  }

  function visaMangd(mangd, enhet) {
    if (mangd == null) return 'efter smak';
    return (String(mangd).replace('.', ',') + ' ' + (enhet || '')).trim();
  }

  function sokText(r) {
    return r._sok || (r._sok = norm([r.namn, r.beskrivning, (r.ingredienser || []).map((i) => i.namn).join(' '), r.anteckning].join(' ')));
  }

  // Alla ord måste finnas i namn, beskrivning, ingredienser eller anteckning (D-27). Tom fråga ger alla.
  function sok(lista, fraga) {
    const ord = norm(fraga).split(' ').filter(Boolean);
    if (!ord.length) return lista.slice();
    return lista.filter((r) => { const t = sokText(r); return ord.every((o) => t.includes(o)); });
  }

  function filtrera(lista, minBetyg) {
    return minBetyg ? lista.filter((r) => (r.betyg || 0) >= minBetyg) : lista.slice();
  }

  const SORTERING = {
    betyg: (a, b) => (b.betyg || 0) - (a.betyg || 0) || (b.antal_lagad || 0) - (a.antal_lagad || 0) || sv(a.namn, b.namn),
    senast: (a, b) => sv(b.senast_lagad || '', a.senast_lagad || '') || sv(a.namn, b.namn),
    flest: (a, b) => (b.antal_lagad || 0) - (a.antal_lagad || 0) || (b.betyg || 0) - (a.betyg || 0) || sv(a.namn, b.namn),
    kcal: (a, b) => (a.kcal_portion || 0) - (b.kcal_portion || 0) || sv(a.namn, b.namn)
  };
  function sortera(lista, satt) {
    return lista.slice().sort(SORTERING[satt] || SORTERING.betyg);
  }

  // Två ingrediensnamn hör ihop om det ena börjar ett ord i det andra ("Kyckling" ↔ "Kycklingfilé", "Paprika" ↔ "Röd paprika")
  function liknar(a, b) {
    return (' ' + a).includes(' ' + b) || (' ' + b).includes(' ' + a);
  }

  // Sparade recept som innehåller någon av ingredienserna: flest träffar först, sedan bäst betyg (US-17 AC4)
  function matcha(lista, valda) {
    const v = (valda || []).map(norm).filter(Boolean);
    if (!v.length) return [];
    return lista
      .map((recept) => {
        const egna = (recept.ingredienser || []).map((i) => norm(i.namn));
        return { recept, traffar: v.filter((x) => egna.some((e) => liknar(e, x))).length };
      })
      .filter((m) => m.traffar > 0)
      .sort((a, b) => b.traffar - a.traffar || SORTERING.betyg(a.recept, b.recept));
  }

  function passarKvar(kcal, kvar) {
    return kvar == null ? null : kcal <= kvar;
  }

  // Ungefärlig vikt per portion när en portion loggas: summan av ingredienser i g, kg, ml, dl och l.
  // Går det inte att räkna blir det 350 g. Kcal är det som räknas, vikten går att ändra efteråt.
  const GRAM = { g: 1, kg: 1000, ml: 1, dl: 100, l: 1000 };
  function gramPerPortion(ingredienser, portioner) {
    const summa = (ingredienser || []).reduce((s, i) => s + (i.mangd || 0) * (GRAM[String(i.enhet || '').toLowerCase()] || 0), 0);
    const g = Math.round(summa / Math.max(1, portioner) / 5) * 5;
    return g >= 50 ? Math.min(g, 5000) : 350;
  }

  function stjarnor(betyg) {
    const n = Math.max(0, Math.min(5, betyg || 0));
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  const api = { avrunda, skala, visaMangd, sok, filtrera, sortera, matcha, passarKvar, stjarnor, gramPerPortion };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KaloriRecept = api;
})(typeof window !== 'undefined' ? window : globalThis);
