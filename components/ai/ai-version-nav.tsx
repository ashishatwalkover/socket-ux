"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AI_VERSIONS: { key: string; label: string; href: string }[] = [
  { key: "classic", label: "Version1", href: "/ai2" },
  { key: "fresh", label: "Version2", href: "/ai" },
  { key: "studio", label: "Version3", href: "/ai3" },
  { key: "split", label: "Version4", href: "/ai4" },
  { key: "canvas", label: "Version5", href: "/ai5" },
];

/**
 * Pill switcher for the AI flow versions. Highlights whichever route is active.
 * Shared across /ai, /ai2 and /ai3 so you can hop between versions from any of them.
 */
export function AiVersionNav() {
  const pathname = usePathname();

  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-gray-200 bg-gray-100 p-0.5">
      {AI_VERSIONS.map((version) => {
        const isActive = pathname === version.href;
        return (
          <Link
            key={version.key}
            href={version.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {version.label}
          </Link>
        );
      })}
    </div>
  );
}
