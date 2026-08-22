"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Drawer, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface AddStepItem {
  name: string;
  bg: string;
  label: string;
}

export interface AddStepSection {
  title: string;
  items: AddStepItem[];
}

export const DEFAULT_BUILT_IN_TOOLS: AddStepItem[] = [
  { name: "API Call",                        bg: "bg-gray-700",   label: "{}" },
  { name: "JS Code",                         bg: "bg-yellow-400", label: "JS" },
  { name: "Variable",                        bg: "bg-gray-200",   label: "" },
  { name: "Comment",                         bg: "bg-gray-500",   label: "💬" },
  { name: "Multiple Paths (If Conditions)",  bg: "bg-indigo-500", label: "Y" },
  { name: "Human Intervention",              bg: "bg-gray-600",   label: "👤" },
  { name: "Workspace Memory",                bg: "bg-amber-700",  label: "📚" },
  { name: "Flow in Flow",                    bg: "bg-gray-700",   label: "▦" },
  { name: "Delay",                           bg: "bg-gray-500",   label: "⏱" },
  { name: "Call AI Agent (Instant)",         bg: "bg-violet-500", label: "◇" },
  { name: "Call AI Agent (Background)",      bg: "bg-violet-500", label: "◇" },
  { name: "SMS",                             bg: "bg-blue-500",   label: "✉" },
  { name: "Loop",                            bg: "bg-teal-500",   label: "↻" },
];

export const DEFAULT_CONNECTED_APPS: AddStepItem[] = [
  { name: "Google Sheets",       bg: "bg-green-600",  label: "S"  },
  { name: "Google Forms",        bg: "bg-violet-600", label: "F"  },
  { name: "Gmail",               bg: "bg-red-500",    label: "M"  },
  { name: "Google Docs",         bg: "bg-blue-500",   label: "D"  },
  { name: "Google Drive",        bg: "bg-yellow-500", label: "△"  },
  { name: "Gtwy",                bg: "bg-gray-700",   label: "G"  },
  { name: "Google Calendar",     bg: "bg-blue-600",   label: "31" },
  { name: "Slack",               bg: "bg-pink-500",   label: "#"  },
  { name: "viaSocket utilities", bg: "bg-gray-700",   label: "vs" },
];

export const DEFAULT_ADD_STEP_SECTIONS: AddStepSection[] = [
  { title: "Built-In Tools",  items: DEFAULT_BUILT_IN_TOOLS  },
  { title: "Connected Apps",  items: DEFAULT_CONNECTED_APPS  },
];

export interface AddStepDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (item: AddStepItem, sectionTitle: string) => void;
  sections?: AddStepSection[];
  title?: string;
  searchPlaceholder?: string;
  width?: number;
  /** Changing this value (e.g. re-clicking the trigger) flashes the drawer and re-focuses search. */
  pulse?: number;
}

export function AddStepDrawer({
  open,
  onClose,
  onSelect,
  sections = DEFAULT_ADD_STEP_SECTIONS,
  title = "Add a Step",
  searchPlaceholder = "Search Apps",
  width = 360,
  pulse,
}: AddStepDrawerProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // On each pulse (trigger re-click), focus + select the search box and flash the drawer.
  useEffect(() => {
    if (!open || pulse == null) return;
    // Wait a frame so the drawer paper is mounted before focusing/animating.
    const id = requestAnimationFrame(() => {
      const input = inputRef.current;
      input?.focus();
      input?.select();
      const el = contentRef.current;
      if (el) {
        el.classList.remove("flow-drawer-blink");
        void el.offsetWidth; // restart the animation
        el.classList.add("flow-drawer-blink");
      }
    });
    return () => cancelAnimationFrame(id);
  }, [pulse, open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map(s => ({ ...s, items: s.items.filter(i => i.name.toLowerCase().includes(q)) }))
      .filter(s => s.items.length > 0);
  }, [query, sections]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      hideBackdrop
      slotProps={{
        paper: { sx: { width, bgcolor: "#ffffff", color: "#111827", pointerEvents: "auto" } },
        root: { sx: { pointerEvents: "none" } },
      }}
    >
      <div ref={contentRef} className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="text-base font-semibold text-gray-900">{title}</span>
        <IconButton size="small" onClick={onClose} sx={{ color: "#6b7280" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      <div className="px-4 py-3">
        <TextField
          size="small"
          fullWidth
          autoFocus
          inputRef={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#ffffff",
              fontSize: "0.875rem",
              "& fieldset": { borderColor: "#3b82f6" },
              "&:hover fieldset": { borderColor: "#3b82f6" },
              "&.Mui-focused fieldset": { borderColor: "#3b82f6", borderWidth: "1px" },
            },
            "& .MuiOutlinedInput-input": { color: "#111827" },
          }}
        />
      </div>
      <div className="flex-1 overflow-y-auto pb-6">
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-sm text-gray-500 text-center">No matches found.</p>
        )}
        {filtered.map((section, idx) => (
          <div key={section.title} className={`px-4 ${idx === 0 ? "" : "mt-4"}`}>
            <p className="text-xs text-gray-500 font-medium mt-2 mb-2">{section.title}</p>
            <ul>
              {section.items.map(item => (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() => onSelect?.(item, section.title)}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-100 transition-colors text-left"
                  >
                    <span className={`w-7 h-7 rounded-md ${item.bg} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>
                      {item.label}
                    </span>
                    <span className="text-sm text-gray-800">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      </div>
    </Drawer>
  );
}
