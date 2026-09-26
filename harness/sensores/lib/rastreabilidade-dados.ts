import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { listarSistemas } from './arquivos.js';
import { RAIZ, carregarPolitica } from './politica.js';

export interface Requisito { id: string; titulo: string; risco: string }
export interface Risco { id: string; descricao: string; probabilidade: number; impacto: number; nivel: 'critico' | 'alto' | 'medio' | 'baixo' }
export interface ItemDeCobertura { id: string; requisito: string; tecnica: string; descricao: string; manual?: boolean }
export interface DadosDeRastreabilidade { requisitos: Requisito[]; riscos: Risco[]; itensDeCobertura: ItemDeCobertura[] }

export function carregarDadosPorSistema(): Record<string, DadosDeRastreabilidade> {
  const arquivo = carregarPolitica().rastreabilidade.arquivo;
  const porSistema: Record<string, DadosDeRastreabilidade> = {};
  for (const sistema of listarSistemas()) {
    const caminho = join(RAIZ, 'sistemas', sistema, arquivo);
    if (!existsSync(caminho)) continue;
    const parcial = JSON.parse(readFileSync(caminho, 'utf8')) as Partial<DadosDeRastreabilidade>;
    porSistema[sistema] = { requisitos: parcial.requisitos ?? [], riscos: parcial.riscos ?? [], itensDeCobertura: parcial.itensDeCobertura ?? [] };
  }
  return porSistema;
}

export function carregarDados(): DadosDeRastreabilidade {
  const acumulado: DadosDeRastreabilidade = { requisitos: [], riscos: [], itensDeCobertura: [] };
  for (const d of Object.values(carregarDadosPorSistema())) {
    acumulado.requisitos.push(...d.requisitos);
    acumulado.riscos.push(...d.riscos);
    acumulado.itensDeCobertura.push(...d.itensDeCobertura);
  }
  return acumulado;
}
