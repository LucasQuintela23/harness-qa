import { createHash } from 'node:crypto';
import { open, findTests, lineOf } from './lib/ast.js';
import { listTs } from './lib/files.js';
import type { Violation } from './lib/report.js';

const SENSOR = 'duplicates';

/** Heuristic: same normalized body (no spaces/comments) = duplicate. Does not detect purely semantic duplication; that is covered by /review-test. */
export function run(): Violation[] {
  const groups = new Map<string, { file: string; line: number; title: string }[]>();
  for (const file of listTs('tests', '.spec.ts')) {
    const sf = open(file);
    for (const t of findTests(sf)) {
      if (!t.body) continue;
      const normalized = t.body.getText(sf).replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, '');
      const key = createHash('sha1').update(normalized).digest('hex');
      const list = groups.get(key) ?? [];
      list.push({ file, line: lineOf(sf, t.call), title: t.title });
      groups.set(key, list);
    }
  }
  const v: Violation[] = [];
  for (const list of groups.values()) {
    if (list.length < 2) continue;
    const [first, ...rest] = list;
    if (!first) continue;
    for (const d of rest) v.push({ sensor: SENSOR, file: d.file, line: d.line, problem: `body identical to test "${first.title}" (${first.file}:${first.line}).`, howToFix: 'Remove the duplicate. Repeated tests add no coverage (pesticide paradox: a variation only pays off if it exercises a different coverage item).' });
  }
  return v;
}
