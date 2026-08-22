"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, Chip, CircularProgress, TextField } from "@mui/material";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type AppMeta = { name: string; color: string; letter: string };

export type CapKind = "trigger" | "action";

export type Capability = {
  id: string;
  group: string;
  kind: CapKind;
  name: string;
  beta?: boolean;
  suggested?: boolean;
  hint?: string; // shown while the AI provisions it
};

export type AppPlan = {
  app: string;
  tagline: string;
  groups: string[];
  capabilities: Capability[];
};

/** Per-capability build status once it's been selected.
 *  "selected" = checked but not built yet (waiting for the Build button). */
export type CapStatus = "selected" | "creating" | "created";

/* ------------------------------------------------------------------ */
/* Dummy catalog (mock prototype)                                      */
/* ------------------------------------------------------------------ */

export const PRIMARY = "#2f6bff";

export const APPS: Record<string, AppMeta> = {
  Slack: { name: "Slack", color: "#4A154B", letter: "#" },
  HubSpot: { name: "HubSpot", color: "#FF7A59", letter: "H" },
  "Google Sheets": { name: "Google Sheets", color: "#0F9D58", letter: "S" },
};

/** App capability catalogs — faithful to the reference panel for Slack. */
export const PLANS: Record<string, AppPlan> = {
  Slack: {
    app: "Slack",
    tagline: "6 triggers · 9 actions available",
    groups: ["Triggers", "Search", "List all"],
    capabilities: [
      { id: "slk-t1", group: "Triggers", kind: "trigger", name: "New Message in Channels", beta: true, suggested: true },
      { id: "slk-t2", group: "Triggers", kind: "trigger", name: "New Message on Slack", beta: true },
      { id: "slk-t3", group: "Triggers", kind: "trigger", name: "New User Joined or Updated in Workspace", beta: true },
      { id: "slk-t4", group: "Triggers", kind: "trigger", name: "New Mention", beta: true, suggested: true },
      { id: "slk-t5", group: "Triggers", kind: "trigger", name: "New member join/leave or update", beta: true },
      { id: "slk-t6", group: "Triggers", kind: "trigger", name: "New Thread Message", beta: true },
      { id: "slk-s1", group: "Search", kind: "action", name: "Get User Information by Email", beta: true },
      { id: "slk-s2", group: "Search", kind: "action", name: "Get User Complete Profile Details", beta: true },
      { id: "slk-s3", group: "Search", kind: "action", name: "Find Public channel", suggested: true },
      { id: "slk-l1", group: "List all", kind: "action", name: "Get Thread Replies", beta: true },
      { id: "slk-l2", group: "List all", kind: "action", name: "Get all Channel Members", beta: true },
      { id: "slk-l3", group: "List all", kind: "action", name: "Get Messages from Slack", beta: true },
      { id: "slk-l4", group: "List all", kind: "action", name: "List all Private Channels", beta: true },
      { id: "slk-l5", group: "List all", kind: "action", name: "List all Public Channels", beta: true },
      { id: "slk-l6", group: "List all", kind: "action", name: "Lookup Canvas Sections", beta: true },
    ],
  },
  HubSpot: {
    app: "HubSpot",
    tagline: "4 triggers · 4 actions available",
    groups: ["Triggers", "Actions"],
    capabilities: [
      { id: "hs-t1", group: "Triggers", kind: "trigger", name: "New Contact Created", suggested: true },
      { id: "hs-t2", group: "Triggers", kind: "trigger", name: "New Form Submission", suggested: true },
      { id: "hs-t3", group: "Triggers", kind: "trigger", name: "Deal Stage Changed" },
      { id: "hs-t4", group: "Triggers", kind: "trigger", name: "Contact Property Updated" },
      { id: "hs-a1", group: "Actions", kind: "action", name: "Create Contact", suggested: true },
      { id: "hs-a2", group: "Actions", kind: "action", name: "Create Follow-up Task", suggested: true },
      { id: "hs-a3", group: "Actions", kind: "action", name: "Update Deal" },
      { id: "hs-a4", group: "Actions", kind: "action", name: "Add Contact to List" },
    ],
  },
  "Google Sheets": {
    app: "Google Sheets",
    tagline: "3 triggers · 4 actions available",
    groups: ["Triggers", "Actions"],
    capabilities: [
      { id: "gs-t1", group: "Triggers", kind: "trigger", name: "New Row Added", suggested: true },
      { id: "gs-t2", group: "Triggers", kind: "trigger", name: "New or Updated Row" },
      { id: "gs-t3", group: "Triggers", kind: "trigger", name: "New Spreadsheet Created" },
      { id: "gs-a1", group: "Actions", kind: "action", name: "Add Row", suggested: true },
      { id: "gs-a2", group: "Actions", kind: "action", name: "Update Row" },
      { id: "gs-a3", group: "Actions", kind: "action", name: "Lookup Row" },
      { id: "gs-a4", group: "Actions", kind: "action", name: "Clear Row" },
    ],
  },
};

export function planFor(prompt: string): AppPlan {
  const p = prompt.toLowerCase();
  if (/hubspot|crm|contact|deal|lead/.test(p)) return PLANS.HubSpot;
  if (/sheet|spreadsheet|row|google sheet/.test(p)) return PLANS["Google Sheets"];
  return PLANS.Slack; // default matches the reference image
}

export function buildHint(cap: Capability) {
  if (cap.hint) return cap.hint;
  return cap.kind === "trigger"
    ? "Registering event & webhook subscription…"
    : "Configuring API call & field mapping…";
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

/** App logo as a white rounded tile with the brand mark. */
export function AppTile({ app, size = 28 }: { app: string; size?: number }) {
  const meta = APPS[app];
  if (!meta) return null;
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-white"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className="inline-flex items-center justify-center rounded font-bold text-white"
        style={{
          width: size * 0.62,
          height: size * 0.62,
          backgroundColor: meta.color,
          fontSize: size * 0.32,
        }}
      >
        {meta.letter}
      </span>
    </span>
  );
}

export function BetaTag() {
  return <span className="text-[11px] font-normal text-neutral-400">(βeta)</span>;
}

/* ------------------------------------------------------------------ */
/* useCapabilityBuild — selection + one-by-one build state             */
/* ------------------------------------------------------------------ */

export function useCapabilityBuild(plan: AppPlan | null, opts?: { seedSuggested?: boolean }) {
  const seedSuggested = opts?.seedSuggested ?? false;
  const [statuses, setStatuses] = useState<Record<string, CapStatus>>({});
  const [building, setBuilding] = useState(false);
  const [search, setSearch] = useState("");

  // Seed the suggested capabilities once the plan is known.
  useEffect(() => {
    if (!plan) return;
    if (!seedSuggested) return;
    const initial: Record<string, CapStatus> = {};
    plan.capabilities.filter((c) => c.suggested).forEach((c) => (initial[c.id] = "selected"));
    setStatuses(initial);
    setBuilding(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan?.app]);

  const selected = useMemo(
    () => (plan ? plan.capabilities.filter((c) => statuses[c.id]) : []),
    [plan, statuses]
  );
  const createdCount = selected.filter((c) => statuses[c.id] === "created").length;
  const toBuild = selected.filter((c) => statuses[c.id] === "selected");
  const triggerCreated = selected.filter((c) => c.kind === "trigger" && statuses[c.id] === "created").length;
  const actionCreated = createdCount - triggerCreated;

  // Builder loop: provision selected items one at a time, in list order.
  useEffect(() => {
    if (!building) return;
    const creating = selected.find((c) => statuses[c.id] === "creating");
    if (creating) {
      const t = window.setTimeout(() => setStatuses((s) => ({ ...s, [creating.id]: "created" })), 1050);
      return () => window.clearTimeout(t);
    }
    const nextSelected = selected.find((c) => statuses[c.id] === "selected");
    if (nextSelected) {
      setStatuses((s) => ({ ...s, [nextSelected.id]: "creating" }));
      return;
    }
    setBuilding(false);
  }, [building, selected, statuses]);

  function toggle(id: string) {
    if (building) return;
    setStatuses((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = "selected";
      return next;
    });
  }

  function modify(id: string) {
    if (building) return;
    setStatuses((prev) => ({ ...prev, [id]: "selected" }));
  }

  function build() {
    if (building || toBuild.length === 0) return;
    setBuilding(true);
  }

  return {
    statuses,
    building,
    search,
    setSearch,
    selected,
    createdCount,
    toBuild,
    triggerCreated,
    actionCreated,
    toggle,
    modify,
    build,
  };
}

/* ------------------------------------------------------------------ */
/* CapabilityList — grouped, searchable list with inline build status  */
/* ------------------------------------------------------------------ */

export function CapabilityList({
  plan,
  statuses,
  search,
  locked,
  onSearch,
  onToggle,
  onModify,
}: {
  plan: AppPlan;
  statuses: Record<string, CapStatus>;
  search: string;
  locked: boolean;
  onSearch: (v: string) => void;
  onToggle: (id: string) => void;
  onModify: (id: string) => void;
}) {
  const q = search.trim().toLowerCase();
  const filtered = plan.capabilities.filter((c) => c.name.toLowerCase().includes(q));

  return (
    <>
      {/* Search */}
      <div className="px-4 pt-3">
        <TextField
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search triggers & actions"
          size="small"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <span className="mr-2 text-neutral-400">
                  <SearchIcon width={16} height={16} />
                </span>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "14px",
              "& fieldset": { borderColor: "#e5e5e5" },
              "&:hover fieldset": { borderColor: "#d4d4d4" },
              "&.Mui-focused fieldset": { borderColor: PRIMARY, borderWidth: "1.5px" },
            },
          }}
        />
      </div>

      {/* Grouped, scrollable list */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {plan.groups.map((group) => {
          const items = filtered.filter((c) => c.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="mb-1">
              <p className="px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                {group}
              </p>
              {items.map((cap) => {
                const status = statuses[cap.id];
                const checked = status === "selected" || status === "creating";
                const isCreated = status === "created";
                const clickable = !locked && status !== "creating";
                const handleClick = () => {
                  if (!clickable) return;
                  if (isCreated) onModify(cap.id);
                  else onToggle(cap.id);
                };
                return (
                  <div
                    key={cap.id}
                    role="button"
                    tabIndex={clickable ? 0 : -1}
                    onClick={handleClick}
                    onKeyDown={(e) => {
                      if (clickable && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        handleClick();
                      }
                    }}
                    aria-pressed={checked || isCreated}
                    className={[
                      "group flex items-center gap-1 rounded-lg px-1 outline-none transition-colors",
                      clickable ? "cursor-pointer hover:bg-neutral-50 focus-visible:bg-neutral-50" : "cursor-default",
                      status === "creating" ? "bg-[#2f6bff]/5" : "",
                    ].join(" ")}
                  >
                    {/* left slot: green tick once built, otherwise the checkbox */}
                    {isCreated ? (
                      <span className="flex size-[30px] shrink-0 items-center justify-center" aria-label="Built">
                        <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                          <CheckIcon className="size-3" />
                        </span>
                      </span>
                    ) : (
                      <Checkbox
                        checked={checked}
                        disableRipple
                        tabIndex={-1}
                        size="small"
                        sx={{
                          color: "#d4d4d4",
                          "&.Mui-checked": { color: PRIMARY },
                          p: "6px",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                    <AppTile app={plan.app} size={26} />
                    <span className="ml-1.5 min-w-0 flex-1 py-2">
                      <span className="block truncate text-[14px] text-neutral-800">
                        {cap.name} {cap.beta && <BetaTag />}
                      </span>
                      {status === "creating" && (
                        <span className="mt-0.5 block truncate text-[12px] text-neutral-500">{buildHint(cap)}</span>
                      )}
                      {isCreated && (
                        <span className="mt-0.5 block truncate text-[12px] text-emerald-600">Created &amp; ready</span>
                      )}
                    </span>
                    {/* right-side status / actions */}
                    <span className="mr-1 flex shrink-0 items-center">
                      {status === "creating" && <CircularProgress size={16} thickness={5} sx={{ color: PRIMARY }} />}
                      {isCreated && !locked && (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                          <PencilIcon className="size-3.5" /> Modify
                        </span>
                      )}
                      {!status && cap.suggested && !locked && (
                        <Chip
                          label="Suggested"
                          size="small"
                          sx={{ height: 20, fontSize: "11px", fontWeight: 500, backgroundColor: "#ede9fe", color: "#7c3aed" }}
                        />
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-4 py-10 text-center">
            <p className="text-[13px] text-neutral-500">No triggers or actions match “{search}”.</p>
            <Button
              variant="text"
              size="small"
              onClick={() => onSearch("")}
              className="mt-1"
              sx={{ color: "#2f6bff" }}
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
