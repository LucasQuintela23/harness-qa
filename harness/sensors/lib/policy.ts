import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface Policy {
  allowedTechniques: string[];
  levels: string[];
  directoryForLevel: Record<string, string>;
  timeBudgetSeconds: Record<string, number>;
  maxTestsPerFile: number;
  traceability: { dir: string };
  drift: {
    daysWithoutRunForDeadTest: number;
    maxFlakinessPercentage: number;
    minRiskCoveragePerLevel: Record<string, number>;
  };
}

export const ROOT = process.cwd();

export function loadPolicy(): Policy {
  return JSON.parse(readFileSync(join(ROOT, 'harness/config/policy.json'), 'utf8')) as Policy;
}
