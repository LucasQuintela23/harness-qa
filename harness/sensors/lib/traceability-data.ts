import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadPolicy } from './policy.js';

export interface Requirement { id: string; title: string; risk: string }
export interface Risk { id: string; description: string; probability: number; impact: number; level: 'critical' | 'high' | 'medium' | 'low' }
export interface CoverageItem { id: string; requirement: string; technique: string; description: string; manual?: boolean }
export interface TraceabilityData { requirements: Requirement[]; risks: Risk[]; coverageItems: CoverageItem[] }

export function loadData(): TraceabilityData {
  const dir = join(ROOT, loadPolicy().traceability.dir);
  const accumulated: TraceabilityData = { requirements: [], risks: [], coverageItems: [] };
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const partial = JSON.parse(readFileSync(join(dir, file), 'utf8')) as Partial<TraceabilityData>;
    accumulated.requirements.push(...(partial.requirements ?? []));
    accumulated.risks.push(...(partial.risks ?? []));
    accumulated.coverageItems.push(...(partial.coverageItems ?? []));
  }
  return accumulated;
}
