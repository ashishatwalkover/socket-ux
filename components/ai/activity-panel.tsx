"use client";

import { useMemo, useState } from "react";
import {
  Drawer,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { transformActivity, type TransformOptions } from "@/lib/activity/transform";
import type {
  ActivityCategory,
  ActivityChange,
  ActivityFeed,
  ActivityUserGroup,
  RawActivityResponse,
} from "@/lib/activity/types";

export interface ActivityPanelProps {
  open: boolean;
  onClose: () => void;
  /** Raw changelog payload; transformed internally unless `feed` is given. */
  response?: RawActivityResponse;
  /** Pre-transformed feed (skips the transform when provided). */
  feed?: ActivityFeed;
  /** Registry joins + formatting passed through to the transform. */
  transformOptions?: TransformOptions;
  /** Reference "now" for relative timestamps. Defaults to new Date(). */
  now?: Date;
  /** Groups with more changes than this collapse behind a "show more". */
  collapseAfter?: number;
  width?: number;
}

type CategoryFilter = "all" | ActivityCategory;

const CATEGORY_CHIPS: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "step", label: "Steps" },
  { key: "structure", label: "Structure" },
  { key: "publish", label: "Publishes" },
];

/* ------------------------------------------------------------------ */
/* Time helpers                                                        */
/* ------------------------------------------------------------------ */

function relativeTime(iso: string, now: Date): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.round(day / 7);
  if (wk < 5) return `${wk}w ago`;
  const mo = Math.round(day / 30);
  return `${mo}mo ago`;
}

/* ------------------------------------------------------------------ */
/* Filtering                                                           */
/* ------------------------------------------------------------------ */

function filterFeed(
  feed: ActivityFeed,
  { category, userId, query }: { category: CategoryFilter; userId: string; query: string },
): ActivityFeed {
  const q = query.trim().toLowerCase();
  const out: ActivityFeed = [];

  for (const section of feed) {
    const groups: ActivityUserGroup[] = [];
    for (const group of section.groups) {
      if (userId !== "all" && group.userId !== userId) continue;
      const changes = group.changes.filter((c) => {
        if (category !== "all" && c.category !== category) return false;
        if (q && !c.text.toLowerCase().includes(q)) return false;
        return true;
      });
      if (changes.length === 0) continue;
      groups.push({ ...group, changes, changeCount: changes.length });
    }
    if (groups.length > 0) out.push({ ...section, groups });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

/** Deterministic avatar tint from a user id. */
function avatarTint(userId: string): string {
  const tints = [
    "bg-neutral-200 text-neutral-700",
    "bg-indigo-100 text-indigo-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];
  let h = 0;
  for (let i = 0; i < userId.length; i++) h = (h * 31 + userId.charCodeAt(i)) >>> 0;
  return tints[h % tints.length];
}

function ChangeRow({ change, now }: { change: ActivityChange; now: Date }) {
  return (
    <div className="group flex items-start justify-between gap-4 rounded-lg -mx-2 px-2 py-[7px] transition-colors hover:bg-neutral-50">
      <p className="flex-1 text-[15px] leading-snug text-neutral-700">
        {change.segments.map((seg, i) =>
          seg.emphasis ? (
            <span key={i} className="font-semibold text-neutral-900">
              {seg.text}
            </span>
          ) : (
            <span key={i}>{seg.text}</span>
          ),
        )}
      </p>
      <Tooltip title={new Date(change.isoTime).toLocaleString()} placement="left" arrow>
        <span className="shrink-0 pt-0.5 text-xs tabular-nums text-neutral-400">
          {relativeTime(change.isoTime, now)}
        </span>
      </Tooltip>
    </div>
  );
}

function UserGroup({
  group,
  now,
  collapseAfter,
}: {
  group: ActivityUserGroup;
  now: Date;
  collapseAfter: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const collapsible = group.changes.length > collapseAfter;
  const visible =
    collapsible && !expanded ? group.changes.slice(0, collapseAfter) : group.changes;
  const hiddenCount = group.changes.length - visible.length;

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarTint(
            group.userId,
          )}`}
        >
          {group.initials}
        </span>
        <span className="text-[15px] font-semibold text-neutral-900">
          {group.userName}
        </span>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
          {group.changeCount} {group.changeCount === 1 ? "change" : "changes"}
        </span>
      </div>

      <div className="ml-[18px] pl-[26px]">
        {visible.map((change) => (
          <ChangeRow key={change.id} change={change} now={now} />
        ))}
        {collapsible && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="relative z-10 mt-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            {expanded ? "Show less" : `Show ${hiddenCount} more`}
          </button>
        )}
      </div>
    </div>
  );
}

export function ActivityPanel({
  open,
  onClose,
  response,
  feed,
  transformOptions,
  now,
  collapseAfter = 6,
  width = 480,
}: ActivityPanelProps) {
  const resolvedNow = now ?? transformOptions?.now ?? new Date();

  const [category, setCategory] = useState<CategoryFilter>("all");
  const [userId, setUserId] = useState<string>("all");
  const [query, setQuery] = useState("");

  const baseFeed = useMemo<ActivityFeed>(() => {
    if (feed) return feed;
    if (response) return transformActivity(response, transformOptions);
    return [];
  }, [feed, response, transformOptions]);

  // Distinct authors (id + name) for the people filter.
  const people = useMemo(() => {
    const seen = new Map<string, string>();
    for (const s of baseFeed)
      for (const g of s.groups) if (!seen.has(g.userId)) seen.set(g.userId, g.userName);
    return [...seen.entries()].map(([id, name]) => ({ id, name }));
  }, [baseFeed]);

  const filtered = useMemo(
    () => filterFeed(baseFeed, { category, userId, query }),
    [baseFeed, category, userId, query],
  );

  const isFiltering = category !== "all" || userId !== "all" || query.trim() !== "";

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width, maxWidth: "100vw" } } }}
    >
      <div className="flex h-full flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-xl font-semibold text-neutral-900">Activity</h2>
          <IconButton onClick={onClose} size="small" aria-label="Close activity panel">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>

        {/* Filter bar */}
        <div className="border-b border-neutral-200 px-6 pb-4">
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5">
            <SearchIcon fontSize="small" className="text-neutral-400" />
            <InputBase
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search changes…"
              className="flex-1 text-sm"
              sx={{ fontSize: 14 }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs text-neutral-400 hover:text-neutral-600"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-0.5 rounded-full border border-neutral-200 bg-neutral-100 p-0.5">
              {CATEGORY_CHIPS.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => setCategory(chip.key)}
                  aria-pressed={category === chip.key}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    category === chip.key
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
            {people.length > 1 && (
              <Select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: 12,
                  borderRadius: 999,
                  ".MuiSelect-select": { py: 0.5, pl: 1.5 },
                }}
              >
                <MenuItem value="all" sx={{ fontSize: 13 }}>
                  All people
                </MenuItem>
                {people.map((p) => (
                  <MenuItem key={p.id} value={p.id} sx={{ fontSize: 13 }}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {filtered.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <p className="text-sm font-medium text-neutral-500">
                {isFiltering ? "No matching activity" : "No activity yet"}
              </p>
              <p className="text-xs text-neutral-400">
                {isFiltering
                  ? "Try a different filter or search term."
                  : "Changes to this flow will appear here."}
              </p>
            </div>
          ) : (
            filtered.map((section) => (
              <section key={section.label}>
                <h3 className="sticky top-0 z-20 -mx-6 bg-white/90 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 backdrop-blur">
                  {section.label}
                </h3>
                {section.groups.map((group) => (
                  <UserGroup
                    key={`${section.label}-${group.userId}-${group.changes[0]?.id}`}
                    group={group}
                    now={resolvedNow}
                    collapseAfter={collapseAfter}
                  />
                ))}
              </section>
            ))
          )}
        </div>
      </div>
    </Drawer>
  );
}
