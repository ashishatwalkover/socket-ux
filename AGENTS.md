<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# UI conventions: MUI for components, Tailwind for layout

There is **one** component library — **MUI (`@mui/material` v9)** — and a shared theme in `app/theme.ts` that mirrors the design tokens in `app/globals.css`. shadcn/ui and Base UI have been removed; there is no `components/ui` folder. Do not reintroduce them, and do not hand-roll components out of raw HTML + Tailwind color classes.

**The boundary rule:**

- **Components come from MUI.** Buttons, inputs, selects, chips, cards, dialogs, menus, tables, etc. — import from `@mui/material`. Never build them from raw `<button>` / `<input>` / `<select>` styled with Tailwind. A component's *own* look (variant, color, size, states, elevation, radius, padding) is styled with MUI's `variant`/`color`/`size` props, the `sx` prop, or the theme — **not** Tailwind utility classes on the component root.
- **Layout comes from Tailwind.** Placement, spacing between elements, flex/grid, width/height of wrappers, responsive breakpoints, and one-off tweaks on plain `<div>`s. Put Tailwind classes on the wrapper *around* a MUI component, not on the component itself.
- Structural Tailwind classes MUI doesn't own (`w-full`, `mt-2`, `shrink-0`) are fine on a MUI root. Anything touching color / typography / radius / padding *inside* a component belongs in `sx`.

**Mapping reference** (what the old shadcn API became):

| Old | Now |
|---|---|
| `<Button variant="default">` | `<Button variant="contained">` |
| `<Button variant="outline">` | `<Button variant="outlined">` |
| `<Button variant="secondary">` | `<Button variant="contained" color="secondary">` |
| `<Button variant="ghost">` / `link` | `<Button variant="text">` |
| `<Button variant="destructive">` | `<Button variant="outlined" color="error">` |
| `<Button size="icon">` | `<IconButton>` |
| `size="sm"` / `"xs"` | `size="small"` |
| `<Input>` | `<TextField size="small">` (or `<InputBase>` when it must be borderless) |
| leading/trailing icon in a field | `slotProps={{ input: { startAdornment: <InputAdornment>… } }}` (MUI v9 dropped `InputProps`) |
| `<Badge>` (pill/label) | `<Chip size="small">` (not MUI `Badge`, which is a dot/count) |
| `<Card>` + sub-parts | `<Paper variant="outlined">` with Tailwind for inner spacing, or MUI `<Card>` |

**Setup facts:** the app-wide providers live in `app/providers.tsx` (`EmotionCacheProvider` + MUI `ThemeProvider`), wired in `app/layout.tsx`. There is **no `<CssBaseline />`** — Tailwind's preflight is the single CSS reset; do not add CssBaseline. The dark color scheme activates under the `.dark` class (same switch as Tailwind's `dark:`).
