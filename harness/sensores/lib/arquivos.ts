import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { RAIZ } from './politica.js';

export function listarTs(dirRelativo: string, sufixo = '.ts'): string[] {
  const inicio = join(RAIZ, dirRelativo);
  const achados: string[] = [];
  const visitar = (dir: string): void => {
    let entradas: string[];
    try { entradas = readdirSync(dir); } catch { return; }
    for (const nome of entradas) {
      const caminho = join(dir, nome);
      if (statSync(caminho).isDirectory()) visitar(caminho);
      else if (nome.endsWith(sufixo)) achados.push(relative(RAIZ, caminho));
    }
  };
  visitar(inicio);
  return achados.sort();
}

export function listarSistemas(): string[] {
  const base = join(RAIZ, 'sistemas');
  try { return readdirSync(base).filter((d) => statSync(join(base, d)).isDirectory()).sort(); } catch { return []; }
}

export const listarSpecs = (): string[] => listarSistemas().flatMap((s) => listarTs(`sistemas/${s}/tests`, '.spec.ts'));

/** Todo TypeScript de suporte e produto: support/ compartilhado e sistemas/<sut>/{src,support,tests}. */
export const listarCodigo = (): string[] => [...listarTs('support'), ...listarTs('sistemas')];
