import { loadPolicy } from './lib/policy.js';
import { REPORT_PATH, readReport } from './lib/playwright-report.js';
import type { Violation } from './lib/report.js';

const SENSOR = 'suite-time';

export function run(): Violation[] {
  const report = readReport();
  if (!report) return [{ sensor: SENSOR, file: REPORT_PATH, problem: 'Playwright JSON report is missing.', howToFix: 'Run a project (npm run test:component) before this sensor.' }];
  const budget = loadPolicy().timeBudgetSeconds;
  const projects = [...new Set(report.tests.map((t) => t.project))];
  const limit = projects.reduce((sum, p) => sum + (budget[p] ?? 0), 0);
  const v: Violation[] = [];
  if (limit > 0 && report.totalDurationMs / 1000 > limit) {
    const slowest = [...report.tests].sort((a, b) => b.durationMs - a.durationMs).slice(0, 3).map((t) => `${t.title} (${Math.round(t.durationMs)}ms)`).join('; ');
    v.push({ sensor: SENSOR, file: REPORT_PATH, problem: `the suite took ${(report.totalDurationMs / 1000).toFixed(1)}s; the budget for ${projects.join('+')} is ${limit}s. Slowest: ${slowest}.`, howToFix: 'Move the slow scenario down to a lower level of the pyramid (E2E -> integration -> component), increase parallelism, or remove redundant setup. Do not raise the budget without a decision recorded in docs/test-strategy.md.' });
  }
  return v;
}
