import type { DiscountInput } from '../../src/example/order.js';

export class DiscountInputBuilder {
  private data: DiscountInput = { quantity: 1, loyaltyCustomer: false, validCoupon: false };

  withQuantity(quantity: number): this { this.data = { ...this.data, quantity }; return this; }
  loyal(): this { this.data = { ...this.data, loyaltyCustomer: true }; return this; }
  withValidCoupon(): this { this.data = { ...this.data, validCoupon: true }; return this; }
  build(): DiscountInput { return { ...this.data }; }
}
