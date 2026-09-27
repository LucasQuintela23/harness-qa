import { test, expect } from '@playwright/test';
import { discountPercentage } from '../../../src/example/order.js';
import { DiscountInputBuilder } from '../../../support/builders/OrderBuilder.js';

const rules = [
  { rule: 'R1 no volume, loyalty, or coupon', coverage: 'EX-DT-R1', input: new DiscountInputBuilder().withQuantity(5).build(), expected: 0 },
  { rule: 'R2 volume only', coverage: 'EX-DT-R2', input: new DiscountInputBuilder().withQuantity(6).build(), expected: 10 },
  { rule: 'R3 loyalty only', coverage: 'EX-DT-R3', input: new DiscountInputBuilder().withQuantity(5).loyal().build(), expected: 5 },
  { rule: 'R4 coupon only', coverage: 'EX-DT-R4', input: new DiscountInputBuilder().withQuantity(5).withValidCoupon().build(), expected: 5 },
  { rule: 'R5 all, capped at the ceiling', coverage: 'EX-DT-R5', input: new DiscountInputBuilder().withQuantity(6).loyal().withValidCoupon().build(), expected: 15 },
];

for (const r of rules) {
  test(`discount: ${r.rule} results in ${r.expected}%`, {
    tag: ['@technique:DT', '@req:REQ-EX-002', '@risk:R-EX-002', `@coverage:${r.coverage}`],
  }, () => {
    expect(discountPercentage(r.input)).toBe(r.expected);
  });
}
