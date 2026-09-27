import { emit, type Violation } from './lib/report.js';
import * as assertions from './assertions.js';
import * as duplicates from './duplicates.js';
import * as structural from './structural.js';
import * as traceability from './traceability.js';
import * as suiteTime from './suite-time.js';
import * as flakiness from './flakiness.js';
import * as drift from './drift.js';

const groups: Record<string, [string, () => Violation[]][]> = {
  static: [['assertions', assertions.run], ['duplicates', duplicates.run], ['structural', structural.run], ['traceability', traceability.run]],
  report: [['flakiness', flakiness.run], ['suite-time', suiteTime.run]],
  drift: [['drift', drift.run]],
};

const group = process.argv[2] ?? '';
const sensors = groups[group];
if (!sensors) { console.error(`usage: run.ts <${Object.keys(groups).join('|')}>`); process.exit(2); }

let failures = 0;
for (const [name, execute] of sensors) failures += emit(name, execute());
if (group === 'report') drift.recordRun();
process.exit(failures > 0 ? 1 : 0);
