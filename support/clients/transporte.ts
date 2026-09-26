import type { APIRequestContext } from '@playwright/test';
import type { Corpo, RespostaHttp } from '../contratos/RespostaHttp.js';

export type Metodo = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface OpcoesDeEnvio { corpo?: Corpo; token?: string }

export async function enviar(request: APIRequestContext, url: string, metodo: Metodo, opcoes: OpcoesDeEnvio = {}): Promise<RespostaHttp> {
  const resposta = await request.fetch(url, {
    method: metodo,
    ...(opcoes.corpo === undefined ? {} : { data: opcoes.corpo }),
    ...(opcoes.token === undefined ? {} : { headers: { Authorization: opcoes.token } }),
  });
  return { status: resposta.status(), corpo: await resposta.json() };
}
