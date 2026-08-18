"use client";

// Connections page — CTAs are inert by design. Empty/with-data state comes from
// the global PrototypeHeader via the `state` URL param.
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LuKey, LuUnplug, LuEye, LuShieldCheck } from "react-icons/lu";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";
import {
  SAMPLE_CONNECTIONS,
  TRUST_SIGNALS,
  type BrandIcon,
  type Connection,
} from "@/lib/connections-data";

/* ─────────────────────────── Icons ─────────────────────────── */
const Icon = {
  plus: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
  ),
  search: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
  ),
  sparkles: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" /></svg>
  ),
  shield: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z" /><path d="M9 12l2 2 4-4" /></svg>
  ),
  arrowRight: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
  ),
  alert: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10.3 3.9l-8 13.9A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.2l-8-13.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4" /><circle cx="12" cy="17" r="1" /></svg>
  ),
  chevron: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="9 18 15 12 9 6" /></svg>
  ),
  link: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" /></svg>
  ),
};

const TRUST_ICON: Record<string, IconType> = {
  key: LuKey,
  unplug: LuUnplug,
  eye: LuEye,
  lock: LuShieldCheck,
};

/* ─────────────────────────── Brand avatar ─────────────────────────── */
function BrandAvatar({ brand, size = 32 }: { brand: BrandIcon; size?: number }) {
  const style = { width: size, height: size };
  if (brand.letter) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-lg font-bold text-white"
        style={{ ...style, backgroundColor: brand.color, fontSize: size * 0.5 }}
      >
        {brand.letter}
      </span>
    );
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-lg bg-slate-100"
      style={{ ...style, fontSize: size * 0.55 }}
    >
      {brand.emoji}
    </span>
  );
}

/* ─────────────────────────── Trust strip ─────────────────────────── */
function TrustStrip() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center justify-center gap-2 border-b border-slate-200 pb-3 text-slate-700">
        <Icon.shield className="size-4 text-emerald-600" />
        <span className="text-xs font-semibold">Connecting is safe and reversible</span>
      </div>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_SIGNALS.map((s) => {
          const SignalIcon = TRUST_ICON[s.icon];
          return (
            <div key={s.title} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                <SignalIcon className="size-5" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-medium text-slate-800">{s.title}</div>
                <div className="text-[11px] leading-snug text-slate-500">{s.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────── Header ─────────────────────────── */
function PageHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-slate-900">Connections</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
          Connections are the keys that let your flows sign in to your apps.{" "}
          <span className="font-medium text-slate-800">On their own they don&apos;t do anything</span> — a
          flow has to use them. Add them as you build.
        </p>
      </div>
      <button
        type="button"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        <Icon.plus className="size-4" />
        Connect new app
      </button>
    </div>
  );
}

/* ═══════════════════════════ EMPTY STATE ═══════════════════════════ */
function EmptyState() {
  return (
    <div className="space-y-8">
      <PageHeader />

      <TrustStrip />

      {/* Reframe: connecting is step 1 of 2, the flow is what does the work */}
      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex w-fit items-center gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <span className="flex size-12 items-center justify-center rounded-xl border-2 border-blue-200 bg-blue-50 text-blue-600">
                <Icon.link className="size-5" />
              </span>
              <span className="text-[11px] font-medium text-slate-500">1 · Connect</span>
            </div>
            <span className="mb-5 text-slate-300">
              <Icon.arrowRight className="size-5" />
            </span>
            <div className="flex flex-col items-center gap-1.5">
              <span className="flex size-12 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-400">
                <Icon.sparkles className="size-5" />
              </span>
              <span className="text-[11px] font-medium text-slate-500">2 · Flow runs it</span>
            </div>
          </div>

          <h2 className="mt-6 text-lg font-semibold text-slate-900">
            No connections yet — and that&apos;s fine
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            A connection is just the key to an app — nothing runs until a flow uses it. Connect one now,
            or skip it: your flow will ask you to connect an app the moment it needs one.
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Icon.plus className="size-4" />
            Connect new app
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ POPULATED STATE ═══════════════════════════ */
type FilterKey = "all" | "in-use" | "idle" | "expired";

function UsageCell({ conn }: { conn: Connection }) {
  if (conn.usedInFlows === 0) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700"
        title="This connection isn't powering anything yet"
      >
        <span className="size-1.5 rounded-full bg-amber-500" />
        Not used yet
      </span>
    );
  }
  return (
    <div className="flex items-center gap-1.5" title={conn.flowNames.join(", ")}>
      <span className="size-1.5 rounded-full bg-emerald-500" />
      <span className="text-xs text-slate-700">
        Powers{" "}
        <span className="font-semibold text-slate-900">
          {conn.usedInFlows} {conn.usedInFlows === 1 ? "flow" : "flows"}
        </span>
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: Connection["status"] }) {
  if (status === "expired") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
        <span className="size-1.5 rounded-full bg-red-500" />
        Expired
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
      <span className="size-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  );
}

function PopulatedState() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const stats = useMemo(() => {
    const total = SAMPLE_CONNECTIONS.length;
    const idle = SAMPLE_CONNECTIONS.filter((c) => c.usedInFlows === 0).length;
    const expired = SAMPLE_CONNECTIONS.filter((c) => c.status === "expired").length;
    const flowsPowered = new Set(
      SAMPLE_CONNECTIONS.flatMap((c) => c.flowNames)
    ).size;
    return { total, inUse: total - idle, idle, expired, flowsPowered };
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SAMPLE_CONNECTIONS.filter((c) => {
      if (filter === "in-use" && c.usedInFlows === 0) return false;
      if (filter === "idle" && c.usedInFlows !== 0) return false;
      if (filter === "expired" && c.status !== "expired") return false;
      if (!q) return true;
      return (
        c.app.toLowerCase().includes(q) ||
        c.account.toLowerCase().includes(q) ||
        (c.title ?? "").toLowerCase().includes(q)
      );
    });
  }, [query, filter]);

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: stats.total },
    { key: "in-use", label: "In use", count: stats.inUse },
    { key: "idle", label: "Idle", count: stats.idle },
    { key: "expired", label: "Expired", count: stats.expired },
  ];

  return (
    <div className="space-y-6">
      <PageHeader />

      {/* Reality-check banner — the core nudge for "connections mistaken for the product" */}
      {stats.idle > 0 && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <Icon.alert className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-900">
              {`${stats.idle} of your ${stats.total} connections aren't doing anything yet`}
            </div>
            <div className="mt-0.5 text-xs leading-relaxed text-slate-600">
              Connecting an app just hands over the keys — nothing runs until a flow uses it. Build a flow
              to put these to work.
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Icon.search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search connections…"
            className="w-64 rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400"
          />
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f.key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {f.label}
              <span className={cn("ml-1.5 tabular-nums", filter === f.key ? "text-white/70" : "text-slate-400")}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Application</th>
                <th className="px-5 py-3">Connection</th>
                <th className="px-5 py-3">Used in</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Connected on</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr
                  key={c.id}
                  className={cn(
                    "border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/60",
                    c.usedInFlows === 0 && "bg-amber-50/30"
                  )}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <BrandAvatar brand={c.brand} size={32} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900">{c.app}</div>
                        <div className="truncate text-xs text-slate-400">
                          {c.title ?? "No title"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-sm text-slate-700">{c.account}</div>
                    <div className="text-xs text-slate-400">by {c.connectedBy}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <UsageCell conn={c} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 tabular-nums">{c.connectedOn}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                      <Icon.chevron className="size-4 -rotate-90" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <div className="px-5 py-12 text-center">
            <div className="text-sm font-medium text-slate-700">No connections match this view</div>
            <div className="mt-1 text-xs text-slate-500">Try a different filter or search term.</div>
          </div>
        )}
      </div>

      <TrustStrip />
    </div>
  );
}

/* ═══════════════════════════ Page + state toggle ═══════════════════════════ */
/**
 * The empty / with-data state is driven by the global PrototypeHeader through
 * the `state` URL param, so the switch lives in the prototype toolbar, not here.
 */
function ConnectionsPageInner() {
  const params = useSearchParams();
  const view = params.get("state") === "empty" ? "empty" : "with-data";

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-5xl px-8 py-10">
        {view === "empty" ? <EmptyState /> : <PopulatedState />}
      </div>
    </div>
  );
}

export default function ConnectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-full bg-slate-50" />}>
      <ConnectionsPageInner />
    </Suspense>
  );
}
