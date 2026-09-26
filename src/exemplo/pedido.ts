// EXEMPLO DESCARTAVEL: dominio ficticio apenas para demonstrar o harness. Apague ao ligar o SUT real.

export const QUANTIDADE_MINIMA = 1;
export const QUANTIDADE_MAXIMA = 10;
export const LIMITE_DESCONTO_VOLUME = 6;

export type EstadoDoPedido = 'CRIADO' | 'PAGO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';
export type EventoDoPedido = 'pagar' | 'enviar' | 'entregar' | 'cancelar';

export function quantidadeEhValida(quantidade: number): boolean {
  return Number.isInteger(quantidade) && quantidade >= QUANTIDADE_MINIMA && quantidade <= QUANTIDADE_MAXIMA;
}

export interface EntradaDeDesconto { quantidade: number; clienteFidelidade: boolean; cupomValido: boolean }

/** Percentual de desconto. Regras: volume >= 6 = 10%; fidelidade = 5%; cupom valido = 5%; soma limitada a 15%. */
export function percentualDeDesconto({ quantidade, clienteFidelidade, cupomValido }: EntradaDeDesconto): number {
  const volume = quantidade >= LIMITE_DESCONTO_VOLUME ? 10 : 0;
  const fidelidade = clienteFidelidade ? 5 : 0;
  const cupom = cupomValido ? 5 : 0;
  return Math.min(volume + fidelidade + cupom, 15);
}

const TRANSICOES: Record<EstadoDoPedido, Partial<Record<EventoDoPedido, EstadoDoPedido>>> = {
  CRIADO: { pagar: 'PAGO', cancelar: 'CANCELADO' },
  PAGO: { enviar: 'ENVIADO', cancelar: 'CANCELADO' },
  ENVIADO: { entregar: 'ENTREGUE' },
  ENTREGUE: {},
  CANCELADO: {},
};

export class TransicaoInvalidaError extends Error {
  constructor(readonly estado: EstadoDoPedido, readonly evento: EventoDoPedido) {
    super(`Evento "${evento}" nao permitido no estado ${estado}`);
  }
}

export function transitar(estado: EstadoDoPedido, evento: EventoDoPedido): EstadoDoPedido {
  const destino = TRANSICOES[estado][evento];
  if (destino === undefined) throw new TransicaoInvalidaError(estado, evento);
  return destino;
}
