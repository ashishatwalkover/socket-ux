"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AI_BASE, APP_BASE, isAiRoute, isAppRoute, isWebRoute } from "@/lib/app-routes";
import { designComponents } from "@/lib/design-components";
import { cn } from "@/lib/utils";

const FULL_BLEED_ROUTES = [
  `${APP_BASE}/flow-by-ai`,
  `${APP_BASE}/components/onboarding`,
];

function isFlowRoute(pathname: string): boolean {
  return pathname.startsWith(`${APP_BASE}/flows/`);
}

function isNavActive(pathname: string, href: string): boolean {
  if (href === APP_BASE) return isAppRoute(pathname);
  if (href === AI_BASE) return isAiRoute(pathname);
  return pathname === href;
}

const NavIcon = {
  home: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12l9-9 9 9"/><path d="M5 10v10a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V10"/>
    </svg>
  ),
  search: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
    </svg>
  ),
  metrics: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="6" y1="20" x2="6" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="18" y1="20" x2="18" y2="14"/>
    </svg>
  ),
  connections: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"/>
    </svg>
  ),
  mcp: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  ),
  ai: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
      <path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9L19 14z"/>
    </svg>
  ),
  memory: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
      <polyline points="12 12 12 16"/><polyline points="10 14 12 12 14 14"/>
    </svg>
  ),
  templates: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 4 4 18 20 18 12 4"/><circle cx="7" cy="18" r="2"/>
    </svg>
  ),
  plus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  chevron: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  envelope: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
      <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z" fill="#fff"/>
      <path d="M4 6l8 6 8-6v1l-8 6-8-6V6z" fill="#1e7fff"/>
      <path d="M4 7l8 6 8-6v12H4V7z" fill="#0d6efd" opacity="0.85"/>
    </svg>
  ),
};

type NavItem = {
  name: string;
  href: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  divider?: boolean;
  dot?: boolean;
  action?: "command-palette" | "components";
};

const navigation: NavItem[] = [
  { name: "Search (Cmd+K)", href: "#search", icon: NavIcon.search, action: "command-palette" },
  { name: "Home", href: APP_BASE, icon: NavIcon.home, divider: true },
  { name: "Workflows", href: `${APP_BASE}/workflows`, icon: NavIcon.templates},
  { name: "AI", href: AI_BASE, icon: NavIcon.ai },
  { name: "Metrics", href: `${APP_BASE}/metrics`, icon: NavIcon.metrics },
  { name: "Templates", href: `${APP_BASE}/templates`, icon: NavIcon.templates },
  { name: "Connections", href: `${APP_BASE}/connections`, icon: NavIcon.connections, dot: true },
  { name: "MCP Server", href: `${APP_BASE}/mcp-server`, icon: NavIcon.mcp, divider: true },
  { name: "AI Agents", href: `${APP_BASE}/ai-agents`, icon: NavIcon.ai },
  { name: "Memory", href: `${APP_BASE}/memory`, icon: NavIcon.memory },
];

export function LeftNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [betaMode, setBetaMode] = useState(true);
  const [componentsView, setComponentsView] = useState(false);
  const [componentsSearch, setComponentsSearch] = useState("");
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Hide on the new home experiments (v1, v3). The v2 duplicate keeps the nav.
  const isNewHome = pathname === APP_BASE || pathname === `${APP_BASE}/v3`;
  if (isNewHome || FULL_BLEED_ROUTES.includes(pathname) || isAiRoute(pathname) || isWebRoute(pathname) || isFlowRoute(pathname)) return null;

  const menuItems = [
    { icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="11" r="3"/><path d="M7 19c1-2 3-3 5-3s4 1 5 3"/></svg>
    ), label: "Switch Workspace" },
    { icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    ), label: "Workspace Settings" },
    { icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ), label: "Members" },
    { icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
    ), label: "Billing", href: `${APP_BASE}/billing`, active: true },
    { icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
    ), label: "Notifications" },
  ];

  return (
    <nav className="w-64 bg-white text-gray-800 flex flex-col h-screen border-r border-gray-200">
      <div className="relative border-b border-gray-200" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <NavIcon.envelope />
          <span className="text-lg font-semibold tracking-wide">MSG91</span>
          <NavIcon.chevron className={cn("text-gray-500 transition-transform", menuOpen && "rotate-180")} />
          <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
            (βeta)
          </span>
        </button>

        {menuOpen && (
          <div className="absolute top-full left-3 right-3 mt-1 bg-[#2b333c] text-white rounded-lg shadow-2xl z-50 overflow-hidden py-2">
            {menuItems.map((item) => {
              const cls = cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors",
                item.active ? "bg-[#3d4650]" : "hover:bg-white/5"
              );
              const inner = (
                <>
                  <span className="text-gray-300">{item.icon}</span>
                  <span>{item.label}</span>
                </>
              );
              return item.href ? (
                <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className={cls}>
                  {inner}
                </Link>
              ) : (
                <button key={item.label} className={cls}>
                  {inner}
                </button>
              );
            })}

            <button
              onClick={() => { setComponentsView(true); setMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/5"
            >
              <span className="text-gray-300">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </span>
              <span>Components</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors">
              <span className="text-gray-300">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6l1 4h4v4l-2 1v6l-4 3H10l-4-3v-6L4 11V7h4l1-4z"/><path d="M12 8v6"/></svg>
              </span>
              <span>Beta Mode</span>
              <button
                onClick={(e) => { e.stopPropagation(); setBetaMode(!betaMode); }}
                className={cn(
                  "ml-auto relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                  betaMode ? "bg-blue-500" : "bg-gray-500"
                )}
              >
                <span className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  betaMode ? "translate-x-4" : "translate-x-0.5"
                )} />
              </button>
            </button>

            <div className="my-2 border-t border-white/10" />

            <button
              onClick={() => setDevToolsOpen((o) => !o)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors"
            >
              <span className="text-gray-300">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="5" cy="5" r="1.5"/><circle cx="12" cy="5" r="1.5"/><circle cx="19" cy="5" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="19" r="1.5"/><circle cx="12" cy="19" r="1.5"/><circle cx="19" cy="19" r="1.5"/></svg>
              </span>
              <span>Developer Tools</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("ml-auto text-gray-300 transition-transform", devToolsOpen ? "rotate-90" : "")}><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            {devToolsOpen && (
              <div className="pb-1">
                <Link
                  href={`${APP_BASE}/components/plug-builder`}
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-3 py-2 pl-11 pr-4 text-sm text-left text-gray-200 hover:bg-white/5 transition-colors"
                >
                  <span className="text-gray-400">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  </span>
                  <span>Plug Builder</span>
                </Link>
              </div>
            )}

            <div className="my-2 border-t border-white/10" />

            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors">
              <span className="text-gray-300">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><circle cx="19" cy="19" r="2"/></svg>
              </span>
              <span>Profile Settings</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors">
              <span className="text-gray-300">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
              </span>
              <span>Refer & Earn</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors">
              <span className="text-gray-300">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* <div className="p-3">
        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md transition-colors">
          <NavIcon.plus />
          <span className="text-sm tracking-wide">CREATE NEW FLOW</span>
        </button>
      </div> */}

      {componentsView ? (
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setComponentsView(false); setComponentsSearch(""); }}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
              aria-label="Back"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="relative flex-1">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              <input
                type="text"
                autoFocus
                value={componentsSearch}
                onChange={(e) => setComponentsSearch(e.target.value)}
                placeholder="Search components..."
                className="w-full pl-7 pr-2 py-1.5 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
            {designComponents
              .filter((c) => c.name.toLowerCase().includes(componentsSearch.toLowerCase()))
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    target={item.openInNewWindow ? "_blank" : undefined}
                    rel={item.openInNewWindow ? "noopener noreferrer" : undefined}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <span className="truncate">{item.name}</span>
                    {item.status && (
                      <span className="ml-auto text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full border border-amber-200">
                        {item.status}
                      </span>
                    )}
                  </Link>
                );
              })}
            {designComponents.filter((c) => c.name.toLowerCase().includes(componentsSearch.toLowerCase())).length === 0 && (
              <p className="text-xs text-gray-400 px-3 py-4 text-center">No components found</p>
            )}
          </div>
        </div>
      ) : (
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        <div className="mt-2"></div>
        {navigation.map((item) => {
          const isActive = isNavActive(pathname, item.href);
          const Icon = item.icon;
          const itemClass = cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors relative w-full text-left",
            isActive
              ? "bg-gray-100 text-gray-900 font-medium"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          );
          const inner = (
            <>
              <span className="relative flex-shrink-0">
                <Icon />
                {item.dot && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </span>
              <span>{item.name}</span>
              {item.action === "command-palette" && (
                <kbd className="ml-auto text-[10px] bg-gray-100 text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded">
                  ⌘K
                </kbd>
              )}
            </>
          );
          return (
            <div key={item.href}>
              {item.divider && (
                <div className="my-2 border-t border-gray-200" />
              )}
              {item.action === "command-palette" ? (
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
                  className={itemClass}
                >
                  {inner}
                </button>
              ) : item.action === "components" ? (
                <button
                  type="button"
                  onClick={() => setComponentsView(true)}
                  className={itemClass}
                >
                  {inner}
                </button>
              ) : (
                <Link href={item.href} className={itemClass}>
                  {inner}
                </Link>
              )}
            </div>
          );
        })}
      </div>
      )}

    </nav>
  );
}
