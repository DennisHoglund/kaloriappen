// Spårbarhet: kontrollerar att varje acceptanskriterium (US-xx ACy) i specs/stories.md har minst ett
// testfall i testplan/testfall/ (fältet Krav), och skriver testplan/sparbarhet.md.
// Körs av "npm run testplan". Avbryter med fel om något kriterium saknar testfall.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const stories = fs.readFileSync(path.join(root, 'specs', 'stories.md'), 'utf8');
const kriterier = []; // { us, ac, titel, text }
let us = null, titel = '';
for (const rad of stories.split('\n')) {
  const h = rad.match(/^### (US-\d+) (.+)$/);
  if (h) { us = h[1]; titel = h[2]; continue; }
  const a = rad.match(/^- \*\*AC(\d+)\*\* (.+)$/);
  if (a && us) kriterier.push({ us, ac: 'AC' + a[1], titel, text: a[2] });
}

// "US-04 AC1–2", "US-11 AC1, AC3", "US-12 AC2–3, D-13", "US-08" (hela storyn)
function tolkaKrav(krav) {
  const ut = [];
  for (const m of krav.matchAll(/(US-\d+)((?:\s*(?:AC\d+(?:[–-]\d+)?)\s*,?)*)/g)) {
    const del = m[2] || '';
    const ac = [...del.matchAll(/AC(\d+)(?:[–-](\d+))?/g)];
    if (!ac.length) { ut.push({ us: m[1], ac: '*' }); continue; }
    for (const x of ac) {
      const fran = Number(x[1]), till = Number(x[2] || x[1]);
      for (let i = fran; i <= till; i++) ut.push({ us: m[1], ac: 'AC' + i });
    }
  }
  return ut;
}

const dir = path.join(root, 'testplan', 'testfall');
const tackning = new Map(kriterier.map((k) => [k.us + ' ' + k.ac, []]));
const helaStoryer = new Map();
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort()) {
  const id = f.replace('.md', '');
  const md = fs.readFileSync(path.join(dir, f), 'utf8');
  const krav = (md.match(/\| \*\*Krav\*\* \| (.+) \|/) || [])[1] || '';
  const typ = md.includes('🖐️') ? '🖐️' : '🤖';
  for (const k of tolkaKrav(krav.replace(/\]\([^)]*\)/g, ''))) {
    if (k.ac === '*') { if (!helaStoryer.has(k.us)) helaStoryer.set(k.us, []); helaStoryer.get(k.us).push(id + ' ' + typ); continue; }
    const lista = tackning.get(k.us + ' ' + k.ac);
    if (lista && !lista.includes(id + ' ' + typ)) lista.push(id + ' ' + typ);
  }
}

const saknas = kriterier.filter((k) => tackning.get(k.us + ' ' + k.ac).length === 0);
const lank = (x) => { const [id, typ] = x.split(' '); return `[${id}](testfall/${id}.md) ${typ}`; };
let md = '# Spårbarhet · Kaloriappen\n\nVarje acceptanskriterium i [specs/stories.md](../specs/stories.md) och testfallen som verifierar det.\n' +
  'Genereras av `tests/sparbarhet.js` (`npm run testplan`). Redigera inte för hand.\n\n' +
  `| | |\n|---|---|\n| **Acceptanskriterier** | ${kriterier.length} |\n| **Med testfall** | ${kriterier.length - saknas.length} |\n| **Utan testfall** | ${saknas.length} |\n\n`;
let senaste = null;
for (const k of kriterier) {
  if (k.us !== senaste) {
    md += `\n## ${k.us} ${k.titel}\n\n| AC | Kriterium | Testfall |\n|---|---|---|\n`;
    senaste = k.us;
  }
  const t = tackning.get(k.us + ' ' + k.ac);
  md += `| ${k.ac} | ${k.text.replace(/\|/g, '\\|')} | ${t.length ? t.map(lank).join(', ') : '**SAKNAS**'} |\n`;
}
const ovriga = [...helaStoryer.entries()].map(([u, l]) => `- ${u}: ${l.map(lank).join(', ')}`).join('\n');
if (ovriga) md += `\n## Testfall som gäller hela storyn\n\n${ovriga}\n`;
fs.writeFileSync(path.join(root, 'testplan', 'sparbarhet.md'), md);

if (saknas.length) {
  console.error('Acceptanskriterier utan testfall:');
  saknas.forEach((k) => console.error('  ✕ ' + k.us + ' ' + k.ac + ' – ' + k.text));
  process.exit(1);
}
console.log('✓ Spårbarhet OK: alla ' + kriterier.length + ' acceptanskriterier har testfall (testplan/sparbarhet.md)');
