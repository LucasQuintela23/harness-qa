import type { APIRequestContext } from '@playwright/test';
import type { CarrinhoConsultavel, CarrinhoCriavel, CarrinhoFinalizavel } from '../contratos/CarrinhoClient.js';
import type { Corpo, RespostaHttp } from '@compartilhado/contratos/RespostaHttp.js';
import { enviar } from '@compartilhado/clients/transporte.js';

export class CarrinhoHttp implements CarrinhoCriavel, CarrinhoConsultavel, CarrinhoFinalizavel {
  constructor(private readonly request: APIRequestContext, private readonly urlBase: string) {}

  criar(corpo: Corpo, token?: string): Promise<RespostaHttp> { return enviar(this.request, `${this.urlBase}/carrinhos`, 'POST', { corpo, ...this.token(token) }); }
  consultar(id: string): Promise<RespostaHttp> { return enviar(this.request, `${this.urlBase}/carrinhos/${id}`, 'GET'); }
  concluir(token?: string): Promise<RespostaHttp> { return enviar(this.request, `${this.urlBase}/carrinhos/concluir-compra`, 'DELETE', this.token(token)); }
  cancelar(token?: string): Promise<RespostaHttp> { return enviar(this.request, `${this.urlBase}/carrinhos/cancelar-compra`, 'DELETE', this.token(token)); }

  private token(token?: string): { token?: string } { return token === undefined ? {} : { token }; }
}
