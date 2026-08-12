"use client";

import Link from "next/link";
import { APP_BASE } from "@/lib/app-routes";

type VersionKey = "v1" | "v2" | "v3" | "v4";

const ACTIVITY_LOG_VERSIONS: { key: VersionKey; href: string }[] = [
  { key: "v1", href: `${APP_BASE}/components/activity-log` },
  { key: "v2", href: `${APP_BASE}/components/activity-log/v2` },
  { key: "v3", href: `${APP_BASE}/components/activity-log/v3` },
  { key: "v4", href: `${APP_BASE}/components/activity-log/v4` },
];

/**
 * Pill switcher for the Activity Log versions. Highlights whichever version is
 * active. Shared between the v1 (timeline) and v2 (card feed) designs.
 */
export function ActivityLogVersionNav({
  current,
  tone = "dark",
}: {
  current: VersionKey;
  /** "dark" = light pill for dark canvases (v1); "light" = dark pill for light canvases (v2). */
  tone?: "dark" | "light";
}) {
  const wrap =
    tone === "dark"
      ? "border-white/15 bg-black/30 backdrop-blur"
      : "border-slate-200 bg-white";
  const active =
    tone === "dark"
      ? "bg-white text-neutral-900 shadow-sm"
      : "bg-slate-900 text-white shadow-sm";
  const inactive =
    tone === "dark"
      ? "text-white/60 hover:text-white"
      : "text-slate-500 hover:text-slate-900";

  return (
    <div className={`inline-flex items-center gap-0.5 rounded-full border p-0.5 ${wrap}`}>
      {ACTIVITY_LOG_VERSIONS.map((version) => (
        <Link
          key={version.key}
          href={version.href}
          aria-current={current === version.key ? "page" : undefined}
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
            current === version.key ? active : inactive
          }`}
        >
          {version.key}
        </Link>
      ))}
    </div>
  );
}
