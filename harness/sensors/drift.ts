import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { loadPolicy, ROOT } from './lib/policy.js';
import { loadData } from './lib/traceability-data.js';
import { readReport } from './lib/playwright-report.js';
import { listTests } from './traceability.js';
import type { Violation } from './lib/report.js';

const SENSOR = 'drift';
const HISTORY = 'reports/history.jsonl';

interface Record_ { date: string; tests: { id: string; status: string }[] }

export function recordRun(): void {
  const report = readReport();
  if (!report) return;
  mkdirSync(join(ROOT, 'reports'), { recursive: true });
  const record: Record_ = { date: new Date().toISOString(), tests: report.tests.map((t) => ({ id: t.id, status: t.status })) };
  appendFileSync(join(ROOT, HISTORY), `${JSON.stringify(record)}\n`);
}

const readHistory = (): Record_[] => {
  const path = join(ROOT, HISTORY);
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as Record_);
};

export function run(): Violation[] {
  const p = loadPolicy();
  const v: Violation[] = [];
  const history = readHistory();

  const byTest = new Map<string, { total: number; flaky: number; last: string; alwaysSkipped: boolean }>();
  for (const r of history) for (const t of r.tests) {
    const a = byTest.get(t.id) ?? { total: 0, flaky: 0, last: r.date, alwaysSkipped: true };
    a.total++; a.last = r.date;
    if (t.status === 'flaky') a.flaky++;
    if (t.status !== 'skipped') a.alwaysSkipped = false;
    byTest.set(t.id, a);
  }
  const limitMs = p.drift.daysWithoutRunForDeadTest * 86_400_000;
  for (const [id, a] of byTest) {
    const rate = (a.flaky / a.total) * 100;
    if (a.total >= 5 && rate > p.drift.maxFlakinessPercentage) v.push({ sensor: SENSOR, file: id, problem: `accumulated flakiness of ${rate.toFixed(1)}% over ${a.total} runs (limit ${p.drift.maxFlakinessPercentage}%).`, howToFix: 'Open an automation defect, inspect the retry traces, and fix the root cause; do not raise the limit.' });
    if (Date.now() - Date.parse(a.last) > limitMs) v.push({ sensor: SENSOR, file: id, problem: `test has not run in over ${p.drift.daysWithoutRunForDeadTest} days (possibly dead).`, howToFix: 'Confirm it is still part of a project/tag run in CI; if the requirement is gone, remove the test and its coverage item.' });
    if (a.alwaysSkipped && a.total >= 5) v.push({ sensor: SENSOR, file: id, problem: 'test skipped on every run.', howToFix: 'Fix and re-enable it, or remove it. A permanent skip is a dead test.' });
  }

  const data = loadData();
  const tests = listTests();
  const riskLevel = new Map(data.risks.map((r) => [r.id, r.level]));
  for (const level of Object.keys(p.drift.minRiskCoveragePerLevel)) {
    const minimum = p.drift.minRiskCoveragePerLevel[level] ?? 0;
    const reqs = data.requirements.filter((r) => riskLevel.get(r.risk) === level);
    if (reqs.length === 0) continue;
    const covered = reqs.filter((r) => tests.some((t) => t.tags.includes(`@req:${r.id}`))).length;
    const pct = (covered / reqs.length) * 100;
    if (pct < minimum) v.push({ sensor: SENSOR, file: 'docs/traceability', problem: `coverage of ${level}-risk requirements: ${pct.toFixed(0)}% (minimum ${minimum}%).`, howToFix: `Prioritize cases for ${level}-risk requirements without a test (npm run matrix shows which).` });
  }

  try {
    execFileSync('npm', ['outdated', '--json'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (e) {
    const output = (e as { stdout?: string }).stdout ?? '';
    const outdated = output ? Object.keys(JSON.parse(output) as object).length : 0;
    if (outdated > 0) console.warn(`WARNING ${SENSOR}: ${outdated} outdated dependencie(s) (npm outdated). Not blocking; handle via an update PR.`);
  }
  return v;
}
