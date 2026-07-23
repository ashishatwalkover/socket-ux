"use client";

import Link from "next/link";
import { APP_BASE } from "@/lib/app-routes";

const PLUG_BUILDER_VERSIONS: { key: "v1" | "v2"; href: string }[] = [
  { key: "v1", href: `${APP_BASE}/components/ai-plug-builder` },
  { key: "v2", href: `${APP_BASE}/components/ai-plug-builder/v2` },
];

/**
 * Pill switcher for the AI Plug Builder versions. Highlights whichever version
 * is active. Shared between the blank v1 and the current-design v2.
 */
export function PlugBuilderVersionNav({ current }: { current: "v1" | "v2" }) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-neutral-200 bg-neutral-100 p-0.5">
      {PLUG_BUILDER_VERSIONS.map((version) => (
        <Link
          key={version.key}
          href={version.href}
          aria-current={current === version.key ? "page" : undefined}
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
            current === version.key
              ? "bg-neutral-900 text-white shadow-sm"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          {version.key}
        </Link>
      ))}
    </div>
  );
}
