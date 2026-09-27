import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './policy.js';

export interface TestResult { id: string; title: string; project: string; status: 'expected' | 'unexpected' | 'flaky' | 'skipped'; durationMs: number; tags: string[] }
export interface PlaywrightReport { totalDurationMs: number; tests: TestResult[] }

interface SpecJson { title: string; file: string; line: number; tags?: string[]; tests?: { projectName: string; status: TestResult['status']; results?: { duration: number }[] }[] }
interface SuiteJson { specs?: SpecJson[]; suites?: SuiteJson[] }

export const REPORT_PATH = 'reports/playwright.json';

export function readReport(): PlaywrightReport | undefined {
  const path = join(ROOT, REPORT_PATH);
  if (!existsSync(path)) return undefined;
  const raw = JSON.parse(readFileSync(path, 'utf8')) as { stats?: { duration?: number }; suites?: SuiteJson[] };
  const tests: TestResult[] = [];
  const visit = (s: SuiteJson): void => {
    for (const e of s.specs ?? []) for (const t of e.tests ?? []) {
      tests.push({ id: `${e.file}:${e.line}`, title: e.title, project: t.projectName, status: t.status, durationMs: (t.results ?? []).reduce((a, r) => a + r.duration, 0), tags: (e.tags ?? []).map((g) => (g.startsWith('@') ? g : `@${g}`)) });
    }
    (s.suites ?? []).forEach(visit);
  };
  (raw.suites ?? []).forEach(visit);
  return { totalDurationMs: raw.stats?.duration ?? 0, tests };
}
