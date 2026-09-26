import type { Corpo, RespostaHttp } from '@compartilhado/contratos/RespostaHttp.js';

export interface ProdutoCriavel { criar(corpo: Corpo, token?: string): Promise<RespostaHttp> }
export interface ProdutoConsultavel { consultar(id: string): Promise<RespostaHttp> }
export interface ProdutoAlteravel { alterar(id: string, corpo: Corpo, token?: string): Promise<RespostaHttp> }
export interface ProdutoRemovivel { remover(id: string, token?: string): Promise<RespostaHttp> }
