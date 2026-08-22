import { createTheme } from "@mui/material/styles"

/**
 * MUI theme — the single source of truth for component styling (color, type,
 * shape, elevation). Values mirror the design tokens in app/globals.css so
 * MUI-driven regions and Tailwind-driven layout share one visual language.
 *
 * Rules of the road (see AGENTS.md):
 *   - Color / typography / component look  -> here (or `sx` on the component).
 *   - Layout / spacing / placement         -> Tailwind utility classes.
 *
 * `cssVariables.colorSchemeSelector: "class"` makes the dark scheme activate
 * under the `.dark` class — the same switch Tailwind's `dark:` variant uses —
 * so a single class toggle drives both systems.
 *
 * The neutral (grayscale) palette matches Tailwind's `neutral` scale, which is
 * exactly what the shadcn `neutral` base tokens in globals.css resolve to.
 */
export const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  // Match Tailwind's breakpoints so responsive props agree across both systems.
  breakpoints: {
    values: { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280 },
  },
  // Border radius intentionally left at MUI's default (4px) — the theme will be
  // customized later.
  typography: {
    fontFamily: "var(--font-sans)",
    // shadcn buttons are sentence-case and medium weight, not MUI's uppercase.
    button: { textTransform: "none", fontWeight: 500 },
  },
  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        primary: { main: "#171717", contrastText: "#fafafa" }, // --primary
        secondary: { main: "#f5f5f5", contrastText: "#171717" }, // --secondary
        error: { main: "#dc2626" }, // --destructive
        background: { default: "#ffffff", paper: "#ffffff" }, // --background / --card
        text: { primary: "#0a0a0a", secondary: "#737373" }, // --foreground / --muted-foreground
        divider: "#e5e5e5", // --border
      },
    },
    dark: {
      palette: {
        mode: "dark",
        primary: { main: "#e5e5e5", contrastText: "#171717" },
        secondary: { main: "#262626", contrastText: "#fafafa" },
        error: { main: "#ef4444" },
        background: { default: "#0a0a0a", paper: "#171717" },
        text: { primary: "#fafafa", secondary: "#a3a3a3" },
        divider: "rgba(255,255,255,0.10)",
      },
    },
  },
})
