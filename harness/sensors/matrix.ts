import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib/policy.js';
import { loadData } from './lib/traceability-data.js';
import { readReport } from './lib/playwright-report.js';
import { listTests } from './traceability.js';

const data = loadData();
const tests = listTests();
const run_ = readReport();
const statusOf = (t: { file: string; line: number }): string => {
  const r = run_?.tests.find((x) => `tests/${x.id}`.replace('tests/tests/', 'tests/') === `${t.file}:${t.line}`);
  return r ? r.status : 'not run';
};

const lines = ['# Traceability matrix (generated, do not edit)', '', '| Requirement | Risk | Technique | Coverage item | Test case | Run |', '|---|---|---|---|---|---|'];
for (const req of data.requirements) {
  const risk = data.risks.find((r) => r.id === req.risk);
  const riskLabel = risk ? `${risk.id} (${risk.level})` : `${req.risk} (?)`;
  for (const item of data.coverageItems.filter((i) => i.requirement === req.id)) {
    const cases = tests.filter((t) => t.tags.includes(`@coverage:${item.id}`));
    if (cases.length === 0) lines.push(`| ${req.id} | ${riskLabel} | ${item.technique} | ${item.id}: ${item.description} | ${item.manual === true ? '(manual)' : '**NO TEST**'} | - |`);
    for (const c of cases) lines.push(`| ${req.id} | ${riskLabel} | ${item.technique} | ${item.id}: ${item.description} | ${c.file}:${c.line} ${c.title} | ${statusOf(c)} |`);
  }
}
writeFileSync(join(ROOT, 'docs/traceability/MATRIX.md'), `${lines.join('\n')}\n`);
console.log(`Matrix written to docs/traceability/MATRIX.md (${lines.length - 4} lines).`);
