import type { Corpo } from '@compartilhado/contratos/RespostaHttp.js';
import type { ItemDeCarrinho } from '../contratos/MassaDeTeste.js';

export class CarrinhoBuilder {
  private itens: ItemDeCarrinho[] = [];

  item(idProduto: string, quantidade = 1): this { this.itens = [...this.itens, { idProduto, quantidade }]; return this; }
  construir(): Corpo { return { produtos: this.itens.map((i) => ({ ...i })) }; }
}
