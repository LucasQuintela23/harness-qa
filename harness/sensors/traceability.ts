import { execFileSync } from 'node:child_process';
import { loadPolicy, ROOT } from './lib/policy.js';
import { loadData, type TraceabilityData } from './lib/traceability-data.js';
import type { Violation } from './lib/report.js';

const SENSOR = 'traceability';

export interface ListedTest { id: string; file: string; line: number; title: string; tags: string[]; project: string }

interface SpecJson { title: string; file: string; line: number; tags?: string[]; tests?: { projectName: string }[] }
interface SuiteJson { specs?: SpecJson[]; suites?: SuiteJson[] }

export function listTests(): ListedTest[] {
  const output = execFileSync('npx', ['playwright', 'test', '--list', '--reporter=json'], {
    cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
  });
  const report = JSON.parse(output) as { suites?: SuiteJson[] };
  const tests: ListedTest[] = [];
  const visit = (s: SuiteJson): void => {
    for (const e of s.specs ?? []) {
      const project = e.tests?.[0]?.projectName ?? '';
      tests.push({ id: `${e.file}:${e.line}`, file: `tests/${e.file}`.replace('tests/tests/', 'tests/'), line: e.line, title: e.title, tags: (e.tags ?? []).map(withAt), project });
    }
    (s.suites ?? []).forEach(visit);
  };
  (report.suites ?? []).forEach(visit);
  return tests;
}

const withAt = (t: string): string => (t.startsWith('@') ? t : `@${t}`);

const values = (tags: string[], key: string): string[] =>
  tags.filter((t) => t.startsWith(`@${key}:`)).map((t) => t.slice(key.length + 2));

export function analyze(tests: ListedTest[], data: TraceabilityData, allowedTechniques: string[]): Violation[] {
  const v: Violation[] = [];
  const reqs = new Map(data.requirements.map((r) => [r.id, r]));
  const risks = new Set(data.risks.map((r) => r.id));
  const items = new Map(data.coverageItems.map((i) => [i.id, i]));
  const covered = new Set<string>();

  for (const t of tests) {
    const base = { sensor: SENSOR, file: t.file, line: t.line };
    const techniques = values(t.tags, 'technique');
    const reqIds = values(t.tags, 'req');
    const riskIds = values(t.tags, 'risk');
    const coverage = values(t.tags, 'coverage');
    const example = `test('${t.title}', { tag: ['@technique:BVA2', '@req:REQ-001', '@risk:R-001', '@coverage:ITEM-001'] }, ...)`;

    if (techniques.length !== 1) v.push({ ...base, problem: `test "${t.title}" declares ${techniques.length} technique(s) (expected exactly 1).`, howToFix: `Add a single @technique:<code> tag in { tag: [...] }. Codes: ${allowedTechniques.join(', ')}. E.g.: ${example}` });
    else if (!allowedTechniques.includes(techniques[0] ?? '')) v.push({ ...base, problem: `technique "${techniques[0]}" is not listed in harness/config/policy.json.`, howToFix: `Use one of the CTFL codes: ${allowedTechniques.join(', ')}. A technique outside the syllabus must be registered as an extension in the policy.` });

    if (reqIds.length === 0) v.push({ ...base, problem: `test "${t.title}" has no @req.`, howToFix: `Add @req:<ID> pointing to a requirement in docs/traceability/*.json. ${example}` });
    for (const id of reqIds) if (!reqs.has(id)) v.push({ ...base, problem: `@req:${id} does not exist in docs/traceability.`, howToFix: `Register requirement ${id} under "requirements" or fix the tag.` });

    if (riskIds.length === 0) v.push({ ...base, problem: `test "${t.title}" has no @risk.`, howToFix: `Add @risk:<ID> (docs/risk-analysis.md). Without a risk there is no way to prioritize regression.` });
    for (const id of riskIds) if (!risks.has(id)) v.push({ ...base, problem: `@risk:${id} does not exist in docs/traceability.`, howToFix: `Register risk ${id} under "risks" or fix the tag.` });

    if (coverage.length === 0) v.push({ ...base, problem: `test "${t.title}" has no @coverage.`, howToFix: `Add @coverage:<coverage item ID> (partition, boundary, decision table rule, transition, or branch). If the test doesn't satisfy any item, it is a candidate for removal.` });
    for (const id of coverage) {
      const item = items.get(id);
      if (!item) { v.push({ ...base, problem: `@coverage:${id} does not exist in the plan.`, howToFix: `Derive the item first (skill /derive-test-cases) and register it under "coverageItems".` }); continue; }
      covered.add(id);
      if (techniques[0] && item.technique !== techniques[0]) v.push({ ...base, problem: `item ${id} was derived with ${item.technique}, but the test declares ${techniques[0]}.`, howToFix: `Align the @technique tag with the item's technique, or fix the item in the plan.` });
      if (reqIds.length > 0 && !reqIds.includes(item.requirement)) v.push({ ...base, problem: `item ${id} belongs to ${item.requirement}, but the test declares @req:${reqIds.join(',')}.`, howToFix: `Use @req:${item.requirement}.` });
    }
  }

  for (const item of data.coverageItems) {
    if (item.manual === true || covered.has(item.id)) continue;
    v.push({ sensor: SENSOR, file: 'docs/traceability', problem: `coverage item ${item.id} (${item.technique}: ${item.description}) of requirement ${item.requirement} has no automated test.`, howToFix: `Create a test with { tag: ['@coverage:${item.id}', '@technique:${item.technique}', '@req:${item.requirement}', '@risk:<ID>'] } (use "npm run new-test"), or mark it "manual": true with a justification in docs/plans.` });
  }
  for (const r of data.requirements) if (!risks.has(r.risk)) v.push({ sensor: SENSOR, file: 'docs/traceability', problem: `requirement ${r.id} points to a non-existent risk ${r.risk}.`, howToFix: `Register the risk or fix the reference.` });
  return v;
}

export function run(): Violation[] {
  return analyze(listTests(), loadData(), loadPolicy().allowedTechniques);
}
