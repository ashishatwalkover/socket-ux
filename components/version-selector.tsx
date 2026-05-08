"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

type Version = {
  id: string;
  label: string;
  short: string;
  description: string;
  href: string;
};

const versions: Version[] = [
  {
    id: "v1",
    label: "v1",
    short: "Focus on flows",
    description:
      "Original Workflows Control Center layout focused entirely on listing and managing flows. Folders appear as a horizontal scrollable row at the top.",
    href: "/",
  },
  {
    id: "v2",
    label: "v2",
    short: "Collection in left nav",
    description:
      "Folder/collection navigation moved into the left navigation panel for persistent access. The main canvas focuses on flow content with two dedicated search inputs.",
    href: "/focus",
  },
];

export function VersionSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const current =
    versions.find((v) => v.href === pathname) ?? versions[0];
  const [selected, setSelected] = useState<Version>(current);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const match = versions.find((v) => v.href === pathname);
    if (match) setSelected(match);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="flex items-center gap-2" ref={ref}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent transition-colors"
        >
          <span className="font-semibold">{selected.label}</span>          
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <div className="absolute left-0 top-full mt-1 z-50 w-72 rounded-md border bg-popover shadow-md py-1">
            {versions.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setSelected(v);
                  setOpen(false);
                  router.push(v.href);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors ${
                  selected.id === v.id ? "bg-accent/50" : ""
                }`}
              >
                <span className="font-semibold">{v.label}</span>
                <span className="text-muted-foreground"> — {v.short}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        className="relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <button
          type="button"
          aria-label={`About ${selected.label}`}
          className="flex items-center justify-center w-6 h-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </button>

        {hover && (
          <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50 w-72 rounded-md bg-popover border shadow-lg p-3 text-xs text-popover-foreground">
            <div className="font-semibold mb-1">
              {selected.label} — {selected.short}
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {selected.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
