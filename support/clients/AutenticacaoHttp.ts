import type { APIRequestContext } from '@playwright/test';
import type { Autenticavel } from '../contratos/AutenticacaoClient.js';
import type { Corpo, RespostaHttp } from '../contratos/RespostaHttp.js';
import { enviar } from './transporte.js';

export class AutenticacaoHttp implements Autenticavel {
  constructor(private readonly request: APIRequestContext, private readonly urlBase: string) {}

  autenticar(corpo: Corpo): Promise<RespostaHttp> {
    return enviar(this.request, `${this.urlBase}/login`, 'POST', { corpo });
  }
}
