"use client";

import { Suspense, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { APP_BASE } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

/**
 * Prototype header — a global dev-tool overlay, NOT part of the product UI.
 *
 * It is mounted once in the root layout and appears on every route, but adapts
 * to the current page: each route can register "switches" (segmented toggles)
 * that drive prototype state through the URL (e.g. ?state=empty), so the state
 * is decoupled from the page and shareable via link.
 *
 * To give a route its own controls, add an entry to PROTOTYPE_CONTROLS below.
 */

type PrototypeSwitch = {
  /** URL search-param this switch reads/writes. */
  param: string;
  /** Short label shown before the options. */
  label: string;
  defaultValue: string;
  options: { value: string; label: string }[];
};

/**
 * Version groups — routes that are alternate designs of the same page. When the
 * current route belongs to a group, the chip shows pills to hop between them.
 * (Consolidates the old standalone HomeVersionSwitcher / AiVersionNav / etc.)
 */
type VersionGroup = { id: string; versions: { label: string; href: string }[] };

const PROTOTYPE_VERSIONS: VersionGroup[] = [
  {
    id: "app-home",
    versions: [
      { label: "v1", href: APP_BASE },
      { label: "v2", href: `${APP_BASE}/v2` },
      { label: "v3", href: `${APP_BASE}/v3` },
      { label: "v4", href: `${APP_BASE}/v4` },
    ],
  },
  {
    id: "ai",
    versions: [
      { label: "v1", href: "/ai2" },
      { label: "v2", href: "/ai" },
      { label: "v3", href: "/ai3" },
      { label: "v4", href: "/ai4" },
      { label: "v5", href: "/ai5" },
      { label: "v6", href: "/ai6" },
    ],
  },
  {
    id: "activity-log",
    versions: [
      { label: "v1", href: `${APP_BASE}/components/activity-log` },
      { label: "v2", href: `${APP_BASE}/components/activity-log/v2` },
      { label: "v3", href: `${APP_BASE}/components/activity-log/v3` },
      { label: "v4", href: `${APP_BASE}/components/activity-log/v4` },
    ],
  },
];

const PROTOTYPE_CONTROLS: Record<string, PrototypeSwitch[]> = {
  "/app/connections": [
    {
      param: "state",
      label: "Data",
      defaultValue: "with-data",
      options: [
        { value: "with-data", label: "With data" },
        { value: "empty", label: "Empty" },
      ],
    },
  ],
  "/app/refer": [
    {
      param: "state",
      label: "Referrals",
      defaultValue: "with-data",
      options: [
        { value: "with-data", label: "Referred" },
        { value: "empty", label: "None yet" },
      ],
    },
  ],
};

function SegmentedSwitch({ control }: { control: PrototypeSwitch }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get(control.param) ?? control.defaultValue;

  const select = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === control.defaultValue) next.delete(control.param);
    else next.set(control.param, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wide text-white/40">
        {control.label}
      </span>
      <div className="flex items-center gap-0.5 rounded-full bg-white/10 p-0.5">
        {control.options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => select(o.value)}
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors",
              current === o.value ? "bg-white text-slate-900" : "text-white/70 hover:text-white"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function VersionSwitch({ group, pathname }: { group: VersionGroup; pathname: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wide text-white/40">
        Version
      </span>
      <div className="flex items-center gap-0.5 rounded-full bg-white/10 p-0.5">
        {group.versions.map((v) => (
          <button
            key={v.href}
            type="button"
            onClick={() => router.push(v.href)}
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors",
              v.href === pathname ? "bg-white text-slate-900" : "text-white/70 hover:text-white"
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PrototypeHeaderInner() {
  const pathname = usePathname();
  const controls = PROTOTYPE_CONTROLS[pathname] ?? [];
  const versionGroup = PROTOTYPE_VERSIONS.find((g) =>
    g.versions.some((v) => v.href === pathname)
  );

  // Dragging: while pos is null the bar stays centered (default); the first drag
  // pins it to an absolute x/y that the user can then move anywhere on screen.
  // Window-level listeners are used so a drag keeps tracking even if the cursor
  // outruns the small handle.
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;

    const move = (ev: MouseEvent) => {
      const w = containerRef.current?.offsetWidth ?? 0;
      const h = containerRef.current?.offsetHeight ?? 0;
      const x = Math.max(4, Math.min(ev.clientX - dx, window.innerWidth - w - 4));
      const y = Math.max(4, Math.min(ev.clientY - dy, window.innerHeight - h - 4));
      setPos({ x, y });
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div
      ref={containerRef}
      className={cn("fixed z-[100]", pos ? "" : "left-1/2 top-3 -translate-x-1/2")}
      style={pos ? { left: pos.x, top: pos.y } : undefined}
    >
      <div
        onMouseDown={startDrag}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative flex cursor-grab touch-none items-center gap-2 rounded-full border border-white/10 bg-slate-900/95 px-2 py-1.5 text-white shadow-lg backdrop-blur active:cursor-grabbing"
        title="Drag to move"
      >
        {showTooltip && (
          <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950 px-3 py-1.5 text-[11px] font-medium text-amber-100 shadow-lg border border-white/10 pointer-events-none">
            Drag anywhere to move
          </div>
        )}
        <span className="flex items-center gap-1.5 rounded-full px-1.5 text-[10px] font-semibold uppercase tracking-widest text-amber-300">
          <span className="inline-block size-1.5 rounded-full bg-amber-400" />
          Not a part of UI
        </span>

        <Link
          href={APP_BASE}
          className="flex size-6 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          title="Go to home"
          aria-label="Go to home"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12l9-9 9 9" /><path d="M5 10v10a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V10" />
          </svg>
        </Link>

        {versionGroup && (
          <>
            <span className="h-4 w-px bg-white/15" />
            <VersionSwitch group={versionGroup} pathname={pathname} />
          </>
        )}

        {controls.length > 0 && (
          <>
            <span className="h-4 w-px bg-white/15" />
            {controls.map((c) => (
              <SegmentedSwitch key={c.param} control={c} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export function PrototypeHeader() {
  return (
    <Suspense fallback={null}>
      <PrototypeHeaderInner />
    </Suspense>
  );
}
