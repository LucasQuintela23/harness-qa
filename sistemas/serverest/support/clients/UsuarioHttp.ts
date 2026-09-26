import type { APIRequestContext } from '@playwright/test';
import type { Corpo, RespostaHttp } from '@compartilhado/contratos/RespostaHttp.js';
import type { UsuarioAlteravel, UsuarioConsultavel, UsuarioCriavel, UsuarioRemovivel } from '../contratos/UsuarioClient.js';
import { enviar } from '@compartilhado/clients/transporte.js';

export class UsuarioHttp implements UsuarioCriavel, UsuarioConsultavel, UsuarioAlteravel, UsuarioRemovivel {
  constructor(private readonly request: APIRequestContext, private readonly urlBase: string) {}

  criar(corpo: Corpo): Promise<RespostaHttp> { return enviar(this.request, `${this.urlBase}/usuarios`, 'POST', { corpo }); }
  consultar(id: string): Promise<RespostaHttp> { return enviar(this.request, `${this.urlBase}/usuarios/${id}`, 'GET'); }
  alterar(id: string, corpo: Corpo): Promise<RespostaHttp> { return enviar(this.request, `${this.urlBase}/usuarios/${id}`, 'PUT', { corpo }); }
  remover(id: string): Promise<RespostaHttp> { return enviar(this.request, `${this.urlBase}/usuarios/${id}`, 'DELETE'); }
}
