import { createHash } from 'node:crypto';
import { abrir, encontrarTestes, linhaDe } from './lib/ast.js';
import { listarTs } from './lib/arquivos.js';
import type { Violacao } from './lib/relatorio.js';

const SENSOR = 'duplicados';

/** Heuristica: mesmo corpo normalizado (sem espacos/comentarios) = duplicado. Nao detecta duplicacao puramente semantica; isso fica com /revisar-teste. */
export function executar(): Violacao[] {
  const grupos = new Map<string, { arquivo: string; linha: number; titulo: string }[]>();
  for (const arquivo of listarTs('tests', '.spec.ts')) {
    const sf = abrir(arquivo);
    for (const t of encontrarTestes(sf)) {
      if (!t.corpo) continue;
      const normal = t.corpo.getText(sf).replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, '');
      const chave = createHash('sha1').update(normal).digest('hex');
      const lista = grupos.get(chave) ?? [];
      lista.push({ arquivo, linha: linhaDe(sf, t.chamada), titulo: t.titulo });
      grupos.set(chave, lista);
    }
  }
  const v: Violacao[] = [];
  for (const lista of grupos.values()) {
    if (lista.length < 2) continue;
    const [primeiro, ...resto] = lista;
    if (!primeiro) continue;
    for (const d of resto) v.push({ sensor: SENSOR, arquivo: d.arquivo, linha: d.linha, problema: `corpo identico ao teste "${primeiro.titulo}" (${primeiro.arquivo}:${primeiro.linha}).`, comoCorrigir: 'Remova o duplicado. Testes repetidos nao adicionam cobertura (paradoxo do pesticida: variacao so vale se exercitar item de cobertura diferente).' });
  }
  return v;
}
