import type { EntradaDeDesconto } from '../../src/pedido.js';

export class EntradaDeDescontoBuilder {
  private dados: EntradaDeDesconto = { quantidade: 1, clienteFidelidade: false, cupomValido: false };

  comQuantidade(quantidade: number): this { this.dados = { ...this.dados, quantidade }; return this; }
  fidelidade(): this { this.dados = { ...this.dados, clienteFidelidade: true }; return this; }
  comCupomValido(): this { this.dados = { ...this.dados, cupomValido: true }; return this; }
  construir(): EntradaDeDesconto { return { ...this.dados }; }
}
