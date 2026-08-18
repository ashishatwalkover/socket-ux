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

function PrototypeHeaderInner() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const controls = PROTOTYPE_CONTROLS[pathname] ?? [];

  // Dragging: while pos is null the bar stays centered (default); the first drag
  // pins it to an absolute x/y that the user can then move anywhere on screen.
  // Window-level listeners are used so a drag keeps tracking even if the cursor
  // outruns the small handle.
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

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
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/95 px-2 py-1.5 text-white shadow-lg backdrop-blur">
        <button
          type="button"
          onMouseDown={startDrag}
          className="flex cursor-grab touch-none items-center rounded-full px-0.5 text-white/40 hover:text-white/70 active:cursor-grabbing"
          title="Drag to move"
          aria-label="Drag prototype toolbar"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <circle cx="9" cy="6" r="1.4" /><circle cx="15" cy="6" r="1.4" />
            <circle cx="9" cy="12" r="1.4" /><circle cx="15" cy="12" r="1.4" />
            <circle cx="9" cy="18" r="1.4" /><circle cx="15" cy="18" r="1.4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-1.5 rounded-full px-1.5 text-[10px] font-semibold uppercase tracking-widest text-amber-300"
          title="Prototype tools"
        >
          <span className="inline-block size-1.5 rounded-full bg-amber-400" />
          Proto
        </button>

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

        {!collapsed && controls.length > 0 && (
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
