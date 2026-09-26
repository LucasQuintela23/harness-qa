import type { APIRequestContext } from '@playwright/test';
import type { ProdutoAlteravel, ProdutoConsultavel, ProdutoCriavel, ProdutoRemovivel } from '../contratos/ProdutoClient.js';
import type { Corpo, RespostaHttp } from '@compartilhado/contratos/RespostaHttp.js';
import { enviar } from '@compartilhado/clients/transporte.js';

export class ProdutoHttp implements ProdutoCriavel, ProdutoConsultavel, ProdutoAlteravel, ProdutoRemovivel {
  constructor(private readonly request: APIRequestContext, private readonly urlBase: string) {}

  criar(corpo: Corpo, token?: string): Promise<RespostaHttp> { return enviar(this.request, `${this.urlBase}/produtos`, 'POST', this.opcoes(token, corpo)); }
  consultar(id: string): Promise<RespostaHttp> { return enviar(this.request, `${this.urlBase}/produtos/${id}`, 'GET'); }
  alterar(id: string, corpo: Corpo, token?: string): Promise<RespostaHttp> { return enviar(this.request, `${this.urlBase}/produtos/${id}`, 'PUT', this.opcoes(token, corpo)); }
  remover(id: string, token?: string): Promise<RespostaHttp> { return enviar(this.request, `${this.urlBase}/produtos/${id}`, 'DELETE', this.opcoes(token)); }

  private opcoes(token?: string, corpo?: Corpo): { corpo?: Corpo; token?: string } {
    return { ...(corpo === undefined ? {} : { corpo }), ...(token === undefined ? {} : { token }) };
  }
}
