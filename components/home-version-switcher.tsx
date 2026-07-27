"use client";

import { usePathname, useRouter } from "next/navigation";
import { APP_BASE } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

type HomeVersion = {
  id: string;
  label: string;
  href: string;
};

const HOME_VERSIONS: HomeVersion[] = [
  { id: "v1", label: "v1", href: APP_BASE },
  { id: "v2", label: "v2", href: `${APP_BASE}/v2` },
];

/**
 * Floating switcher between the home page versions.
 * Rendered on each home version so it stays reachable even when the
 * left navigation is hidden (as it is on v1).
 */
export function HomeVersionSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const current =
    HOME_VERSIONS.find((v) => v.href === pathname)?.id ?? "v1";

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 backdrop-blur px-1 py-1 shadow-sm">
      {HOME_VERSIONS.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => router.push(v.href)}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium transition-colors",
            current === v.id
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
