import type { Corpo, RespostaHttp } from '@compartilhado/contratos/RespostaHttp.js';

export interface CarrinhoCriavel { criar(corpo: Corpo, token?: string): Promise<RespostaHttp> }
export interface CarrinhoConsultavel { consultar(id: string): Promise<RespostaHttp> }
export interface CarrinhoFinalizavel {
  concluir(token?: string): Promise<RespostaHttp>;
  cancelar(token?: string): Promise<RespostaHttp>;
}
