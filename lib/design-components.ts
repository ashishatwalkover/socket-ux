import { APP_BASE } from "./app-routes";

export type DesignComponent = {
  id: string;
  name: string;
  description: string;
  href: string;
  status?: "WIP" | "Ready" | "Draft";
};

/** Add new UX preview components here — they appear in Cmd+K and the left nav footer. */
export const designComponents: DesignComponent[] = [
  {
    id: "comp-offers-pricing",
    name: "Offers & Pricing",
    description: "Pricing tiers, offers, and promotional banners",
    href: `${APP_BASE}/components/offers-pricing`,
    status: "WIP",
  },
];
