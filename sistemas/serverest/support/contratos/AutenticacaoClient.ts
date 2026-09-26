import type { Corpo, RespostaHttp } from '@compartilhado/contratos/RespostaHttp.js';

export interface Autenticavel {
  autenticar(corpo: Corpo): Promise<RespostaHttp>;
}
