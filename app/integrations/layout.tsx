import type { ReactNode } from "react";

/**
 * Integrations is a light-surface product area. The app shell can render under
 * the system `.dark` color scheme, which would otherwise flip MUI's palette
 * (Paper, TextField, Button…) to dark while the hand-tuned Tailwind grays stay
 * light — a broken, half-dark mix.
 *
 * Pinning the whole subtree here keeps it consistently light regardless of the
 * system scheme:
 *   - `light` re-declares MUI's palette CSS variables as light for everything
 *     below (MUI's `colorSchemeSelector: "class"` keys the scheme off this
 *     class — see app/theme.ts), overriding the inherited `.dark` values.
 *   - the explicit light background gives the fixed-gray text a light surface
 *     instead of showing the dark app `bg-background` through transparent
 *     content regions.
 */
export default function IntegrationsLayout({ children }: { children: ReactNode }) {
  return <div className="light min-h-full bg-white text-gray-900">{children}</div>;
}
