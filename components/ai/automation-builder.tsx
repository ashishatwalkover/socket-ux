"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Icons
 * ------------------------------------------------------------------ */

/** ActiveCampaign — blue rounded square with a white play triangle. */
function ActiveCampaignIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect x="1" y="1" width="22" height="22" rx="5" fill="#1E63E9" />
      <path d="M8 7.5v9l8-4.5-8-4.5z" fill="#fff" />
    </svg>
  );
}

/** Google Sheets — green sheet with white grid. */
function GoogleSheetsIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="1.5" width="18" height="21" rx="2.5" fill="#0F9D58" />
      <rect x="6.5" y="6" width="11" height="12" rx="1" fill="#fff" />
      <path
        d="M6.5 10h11M6.5 14h11M12 6v12"
        stroke="#0F9D58"
        strokeWidth="1.3"
      />
    </svg>
  );
}

const ICONS = {
  activecampaign: ActiveCampaignIcon,
  sheets: GoogleSheetsIcon,
} as const;

type IconKey = keyof typeof ICONS;

const APP_LABELS: Record<IconKey, string> = {
  activecampaign: "ActiveCampaign",
  sheets: "Google Sheets",
};

function AppIcon({ kind, size }: { kind: IconKey; size?: number }) {
  const C = ICONS[kind];
  return <C size={size} />;
}

/* ------------------------------------------------------------------ *
 * Types + default data
 * ------------------------------------------------------------------ */

export type AutomationOption = {
  id: string;
  name: string;
  icon: IconKey;
};

export type AutomationBuilderProps = {
  appName?: string;
  appIcon?: IconKey;
  triggers?: AutomationOption[];
  actions?: AutomationOption[];
  onBack?: () => void;
  onCreate?: (selection: { trigger: string | null; actions: string[] }) => void;
  className?: string;
};

const DEFAULT_TRIGGERS: AutomationOption[] = [
  { id: "deal-task-completed", name: "Deal Task Completed", icon: "activecampaign" },
  { id: "new-campaign-link-click", name: "New Campaign Link Click", icon: "activecampaign" },
  { id: "new-campaign-open", name: "New Campaign Open", icon: "activecampaign" },
  { id: "new-campaign-starts-sending", name: "New Campaign Starts Sending", icon: "activecampaign" },
  { id: "new-campaign-unsubscribe", name: "New Campaign Unsubscribe", icon: "activecampaign" },
  { id: "new-contact", name: "New Contact", icon: "activecampaign" },
  { id: "new-contact-added-to-list", name: "New Contact Added to List", icon: "activecampaign" },
  { id: "new-contact-note", name: "New Contact Note", icon: "activecampaign" },
  { id: "new-contact-task", name: "New Contact Task", icon: "activecampaign" },
  { id: "new-deal-added-updated", name: "New Deal Added or Updated", icon: "activecampaign" },
  { id: "new-deal-note", name: "New Deal Note", icon: "activecampaign" },
  { id: "new-deal-task", name: "New Deal Task", icon: "activecampaign" },
  { id: "new-updated-account", name: "New or Updated Account", icon: "activecampaign" },
  { id: "new-updated-contact", name: "New or Updated Contact", icon: "activecampaign" },
  { id: "tag-added-removed", name: "Tag Added or Removed From Contact", icon: "activecampaign" },
  { id: "updated-contact", name: "Updated Contact", icon: "activecampaign" },
  { id: "new-sheet-created", name: "New Sheet Created", icon: "sheets" },
  { id: "new-spreadsheet", name: "New Spreadsheet", icon: "sheets" },
  { id: "row-added-updated", name: "Row Added Or Updated", icon: "sheets" },
];

const DEFAULT_ACTIONS: AutomationOption[] = [
  // Google Sheets
  { id: "add-conditional-formatting", name: "Add Conditional Formatting Rule", icon: "sheets" },
  { id: "add-multiple-rows", name: "Add Multiple Rows", icon: "sheets" },
  { id: "add-new-row-to-sheet", name: "Add New Row to Sheet", icon: "sheets" },
  { id: "batch-update-cell-values", name: "Batch Update Cell Values", icon: "sheets" },
  { id: "clear-spreadsheet-row", name: "Clear Spreadsheet Row", icon: "sheets" },
  { id: "copy-sheet-to-spreadsheet", name: "Copy Sheet To Spreadsheet", icon: "sheets" },
  { id: "create-a-spreadsheet", name: "Create a Spreadsheet", icon: "sheets" },
  { id: "create-sheet-column", name: "Create Sheet Column", icon: "sheets" },
  { id: "create-spreadsheet-from-template", name: "Create Spreadsheet From Template", icon: "sheets" },
  { id: "create-subsheet", name: "Create Subsheet", icon: "sheets" },
  { id: "delete-rows", name: "Delete Rows", icon: "sheets" },
  { id: "find-subsheet", name: "Find Subsheet", icon: "sheets" },
  { id: "format-spreadsheet-row", name: "Format Spreadsheet Row", icon: "sheets" },
  { id: "get-row-details", name: "Get Row Details", icon: "sheets" },
  { id: "get-rows-from-range", name: "Get Rows From Range", icon: "sheets" },
  { id: "list-rows-in-sheet", name: "List Rows in Sheet", icon: "sheets" },
  { id: "list-spreadsheets", name: "List Spreadsheets", icon: "sheets" },
  { id: "list-spreadsheet-tabs", name: "List Spreadsheet Tabs", icon: "sheets" },
  { id: "lookup-spreadsheet-rows", name: "Lookup Spreadsheet Rows", icon: "sheets" },
  { id: "update-multiple-rows", name: "Update Multiple Rows", icon: "sheets" },
  { id: "update-sheet-name", name: "Update Sheet Name", icon: "sheets" },
  { id: "update-spreadsheet-row", name: "Update Spreadsheet Row", icon: "sheets" },
  // ActiveCampaign
  { id: "add-contact-to-account", name: "Add a Contact to Account", icon: "activecampaign" },
  { id: "add-remove-tag", name: "Add or Remove Tag From Contact", icon: "activecampaign" },
  { id: "add-secondary-contact", name: "Add Secondary Contact to Deal", icon: "activecampaign" },
  { id: "create-an-account", name: "Create an Account", icon: "activecampaign" },
  { id: "create-contact", name: "Create Contact", icon: "activecampaign" },
  { id: "create-or-update-a-deal", name: "Create or Update a Deal", icon: "activecampaign" },
  { id: "delete-tag", name: "Delete Tag", icon: "activecampaign" },
  { id: "find-account", name: "Find a Account", icon: "activecampaign" },
  { id: "find-campaign", name: "Find a Campaign", icon: "activecampaign" },
  { id: "find-contact", name: "Find a Contact", icon: "activecampaign" },
  { id: "find-deal", name: "Find a Deal", icon: "activecampaign" },
  { id: "find-deal-task", name: "Find a Deal Task", icon: "activecampaign" },
  { id: "find-all-campaigns", name: "Find all Campaigns", icon: "activecampaign" },
  { id: "find-user", name: "Find a User", icon: "activecampaign" },
  { id: "update-account", name: "Update Account", icon: "activecampaign" },
  { id: "update-deal", name: "Update a Deal", icon: "activecampaign" },
  { id: "update-contact", name: "Update Contact", icon: "activecampaign" },
];

const DEFAULT_TRIGGER: string | null = null;
const DEFAULT_ACTIONS_SELECTED: string[] = [];

/* ------------------------------------------------------------------ *
 * Small building blocks
 * ------------------------------------------------------------------ */

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function OptionRow({
  option,
  control,
  checked,
  onToggle,
}: {
  option: AutomationOption;
  control: "radio" | "checkbox";
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
        checked
          ? "border-blue-200 bg-blue-50/60"
          : "border-transparent hover:bg-gray-50",
      )}
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center border transition-colors",
          control === "radio" ? "rounded-full" : "rounded",
          checked ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white",
        )}
      >
        {checked && control === "radio" && (
          <span className="size-1.5 rounded-full bg-white" />
        )}
        {checked && control === "checkbox" && (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <input
        type={control}
        checked={checked}
        onChange={onToggle}
        className="sr-only"
      />
      <span className="shrink-0">
        <AppIcon kind={option.icon} />
      </span>
      <span className="truncate text-gray-800">{option.name}</span>
    </label>
  );
}

function ColumnHeader({
  title,
  search,
  onSearch,
}: {
  title: string;
  search: string;
  onSearch: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="mb-3 text-base font-semibold text-gray-900">{title}</h2>
      <SearchInput
        value={search}
        onChange={onSearch}
        placeholder={`Search ${title.toLowerCase()}...`}
      />
    </div>
  );
}

function FilterChip({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon?: IconKey;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
      )}
    >
      {icon && <AppIcon kind={icon} size={14} />}
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Main component
 * ------------------------------------------------------------------ */

export function AutomationBuilder({
  appName = "ActiveCampaign",
  appIcon = "activecampaign",
  triggers = DEFAULT_TRIGGERS,
  actions = DEFAULT_ACTIONS,
  onBack,
  onCreate,
  className,
}: AutomationBuilderProps) {
  const [triggerSearch, setTriggerSearch] = useState("");
  const [actionSearch, setActionSearch] = useState("");
  const [actionApp, setActionApp] = useState<IconKey | "all">("all");
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(
    DEFAULT_TRIGGER,
  );
  const [selectedActions, setSelectedActions] = useState<string[]>(
    DEFAULT_ACTIONS_SELECTED,
  );

  // Distinct apps present in the actions, in first-seen order — drives the filter chips.
  const actionApps = useMemo(() => {
    const seen: IconKey[] = [];
    for (const a of actions) if (!seen.includes(a.icon)) seen.push(a.icon);
    return seen;
  }, [actions]);

  const filteredTriggers = useMemo(
    () =>
      triggers.filter((t) =>
        t.name.toLowerCase().includes(triggerSearch.trim().toLowerCase()),
      ),
    [triggers, triggerSearch],
  );

  const filteredActions = useMemo(
    () =>
      actions.filter(
        (a) =>
          (actionApp === "all" || a.icon === actionApp) &&
          a.name.toLowerCase().includes(actionSearch.trim().toLowerCase()),
      ),
    [actions, actionSearch, actionApp],
  );

  const ready = selectedTrigger !== null && selectedActions.length > 0;

  const toggleAction = (id: string) =>
    setSelectedActions((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );

  return (
    <div className={cn("flex h-[100dvh] flex-col overflow-hidden bg-gray-50", className)}>
      {/* App header — 3 sections: left / centre / right (never scrolls) */}
      <header className="shrink-0 border-b border-gray-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-3 items-center gap-4 px-6 py-2">
          {/* Left */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-blue-600 transition-colors hover:text-blue-700"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              All apps
            </button>
          </div>

          {/* Centre */}
          <div className="flex items-center justify-center gap-2">
            <AppIcon kind={appIcon} size={18} />
            <span className="text-base font-semibold tracking-tight text-gray-900">
              {appName}
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={!ready}
              onClick={() =>
                onCreate?.({
                  trigger: selectedTrigger,
                  actions: selectedActions,
                })
              }
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-semibold text-white transition-colors",
                ready
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-300",
              )}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create
            </button>
          </div>
        </div>
      </header>

      {/* Body — 2 columns, each with its own independent scroll */}
      <div className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 grid-cols-1 gap-8 px-6 pt-5 md:grid-cols-2">
        {/* When this happens */}
        <section className="flex min-h-0 flex-col">
          <div className="shrink-0">
            <ColumnHeader
              title="When this happens"
              search={triggerSearch}
              onSearch={setTriggerSearch}
            />
          </div>
          <div className="mt-3 min-h-0 flex-1 space-y-0.5 overflow-y-auto pb-6">
            {filteredTriggers.map((t) => (
              <OptionRow
                key={t.id}
                option={t}
                control="radio"
                checked={selectedTrigger === t.id}
                onToggle={() => setSelectedTrigger(t.id)}
              />
            ))}
            {filteredTriggers.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-gray-400">
                No triggers found
              </p>
            )}
          </div>
        </section>

        {/* Do this */}
        <section className="flex min-h-0 flex-col">
          <div className="shrink-0">
            <ColumnHeader
              title="Do this"
              search={actionSearch}
              onSearch={setActionSearch}
            />
            {/* Filter chips — narrow the action list to one app */}
            {actionApps.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <FilterChip
                  label="All apps"
                  active={actionApp === "all"}
                  onClick={() => setActionApp("all")}
                />
                {actionApps.map((app) => (
                  <FilterChip
                    key={app}
                    label={APP_LABELS[app]}
                    icon={app}
                    active={actionApp === app}
                    onClick={() => setActionApp(app)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="mt-3 min-h-0 flex-1 space-y-0.5 overflow-y-auto pb-6">
            {filteredActions.map((a) => (
              <OptionRow
                key={a.id}
                option={a}
                control="checkbox"
                checked={selectedActions.includes(a.id)}
                onToggle={() => toggleAction(a.id)}
              />
            ))}
            {filteredActions.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-gray-400">
                No actions found
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
