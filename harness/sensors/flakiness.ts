import { REPORT_PATH, readReport } from './lib/playwright-report.js';
import type { Violation } from './lib/report.js';

const SENSOR = 'flakiness';

export function run(): Violation[] {
  const report = readReport();
  if (!report) return [{ sensor: SENSOR, file: REPORT_PATH, problem: 'Playwright JSON report is missing.', howToFix: 'Run a test project before this sensor.' }];
  return report.tests.filter((t) => t.status === 'flaky').map((t) => ({
    sensor: SENSOR, file: t.id, problem: `test "${t.title}" only passed after a retry (flaky).`,
    howToFix: 'Do not increase retries. Open the trace (test-results), identify the cause (implicit wait, shared data, ordering, clock) and fix it at the source. If it cannot be fixed now, register a defect and quarantine with test.fixme referencing the ID.',
  }));
}
