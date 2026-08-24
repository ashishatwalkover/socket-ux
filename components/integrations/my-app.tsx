"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  InputAdornment,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import { cn } from "@/lib/utils";

/* ─── Capability catalog (Slack) ─── */
const TRIGGERS: string[] = [
  "New member join/leave or updated in channel",
  "New Mention",
  "New Message in Channels",
  "New Message on Slack",
  "New Thread Message",
  "New User Joined or Updated in Your Org",
  "Reaction Added",
];

const ACTIONS: string[] = [
  "Add reminder",
  "Add Users to Channel",
  "Chat_update slack block or message using messageTs",
  "Get all Channel Members",
  "Get Messages from Slack",
  "Get Thread Replies",
  "Get User Complete Profile Details by ID",
  "Get User Information by Email",
  "Get User Information by Id",
  "List all Private Channels",
  "List all Public Channels",
  "Lookup Canvas Sections",
  "Message Private Channel",
  "View_open BlockKit Modal using JSON",
];

type SelMap = Record<string, boolean>;

const allTrue = (names: string[]): SelMap => Object.fromEntries(names.map((n) => [n, true]));
const countOn = (names: string[], sel: SelMap) => names.filter((n) => sel[n]).length;
const matches = (name: string, q: string) => !q || name.toLowerCase().includes(q);

function SlackMark() {
  return (
    <svg viewBox="0 0 122.8 122.8" width="26" height="26" aria-hidden>
      <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9z" fill="#e01e5a" />
      <path d="M32.3 77.6c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a" />
      <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2z" fill="#36c5f0" />
      <path d="M45.2 32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0" />
      <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2z" fill="#2eb67d" />
      <path d="M90.5 45.2c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d" />
      <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9z" fill="#ecb22e" />
      <path d="M77.6 90.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function CapabilityColumn({
  title,
  caps,
  query,
  selected,
  setSelected,
}: {
  title: string;
  caps: string[];
  query: string;
  selected: SelMap;
  setSelected: (updater: (prev: SelMap) => SelMap) => void;
}) {
  const filtered = caps.filter((c) => matches(c, query));
  const enabled = countOn(caps, selected);
  const allFilteredOn = filtered.length > 0 && filtered.every((c) => selected[c]);

  const setMany = (value: boolean) =>
    setSelected((prev) => {
      const next = { ...prev };
      filtered.forEach((c) => (next[c] = value));
      return next;
    });

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
            {enabled}/{caps.length}
          </span>
        </div>
        {filtered.length > 0 && (
          <button
            type="button"
            onClick={() => setMany(!allFilteredOn)}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            {allFilteredOn ? "Unselect All" : "Select all"}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 px-3 py-6 text-center text-sm text-gray-400">
          No {title.toLowerCase()} match “{query}”.
        </p>
      ) : (
        <div className="flex flex-col">
          {filtered.map((c) => {
            const on = !!selected[c];
            return (
              <label
                key={c}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-gray-50"
              >
                <Checkbox
                  size="small"
                  checked={on}
                  onChange={() => setSelected((prev) => ({ ...prev, [c]: !prev[c] }))}
                  sx={{ p: 0.5 }}
                />
                <span className={cn("text-sm font-medium", on ? "text-gray-900" : "text-gray-500")}>
                  {c}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MyApp() {
  const [query, setQuery] = useState("");
  const [triggerSel, setTriggerSel] = useState<SelMap>(() => allTrue(TRIGGERS));
  const [actionSel, setActionSel] = useState<SelMap>(() => allTrue(ACTIONS));
  const [autoEnable, setAutoEnable] = useState(true);

  // Baseline for dirty-state + reset (Visibility of system status).
  const [baseline, setBaseline] = useState(() => ({
    triggerSel: allTrue(TRIGGERS),
    actionSel: allTrue(ACTIONS),
    autoEnable: true,
  }));
  const [savedOpen, setSavedOpen] = useState(false);

  const q = query.trim().toLowerCase();

  const totalOn = countOn(TRIGGERS, triggerSel) + countOn(ACTIONS, actionSel);
  const totalAll = TRIGGERS.length + ACTIONS.length;

  const dirty = useMemo(
    () =>
      JSON.stringify({ triggerSel, actionSel, autoEnable }) !==
      JSON.stringify(baseline),
    [triggerSel, actionSel, autoEnable, baseline]
  );

  const handleReset = () => {
    setTriggerSel({ ...baseline.triggerSel });
    setActionSel({ ...baseline.actionSel });
    setAutoEnable(baseline.autoEnable);
  };
  const handleUpdate = () => {
    setBaseline({ triggerSel: { ...triggerSel }, actionSel: { ...actionSel }, autoEnable });
    setSavedOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 -mx-10 -mt-8 mb-6 border-b border-gray-200 bg-white/85 px-10 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl border border-gray-200 bg-white">
              <SlackMark />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Slack</h1>
              <p className="mt-0.5 text-sm text-gray-500">
                Choose what your users can do with Slack inside the embed.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:inline">{totalOn} of {totalAll} enabled</span>
            <Button variant="contained" disabled={!dirty} onClick={handleUpdate}>
              Update
            </Button>
          </div>
        </div>
      </div>

      <Paper variant="outlined" sx={{ borderColor: "divider", borderRadius: 2 }}>
        {/* Toolbar: search */}
        <div className="border-b border-gray-100 p-4">
          <TextField
            size="small"
            placeholder="Search triggers and actions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:max-w-xs"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "text.disabled" }}>
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        {/* Capability lists */}
        <div className="grid gap-x-10 gap-y-6 p-5 md:grid-cols-2">
          <CapabilityColumn title="Triggers" caps={TRIGGERS} query={q} selected={triggerSel} setSelected={setTriggerSel} />
          <CapabilityColumn title="Actions" caps={ACTIONS} query={q} selected={actionSel} setSelected={setActionSel} />
        </div>

        {/* Auto-enable — the old cryptic "maintains selection" made explicit */}
        <div className="flex items-center justify-between gap-4 border-t border-gray-100 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Auto-enable new capabilities</p>
            <p className="mt-0.5 text-xs text-gray-500">
              When Slack adds new triggers or actions later, enable them for your users automatically.
            </p>
          </div>
          <Tooltip title="Applies to capabilities released in the future">
            <Switch checked={autoEnable} onChange={(e) => setAutoEnable(e.target.checked)} />
          </Tooltip>
        </div>
      </Paper>

      {/* Bottom action bar */}
      <div className="flex items-center justify-between gap-2 py-4">
        <span className="text-sm text-gray-500">{totalOn} of {totalAll} capabilities enabled</span>
        <div className="flex items-center gap-2">
          <Button variant="text" color="inherit" disabled={!dirty} onClick={handleReset}>
            Discard changes
          </Button>
          <Button variant="contained" disabled={!dirty} onClick={handleUpdate}>
            Update
          </Button>
        </div>
      </div>

      <Snackbar
        open={savedOpen}
        autoHideDuration={2500}
        onClose={() => setSavedOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSavedOpen(false)} sx={{ width: "100%" }}>
          Capabilities updated
        </Alert>
      </Snackbar>
    </div>
  );
}
