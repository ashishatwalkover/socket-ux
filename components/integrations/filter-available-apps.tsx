"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
} from "@mui/material";
import { cn } from "@/lib/utils";
import { EMBED_SERVICES, EMBED_CATEGORIES, type EmbedService } from "@/lib/embed-services";

type SelMap = Record<string, boolean>;
type ServiceSel = { triggers: SelMap; actions: SelMap };
type Selections = Record<string, ServiceSel>;

const allTrue = (names: string[]): SelMap => Object.fromEntries(names.map((n) => [n, true]));
const countOn = (names: string[], sel: SelMap) => names.filter((n) => sel[n]).length;

// Apps start off (opt-in). A service becomes "available" only once the user
// enables at least one of its triggers/actions and saves.
const initialSelections = (): Selections =>
  Object.fromEntries(EMBED_SERVICES.map((s) => [s.id, { triggers: {}, actions: {} }]));

const svcTotal = (s: EmbedService) => s.triggers.length + s.actions.length;
const svcOn = (s: EmbedService, sel: ServiceSel) =>
  countOn(s.triggers, sel.triggers) + countOn(s.actions, sel.actions);

function AppIcon({ service, className }: { service: EmbedService; className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white",
        className
      )}
    >
      {service.iconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={service.iconUrl} alt="" className="size-full object-contain p-0.5" />
      ) : (
        <span className="text-lg leading-none">{service.icon}</span>
      )}
    </span>
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

/* Right pane — the selected service's triggers & actions. */
function CapabilityGroup({
  title,
  items,
  sel,
  onToggle,
  onSetAll,
}: {
  title: string;
  items: string[];
  sel: SelMap;
  onToggle: (name: string) => void;
  onSetAll: (value: boolean) => void;
}) {
  if (items.length === 0) return null;
  const on = countOn(items, sel);
  const allOn = on === items.length;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</h4>
          <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
            {on}/{items.length}
          </span>
        </div>
        <button type="button" onClick={() => onSetAll(!allOn)} className="text-xs font-medium text-blue-600 hover:underline">
          {allOn ? "Unselect All" : "Select all"}
        </button>
      </div>
      <div className="flex flex-col">
        {items.map((name) => (
          <label key={name} className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 hover:bg-gray-50">
            <Checkbox size="small" checked={!!sel[name]} onChange={() => onToggle(name)} sx={{ p: 0.5 }} />
            <span className="text-sm text-gray-800">{name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function FilterAvailableApps() {
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [activeId, setActiveId] = useState<string>(EMBED_SERVICES[0].id);
  const [selections, setSelections] = useState<Selections>(initialSelections);
  const [baseline, setBaseline] = useState<Selections>(initialSelections);
  const [savedOpen, setSavedOpen] = useState(false);

  const q = query.trim().toLowerCase();

  const toggleCat = (cat: string) =>
    setSelectedCats((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });

  const filtered = useMemo(() => {
    return EMBED_SERVICES.filter((s) => {
      if (selectedCats.size && !s.categories.some((c) => selectedCats.has(c))) return false;
      if (q && !(s.name.toLowerCase().includes(q) || s.categories.some((c) => c.toLowerCase().includes(q))))
        return false;
      if (availableOnly && svcOn(s, selections[s.id]) === 0) return false;
      return true;
    });
  }, [selectedCats, q, availableOnly, selections]);

  const active = EMBED_SERVICES.find((s) => s.id === activeId)!;
  const activeSel = selections[activeId];

  const availableCount = EMBED_SERVICES.filter((s) => svcOn(s, selections[s.id]) > 0).length;
  const dirty = useMemo(
    () => JSON.stringify(selections) !== JSON.stringify(baseline),
    [selections, baseline]
  );

  const setServiceAll = (s: EmbedService, value: boolean) =>
    setSelections((prev) => ({
      ...prev,
      [s.id]: { triggers: value ? allTrue(s.triggers) : {}, actions: value ? allTrue(s.actions) : {} },
    }));

  const setGroup = (id: string, group: "triggers" | "actions", names: string[], value: boolean) =>
    setSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], [group]: value ? allTrue(names) : {} },
    }));

  const toggleCap = (id: string, group: "triggers" | "actions", name: string) =>
    setSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], [group]: { ...prev[id][group], [name]: !prev[id][group][name] } },
    }));

  const handleReset = () => setSelections(structuredClone(baseline));
  const handleSave = () => {
    setBaseline(structuredClone(selections));
    setSavedOpen(true);
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 -mx-10 -mt-8 mb-6 border-b border-gray-200 bg-white/85 px-10 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Filter Available Services</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Choose which apps — and which of their triggers and actions — your users can connect.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-sm text-gray-500 md:inline">
              {availableCount} of {EMBED_SERVICES.length} available
            </span>
            <Button variant="text" color="inherit" disabled={!dirty} onClick={handleReset}>
              Discard
            </Button>
            <Button variant="contained" disabled={!dirty} onClick={handleSave}>
              Save changes
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr_360px]">
        {/* ── Categories ── */}
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:self-start lg:overflow-auto">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Categories</h2>
            {selectedCats.size > 0 && (
              <button type="button" onClick={() => setSelectedCats(new Set())} className="text-xs font-medium text-blue-600 hover:underline">
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-col">
            {EMBED_CATEGORIES.map((cat) => (
              <label key={cat} className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 hover:bg-gray-50">
                <Checkbox size="small" checked={selectedCats.has(cat)} onChange={() => toggleCat(cat)} sx={{ p: 0.5 }} />
                <span className="text-sm text-gray-700">{cat}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* ── Services list ── */}
        <div className="min-w-0">
          <TextField
            fullWidth
            size="small"
            placeholder="Search services by name, domain, or description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
          <div className="mt-2 mb-3 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {filtered.length} {filtered.length === 1 ? "service" : "services"}
            </span>
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-600">
              <Checkbox size="small" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} sx={{ p: 0.25 }} />
              Filtered only
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 px-4 py-12 text-center text-sm text-gray-400">
              No services match your filters.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((s) => {
                const sel = selections[s.id];
                const on = svcOn(s, sel);
                const total = svcTotal(s);
                const isActive = s.id === activeId;
                return (
                  <div
                    key={s.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveId(s.id)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setActiveId(s.id))}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border bg-white px-3 py-2.5 transition-colors",
                      isActive ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <AppIcon service={s} className="size-8" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-gray-900">{s.name}</div>
                      <div className="truncate text-xs text-gray-400">{s.categories.slice(0, 2).join(" · ")}</div>
                    </div>
                    {on > 0 && (
                      <span className="shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                        {on}/{total} on
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Detail: selected service capabilities ── */}
        <div className="min-w-0">
          <Paper
            variant="outlined"
            sx={{ borderColor: "divider", borderRadius: 2 }}
            className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-auto"
          >
            <div className="flex items-center gap-2.5 border-b border-gray-100 px-4 py-3">
              <AppIcon service={active} className="size-8" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-gray-900">{active.name}</div>
                <div className="truncate text-xs text-gray-400">
                  {svcOn(active, activeSel)} of {svcTotal(active)} enabled
                </div>
              </div>
              <button
                type="button"
                onClick={() => setServiceAll(active, svcOn(active, activeSel) !== svcTotal(active))}
                className="shrink-0 text-xs font-medium text-blue-600 hover:underline"
              >
                {svcOn(active, activeSel) === svcTotal(active) ? "Unselect All" : "Select all"}
              </button>
            </div>
            <div className="flex flex-col gap-5 p-4">
              <CapabilityGroup
                title="Triggers"
                items={active.triggers}
                sel={activeSel.triggers}
                onToggle={(n) => toggleCap(active.id, "triggers", n)}
                onSetAll={(v) => setGroup(active.id, "triggers", active.triggers, v)}
              />
              <CapabilityGroup
                title="Actions"
                items={active.actions}
                sel={activeSel.actions}
                onToggle={(n) => toggleCap(active.id, "actions", n)}
                onSetAll={(v) => setGroup(active.id, "actions", active.actions, v)}
              />
              {active.triggers.length === 0 && active.actions.length === 0 && (
                <p className="text-sm text-gray-400">This service has no configurable capabilities.</p>
              )}
            </div>
          </Paper>
        </div>
      </div>

      <Snackbar
        open={savedOpen}
        autoHideDuration={2500}
        onClose={() => setSavedOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSavedOpen(false)} sx={{ width: "100%" }}>
          Available services updated
        </Alert>
      </Snackbar>
    </div>
  );
}
