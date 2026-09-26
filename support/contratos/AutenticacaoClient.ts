import type { Corpo, RespostaHttp } from './RespostaHttp.js';

export interface Autenticavel {
  autenticar(corpo: Corpo): Promise<RespostaHttp>;
}
