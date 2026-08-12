"use client";

import { useMemo, useState, type ReactElement } from "react";
import { ActivityLogVersionNav } from "@/components/ai/activity-log-version-nav";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Change = { text: string; time: string };
type ActivityGroup = { user: string; changes: Change[] };
type DaySection = { label: string; groups: ActivityGroup[] };

/* ------------------------------------------------------------------ */
/* Action semantics                                                    */
/* ------------------------------------------------------------------ */

type ActionKind = "add" | "remove" | "update" | "move" | "rename" | "default";

const ACTION: Record<ActionKind, { verb: string; tile: string; icon: ReactElement }> = {
  add: {
    verb: "Added",
    tile: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  remove: {
    verb: "Removed",
    tile: "bg-rose-50 text-rose-600 ring-rose-100",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M5 12h14" />
      </svg>
    ),
  },
  update: {
    verb: "Updated",
    tile: "bg-amber-50 text-amber-600 ring-amber-100",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  move: {
    verb: "Moved",
    tile: "bg-violet-50 text-violet-600 ring-violet-100",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 7l-4 5 4 5M4 12h16" />
      </svg>
    ),
  },
  rename: {
    verb: "Renamed",
    tile: "bg-sky-50 text-sky-600 ring-sky-100",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7V5h16v2M9 20h6M12 5v15" />
      </svg>
    ),
  },
  default: {
    verb: "Changed",
    tile: "bg-slate-100 text-slate-500 ring-slate-200",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
};

function kindOf(text: string): ActionKind {
  const verb = text.trim().split(" ")[0].toLowerCase();
  if (verb === "added") return "add";
  if (verb === "removed") return "remove";
  if (verb === "updated" || verb === "update" || verb === "edited") return "update";
  if (verb === "moved") return "move";
  if (verb === "renamed") return "rename";
  return "default";
}

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */

const SECTIONS: DaySection[] = [
  {
    label: "Today",
    groups: [
      { user: "Eshaan Sharma", changes: [{ text: "Updated Response", time: "11:10" }] },
      {
        user: "Maya Rodriguez",
        changes: [
          { text: "Removed Break Flow", time: "10:58" },
          { text: "Update Break Flow", time: "10:54" },
          { text: "Added Break Flow", time: "10:50" },
        ],
      },
      {
        user: "Eshaan Sharma",
        changes: [
          { text: "Removed Multipath (**not needed**)", time: "10:38" },
          { text: "Edited condition of Multipath (**module is flow**)", time: "10:34" },
          { text: "Added Multipath (**UI UX**)", time: "10:30" },
          { text: "Removed Step **Old Formatter**", time: "10:20" },
          { text: "Moved Step **Notify Team**", time: "10:16" },
          { text: "Renamed Step from **Notify Channel** to **Notify Team**", time: "10:12" },
          { text: "Updated authentication of Step **Send Slack Message**", time: "10:08" },
          { text: "Updated configuration of Step **Send Slack Message**", time: "10:04" },
          { text: "Added Step **Log to Sheet**", time: "10:00" },
        ],
      },
      {
        user: "Maya Rodriguez",
        changes: [
          { text: "Removed Loop", time: "9:52" },
          { text: "Updated Loop configuration", time: "9:48" },
          { text: "Added Loop", time: "9:44" },
        ],
      },
      {
        user: "Eshaan Sharma",
        changes: [
          { text: "Removed **Get Data**", time: "9:42" },
          { text: "Updated **Get Data** configuration", time: "9:38" },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const AVATAR_TONES = [
  "bg-indigo-100 text-indigo-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}
function toneFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_TONES[h % AVATAR_TONES.length];
}

/** Render text with **bold** segments, dropping the leading verb (shown as a chip). */
function RichBody({ text }: { text: string }) {
  const withoutVerb = text.replace(/^\s*\S+\s*/, "");
  const parts = withoutVerb.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const FILTERS: { key: ActionKind | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "add", label: "Added" },
  { key: "remove", label: "Removed" },
  { key: "update", label: "Updated" },
  { key: "move", label: "Moved" },
];

export default function ActivityLogV2Page() {
  const [open, setOpen] = useState(true);
  const [filter, setFilter] = useState<ActionKind | "all">("all");

  const filtered = useMemo(
    () =>
      SECTIONS.map((section) => ({
        ...section,
        groups: section.groups
          .map((g) => ({ ...g, changes: g.changes.filter((c) => filter === "all" || kindOf(c.text) === filter) }))
          .filter((g) => g.changes.length > 0),
      })).filter((s) => s.groups.length > 0),
    [filter]
  );

  const total = useMemo(
    () => filtered.reduce((s, sec) => s + sec.groups.reduce((g, grp) => g + grp.changes.length, 0), 0),
    [filtered]
  );

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-slate-100"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.06) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="absolute left-6 top-6 z-20">
        <ActivityLogVersionNav current="v2" tone="light" />
      </div>

      {open && <div className="absolute inset-0 bg-slate-900/10" onClick={() => setOpen(false)} />}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="absolute right-6 top-6 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg hover:bg-gray-50"
        >
          Open Activity
        </button>
      )}

      {/* Panel */}
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-slate-50 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 pb-3 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">Activity</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{total}</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close activity"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filter pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    active ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-sm font-medium text-slate-900">No matching activity</p>
              <p className="mt-1 text-sm text-slate-500">Try a different filter.</p>
            </div>
          ) : (
            filtered.map((section) => (
              <div key={section.label}>
                <div className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{section.label}</div>

                <div className="space-y-3">
                  {section.groups.map((group, gi) => (
                    <div key={gi} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                      {/* Card header */}
                      <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-2.5">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${toneFor(group.user)}`}>
                          {initials(group.user)}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{group.user}</span>
                        <span className="ml-auto text-xs text-slate-400">
                          {group.changes.length} {group.changes.length === 1 ? "change" : "changes"}
                        </span>
                      </div>

                      {/* Change rows */}
                      <div className="divide-y divide-slate-50">
                        {group.changes.map((change, ci) => {
                          const kind = kindOf(change.text);
                          const a = ACTION[kind];
                          return (
                            <div key={ci} className="flex items-start gap-3 px-4 py-2.5">
                              {/* Icon tile */}
                              <div className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md ring-1 ${a.tile}`}>
                                {a.icon}
                              </div>
                              <p className="min-w-0 flex-1 text-sm leading-snug text-slate-600">
                                <span className="font-medium text-slate-800">{a.verb}</span>{" "}
                                <RichBody text={change.text} />
                              </p>
                              <span className="mt-0.5 flex-shrink-0 text-xs tabular-nums text-slate-400">{change.time}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
