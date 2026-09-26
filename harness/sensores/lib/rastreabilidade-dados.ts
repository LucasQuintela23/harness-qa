import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ, carregarPolitica } from './politica.js';

export interface Requisito { id: string; titulo: string; risco: string }
export interface Risco { id: string; descricao: string; probabilidade: number; impacto: number; nivel: 'critico' | 'alto' | 'medio' | 'baixo' }
export interface ItemDeCobertura { id: string; requisito: string; tecnica: string; descricao: string; manual?: boolean }
export interface DadosDeRastreabilidade { requisitos: Requisito[]; riscos: Risco[]; itensDeCobertura: ItemDeCobertura[] }

export function carregarDados(): DadosDeRastreabilidade {
  const dir = join(RAIZ, carregarPolitica().rastreabilidade.dir);
  const acumulado: DadosDeRastreabilidade = { requisitos: [], riscos: [], itensDeCobertura: [] };
  for (const arquivo of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const parcial = JSON.parse(readFileSync(join(dir, arquivo), 'utf8')) as Partial<DadosDeRastreabilidade>;
    acumulado.requisitos.push(...(parcial.requisitos ?? []));
    acumulado.riscos.push(...(parcial.riscos ?? []));
    acumulado.itensDeCobertura.push(...(parcial.itensDeCobertura ?? []));
  }
  return acumulado;
}
