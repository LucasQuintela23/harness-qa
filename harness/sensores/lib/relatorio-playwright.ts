import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ } from './politica.js';

export interface ResultadoDeTeste { id: string; titulo: string; projeto: string; status: 'expected' | 'unexpected' | 'flaky' | 'skipped'; duracaoMs: number; tags: string[] }
export interface RelatorioPlaywright { duracaoTotalMs: number; testes: ResultadoDeTeste[] }

interface SpecJson { title: string; file: string; line: number; tags?: string[]; tests?: { projectName: string; status: ResultadoDeTeste['status']; results?: { duration: number }[] }[] }
interface SuiteJson { specs?: SpecJson[]; suites?: SuiteJson[] }

export const CAMINHO_RELATORIO = 'reports/playwright.json';

export function lerRelatorio(): RelatorioPlaywright | undefined {
  const caminho = join(RAIZ, CAMINHO_RELATORIO);
  if (!existsSync(caminho)) return undefined;
  const bruto = JSON.parse(readFileSync(caminho, 'utf8')) as { stats?: { duration?: number }; suites?: SuiteJson[] };
  const testes: ResultadoDeTeste[] = [];
  const visitar = (s: SuiteJson): void => {
    for (const e of s.specs ?? []) for (const t of e.tests ?? []) {
      testes.push({ id: `${e.file}:${e.line}`, titulo: e.title, projeto: t.projectName, status: t.status, duracaoMs: (t.results ?? []).reduce((a, r) => a + r.duration, 0), tags: (e.tags ?? []).map((g) => (g.startsWith('@') ? g : `@${g}`)) });
    }
    (s.suites ?? []).forEach(visitar);
  };
  (bruto.suites ?? []).forEach(visitar);
  return { duracaoTotalMs: bruto.stats?.duration ?? 0, testes };
}
