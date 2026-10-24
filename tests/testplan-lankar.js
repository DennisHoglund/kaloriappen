// Uppdaterar Playwright-länkarna i testplan/testfall/*.md så att de pekar på rätt fil, rad och testnamn.
// Körs av "npm run testplan" före kontrollen.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const dir = path.join(root, 'testplan', 'testfall');

const tester = new Map();
for (const f of fs.readdirSync(__dirname).filter((f) => f.endsWith('.spec.js'))) {
  fs.readFileSync(path.join(__dirname, f), 'utf8').split('\n').forEach((rad, i) => {
    const m = rad.match(/test\('(.+?)', \{ annotation: \{ type: 'testfall', description: '(TC-[A-Z]+-\d+)'/);
    if (m) tester.set(m[2], { fil: f, rad: i + 1, namn: m[1] });
  });
}

let andrade = 0;
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const t = tester.get(f.replace('.md', ''));
  if (!t) continue;
  const p = path.join(dir, f);
  const fore = fs.readFileSync(p, 'utf8');
  const efter = fore.replace(/\| \*\*Playwright\*\* \|.*\|/, `| **Playwright** | [\`tests/${t.fil}\`](../../tests/${t.fil}#L${t.rad}) – *${t.namn}* |`);
  if (efter !== fore) { fs.writeFileSync(p, efter); andrade++; }
}
console.log('✓ Testplanlänkar uppdaterade: ' + andrade);
