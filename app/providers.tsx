"use client"

import * as React from "react"
import { ThemeProvider } from "@mui/material/styles"

import EmotionCacheProvider from "./emotion-cache"
import { theme } from "./theme"

/**
 * Global client providers. Note: no <CssBaseline /> — Tailwind's preflight is
 * the app's single CSS reset (globals.css imports "tailwindcss"). Adding
 * CssBaseline would run a second, conflicting reset. See AGENTS.md.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmotionCacheProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </EmotionCacheProvider>
  )
}
