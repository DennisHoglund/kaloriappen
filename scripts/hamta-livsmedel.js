// Hämtar Livsmedelsverkets livsmedelsdatabas och skriver data/livsmedel.json:
// { kalla, licens, hamtad, antal, livsmedel: [[nummer, namn, kcal per 100 g], ...] }
// Körs av arbetsflödet "Uppdatera livsmedel" (en gång i veckan och vid behov), inte vid varje push.
// Källa: Livsmedelsverkets livsmedelsdatabas, CC BY 4.0. Källan ska anges i appen.
const fs = require('fs');
const path = require('path');

const BAS = 'https://dataportal.livsmedelsverket.se/livsmedel/api/v1';
const SIDA = 100;
const SAMTIDIGA = 8;
const MINST = 2000; // färre än så betyder att något gick fel – skriv inte över filen

// Plockar ut kcal per 100 g ur ett livsmedels näringsvärden
function kcalPer100g(naringsvarden) {
  const e = (naringsvarden || []).find((n) => n.euroFIRkod === 'ENERC' && String(n.enhet).toLowerCase() === 'kcal');
  if (!e || typeof e.varde !== 'number' || !(e.viktGram > 0)) return null;
  return Math.round((e.varde * 100 / e.viktGram) * 10) / 10;
}

// Bygger filens innehåll av listan och näringsvärdena (ren funktion, testas i tests/livsmedel.spec.js)
function bygg(livsmedel, kcalPerNummer, hamtad) {
  const rader = livsmedel
    .map((l) => [l.nummer, String(l.namn).trim(), kcalPerNummer.get(l.nummer)])
    .filter(([nr, namn, kcal]) => Number.isInteger(nr) && namn && typeof kcal === 'number' && kcal >= 0 && kcal <= 1000)
    .sort((a, b) => a[1].localeCompare(b[1], 'sv'));
  return {
    kalla: 'Livsmedelsverkets livsmedelsdatabas',
    licens: 'CC BY 4.0',
    hamtad,
    antal: rader.length,
    livsmedel: rader
  };
}

async function hamtaJson(url, forsok = 4) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { accept: 'application/json' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (e) {
      if (i >= forsok) throw new Error(url + ': ' + e.message);
      await new Promise((r) => setTimeout(r, 1000 * i));
    }
  }
}

async function main() {
  const lista = [];
  for (let offset = 0; ; offset += SIDA) {
    const sida = await hamtaJson(`${BAS}/livsmedel?offset=${offset}&limit=${SIDA}&sprak=1`);
    lista.push(...sida.livsmedel);
    if (lista.length >= sida._meta.totalRecords || !sida.livsmedel.length) break;
  }
  console.log('Livsmedel i listan: ' + lista.length);

  const kcal = new Map();
  const misslyckade = [];
  let nasta = 0;
  async function arbetare() {
    while (nasta < lista.length) {
      const l = lista[nasta++];
      try {
        const k = kcalPer100g(await hamtaJson(`${BAS}/livsmedel/${l.nummer}/naringsvarden?sprak=1`));
        if (k !== null) kcal.set(l.nummer, k);
      } catch (e) {
        misslyckade.push(l.nummer + ' (' + e.message.split(': ').pop() + ')');
      }
    }
  }
  await Promise.all(Array.from({ length: SAMTIDIGA }, arbetare));
  if (misslyckade.length) console.log('::warning::' + misslyckade.length + ' livsmedel kunde inte hämtas, t.ex. ' + misslyckade.slice(0, 5).join(', '));

  const data = bygg(lista, kcal, new Date().toISOString().slice(0, 10));
  if (data.antal < MINST) throw new Error('Bara ' + data.antal + ' livsmedel med kcal – filen skrivs inte över');
  const fil = path.join(__dirname, '..', 'data', 'livsmedel.json');
  fs.writeFileSync(fil, JSON.stringify(data) + '\n');
  console.log('::notice::Skrev ' + data.antal + ' livsmedel till data/livsmedel.json (' + Math.round(fs.statSync(fil).size / 1024) + ' kB)');
}

if (require.main === module) main().catch((e) => { console.log('::error::' + e.message); process.exit(1); });

module.exports = { kcalPer100g, bygg };
