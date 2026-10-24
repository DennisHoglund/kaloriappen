// Livsmedel från Livsmedelsverket (data/livsmedel.json) och sökning i dem (US-06).
// Rena funktioner fungerar både i webbläsaren (window.KaloriLivsmedel) och i Node (för enhetstester).
(function (root) {
  'use strict';

  // Gemener utan accenter, så att "agg" hittar "Ägg" och "creme" hittar "crème"
  function normalisera(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
  }

  // Söker i [[nummer, namn, kcal], …]. Alla ord måste finnas. Träffar i början av namnet först,
  // sedan i början av ett ord, sedan var som helst. Inom varje grupp kortare namn först.
  function sok(lista, fraga, max = 40) {
    const q = normalisera(fraga);
    if (q.replace(/ /g, '').length < 2) return [];
    const ord = q.split(' ');
    const traffar = [];
    for (const rad of lista) {
      const n = rad.norm || (rad.norm = normalisera(rad[1]));
      if (!ord.every((o) => n.includes(o))) continue;
      const rang = n.startsWith(ord[0]) ? 0 : (' ' + n).includes(' ' + ord[0]) ? 1 : 2;
      traffar.push([rang, n.length, rad]);
    }
    traffar.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    return traffar.slice(0, max).map((t) => t[2]);
  }

  // kcal för en mängd, avrundat till en decimal
  function kcalFor(kcalPer100g, gram) {
    return Math.round(kcalPer100g * gram / 10) / 10;
  }

  let laddade = null;
  // Hämtar livsmedelsfilen en gång och behåller den i minnet
  function ladda() {
    if (!laddade) {
      laddade = fetch('data/livsmedel.json').then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).catch((e) => { laddade = null; throw e; });
    }
    return laddade;
  }

  const api = { normalisera, sok, kcalFor, ladda };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KaloriLivsmedel = api;
})(typeof window !== 'undefined' ? window : globalThis);
