import { test, expect } from '@playwright/test';
import { transition, InvalidTransitionError, type OrderState, type OrderEvent } from '../../../src/example/order.js';

const validTransitions: { id: string; from: OrderState; event: OrderEvent; to: OrderState }[] = [
  { id: 'EX-ST-T1', from: 'CREATED', event: 'pay', to: 'PAID' },
  { id: 'EX-ST-T2', from: 'PAID', event: 'ship', to: 'SHIPPED' },
  { id: 'EX-ST-T3', from: 'SHIPPED', event: 'deliver', to: 'DELIVERED' },
  { id: 'EX-ST-T4', from: 'CREATED', event: 'cancel', to: 'CANCELED' },
  { id: 'EX-ST-T5', from: 'PAID', event: 'cancel', to: 'CANCELED' },
];

const invalidTransitions: { id: string; from: OrderState; event: OrderEvent }[] = [
  { id: 'EX-ST-X1', from: 'CREATED', event: 'ship' },
  { id: 'EX-ST-X2', from: 'SHIPPED', event: 'cancel' },
  { id: 'EX-ST-X3', from: 'DELIVERED', event: 'pay' },
  { id: 'EX-ST-X4', from: 'CANCELED', event: 'pay' },
];

for (const t of validTransitions) {
  test(`order: ${t.from} + ${t.event} goes to ${t.to}`, {
    tag: ['@technique:ST', '@req:REQ-EX-003', '@risk:R-EX-003', `@coverage:${t.id}`],
  }, () => {
    expect(transition(t.from, t.event)).toBe(t.to);
  });
}

for (const t of invalidTransitions) {
  test(`order: ${t.event} on ${t.from} is rejected`, {
    tag: ['@technique:ST', '@req:REQ-EX-003', '@risk:R-EX-003', `@coverage:${t.id}`],
  }, () => {
    expect(() => transition(t.from, t.event)).toThrow(InvalidTransitionError);
  });
}
