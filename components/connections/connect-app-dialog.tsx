"use client";

import { useEffect, useRef, useState } from "react";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import CheckIcon from "@mui/icons-material/Check";
import type { AppIntegration } from "@/lib/flow-types";

const Icon = {
  close: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  ),
  external: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  chevron: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
};

function ScopeOptionIcon({ scopeId }: { scopeId: string }) {
  if (scopeId === "org") {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
        <CorporateFareIcon sx={{ fontSize: 20 }} />
      </span>
    );
  }
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
      <AccountTreeIcon sx={{ fontSize: 20 }} />
    </span>
  );
}

const FLOW_SCOPE_DESCRIPTION = "Only available within this flow";

const ORG_SCOPE_DESCRIPTION = "Available to all flow this this organization";

const ACCESS_SCOPES = [
  { id: "org", name: "Acme Corporation", description: ORG_SCOPE_DESCRIPTION },
  { id: "product-sync", name: "Product Sync Flow", description: FLOW_SCOPE_DESCRIPTION },
  { id: "analytics-dashboard", name: "Analytics Dashboard", description: FLOW_SCOPE_DESCRIPTION },
  { id: "inventory-update", name: "Inventory Update", description: FLOW_SCOPE_DESCRIPTION },
  { id: "warehouse-sync", name: "Data Warehouse Sync", description: FLOW_SCOPE_DESCRIPTION },
  { id: "signup-notifications", name: "Signup Notifications", description: FLOW_SCOPE_DESCRIPTION },
  { id: "abandoned-cart", name: "Abandoned Cart Recovery", description: FLOW_SCOPE_DESCRIPTION },
] as const;

function AccessScopeDropdown() {
  const [selectedId, setSelectedId] = useState<(typeof ACCESS_SCOPES)[number]["id"]>("org");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = ACCESS_SCOPES.find((s) => s.id === selectedId) ?? ACCESS_SCOPES[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex w-full items-start justify-between gap-3 rounded-lg border border-[#333] bg-[#252525] px-4 py-4 text-left hover:bg-[#2a2a2a] transition-colors"
      >
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <ScopeOptionIcon scopeId={selected.id} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">{selected.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-400">{selected.description}</p>
          </div>
        </div>
        <Icon.chevron
          className={`mt-0.5 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Flow scope"
          className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-[#444] bg-[#2a2a2a] py-1 shadow-xl"
        >
          {ACCESS_SCOPES.map((scope) => (
            <li key={scope.id} role="option" aria-selected={scope.id === selectedId}>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(scope.id);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#333] ${
                  scope.id === selectedId ? "bg-[#333]/80" : ""
                }`}
              >
                <ScopeOptionIcon scopeId={scope.id} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{scope.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-gray-400">{scope.description}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AppBrandIcon({ appId }: { appId: string }) {
  if (appId === "sheets") {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
        G
      </span>
    );
  }
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#2a2a2a] text-xl">
      {appId === "gmail" ? "✉️" : appId === "slack" ? "💬" : "📱"}
    </span>
  );
}

const DEMO_ACCOUNTS: Record<string, string> = {
  sheets: "mr.singhrahul2215@gmail.com",
  gmail: "mr.singhrahul2215@gmail.com",
  slack: "rahul@acme-corp.slack.com",
  shopify: "store@acme-corp.com",
  whatsapp: "business@acme-corp.com",
  notion: "rahul@acme-corp.com",
  airtable: "rahul@acme-corp.com",
  twilio: "rahul@acme-corp.com",
  crm: "rahul@acme-corp.com",
};

const DEMO_FLOWS: Record<string, string[]> = {
  sheets: ["Product Sync Flow", "Analytics Dashboard", "Inventory Update", "Data Warehouse Sync"],
  gmail: ["Signup Notifications", "Weekly Digest"],
  slack: ["Support Ticket to Slack", "Daily Standup Reminder"],
  whatsapp: ["Order Notifications", "Abandoned Cart Recovery"],
  shopify: ["New Order Webhook"],
  notion: [],
  airtable: [],
  twilio: [],
  crm: ["New Lead to HubSpot CRM"],
};

function ConnectionTitlePopover() {
  const [title, setTitle] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const openPopover = () => {
    setDraft(title ?? "");
    setOpen(true);
  };

  const saveTitle = () => {
    const trimmed = draft.trim();
    if (trimmed) setTitle(trimmed);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative w-fit">
      <button
        type="button"
        onClick={openPopover}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-400"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {title ?? "Add Title"}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Connection title"
          className="absolute left-0 top-full z-30 mt-2 w-72 rounded-lg border border-[#444] bg-[#2a2a2a] p-3 shadow-xl"
        >
          <label htmlFor="connection-title-input" className="text-xs font-medium text-gray-400">
            Title
          </label>
          <input
            id="connection-title-input"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveTitle();
              if (e.key === "Escape") setOpen(false);
            }}
            placeholder="e.g. Production Sheets"
            className="mt-1.5 w-full rounded-md border border-[#444] bg-[#1e1e1e] px-3 py-2 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveTitle}
              disabled={!draft.trim()}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type ConnectAppDialogProps = {
  app: AppIntegration;
  open: boolean;
  connecting?: boolean;
  onClose: () => void;
  onConnect: () => void;
};

export function ConnectAppDialog({
  app,
  open,
  connecting = false,
  onClose,
  onConnect,
}: ConnectAppDialogProps) {
  if (!open) return null;

  const account = DEMO_ACCOUNTS[app.id] ?? "rahul@acme-corp.com";
  const flows = DEMO_FLOWS[app.id] ?? ["Sample Automation Flow"];
  const flowCount = flows.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="connect-app-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 cursor-default"
      />

      <section className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-[#333] bg-[#1e1e1e] text-white shadow-2xl">
        <header className="flex items-start gap-3 border-b border-[#333] px-6 py-5">
          <AppBrandIcon appId={app.id} />
          <div className="min-w-0 flex-1">
            <h2 id="connect-app-title" className="text-lg font-semibold leading-tight">
              {app.name}
            </h2>
            <p className="mt-0.5 text-sm text-gray-400">App connection</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded text-gray-500 hover:bg-white/5 hover:text-gray-300"
            aria-label="Close dialog"
          >
            <Icon.close />
          </button>
        </header>

        <div className="space-y-6 px-6 py-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Connection</span>              
            </div>
            <div className="flex flex-col gap-3 rounded-lg border border-[#333] bg-[#252525] px-4 py-4">
              <ConnectionTitlePopover key={app.id} />
              <p className="text-sm font-semibold text-white">{account}</p>
              <div className="flex items-center gap-2">
                <span className="inline-flex size-5 items-center justify-center rounded-full text-emerald-500">
                  <CheckIcon sx={{ fontSize: 14 }} />
                </span>
                <span className="text-xs font-semibold text-emerald-400">Connection updated</span>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Access scope</p>
            <AccessScopeDropdown />
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Used in</p>
            <div className="rounded-lg border border-[#333] bg-[#252525] px-4 py-4">
              <p className="text-sm leading-relaxed text-gray-200">
                {flows.join(", ")}
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Active across {flowCount} {flowCount === 1 ? "flow" : "flows"}
            </p>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-[#333] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={connecting}
            className="rounded-md border border-[#555] bg-transparent px-6 py-2 text-sm font-medium text-white hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConnect}
            disabled={connecting}
            className="rounded-md bg-blue-600 px-8 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {connecting ? "Connecting…" : "Connect"}
          </button>
        </footer>
      </section>
    </div>
  );
}
