import type { Corpo, RespostaHttp } from '@compartilhado/contratos/RespostaHttp.js';

export interface UsuarioCriavel { criar(corpo: Corpo): Promise<RespostaHttp> }
export interface UsuarioConsultavel { consultar(id: string): Promise<RespostaHttp> }
export interface UsuarioAlteravel { alterar(id: string, corpo: Corpo): Promise<RespostaHttp> }
export interface UsuarioRemovivel { remover(id: string): Promise<RespostaHttp> }
