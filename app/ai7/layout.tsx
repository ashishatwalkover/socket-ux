import type { ReactNode } from "react";

/**
 * V7 is a light-only surface. The app shell can render under the system `.dark`
 * color scheme, which flips MUI's palette (Chip, Button, TextField…) to dark
 * text while V7's hand-written Tailwind grays stay light — MUI labels then
 * render near-white on white and disappear.
 *
 * `light` re-declares MUI's palette CSS variables as light for the whole
 * subtree (MUI's `colorSchemeSelector: "class"` keys off this class — see
 * app/theme.ts), overriding the inherited `.dark` values.
 */
export default function Ai7Layout({ children }: { children: ReactNode }) {
  return <div className="light h-full bg-white text-gray-900">{children}</div>;
}
