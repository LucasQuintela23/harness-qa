import { randomUUID } from 'node:crypto';
import type { Corpo } from '../contratos/RespostaHttp.js';

export class ProdutoBuilder {
  private dados: Corpo = { nome: `qa-produto-${randomUUID()}`, preco: 10, descricao: 'Produto de teste', quantidade: 5 };

  com(campo: string, valor: unknown): this { this.dados = { ...this.dados, [campo]: valor }; return this; }
  comAjustes(ajustes: Corpo): this { this.dados = { ...this.dados, ...ajustes }; return this; }
  construir(): Corpo { return { ...this.dados }; }
}
