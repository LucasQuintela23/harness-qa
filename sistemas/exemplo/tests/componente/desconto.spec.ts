import { test, expect } from '@playwright/test';
import { percentualDeDesconto } from '../../src/pedido.js';
import { EntradaDeDescontoBuilder } from '../../support/builders/PedidoBuilder.js';

const regras = [
  { regra: 'R1 sem volume, fidelidade nem cupom', cobertura: 'EX-DT-R1', entrada: new EntradaDeDescontoBuilder().comQuantidade(5).construir(), esperado: 0 },
  { regra: 'R2 somente volume', cobertura: 'EX-DT-R2', entrada: new EntradaDeDescontoBuilder().comQuantidade(6).construir(), esperado: 10 },
  { regra: 'R3 somente fidelidade', cobertura: 'EX-DT-R3', entrada: new EntradaDeDescontoBuilder().comQuantidade(5).fidelidade().construir(), esperado: 5 },
  { regra: 'R4 somente cupom', cobertura: 'EX-DT-R4', entrada: new EntradaDeDescontoBuilder().comQuantidade(5).comCupomValido().construir(), esperado: 5 },
  { regra: 'R5 todos, limitado ao teto', cobertura: 'EX-DT-R5', entrada: new EntradaDeDescontoBuilder().comQuantidade(6).fidelidade().comCupomValido().construir(), esperado: 15 },
];

for (const r of regras) {
  test(`desconto: ${r.regra} resulta em ${r.esperado}%`, {
    tag: ['@tecnica:DT', '@req:REQ-EX-002', '@risco:R-EX-002', `@cobertura:${r.cobertura}`],
  }, () => {
    expect(percentualDeDesconto(r.entrada)).toBe(r.esperado);
  });
}
