"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = { panel: string; onStepSelect?: (step: { name: string; description: string; id: string }) => void; selectedStepId?: string; onStepDeselect?: () => void };

type FlowDef = {
  id: string;
  name: string;
  status: "running" | "paused" | "failed";
  trigger: string;
  summary: string;
  steps: string[];
};

type FlowStep = {
  id: string;
  title: string;
  subtitle?: string;
  app: string;
  type: "trigger" | "action" | "condition" | "wait" | "stop";
  branches?: { label: string; steps: FlowStep[] }[];
};

const FLOWS_BASE: FlowDef[] = [
  {
    id: "cart-recovery",
    name: "Abandoned cart recovery",
    status: "running",
    trigger: "Shopify · cart abandoned",
    summary:
      "Watch for abandoned carts on Shopify, wait 2 hours, then send a reminder email. Retry once on failure.",
    steps: [
      "Trigger: Shopify cart abandoned",
      "Wait 2 hours",
      "Check if order was completed — if yes, stop",
      "Send reminder email via Gmail",
      "Retry once if email fails",
      "Log outcome",
    ],
  },
  {
    id: "invoice-reminder",
    name: "Daily invoice reminder",
    status: "running",
    trigger: "Schedule · daily 9:00 AM",
    summary:
      "Every morning, find invoices unpaid for 3+ days and send a WhatsApp reminder to the customer.",
    steps: [
      "Trigger: daily at 9:00 AM",
      "Fetch invoices unpaid > 3 days",
      "Send WhatsApp reminder per customer",
      "Email finance team summary",
    ],
  },
  {
    id: "sync-leads",
    name: "Sync new leads to HubSpot",
    status: "paused",
    trigger: "Webhook · new lead",
    summary:
      "When a new lead arrives via the website form, create or update a HubSpot contact and notify sales.",
    steps: [
      "Trigger: webhook on new lead",
      "Find or create HubSpot contact",
      "Tag with source",
      "Notify #sales on Slack",
    ],
  },
];

// Get flows with optional extended version for cart-recovery
function getFlows(extendedFlowId?: string): FlowDef[] {
  return FLOWS_BASE.map(f => {
    if (f.id === "cart-recovery" && extendedFlowId === "cart-recovery") {
      return {
        ...f,
        summary: "Watch for abandoned carts on Shopify, wait 2 hours, then send a reminder email. If customer still hasn't checked out 24 hours after the email, send a WhatsApp follow-up. Retry once on failure.",
        steps: [
          "Trigger: Shopify cart abandoned",
          "Wait 2 hours",
          "Check if order was completed — if yes, stop",
          "Send reminder email via Gmail",
          "Retry once if email fails",
          "Wait 24 hours",
          "Check if order was completed — if yes, stop",
          "Send WhatsApp follow-up",
          "Log outcome",
        ],
      };
    }
    return f;
  });
}

const FLOWS = FLOWS_BASE;

const statusStyle: Record<FlowDef["status"], string> = {
  running: "bg-emerald-500",
  paused: "bg-amber-500",
  failed: "bg-red-500",
};

const META: Record<string, { title: string; description: string }> = {
  home: { title: "Home", description: "All automations created from chat." },
  logs: {
    title: "Logs",
    description: "Recent execution events across your workflows.",
  },
  reports: { title: "Reports", description: "Performance & success metrics." },
  dashboard: {
    title: "Dashboard",
    description: "At-a-glance health of your automations.",
  },
  profile: { title: "Profile", description: "Account & preferences." },
};

export function RightPanel({ panel, onStepSelect, selectedStepId, onStepDeselect }: Props) {
  const searchParams = useSearchParams();
  const flowId = searchParams.get("flow");
  const extended = searchParams.get("extended");

  let flow = null;
  if (panel === "home" && flowId) {
    const flows = getFlows(extended ? flowId : undefined);
    flow = flows.find((f) => f.id === flowId);
  }

  if (flow) {
    return <FlowDetail flow={flow} onStepSelect={onStepSelect} selectedStepId={selectedStepId} onStepDeselect={onStepDeselect} />;
  }

  const meta = META[panel] ?? { title: panel, description: "Coming soon." };

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-background">
      <div className="border-b border-border/70 px-5 py-3">
        <p className="text-xs text-muted-foreground">{meta.description}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {panel === "home" ? <FlowList /> : <PanelPlaceholder panel={panel} />}
      </div>
    </div>
  );
}

function FlowList() {
  return (
    <ul className="space-y-2">
      {FLOWS.map((f) => (
        <li key={f.id}>
          <Link
            href={`/ai?panel=home&flow=${f.id}`}
            className="flex items-start gap-3 rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm transition-colors hover:border-violet-300 hover:bg-violet-50/40"
          >
            <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${statusStyle[f.status]}`} />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-foreground">{f.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{f.trigger}</span>
            </span>
            <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FlowDetail({ flow, onStepSelect, selectedStepId, onStepDeselect }: { flow: FlowDef; onStepSelect?: (step: { name: string; description: string; id: string }) => void; selectedStepId?: string; onStepDeselect?: () => void }) {
  const [activeTab, setActiveTab] = useState<"summary" | "flow" | "logs">("summary");

  const tabs = [
    { id: "summary" as const, label: "Summary" },
    { id: "flow" as const, label: "Flow" },
    { id: "logs" as const, label: "Logs" },
  ];

  const [selectedStep, setSelectedStep] = useState<FlowStep | null>(null);

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-background">
      {/* Tabs + Actions */}
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-3">
        <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="cursor-pointer">
            <PlayIcon className="size-3.5" />
            Test
          </Button>
          <Button size="sm" className="cursor-pointer">
            Publish Flow
          </Button>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === "summary" && (
          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Summary
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">{flow.summary}</p>
            </section>

            <section>
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Steps
              </h3>
              <ol className="mt-3 space-y-2">
                {flow.steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="text-foreground/90">{s}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        )}

        {activeTab === "flow" && <FlowSection steps={SAMPLE_FLOW_STEPS} selectedStepId={selectedStepId} onStepClick={(step) => {
          setSelectedStep(step);
          if (onStepSelect) {
            onStepSelect({
              name: step.title,
              description: step.subtitle || `${step.app} action step`,
              id: step.id
            });
          }
        }} />}

        {activeTab === "logs" && <LogsSection />}
      </div>
      <StepConfigDrawer
        step={selectedStep}
        open={!!selectedStep}
        onClose={() => {
          setSelectedStep(null);
          onStepDeselect?.();
        }}
      />
    </div>
  );
}

const SAMPLE_FLOW_STEPS: FlowStep[] = [
  {
    id: "trigger-1",
    title: "Shopify cart abandoned",
    subtitle: "Trigger",
    app: "shopify",
    type: "trigger",
  },
  {
    id: "wait-1",
    title: "Wait 2 hours",
    subtitle: "Delay",
    app: "wait",
    type: "wait",
  },
  {
    id: "condition-1",
    title: "Check if order was completed",
    subtitle: "Condition",
    app: "condition",
    type: "condition",
    branches: [
      {
        label: "Yes",
        steps: [
          { id: "stop-1", title: "Stop", subtitle: "End flow", app: "stop", type: "stop" },
        ],
      },
      {
        label: "No",
        steps: [
          {
            id: "action-1",
            title: "Send reminder email via Gmail",
            subtitle: "Action",
            app: "gmail",
            type: "action",
          },
          {
            id: "action-2",
            title: "Retry once if email fails",
            subtitle: "Error handler",
            app: "gmail",
            type: "action",
          },
          {
            id: "wait-2",
            title: "Wait 24 hours",
            subtitle: "Delay",
            app: "wait",
            type: "wait",
          },
          {
            id: "action-3",
            title: "Send WhatsApp follow-up",
            subtitle: "Action",
            app: "whatsapp",
            type: "action",
          },
        ],
      },
    ],
  },
  {
    id: "action-4",
    title: "Log outcome",
    subtitle: "Action",
    app: "log",
    type: "action",
  },
];

function AppIconBadge({ app }: { app: string }) {
  const styles: Record<string, string> = {
    shopify: "bg-[#96bf48]",
    gmail: "bg-[#EA4335]",
    slack: "bg-[#4A154B]",
    sheets: "bg-[#0F9D58]",
    whatsapp: "bg-[#25D366]",
    wait: "bg-gray-400",
    condition: "bg-amber-500",
    stop: "bg-red-500",
    log: "bg-gray-500",
    trigger: "bg-blue-500",
  };
  const labels: Record<string, string> = {
    shopify: "S",
    gmail: "G",
    slack: "Sl",
    sheets: "Sh",
    whatsapp: "W",
    wait: "⏱",
    condition: "IF",
    stop: "■",
    log: "L",
    trigger: "T",
  };
  return (
    <span className={`inline-flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white ${styles[app] || "bg-gray-400"}`}>
      {labels[app] || "?"}
    </span>
  );
}

function FlowStepNode({ step, onClick }: { step: FlowStep; onClick: (step: FlowStep) => void }) {
  const typeColors: Record<string, string> = {
    trigger: "border-l-4 border-l-blue-500",
    action: "border-l-4 border-l-violet-500",
    condition: "border-l-4 border-l-amber-500",
    wait: "border-l-4 border-l-gray-400",
    stop: "border-l-4 border-l-red-500",
  };
  return (
    <button
      onClick={() => onClick(step)}
      className={`flex w-full items-center gap-3 rounded-lg border border-border/70 bg-background px-3 py-2.5 text-left transition-colors hover:border-violet-300 hover:bg-violet-50/40 cursor-pointer ${typeColors[step.type] || ""}`}
    >
      <AppIconBadge app={step.app} />
      <div className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground">{step.title}</span>
        {step.subtitle && (
          <span className="block text-xs text-muted-foreground">{step.subtitle}</span>
        )}
      </div>
    </button>
  );
}

function FlowTree({ steps, onStepClick, selectedStepId }: { steps: FlowStep[]; onStepClick: (step: FlowStep) => void; selectedStepId?: string }) {
  const numberMap = useMemo(() => {
    const map = new Map<string, number>();
    let num = 1;
    function walk(items: FlowStep[]) {
      for (const item of items) {
        map.set(item.id, num++);
        if (item.branches) {
          for (const branch of item.branches) {
            walk(branch.steps);
          }
        }
      }
    }
    walk(steps);
    return map;
  }, [steps]);

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleCollapse = (stepId: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  };

  const items = useMemo(() => {
    const result: (
      | { type: "step"; step: FlowStep; num: number; depth: number }
      | { type: "label"; label: string; count: number; depth: number }
    )[] = [];
    function walk(steps: FlowStep[], depth: number, parentCollapsed: boolean) {
      for (const step of steps) {
        const isCollapsed = parentCollapsed || collapsed.has(step.id);
        result.push({ type: "step", step, num: numberMap.get(step.id) ?? 0, depth });
        if (step.branches && !isCollapsed) {
          for (const branch of step.branches) {
            if (branch.label === "No") {
              result.push({ type: "label", label: "ELSE", count: branch.steps.length, depth: depth + 1 });
            }
            walk(branch.steps, depth + 1, false);
          }
        }
      }
    }
    walk(steps, 0, false);
    return result;
  }, [steps, numberMap, collapsed]);

  return (
    <div className="relative flex w-full">
      <div className="absolute top-0 bottom-0 left-3 w-px bg-border" />
      <div className="flex-1 flex flex-col">
        {items.map((item, i) => {
          if (item.type === "label") {
            return (
              <div
                key={`label-${i}`}
                className="flex items-center gap-2 py-1 mb-1"
                style={{ paddingLeft: 24 + (item.depth - 1) * 28 }}
              >
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-pink-50 text-pink-500">ELSE</span>
                <span className="text-[10px] text-muted-foreground">{item.count} step{item.count !== 1 ? "s" : ""}</span>
              </div>
            );
          }

          const step = item.step;
          const hasBranches = !!step.branches;
          const isCollapsed = collapsed.has(step.id);

          return (
            <div key={step.id} className="flex items-center mb-3 group">
              {/* Number */}
              <div className="w-6 flex justify-center shrink-0">
                <div className="w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold text-violet-600 z-10">
                  {item.num}
                </div>
              </div>

              {/* Card */}
              <div style={{ marginLeft: item.depth * 28 }} className="flex items-center gap-2">
                <div
                  className={`w-fit rounded-lg border px-4 py-3 transition-colors cursor-pointer ${
                    selectedStepId === step.id
                      ? "border-2 border-black bg-violet-50/50"
                      : step.type === "condition"
                      ? "border-amber-300/70 bg-amber-50/30 hover:bg-amber-50/50"
                      : "border-border/70 bg-background hover:bg-violet-50/40"
                  }`}
                  onClick={() => hasBranches ? toggleCollapse(step.id) : onStepClick(step)}
                >
                  <div className="flex items-center gap-2.5">
                    <AppIconBadge app={step.app} />
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">{step.title}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{step.subtitle}</span>
                    {hasBranches && (
                      <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded whitespace-nowrap">
                        {step.branches!.reduce((acc, b) => acc + b.steps.length, 0)} steps
                      </span>
                    )}
                  </div>
                </div>
                {hasBranches && (
                  <button
                    type="button"
                    onClick={() => toggleCollapse(step.id)}
                    className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`size-4 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepConfigDrawer({ step, open, onClose }: { step: FlowStep | null; open: boolean; onClose: () => void }) {
  if (!step) return null;

  const configFields: Record<string, { label: string; value: string }[]> = {
    "trigger-1": [
      { label: "Platform", value: "Shopify" },
      { label: "Event", value: "Cart Abandoned" },
      { label: "Store", value: "my-store.myshopify.com" },
    ],
    "wait-1": [
      { label: "Duration", value: "2 hours" },
    ],
    "condition-1": [
      { label: "Field", value: "order.status" },
      { label: "Operator", value: "equals" },
      { label: "Value", value: "completed" },
    ],
    "action-1": [
      { label: "Service", value: "Gmail" },
      { label: "To", value: "{{customer.email}}" },
      { label: "Subject", value: "Don't forget your cart!" },
      { label: "Body", value: "Hi {{customer.name}}, you left items in your cart..." },
    ],
    "action-2": [
      { label: "Service", value: "Gmail" },
      { label: "Retry count", value: "1" },
      { label: "Retry delay", value: "5 minutes" },
    ],
    "wait-2": [
      { label: "Duration", value: "24 hours" },
    ],
    "condition-2": [
      { label: "Field", value: "order.status" },
      { label: "Operator", value: "equals" },
      { label: "Value", value: "completed" },
    ],
    "action-3": [
      { label: "Service", value: "WhatsApp" },
      { label: "To", value: "{{customer.phone}}" },
      { label: "Message", value: "Hey! Your cart is waiting..." },
    ],
    "action-4": [
      { label: "Level", value: "Info" },
      { label: "Message", value: "Flow completed for {{customer.email}}" },
    ],
    "stop-1": [
      { label: "Action", value: "Terminate flow" },
      { label: "Reason", value: "Order already completed" },
    ],
    "stop-2": [
      { label: "Action", value: "Terminate flow" },
      { label: "Reason", value: "Order completed after reminder" },
    ],
  };

  const fields = configFields[step.id] || [{ label: "Title", value: step.title }];

  return (
    <div className={`fixed inset-y-0 right-0 w-[420px] bg-white border-l border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 min-w-0">
          <AppIconBadge app={step.app} />
          <span className="text-sm font-semibold text-gray-800 truncate">{step.title}</span>
        </div>
        <button onClick={onClose} className="inline-flex size-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 shrink-0 cursor-pointer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-52px)]">
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Type</span>
          <p className="text-sm font-medium text-gray-800 capitalize">{step.type}</p>
        </div>
        {fields.map((f) => (
          <div key={f.label}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
            <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800">
              {f.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelPlaceholder({ panel }: { panel: string }) {
  const items: Record<string, string[]> = {
    logs: [
      "10:42 — Cart abandoned by priya@example.com",
      "10:43 — Reminder email sent",
      "10:44 — Email delivered",
    ],
    reports: [
      "Tasks executed: 12,430",
      "Success rate: 98.2%",
      "Avg recovery time: 2m 14s",
    ],
    dashboard: [
      "4 active automations",
      "0 failures in last 24h",
      "2 suggestions pending",
    ],
    profile: [
      "Ashish · ashish@walkover.in",
      "Workspace: MSG91",
      "Plan: Beta",
    ],
  };
  const list = items[panel] ?? [];
  if (panel === "logs") {
    return <LogsSection />;
  }

  return (
    <ul className="space-y-2">
      {list.map((it, i) => (
        <li
          key={i}
          className="rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm"
        >
          {it}
        </li>
      ))}
    </ul>
  );
}

type LogSnapshot = {
  id: string;
  relative: string;
  time: string;
};

const LOG_SNAPSHOTS: LogSnapshot[] = [
  { id: "s1", relative: "47s", time: "6:52 PM" },
  { id: "s2", relative: "2m", time: "6:50 PM" },
  { id: "s3", relative: "12m", time: "6:41 PM" },
  { id: "s4", relative: "19m", time: "6:32 PM" },
  { id: "s5", relative: "29m", time: "6:20 PM" },
  { id: "s6", relative: "40m", time: "6:11 PM" },
  { id: "s7", relative: "57m", time: "5:54 PM" },
  { id: "s8", relative: "1h", time: "5:46 PM" },
];

const DEFAULT_SNAPSHOT_INDEX = 5;

function useLogSnapshotState() {
  const [selectedIndex, setSelectedIndex] = useState(DEFAULT_SNAPSHOT_INDEX);
  const [panelOpen, setPanelOpen] = useState(false);
  const snapshot = LOG_SNAPSHOTS[selectedIndex];

  return {
    selectedIndex,
    panelOpen,
    snapshot,
    selectSnapshot: setSelectedIndex,
    goToOlderSnapshot: () =>
      setSelectedIndex((index) => Math.min(index + 1, LOG_SNAPSHOTS.length - 1)),
    goToNewerSnapshot: () => setSelectedIndex((index) => Math.max(index - 1, 0)),
    togglePanel: () => setPanelOpen((open) => !open),
    canPrev: selectedIndex < LOG_SNAPSHOTS.length - 1,
    canNext: selectedIndex > 0,
  };
}

type LogItem = {
  id: string;
  icon: "condition" | "campaign" | "api";
  title: string;
  subtitle?: string;
  badges?: { label: string; value: string }[];
  result?: "TRUE" | "FALSE";
  collapsible?: boolean;
};

const SAMPLE_LOGS: LogItem[] = [
  {
    id: "log-1",
    icon: "condition",
    title: "user country code should not be '91' and email should not match with Freshworks contact email",
    badges: [
      { label: "user_country_co...", value: "91" },
      { label: "email", value: "yashbafna2121@g..." },
    ],
    result: "FALSE",
  },
  {
    id: "log-2",
    icon: "condition",
    title: "The request email should not match the first Freshworks contact and country code should be '91'.",
    badges: [
      { label: "email", value: "yashbafna2121@g..." },
      { label: "user_country_co...", value: "91" },
    ],
    result: "FALSE",
  },
  {
    id: "log-3",
    icon: "condition",
    title: "If user email has gmail then this flow.",
    badges: [
      { label: "email", value: "yashbafna2121@g..." },
      { label: "includes", value: "function includ..." },
    ],
    result: "TRUE",
  },
  {
    id: "log-4",
    icon: "campaign",
    title: "Kiwi_Campaign_Integration",
    collapsible: true,
  },
  {
    id: "log-5",
    icon: "campaign",
    title: "Falcon_Campaign_Integration_1",
    collapsible: true,
  },
  {
    id: "log-6",
    icon: "condition",
    title: "Check if user's country code is not '91'",
    badges: [{ label: "user_country_co...", value: "91" }],
    result: "FALSE",
  },
  {
    id: "log-7",
    icon: "condition",
    title: "Check if 'ref' field exists and is not empty in the request body.",
    badges: [{ label: "ref", value: "" }],
    result: "FALSE",
  },
  {
    id: "log-8",
    icon: "condition",
    title: "check if contact exists by verifying the presence of an ID in Freshworks response",
    badges: [{ label: "id", value: "" }],
    result: "FALSE",
  },
  {
    id: "log-9",
    icon: "condition",
    title: "Check if utm_source is not 'website', not 'robin', and not blank",
    badges: [{ label: "utm_source", value: "vishantchaurasi..." }],
    result: "TRUE",
  },
];

function LogsSection() {
  const snapshot = useLogSnapshotState();
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failed">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "api" | "plugin" | "variable" | "function" | "response">("all");

  return (
    <div className="flex min-h-0 gap-0">
      {snapshot.panelOpen && (
        <LogSnapshotPanel
          snapshots={LOG_SNAPSHOTS}
          selectedIndex={snapshot.selectedIndex}
          onSelect={snapshot.selectSnapshot}
        />
      )}

      <div className="min-w-0 flex-1 py-4 px-4">
        <LogsFlowToolbar
          snapshot={snapshot.snapshot}
          panelOpen={snapshot.panelOpen}
          onTogglePanel={snapshot.togglePanel}
          onPrev={snapshot.goToOlderSnapshot}
          onNext={snapshot.goToNewerSnapshot}
          canPrev={snapshot.canPrev}
          canNext={snapshot.canNext}
        />

        {/* Filters */}
        <div className="mb-4 space-y-2 rounded-lg border border-border/70 bg-background p-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs font-medium text-muted-foreground">Show Step Status</span>
            {(["all", "success", "failed"] as const).map((s) => (
              <label key={s} className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={statusFilter === s}
                  onChange={() => setStatusFilter(s)}
                  className="size-3.5 accent-violet-600"
                />
                <span className="capitalize">{s}</span>
              </label>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">Show Step Type</span>
            {(["all", "api", "plugin", "variable", "function", "response"] as const).map((t) => (
              <label key={t} className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={typeFilter === t}
                  onChange={() => setTypeFilter(t)}
                  className="size-3.5 accent-violet-600"
                />
                <span className="capitalize">{t}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Incoming Data */}
        <details className="mb-3 group" open>
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5 text-sm font-medium text-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 text-muted-foreground">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>Incoming Data</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </summary>
          <div className="mt-2 rounded-lg border border-border/70 bg-background px-3 py-2.5 text-xs text-muted-foreground">
            Request payload captured at trigger
          </div>
        </details>

        {/* Log entries */}
        <div className="space-y-2">
          {SAMPLE_LOGS.map((log) => (
            <LogItemRow key={log.id} log={log} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LogItemRow({ log }: { log: LogItem }) {
  const [open, setOpen] = useState(true);

  if (log.collapsible) {
    return (
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-lg border border-border/70 bg-background px-3 py-3 text-left transition-colors hover:bg-muted/30 cursor-pointer"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 text-blue-500">
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
        <span className="text-sm font-medium text-foreground">{log.title}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`ml-auto size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-border/70 bg-background px-3 py-3">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 size-4 shrink-0 text-amber-500">
          <path d="M2 12h3l3-9 6 18 4-9h3" />
        </svg>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground">{log.title}</p>
          {log.badges && (
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {log.badges.map((b, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground/80">{b.label}</span>
                  <span>— {b.value}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Result */}
        {log.result && (
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
            log.result === "TRUE" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
          }`}>
            {log.result}
          </span>
        )}
      </div>
    </div>
  );
}

function FlowSection({ steps, onStepClick, selectedStepId }: { steps: FlowStep[]; onStepClick: (step: FlowStep) => void; selectedStepId?: string }) {
  const snapshot = useLogSnapshotState();

  return (
    <div className="flex min-h-0 gap-0">
      {snapshot.panelOpen && (
        <LogSnapshotPanel
          snapshots={LOG_SNAPSHOTS}
          selectedIndex={snapshot.selectedIndex}
          onSelect={snapshot.selectSnapshot}
        />
      )}

      <div className="min-w-0 flex-1 py-4 px-4">
        <LogsFlowToolbar
          snapshot={snapshot.snapshot}
          panelOpen={snapshot.panelOpen}
          onTogglePanel={snapshot.togglePanel}
          onPrev={snapshot.goToOlderSnapshot}
          onNext={snapshot.goToNewerSnapshot}
          canPrev={snapshot.canPrev}
          canNext={snapshot.canNext}
        />
        <FlowTree steps={steps} onStepClick={onStepClick} selectedStepId={selectedStepId} />
      </div>
    </div>
  );
}

function LogSnapshotPanel({
  snapshots,
  selectedIndex,
  onSelect,
}: {
  snapshots: LogSnapshot[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <aside className="mr-4 w-44 shrink-0 border-r border-border/70 pr-3">
      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Snapshots
      </p>
      <ul className="space-y-0.5">
        {snapshots.map((item, index) => {
          const selected = index === selectedIndex;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors cursor-pointer",
                  selected
                    ? "bg-blue-50 text-foreground"
                    : "text-foreground/80 hover:bg-muted/60"
                )}
              >
                <span className="size-2 shrink-0 rounded-full bg-emerald-600" aria-hidden />
                <span>
                  {item.relative}, {item.time}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function LogsFlowToolbar({
  snapshot,
  panelOpen,
  onTogglePanel,
  onPrev,
  onNext,
  canPrev,
  canNext,
  className,
}: {
  snapshot: LogSnapshot;
  panelOpen: boolean;
  onTogglePanel: () => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 inline-flex overflow-hidden rounded-lg border border-border/70 bg-background", className)}>
      <button
        type="button"
        aria-label="Toggle snapshots panel"
        aria-pressed={panelOpen}
        onClick={onTogglePanel}
        className={cn(
          "inline-flex size-9 shrink-0 items-center justify-center border-r border-border/70 transition-colors cursor-pointer",
          panelOpen
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        )}
      >
        <PanelIcon className="size-4" />
      </button>

      <div className="inline-flex items-center gap-2 border-r border-border/70 px-3 py-2 text-sm text-foreground">
        <span className="size-2 shrink-0 rounded-full bg-emerald-600" aria-hidden />
        <span>
          Flow based on {snapshot.relative}, {snapshot.time}
        </span>
      </div>

      <button
        type="button"
        aria-label="Older snapshot"
        onClick={onPrev}
        disabled={!canPrev}
        className="inline-flex size-9 shrink-0 items-center justify-center border-r border-border/70 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
      >
        <ChevronLeft className="size-4" />
      </button>

      <button
        type="button"
        aria-label="Newer snapshot"
        onClick={onNext}
        disabled={!canNext}
        className="inline-flex size-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function FlowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M6 8v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
      <path d="M12 12v4" />
    </svg>
  );
}

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}

function PanelIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
