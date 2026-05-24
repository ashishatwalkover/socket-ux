"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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
  action?: "command-palette";
};

const navigation: NavItem[] = [
  { name: "Search (Cmd+K)", href: "#search", icon: NavIcon.search, action: "command-palette" },
  { name: "Workflows", href: "/", icon: NavIcon.home, divider: true },
  { name: "Metrics", href: "/metrics", icon: NavIcon.metrics },
  { name: "Templates", href: "/templates", icon: NavIcon.templates },
  { name: "Connections", href: "/connections", icon: NavIcon.connections, dot: true },
  { name: "MCP Server", href: "/mcp-server", icon: NavIcon.mcp, divider: true },
  { name: "AI Agents", href: "/ai-agents", icon: NavIcon.ai },
  { name: "Memory", href: "/memory", icon: NavIcon.memory },
];

export function LeftNav() {
  const pathname = usePathname();

  if (pathname === "/flow-by-ai") return null;

  return (
    <nav className="w-64 bg-white text-gray-800 flex flex-col h-screen border-r border-gray-200">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
        <NavIcon.envelope />
        <span className="text-lg font-semibold tracking-wide">MSG91</span>
        <NavIcon.chevron className="text-gray-500" />
        <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
          (βeta)
        </span>
      </div>

      {/* <div className="p-3">
        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md transition-colors">
          <NavIcon.plus />
          <span className="text-sm tracking-wide">CREATE NEW FLOW</span>
        </button>
      </div> */}

      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        <div className="mt-2"></div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
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
              ) : (
                <Link href={item.href} className={itemClass}>
                  {inner}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-gray-200">
        <p className="text-[10px] text-gray-400 px-1">UX Preview Designs</p>
        <div className="mt-2 space-y-0.5">          
        </div>
      </div>
    </nav>
  );
}
