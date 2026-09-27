import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { loadPolicy, ROOT } from '../../sensors/lib/policy.js';

const [level, name, technique, req, risk, coverage] = process.argv.slice(2);
const policy = loadPolicy();
const directories = Object.keys(policy.directoryForLevel).map((d) => d.replace('tests/', ''));

if (!level || !name || !technique || !req || !risk || !coverage) {
  console.error(`usage: npm run new-test -- <${directories.join('|')}> <kebab-name> <technique> <REQ-ID> <RISK-ID> <ITEM-ID>`);
  process.exit(2);
}
if (!directories.includes(level)) { console.error(`invalid level "${level}". Use: ${directories.join(', ')}`); process.exit(2); }
if (!policy.allowedTechniques.includes(technique)) { console.error(`invalid technique "${technique}". Use: ${policy.allowedTechniques.join(', ')}`); process.exit(2); }

const destination = join(ROOT, 'tests', level, `${name}.spec.ts`);
if (existsSync(destination)) { console.error(`${destination} already exists; not overwriting.`); process.exit(1); }
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, `import { test, expect } from '@playwright/test';

test('<expected behavior in business language>', {
  tag: ['@technique:${technique}', '@req:${req}', '@risk:${risk}', '@coverage:${coverage}'],
}, () => {
  // Arrange: data via a builder (support/builders). Act: a single behavior. Assert: exact value derived from the technique.
  expect('<actual>').toBe('<expected>');
});
`);
console.log(`Created ${destination}. Register item ${coverage} in docs/traceability/*.json if it doesn't exist yet.`);
