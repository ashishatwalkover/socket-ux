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
    id: "comp-automation-builder",
    name: "Automation Builder",
    description: "Pick a trigger and actions to assemble an app automation",
    href: `${APP_BASE}/components/automation-builder`,
    status: "WIP",
    openInNewWindow: true,
  },
  {
    id: "comp-ai-plug-builder",
    name: "AI Plug Builder",
    description: "Describe an automation in plain English and watch the plug assemble",
    href: `${APP_BASE}/components/ai-plug-builder`,
    status: "WIP",
    openInNewWindow: true,
  },
  {
    id: "comp-onboarding",
    name: "Onboarding",
    description: "Guided setup checklist for new workspaces",
    href: `${APP_BASE}/components/onboarding`,
    status: "WIP",
    openInNewWindow: true,
  },
  {
    id: "comp-apply-coupon",
    name: "Apply Coupon",
    description: "Verify a coupon code and pick a compatible plan to redeem it",
    href: `${APP_BASE}/components/apply-coupon`,
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
