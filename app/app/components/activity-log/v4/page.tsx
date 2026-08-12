"use client";

import { useMemo, useState } from "react";
import { ActivityLogVersionNav } from "@/components/ai/activity-log-version-nav";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Change = { text: string; time: string; user: string };
type DaySection = { label: string; changes: Change[] };

/* ------------------------------------------------------------------ */
/* Action semantics                                                    */
/* ------------------------------------------------------------------ */

type ActionKind = "add" | "remove" | "update" | "move" | "rename" | "default";

const ACTION: Record<ActionKind, { dot: string; ring: string; text: string }> = {
  add: { dot: "bg-emerald-500", ring: "ring-emerald-100", text: "text-emerald-600" },
  remove: { dot: "bg-rose-500", ring: "ring-rose-100", text: "text-rose-600" },
  update: { dot: "bg-amber-500", ring: "ring-amber-100", text: "text-amber-600" },
  move: { dot: "bg-violet-500", ring: "ring-violet-100", text: "text-violet-600" },
  rename: { dot: "bg-sky-500", ring: "ring-sky-100", text: "text-sky-600" },
  default: { dot: "bg-slate-400", ring: "ring-slate-100", text: "text-slate-600" },
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

/** Minutes since midnight — used to size the gaps between entries. */
function minutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */

const SECTIONS: DaySection[] = [
  {
    label: "Today",
    changes: [
      { user: "Eshaan Sharma", text: "Updated Response", time: "11:10" },
      { user: "Maya Rodriguez", text: "Removed Break Flow", time: "10:58" },
      { user: "Maya Rodriguez", text: "Update Break Flow", time: "10:54" },
      { user: "Maya Rodriguez", text: "Added Break Flow", time: "10:50" },
      { user: "Eshaan Sharma", text: "Removed Multipath (**not needed**)", time: "10:38" },
      { user: "Eshaan Sharma", text: "Edited condition of Multipath (**module is flow**)", time: "10:34" },
      { user: "Eshaan Sharma", text: "Added Multipath (**UI UX**)", time: "10:30" },
      { user: "Eshaan Sharma", text: "Removed Step **Old Formatter**", time: "10:20" },
      { user: "Eshaan Sharma", text: "Moved Step **Notify Team**", time: "10:16" },
      { user: "Eshaan Sharma", text: "Renamed Step from **Notify Channel** to **Notify Team**", time: "10:12" },
      { user: "Eshaan Sharma", text: "Updated authentication of Step **Send Slack Message**", time: "10:08" },
      { user: "Eshaan Sharma", text: "Updated configuration of Step **Send Slack Message**", time: "10:04" },
      { user: "Eshaan Sharma", text: "Added Step **Log to Sheet**", time: "10:00" },
      { user: "Maya Rodriguez", text: "Removed Loop", time: "9:52" },
      { user: "Maya Rodriguez", text: "Updated Loop configuration", time: "9:48" },
      { user: "Maya Rodriguez", text: "Added Loop", time: "9:44" },
      { user: "Eshaan Sharma", text: "Removed **Get Data**", time: "9:42" },
      { user: "Eshaan Sharma", text: "Updated **Get Data** configuration", time: "9:38" },
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

function RichBody({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-slate-900">
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

/** Extra vertical space (px) added between two entries proportional to the time gap. */
const GAP_PER_MIN = 3;
const MAX_GAP = 40;

export default function ActivityLogV4Page() {
  const [open, setOpen] = useState(true);
  const [filter, setFilter] = useState<ActionKind | "all">("all");

  const filtered = useMemo(
    () =>
      SECTIONS.map((section) => ({
        ...section,
        changes: section.changes.filter((c) => filter === "all" || kindOf(c.text) === filter),
      })).filter((s) => s.changes.length > 0),
    [filter]
  );

  const total = useMemo(() => filtered.reduce((s, sec) => s + sec.changes.length, 0), [filtered]);

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-slate-100"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.06) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="absolute left-6 top-6 z-20">
        <ActivityLogVersionNav current="v4" tone="light" />
      </div>

      {open && <div className="absolute inset-0 bg-slate-900/10" onClick={() => setOpen(false)} />}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="absolute right-6 top-6 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-lg hover:bg-slate-50"
        >
          Open Activity
        </button>
      )}

      {/* Panel */}
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-slate-100 px-6 pb-3 pt-5">
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

        {/* Body — time axis on the left, rail with nodes, content on the right */}
        <div className="flex-1 overflow-y-auto px-6 pb-10 pt-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-sm font-medium text-slate-900">No matching activity</p>
              <p className="mt-1 text-sm text-slate-500">Try a different filter.</p>
            </div>
          ) : (
            filtered.map((section) => (
              <div key={section.label}>
                <div className="mb-2 pl-[68px] text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {section.label}
                </div>

                <div className="relative">
                  {/* Continuous rail */}
                  <div className="absolute left-[59px] top-2 bottom-2 w-px bg-slate-200" />

                  {section.changes.map((change, ci) => {
                    const kind = kindOf(change.text);
                    const prev = section.changes[ci - 1];
                    const gap = prev
                      ? Math.min(MAX_GAP, (minutes(prev.time) - minutes(change.time)) * GAP_PER_MIN)
                      : 0;
                    return (
                      <div
                        key={ci}
                        className="relative flex items-start"
                        style={{ marginTop: ci === 0 ? 0 : gap }}
                      >
                        {/* Time axis */}
                        <span className="w-[52px] flex-shrink-0 pt-[1px] text-right text-xs tabular-nums text-slate-400">
                          {change.time}
                        </span>

                        {/* Node on the rail */}
                        <span className="relative mx-[3px] mt-[5px] flex-shrink-0">
                          <span className={`block h-2.5 w-2.5 rounded-full ring-4 ring-white ${ACTION[kind].dot}`} />
                        </span>

                        {/* Content */}
                        <div className="flex min-w-0 flex-1 items-start gap-2 pb-3 pl-2">
                          <p className="min-w-0 flex-1 text-sm leading-snug text-slate-600">
                            <RichBody text={change.text} />
                          </p>
                          <div
                            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${toneFor(
                              change.user
                            )}`}
                            title={change.user}
                          >
                            {initials(change.user)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
