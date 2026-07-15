import { APP_BASE } from "./app-routes";

export type DesignComponent = {
  id: string;
  name: string;
  description: string;
  href: string;
  status?: "WIP" | "Ready" | "Draft";
  openInNewWindow?: boolean;
};

/** Add new UX preview components here — they appear in Cmd+K and the left nav footer. */
export const designComponents: DesignComponent[] = [
  {
    id: "comp-onboarding",
    name: "Onboarding",
    description: "Guided setup checklist for new workspaces",
    href: `${APP_BASE}/components/onboarding`,
    status: "WIP",
    openInNewWindow: true,
  },
  {
    id: "comp-offers-pricing",
    name: "Offers & Pricing",
    description: "Pricing tiers, offers, and promotional banners",
    href: `${APP_BASE}/components/offers-pricing`,
    status: "WIP",
  },
  {
    id: "comp-billing",
    name: "Billing & Subscription",
    description: "Plans, usage, coupons, payment methods, and invoice history",
    href: `${APP_BASE}/billing`,
    status: "Ready",
  },
  {
    id: "comp-templates",
    name: "Template Cards",
    description: "Reusable template cards for automation workflows",
    href: `${APP_BASE}/components`,
    status: "Ready",
  },
];
