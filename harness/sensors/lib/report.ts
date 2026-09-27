export interface Violation {
  sensor: string;
  file: string;
  line?: number;
  problem: string;
  howToFix: string;
}

export function format(v: Violation): string {
  const location = v.line === undefined ? v.file : `${v.file}:${v.line}`;
  return `[${v.sensor}] ${location}\n  PROBLEM: ${v.problem}\n  HOW TO FIX: ${v.howToFix}`;
}

export function emit(name: string, violations: Violation[]): number {
  if (violations.length === 0) {
    console.log(`OK   ${name}`);
    return 0;
  }
  console.error(`FAILED ${name}: ${violations.length} violation(s)\n`);
  for (const v of violations) console.error(`${format(v)}\n`);
  return violations.length;
}
