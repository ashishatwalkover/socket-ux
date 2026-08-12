"use client";

import { useMemo, useState } from "react";
import { ActivityLogVersionNav } from "@/components/ai/activity-log-version-nav";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Change = {
  /** Use **double asterisks** to bold a segment. */
  text: string;
  time: string;
};

type ActivityGroup = {
  user: string;
  changes: Change[];
};

type DaySection = {
  label: string;
  groups: ActivityGroup[];
};

/* ------------------------------------------------------------------ */
/* Action semantics — color + icon derived from the leading verb.      */
/* ------------------------------------------------------------------ */

type ActionKind = "add" | "remove" | "update" | "move" | "rename" | "default";

const ACTION: Record<
  ActionKind,
  { label: string; dot: string; text: string; soft: string; icon: JSX.Element }
> = {
  add: {
    label: "Added",
    dot: "bg-emerald-500",
    text: "text-emerald-600",
    soft: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  remove: {
    label: "Removed",
    dot: "bg-rose-500",
    text: "text-rose-600",
    soft: "bg-rose-50 text-rose-700 ring-rose-200",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M5 12h14" />
      </svg>
    ),
  },
  update: {
    label: "Updated",
    dot: "bg-amber-500",
    text: "text-amber-600",
    soft: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  move: {
    label: "Moved",
    dot: "bg-violet-500",
    text: "text-violet-600",
    soft: "bg-violet-50 text-violet-700 ring-violet-200",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
      </svg>
    ),
  },
  rename: {
    label: "Renamed",
    dot: "bg-sky-500",
    text: "text-sky-600",
    soft: "bg-sky-50 text-sky-700 ring-sky-200",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7V5h16v2M9 20h6M12 5v15" />
      </svg>
    ),
  },
  default: {
    label: "Changed",
    dot: "bg-slate-400",
    text: "text-slate-600",
    soft: "bg-slate-100 text-slate-700 ring-slate-200",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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

/** Render text with **bold** segments, tinting the leading action verb. */
function RichText({ text, kind }: { text: string; kind: ActionKind }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        const bold = part.startsWith("**") && part.endsWith("**");
        if (bold) {
          return (
            <strong key={i} className="font-semibold text-gray-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        // Tint just the leading verb of the first plain segment.
        if (i === 0) {
          const [verb, ...rest] = part.split(" ");
          return (
            <span key={i}>
              <span className={`font-medium ${ACTION[kind].text}`}>{verb}</span>
              {rest.length ? " " + rest.join(" ") : ""}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
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

export default function ActivityLogPage() {
  const [open, setOpen] = useState(true);
  const [filter, setFilter] = useState<ActionKind | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SECTIONS.map((section) => ({
      ...section,
      groups: section.groups
        .map((g) => ({
          ...g,
          changes: g.changes.filter((c) => {
            const matchKind = filter === "all" || kindOf(c.text) === filter;
            const matchQ =
              !q ||
              c.text.toLowerCase().includes(q) ||
              g.user.toLowerCase().includes(q);
            return matchKind && matchQ;
          }),
        }))
        .filter((g) => g.changes.length > 0),
    })).filter((s) => s.groups.length > 0);
  }, [filter, query]);

  const totalChanges = useMemo(
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
        <ActivityLogVersionNav current="v1" tone="light" />
      </div>

      {open && (
        <div className="absolute inset-0 bg-slate-900/10" onClick={() => setOpen(false)} />
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="absolute right-6 top-6 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg hover:bg-gray-50"
        >
          Open Activity
        </button>
      )}

      {/* Slide-over panel */}
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 pb-4 pt-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">Activity</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {totalChanges} {totalChanges === 1 ? "change" : "changes"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close activity"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search changes or people"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/5"
            />
          </div>

          {/* Filter pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    active
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-6 border-t border-gray-100" />

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">No matching activity</p>
              <p className="mt-1 text-sm text-gray-500">Try a different filter or search.</p>
            </div>
          ) : (
            filtered.map((section) => (
              <div key={section.label} className="mb-2">
                <div className="sticky top-0 z-10 -mx-6 bg-white/90 px-6 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 backdrop-blur">
                  {section.label}
                </div>

                <div className="space-y-6 pt-2">
                  {section.groups.map((group, gi) => (
                    <div key={gi} className="relative pl-11">
                      {/* Avatar */}
                      <div
                        className={`absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${toneFor(
                          group.user
                        )}`}
                      >
                        {initials(group.user)}
                      </div>

                      {/* Vertical rail */}
                      {group.changes.length > 0 && (
                        <div className="absolute left-[17px] top-11 bottom-1 w-px bg-gray-200" />
                      )}

                      {/* Name + count */}
                      <div className="flex items-baseline gap-2 pt-1.5">
                        <span className="text-[15px] font-semibold text-gray-900">{group.user}</span>
                        <span className="text-xs text-gray-400">
                          {group.changes.length} {group.changes.length === 1 ? "change" : "changes"}
                        </span>
                      </div>

                      {/* Changes */}
                      <div className="mt-2 space-y-0.5">
                        {group.changes.map((change, ci) => {
                          const kind = kindOf(change.text);
                          return (
                            <div
                              key={ci}
                              className="relative -ml-11 flex items-start justify-between gap-3 rounded-lg py-1.5 pl-11 pr-2"
                            >
                              {/* Node dot on the rail */}
                              <span
                                className={`absolute left-[13px] top-[13px] h-2 w-2 rounded-full ring-4 ring-white ${ACTION[kind].dot}`}
                              />
                              <p className="text-[15px] leading-snug text-gray-600">
                                <RichText text={change.text} kind={kind} />
                              </p>
                              <span
                                className="mt-px flex-shrink-0 text-xs tabular-nums text-gray-400"
                                title={`${section.label} · ${change.time}`}
                              >
                                {change.time}
                              </span>
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
