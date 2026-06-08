export type PlanId = "solo" | "team" | "premium";

export type BillingPeriod = "monthly" | "annually";

export type PlanFeature = {
  label: string;
  included: boolean;
};

export type Plan = {
  id: PlanId;
  name: string;
  originalPrice: number;
  price: number;
  features: PlanFeature[];
  support: string;
  cta: string;
  featured?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "solo",
    name: "Solo Plan",
    originalPrice: 39,
    price: 29,
    features: [
      { label: "5,000 tasks/month", included: true },
      { label: "2,000 AI credits included", included: true },
      { label: "1,500+ app connections", included: true },
      { label: "All basic built-in tools", included: true },
      { label: "AI tools", included: false },
      { label: "Team members", included: false },
    ],
    support: "Standard ticket support",
    cta: "Get Solo Plan",
  },
  {
    id: "team",
    name: "Team Plan",
    originalPrice: 79,
    price: 59,
    featured: true,
    features: [
      { label: "15,000 tasks/month", included: true },
      { label: "5,000 AI credits included", included: true },
      { label: "Unlimited team members", included: true },
      { label: "All basic built-in tools", included: true },
      { label: "Advanced AI models", included: true },
      { label: "5-min polling interval", included: true },
    ],
    support: "Priority ticket support",
    cta: "Get Team Plan",
  },
  {
    id: "premium",
    name: "Premium Plan",
    originalPrice: 99,
    price: 74,
    features: [
      { label: "25,000 tasks/month", included: true },
      { label: "10,000 AI credits included", included: true },
      { label: "Unlimited team members", included: true },
      { label: "All basic built-in tools", included: true },
      { label: "Advanced AI models", included: true },
      { label: "1-min polling (real-time)", included: true },
      { label: "Top priority queue", included: true },
    ],
    support: "One on One live expert support",
    cta: "Get Premium Plan",
  },
];
