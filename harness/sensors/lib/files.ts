import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT } from './policy.js';

export function listTs(relativeDir: string, suffix = '.ts'): string[] {
  const start = join(ROOT, relativeDir);
  const found: string[] = [];
  const visit = (dir: string): void => {
    let entries: string[];
    try { entries = readdirSync(dir); } catch { return; }
    for (const name of entries) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) visit(path);
      else if (name.endsWith(suffix)) found.push(relative(ROOT, path));
    }
  };
  visit(start);
  return found.sort();
}
