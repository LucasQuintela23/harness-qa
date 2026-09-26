import type { RespostaHttp } from '../contratos/RespostaHttp.js';

export function idDe(resposta: RespostaHttp): string {
  const corpo = resposta.corpo as { _id?: unknown };
  if (typeof corpo._id !== 'string') throw new Error(`Resposta ${resposta.status} sem _id: ${JSON.stringify(resposta.corpo)}`);
  return corpo._id;
}

export function exigirStatus(resposta: RespostaHttp, esperado: number, contexto: string): void {
  if (resposta.status !== esperado) throw new Error(`Preparacao falhou (${contexto}): status ${resposta.status}, esperado ${esperado}. Corpo: ${JSON.stringify(resposta.corpo)}`);
}
