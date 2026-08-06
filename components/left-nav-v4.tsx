"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_BASE } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

const BRAND = "#a8200c";

type Item = {
  name: string;
  href: string;
  icon: React.ReactNode;
  section?: "top" | "bottom";
};

const Icon = {
  home: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l9-9 9 9" />
      <path d="M5 10v10a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V10" />
    </svg>
  ),
  workers: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3" />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    </svg>
  ),
  templates: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  metrics: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="20" x2="6" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="18" y1="20" x2="18" y2="14" />
    </svg>
  ),
  connections: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M7.7 7.6l3.2 8.1M16.3 7.6l-3.2 8.1" />
    </svg>
  ),
  agents: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2 4 4 .6-3 3 .8 4.4L12 12l-3.8 2 .8-4.4-3-3L10 6l2-4z" />
    </svg>
  ),
  memory: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4H9z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.4 16.94l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.06 4.4l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.16.678.394.923.687" />
    </svg>
  ),
  help: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

const items: Item[] = [
  { name: "Home", href: `${APP_BASE}/v4`, icon: Icon.home, section: "top" },
  { name: "Workers", href: `${APP_BASE}/v4/workers`, icon: Icon.workers, section: "top" },
  { name: "Templates", href: `${APP_BASE}/v4/templates`, icon: Icon.templates, section: "top" },
  { name: "Metrics", href: `${APP_BASE}/v4/metrics`, icon: Icon.metrics, section: "top" },
  { name: "Connections", href: `${APP_BASE}/v4/connections`, icon: Icon.connections, section: "top" },
  { name: "AI Agents", href: `${APP_BASE}/v4/ai-agents`, icon: Icon.agents, section: "top" },
  { name: "Memory", href: `${APP_BASE}/v4/memory`, icon: Icon.memory, section: "top" },
  { name: "Settings", href: `${APP_BASE}/v4/settings`, icon: Icon.settings, section: "bottom" },
  { name: "Help", href: `${APP_BASE}/v4/help`, icon: Icon.help, section: "bottom" },
];

export function LeftNavV4() {
  const pathname = usePathname();

  const top = items.filter((i) => i.section === "top");
  const bottom = items.filter((i) => i.section === "bottom");

  const renderItem = (item: Item) => {
    const active =
      item.href === `${APP_BASE}/v4`
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-neutral-100 text-neutral-900"
            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
        )}
      >
        <span
          className={cn(
            active ? "text-neutral-900" : "text-neutral-500",
          )}
        >
          {item.icon}
        </span>
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <nav className="flex h-screen w-60 shrink-0 flex-col border-r border-neutral-200 bg-white">
      {/* Brand */}
      <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-4">
        <span
          aria-hidden
          className="inline-block size-2.5 rounded-full"
          style={{ backgroundColor: BRAND }}
        />
        <span className="text-base font-semibold tracking-tight text-neutral-900">
          viaSocket
        </span>
        <span className="ml-auto rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
          v4
        </span>
      </div>

      {/* Primary items */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <div className="space-y-0.5">{top.map(renderItem)}</div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-neutral-200 px-2 py-3">
        <div className="space-y-0.5">{bottom.map(renderItem)}</div>
      </div>

      {/* User */}
      <div className="flex items-center gap-3 border-t border-neutral-200 px-4 py-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
          AY
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-neutral-900">
            Ashish
          </div>
          <div className="truncate text-xs text-neutral-500">
            ashish@walkover.in
          </div>
        </div>
      </div>
    </nav>
  );
}
