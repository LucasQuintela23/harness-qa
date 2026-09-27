// DISPOSABLE EXAMPLE: a fictional domain used only to demonstrate the harness. Delete it once the real SUT is wired up.

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 10;
export const VOLUME_DISCOUNT_THRESHOLD = 6;

export type OrderState = 'CREATED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
export type OrderEvent = 'pay' | 'ship' | 'deliver' | 'cancel';

export function isQuantityValid(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= MIN_QUANTITY && quantity <= MAX_QUANTITY;
}

export interface DiscountInput { quantity: number; loyaltyCustomer: boolean; validCoupon: boolean }

/** Discount percentage. Rules: volume >= 6 = 10%; loyalty = 5%; valid coupon = 5%; sum capped at 15%. */
export function discountPercentage({ quantity, loyaltyCustomer, validCoupon }: DiscountInput): number {
  const volume = quantity >= VOLUME_DISCOUNT_THRESHOLD ? 10 : 0;
  const loyalty = loyaltyCustomer ? 5 : 0;
  const coupon = validCoupon ? 5 : 0;
  return Math.min(volume + loyalty + coupon, 15);
}

const TRANSITIONS: Record<OrderState, Partial<Record<OrderEvent, OrderState>>> = {
  CREATED: { pay: 'PAID', cancel: 'CANCELED' },
  PAID: { ship: 'SHIPPED', cancel: 'CANCELED' },
  SHIPPED: { deliver: 'DELIVERED' },
  DELIVERED: {},
  CANCELED: {},
};

export class InvalidTransitionError extends Error {
  constructor(readonly state: OrderState, readonly event: OrderEvent) {
    super(`Event "${event}" is not allowed in state ${state}`);
  }
}

export function transition(state: OrderState, event: OrderEvent): OrderState {
  const target = TRANSITIONS[state][event];
  if (target === undefined) throw new InvalidTransitionError(state, event);
  return target;
}
