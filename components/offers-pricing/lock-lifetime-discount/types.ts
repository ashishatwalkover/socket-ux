export type DiscountStep = 1 | 2 | 3;

export const DISCOUNT_STEPS = [
  { step: 1 as const, label: "Offer" },
  { step: 2 as const, label: "Plan" },
  { step: 3 as const, label: "Payment" },
];
