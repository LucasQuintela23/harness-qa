import { test, expect } from '@playwright/test';
import { isQuantityValid } from '../../../src/example/order.js';

interface Case { title: string; quantity: number; expected: boolean; technique: 'EP' | 'BVA3'; coverage: string }

const cases: Case[] = [
  { title: 'accepts an integer within range', quantity: 5, expected: true, technique: 'EP', coverage: 'EX-EP-V' },
  { title: 'rejects below the minimum', quantity: -3, expected: false, technique: 'EP', coverage: 'EX-EP-I1' },
  { title: 'rejects above the maximum', quantity: 50, expected: false, technique: 'EP', coverage: 'EX-EP-I2' },
  { title: 'rejects a non-integer', quantity: 2.5, expected: false, technique: 'EP', coverage: 'EX-EP-I3' },
  { title: 'rejects 0 (below the lower boundary)', quantity: 0, expected: false, technique: 'BVA3', coverage: 'EX-BV-0' },
  { title: 'accepts 1 (lower boundary)', quantity: 1, expected: true, technique: 'BVA3', coverage: 'EX-BV-1' },
  { title: 'accepts 2 (above the lower boundary)', quantity: 2, expected: true, technique: 'BVA3', coverage: 'EX-BV-2' },
  { title: 'accepts 9 (below the upper boundary)', quantity: 9, expected: true, technique: 'BVA3', coverage: 'EX-BV-9' },
  { title: 'accepts 10 (upper boundary)', quantity: 10, expected: true, technique: 'BVA3', coverage: 'EX-BV-10' },
  { title: 'rejects 11 (above the upper boundary)', quantity: 11, expected: false, technique: 'BVA3', coverage: 'EX-BV-11' },
];

for (const c of cases) {
  test(`quantity: ${c.title}`, {
    tag: [`@technique:${c.technique}`, '@req:REQ-EX-001', '@risk:R-EX-001', `@coverage:${c.coverage}`],
  }, () => {
    expect(isQuantityValid(c.quantity)).toBe(c.expected);
  });
}
