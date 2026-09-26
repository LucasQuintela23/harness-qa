import { test, expect } from '@playwright/test';
import { transitar, TransicaoInvalidaError, type EstadoDoPedido, type EventoDoPedido } from '../../src/pedido.js';

const validas: { id: string; de: EstadoDoPedido; evento: EventoDoPedido; para: EstadoDoPedido }[] = [
  { id: 'EX-ST-T1', de: 'CRIADO', evento: 'pagar', para: 'PAGO' },
  { id: 'EX-ST-T2', de: 'PAGO', evento: 'enviar', para: 'ENVIADO' },
  { id: 'EX-ST-T3', de: 'ENVIADO', evento: 'entregar', para: 'ENTREGUE' },
  { id: 'EX-ST-T4', de: 'CRIADO', evento: 'cancelar', para: 'CANCELADO' },
  { id: 'EX-ST-T5', de: 'PAGO', evento: 'cancelar', para: 'CANCELADO' },
];

const invalidas: { id: string; de: EstadoDoPedido; evento: EventoDoPedido }[] = [
  { id: 'EX-ST-X1', de: 'CRIADO', evento: 'enviar' },
  { id: 'EX-ST-X2', de: 'ENVIADO', evento: 'cancelar' },
  { id: 'EX-ST-X3', de: 'ENTREGUE', evento: 'pagar' },
  { id: 'EX-ST-X4', de: 'CANCELADO', evento: 'pagar' },
];

for (const t of validas) {
  test(`pedido: ${t.de} + ${t.evento} vai para ${t.para}`, {
    tag: ['@tecnica:ST', '@req:REQ-EX-003', '@risco:R-EX-003', `@cobertura:${t.id}`],
  }, () => {
    expect(transitar(t.de, t.evento)).toBe(t.para);
  });
}

for (const t of invalidas) {
  test(`pedido: ${t.evento} em ${t.de} e rejeitado`, {
    tag: ['@tecnica:ST', '@req:REQ-EX-003', '@risco:R-EX-003', `@cobertura:${t.id}`],
  }, () => {
    expect(() => transitar(t.de, t.evento)).toThrow(TransicaoInvalidaError);
  });
}
