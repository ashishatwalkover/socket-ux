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
  type: "trigger" | "action" | "condition" | "wait" | "stop" | "loop";
  branches?: { label: string; steps: FlowStep[] }[];
  loopBody?: FlowStep[];
  loopLabel?: string;
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
  const [summaryTheme, setSummaryTheme] = useState<"dark" | "light">("light");
  const [summaryConfigureOpen, setSummaryConfigureOpen] = useState(false);
  const [summaryAdvancedOpen, setSummaryAdvancedOpen] = useState(false);
  const [summarySelectedStep, setSummarySelectedStep] = useState<number | null>(null);
  const [selectedMicroAppVersion, setSelectedMicroAppVersion] = useState<"micro-app" | "micro-app1">("micro-app");
  const [showAllStepsV2, setShowAllStepsV2] = useState(false);

  const SUMMARY_STEPS = [
    {
      label: 'Trigger: Shopify cart abandoned',
      icon: 'shopify',
      connection: { icon: 'shopify', name: 'My Store' },
      field: { label: 'When cart is abandoned', chip: 'any cart' },
      status: 'Showing data from 2h, 45:12',
      json: [
        ['{'],
        ['"cart_id"', 'k', ': ', '"cart_abc123"', 's', ','],
        ['"customer_email"', 'k', ': ', '"customer@example.com"', 's', ','],
        ['"total_value"', 'k', ': ', '129.99', 'n', ','],
        ['"items"', 'k', ': ', '3', 'n', ','],
        ['"abandoned_at"', 'k', ': ', '1783061262', 'n', ''],
        ['}']
      ]
    },
    {
      label: 'Wait 2 hours',
      icon: 'timer',
      connection: { icon: 'timer', name: 'Built-in delay' },
      field: { label: 'Wait duration', chip: '2 hours' },
      status: 'Completed at 4h, 45:12',
      json: [
        ['{'],
        ['"delay_seconds"', 'k', ': ', '7200', 'n', ','],
        ['"started_at"', 'k', ': ', '1783061262', 'n', ','],
        ['"completed_at"', 'k', ': ', '1783068462', 'n', ''],
        ['}']
      ]
    },
    {
      label: 'Check if order was completed',
      icon: 'check',
      connection: { icon: 'shopify', name: 'My Store' },
      field: { label: 'Condition', chip: 'if order exists, stop' },
      status: 'Order not found, continuing',
      json: [
        ['{'],
        ['"order_exists"', 'k', ': ', 'false', 'n', ','],
        ['"checked_at"', 'k', ': ', '1783068462', 'n', ','],
        ['"should_continue"', 'k', ': ', 'true', 'n', ''],
        ['}']
      ]
    },
    {
      label: 'Send reminder email via Gmail',
      icon: 'gmail',
      connection: { icon: 'gmail', name: 'support@store.com' },
      field: { label: 'To', chip: 'customer email' },
      status: 'Sent at 4h, 45:15',
      json: [
        ['{'],
        ['"email_id"', 'k', ': ', '"msg_xyz789"', 's', ','],
        ['"to"', 'k', ': ', '"customer@example.com"', 's', ','],
        ['"subject"', 'k', ': ', '"You left something behind!"', 's', ','],
        ['"status"', 'k', ': ', '"sent"', 's', ''],
        ['}']
      ]
    },
    {
      label: 'Retry once if email fails',
      icon: 'retry',
      dim: true,
      paused: false,
      connection: { icon: 'gmail', name: 'support@store.com' },
      field: { label: 'Retry policy', chip: 'max 1 retry' },
      status: 'No retry needed - email sent',
      json: [
        ['{'],
        ['"retry_count"', 'k', ': ', '0', 'n', ','],
        ['"max_retries"', 'k', ': ', '1', 'n', ','],
        ['"email_status"', 'k', ': ', '"sent"', 's', ''],
        ['}']
      ]
    },
    {
      label: 'Log outcome',
      icon: 'log',
      connection: { icon: 'log', name: 'System logger' },
      field: { label: 'Log level', chip: 'info' },
      status: 'Logged at 4h, 45:16',
      json: [
        ['{'],
        ['"event"', 'k', ': ', '"cart_abandonment_reminder"', 's', ','],
        ['"outcome"', 'k', ': ', '"success"', 's', ','],
        ['"timestamp"', 'k', ': ', '1783068466', 'n', ''],
        ['}']
      ]
    }
  ];

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
      <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
        {activeTab === "summary" && (
          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Summary
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">{flow.summary}</p>
            </section>

            {/* Summary App Look */}
            <div className="mt-8">
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedMicroAppVersion("micro-app")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedMicroAppVersion === "micro-app"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Version 1
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMicroAppVersion("micro-app1")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedMicroAppVersion === "micro-app1"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Version 2
                </button>
              </div>
              {selectedMicroAppVersion === "micro-app" ? (
                <div className="rounded-2xl overflow-hidden shadow-sm bg-white" data-component="micro-app">
                  <div className="p-11">
                    <h1 className="text-2xl font-semibold text-gray-900">
                      Shopify Cart Abandonment Reminder
                    </h1>
                    <p className="text-sm text-gray-500">
                      Automated Email Recovery Flow
                    </p>

                    <div className={`grid mt-6 transition-all duration-400 ${summarySelectedStep !== null ? 'grid-cols-[340px_1fr]' : 'grid-cols-[1fr]'}`}>
                    {/* Left: Configure + Steps */}
                    <div>
                      <div className="p-5 rounded-xl border bg-gray-50 border-gray-200" style={{ width: 'fit-content' }}>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setSummaryConfigureOpen(!summaryConfigureOpen);
                              if (summaryConfigureOpen) {
                                setSummarySelectedStep(null);
                              }
                            }}
                            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-lg border border-blue-500 text-blue-500 transition-colors hover:bg-gray-100 h-9 cursor-pointer"
                          >
                            Configure
                            <svg className={`transition-transform ${summaryConfigureOpen ? 'rotate-90' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                              <path d="M9 5l7 7-7 7"/>
                            </svg>
                          </button>

                          <div className={`flex gap-2.5 transition-all ${summaryConfigureOpen ? 'opacity-0 w-0 overflow-hidden' : ''}`}>
                            <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="#96bf48">
                                <path d="M11.6 0C5.2 0 .1 5.2.1 11.6c0 6.4 5.1 11.6 11.5 11.6s11.5-5.2 11.5-11.6C23.1 5.2 18 0 11.6 0zm5.6 5.7l-.5 3.2c-.1.4-.4.5-.7.4l-2.3-.4c-.4-.1-.5-.4-.4-.7l.3-1.9c-1.2-.2-2.5-.3-3.7-.3-1.3 0-2.5.1-3.8.3l.3 2c.1.4-.2.7-.6.7l-2.3.2c-.4 0-.7-.2-.8-.6l-.4-3.1C1.7 7.1.1 9.1.1 11.6c0 6.4 5.1 11.6 11.5 11.6 6.4 0 11.5-5.2 11.5-11.6 0-2.6-1.7-4.7-4.5-5.9z"/>
                              </svg>
                            </span>
                            <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <circle cx="12" cy="13" r="7.5"/>
                                <path d="M12 9v4l2.8 1.6"/>
                                <path d="M9 2.5h6"/>
                              </svg>
                            </span>
                            <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 6L9 17l-5-5"/>
                              </svg>
                            </span>
                            <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                              </svg>
                            </span>
                            <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <path d="M1 4v6h6M23 20v-6h-6"/>
                                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                              </svg>
                            </span>
                            <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10 9 9 9 8 9"/>
                              </svg>
                            </span>
                          </div>
                        </div>

                        <div className={`grid transition-all duration-300 ${summaryConfigureOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                          <div className="overflow-hidden">
                            <div className="pt-4.5 mt-4 border-t border-gray-200">
                              <div className="relative">
                                <div className="absolute left-[20px] top-6 bottom-6 w-0.5 bg-gray-200"></div>
                                {SUMMARY_STEPS.map((step, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => setSummarySelectedStep(i)}
                                    className={`relative grid grid-cols-[24px_40px_1fr_auto] items-center gap-3 p-2 w-full text-left rounded-lg transition-colors ${summarySelectedStep === i ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
                                  >
                                    <span className={`relative z-10 w-2.5 h-2.5 rounded-full justify-self-center ${step.paused ? 'bg-gray-500' : 'bg-blue-500'}`}></span>
                                    <span className={`w-9.5 h-9.5 rounded-lg flex items-center justify-center ${step.dim ? 'text-blue-500' : ''} ${step.dim ? 'opacity-70' : ''} bg-gray-100 border border-gray-200`}>
                                      {step.icon === 'instagram' && (
                                        <svg width="20" height="20" viewBox="0 0 20 20">
                                          <rect x="1.5" y="1.5" width="17" height="17" rx="5.5" fill="url(#ig-grad)"/>
                                          <rect x="6.2" y="6.2" width="7.6" height="7.6" rx="2.4" fill="none" stroke="#fff" strokeWidth="1.3"/>
                                          <circle cx="10" cy="10" r="2.3" fill="none" stroke="#fff" strokeWidth="1.3"/>
                                          <circle cx="14.1" cy="5.9" r="0.9" fill="#fff"/>
                                        </svg>
                                      )}
                                      {step.icon === 'shopify' && (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#96bf48">
                                          <path d="M11.6 0C5.2 0 .1 5.2.1 11.6c0 6.4 5.1 11.6 11.5 11.6s11.5-5.2 11.5-11.6C23.1 5.2 18 0 11.6 0zm5.6 5.7l-.5 3.2c-.1.4-.4.5-.7.4l-2.3-.4c-.4-.1-.5-.4-.4-.7l.3-1.9c-1.2-.2-2.5-.3-3.7-.3-1.3 0-2.5.1-3.8.3l.3 2c.1.4-.2.7-.6.7l-2.3.2c-.4 0-.7-.2-.8-.6l-.4-3.1C1.7 7.1.1 9.1.1 11.6c0 6.4 5.1 11.6 11.5 11.6 6.4 0 11.5-5.2 11.5-11.6 0-2.6-1.7-4.7-4.5-5.9z"/>
                                        </svg>
                                      )}
                                      {step.icon === 'timer' && (
                                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                          <circle cx="12" cy="13" r="7.5"/>
                                          <path d="M12 9v4l2.8 1.6"/>
                                          <path d="M9 2.5h6"/>
                                        </svg>
                                      )}
                                      {step.icon === 'check' && (
                                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M20 6L9 17l-5-5"/>
                                        </svg>
                                      )}
                                      {step.icon === 'gmail' && (
                                        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                                          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                        </svg>
                                      )}
                                      {step.icon === 'retry' && (
                                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                          <path d="M1 4v6h6M23 20v-6h-6"/>
                                          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                                        </svg>
                                      )}
                                      {step.icon === 'log' && (
                                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                          <polyline points="14 2 14 8 20 8"/>
                                          <line x1="16" y1="13" x2="8" y2="13"/>
                                          <line x1="16" y1="17" x2="8" y2="17"/>
                                          <polyline points="10 9 9 9 8 9"/>
                                        </svg>
                                      )}
                                    </span>
                                    <span className={`text-sm font-medium truncate ${step.dim ? 'text-gray-400' : 'text-gray-900'}`}>
                                      {step.label}
                                    </span>
                                    <span className="flex items-center gap-2">
                                      {step.paused && (
                                        <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                                          Paused
                                        </span>
                                      )}
                                      <svg className="opacity-0 group-hover:opacity-100 transition-opacity" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                        <path d="M9 5l7 7-7 7"/>
                                      </svg>
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Detail Panel */}
                    <div className={`min-w-0 overflow-hidden ${summarySelectedStep !== null ? '' : 'w-0'}`}>
                      <div className={`min-w-[420px] pl-6 ${summarySelectedStep !== null ? 'animate-in slide-in-from-left-2' : ''}`}>
                        {summarySelectedStep !== null && SUMMARY_STEPS[summarySelectedStep] && (
                          <>
                            <div className="flex items-center gap-3.5 pb-4.5 border-b mb-5.5">
                              <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                                {SUMMARY_STEPS[summarySelectedStep].icon === 'instagram' && (
                                  <svg width="20" height="20" viewBox="0 0 20 20">
                                    <rect x="1.5" y="1.5" width="17" height="17" rx="5.5" fill="url(#ig-grad)"/>
                                    <rect x="6.2" y="6.2" width="7.6" height="7.6" rx="2.4" fill="none" stroke="#fff" strokeWidth="1.3"/>
                                    <circle cx="10" cy="10" r="2.3" fill="none" stroke="#fff" strokeWidth="1.3"/>
                                    <circle cx="14.1" cy="5.9" r="0.9" fill="#fff"/>
                                  </svg>
                                )}
                                {SUMMARY_STEPS[summarySelectedStep].icon === 'shopify' && (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#96bf48">
                                    <path d="M11.6 0C5.2 0 .1 5.2.1 11.6c0 6.4 5.1 11.6 11.5 11.6s11.5-5.2 11.5-11.6C23.1 5.2 18 0 11.6 0zm5.6 5.7l-.5 3.2c-.1.4-.4.5-.7.4l-2.3-.4c-.4-.1-.5-.4-.4-.7l.3-1.9c-1.2-.2-2.5-.3-3.7-.3-1.3 0-2.5.1-3.8.3l.3 2c.1.4-.2.7-.6.7l-2.3.2c-.4 0-.7-.2-.8-.6l-.4-3.1C1.7 7.1.1 9.1.1 11.6c0 6.4 5.1 11.6 11.5 11.6 6.4 0 11.5-5.2 11.5-11.6 0-2.6-1.7-4.7-4.5-5.9z"/>
                                  </svg>
                                )}
                                {SUMMARY_STEPS[summarySelectedStep].icon === 'timer' && (
                                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                    <circle cx="12" cy="13" r="7.5"/>
                                    <path d="M12 9v4l2.8 1.6"/>
                                    <path d="M9 2.5h6"/>
                                  </svg>
                                )}
                                {SUMMARY_STEPS[summarySelectedStep].icon === 'check' && (
                                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6L9 17l-5-5"/>
                                  </svg>
                                )}
                                {SUMMARY_STEPS[summarySelectedStep].icon === 'gmail' && (
                                  <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                  </svg>
                                )}
                                {SUMMARY_STEPS[summarySelectedStep].icon === 'retry' && (
                                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                    <path d="M1 4v6h6M23 20v-6h-6"/>
                                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                                  </svg>
                                )}
                                {SUMMARY_STEPS[summarySelectedStep].icon === 'log' && (
                                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                    <polyline points="10 9 9 9 8 9"/>
                                  </svg>
                                )}
                              </span>
                              <h3 className="text-xl font-semibold flex-1 text-gray-900">
                                {SUMMARY_STEPS[summarySelectedStep].label}
                              </h3>
                              <button
                                type="button"
                                onClick={() => setSummarySelectedStep(null)}
                                className="w-8.5 h-8.5 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <path d="M5 5l14 14M19 5L5 19"/>
                                </svg>
                              </button>
                            </div>

                            <div className="flex items-center flex-wrap gap-3.5 p-5 rounded-xl border mb-4 bg-gray-50 border-gray-200">
                              <span className="text-sm text-gray-900 font-medium">
                                Using Connection <span className="text-red-500">*</span>
                              </span>
                              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-200 text-sm font-medium text-gray-900">
                                {SUMMARY_STEPS[summarySelectedStep].connection.name}
                              </span>
                              <span className="text-xs font-bold tracking-wider text-blue-500 cursor-pointer">
                                ADD TITLE
                              </span>
                            </div>

                            <div className="flex items-center flex-wrap gap-3.5 p-5 rounded-xl border mb-4 bg-gray-50 border-gray-200">
                              <span className="text-sm text-gray-900 font-medium">
                                {SUMMARY_STEPS[summarySelectedStep].field.label} <span className="text-red-500">*</span>
                              </span>
                              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-200 text-sm font-medium text-gray-900">
                                {SUMMARY_STEPS[summarySelectedStep].field.chip}
                                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-500">
                                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M5 5l14 14M19 5L5 19"/>
                                  </svg>
                                </span>
                              </span>
                            </div>

                            <div className="flex gap-2.5 my-1 mb-5.5">
                              <button className="px-6 py-2.5 rounded-lg border-2 border-blue-500 text-blue-500 text-sm font-bold tracking-wider">
                                TEST
                              </button>
                              <button className="px-6 py-2.5 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 text-sm font-bold tracking-wider" disabled>
                                SAVE
                              </button>
                            </div>

                            <div className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-lg border mb-5 bg-gray-50 border-gray-200 text-sm text-gray-900">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              {SUMMARY_STEPS[summarySelectedStep].status}
                            </div>

                            <div className="flex justify-end mb-2.5">
                              <span className="text-sm font-bold tracking-wider text-blue-500 pb-1.5 border-b-2.5 border-blue-500">
                                RESPONSE
                              </span>
                            </div>

                            <div className="rounded-xl border p-4 bg-gray-50 border-gray-200">
                              <p className="text-sm text-gray-500 mb-2.5">body</p>
                              <div className="overflow-x-auto rounded-lg">
                                <div className="rounded-lg p-3.5 font-mono text-sm leading-7 min-w-[320px] bg-gray-100 text-gray-900">
                                  {SUMMARY_STEPS[summarySelectedStep].json.map((line, idx) => {
                                    if (line.length === 1) return <div key={idx}><span className="text-gray-500 inline-block w-[2.2em] mr-2">{idx + 1}</span>{line[0]}</div>;
                                    const keyColor = '#c2453a';
                                    const strColor = '#b05a1e';
                                    const numColor = '#9a6b10';
                                    let valColor = strColor;
                                    if (line[4] === 'n') valColor = numColor;
                                    if (line[4] === 'k') valColor = keyColor;
                                    return (
                                      <div key={idx}>
                                        <span className="text-gray-500 inline-block w-[2.2em] mr-2">{idx + 1}</span>
                                        <span style={{ color: keyColor }}>{line[0]}</span>{line[2]}<span style={{ color: valColor }}>{line[3]}</span>{line[5]}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="h-8"></div>
                  <div className="border-t border-gray-200"></div>

                  <button
                    type="button"
                    onClick={() => setSummaryAdvancedOpen(!summaryAdvancedOpen)}
                    className="inline-flex items-center gap-1.5 mt-4.5 text-sm font-semibold underline underline-offset-4 text-gray-500 hover:text-gray-700"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.7 7.7 0 0 0-1.7-1L15 3h-4l-.3 2.9a7.7 7.7 0 0 0-1.7 1l-2.4-1-2 3.4L6.6 11a7.6 7.6 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.7 7.7 0 0 0 1.7 1L11 21h4l.3-2.9a7.7 7.7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6Z"/>
                    </svg>
                    Advanced flow
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-gray-100 text-gray-400">
                      optional
                    </span>
                  </button>

                  <div className={`grid transition-all duration-280 ${summaryAdvancedOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className="text-sm mt-3 mb-3.5 text-gray-500">
                        Add extra steps to customize this template.
                      </p>
                      <button className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-lg border text-xs font-bold tracking-wider hover:bg-gray-100">
                        <div className="flex">
                          <span className="w-5 h-5 rounded flex items-center justify-center ml-0" style={{ background: '#20a95a' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                              <path d="M6 3h9l3 3v15H6z"/>
                              <path d="M9 12h6M9 16h6M9 8h3"/>
                            </svg>
                          </span>
                          <span className="w-5 h-5 rounded flex items-center justify-center -ml-1.5" style={{ background: '#e8792f' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                              <path d="M12 3 4 7v10l8 4 8-4V7z"/>
                              <path d="M4 7l8 4 8-4M12 11v10"/>
                            </svg>
                          </span>
                          <span className="w-5 h-5 rounded flex items-center justify-center -ml-1.5" style={{ background: '#c04ab0' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                              <rect x="3.5" y="4.5" width="17" height="15" rx="2"/>
                              <path d="m6 16 4-4.5 3 3 3-3.5 3 5"/>
                            </svg>
                          </span>
                        </div>
                        SWITCH TO ADVANCED FLOW →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden shadow-sm bg-white" data-component="micro-app1">
                <div className="p-11">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Shopify Cart Abandonment Reminder
                  </h1>
                  <p className="text-sm text-gray-500">
                    Automated Email Recovery Flow
                  </p>

                  <div className={`grid mt-6 transition-all duration-400 ${summarySelectedStep !== null ? 'grid-cols-[340px_1fr]' : 'grid-cols-[1fr]'}`}>
                  {/* Left: Configure + Steps */}
                  <div>
                    <div className="p-5 rounded-xl border bg-gray-50 border-gray-200" style={{ width: 'fit-content' }}>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSummaryConfigureOpen(!summaryConfigureOpen);
                            if (summaryConfigureOpen) {
                              setSummarySelectedStep(null);
                            }
                          }}
                          className="inline-flex items-center gap-2 px-5 py-1.5 rounded-lg border border-blue-500 text-blue-500 transition-colors hover:bg-gray-100 h-9 cursor-pointer"
                        >
                          Configure
                          <svg className={`transition-transform ${summaryConfigureOpen ? 'rotate-90' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                            <path d="M9 5l7 7-7 7"/>
                          </svg>
                        </button>

                        <div className={`flex gap-2.5 transition-all ${summaryConfigureOpen ? 'opacity-0 w-0 overflow-hidden' : ''}`}>
                          <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#96bf48">
                              <path d="M11.6 0C5.2 0 .1 5.2.1 11.6c0 6.4 5.1 11.6 11.5 11.6s11.5-5.2 11.5-11.6C23.1 5.2 18 0 11.6 0zm5.6 5.7l-.5 3.2c-.1.4-.4.5-.7.4l-2.3-.4c-.4-.1-.5-.4-.4-.7l.3-1.9c-1.2-.2-2.5-.3-3.7-.3-1.3 0-2.5.1-3.8.3l.3 2c.1.4-.2.7-.6.7l-2.3.2c-.4 0-.7-.2-.8-.6l-.4-3.1C1.7 7.1.1 9.1.1 11.6c0 6.4 5.1 11.6 11.5 11.6 6.4 0 11.5-5.2 11.5-11.6 0-2.6-1.7-4.7-4.5-5.9z"/>
                            </svg>
                          </span>
                          <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                              <circle cx="12" cy="13" r="7.5"/>
                              <path d="M12 9v4l2.8 1.6"/>
                              <path d="M9 2.5h6"/>
                            </svg>
                          </span>
                          <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 6L9 17l-5-5"/>
                            </svg>
                          </span>
                          <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                          </span>
                          <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                              <path d="M1 4v6h6M23 20v-6h-6"/>
                              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                            </svg>
                          </span>
                          <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                              <line x1="16" y1="13" x2="8" y2="13"/>
                              <line x1="16" y1="17" x2="8" y2="17"/>
                              <polyline points="10 9 9 9 8 9"/>
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div className={`grid transition-all duration-300 ${summaryConfigureOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        <div className="overflow-hidden">
                          <div className="pt-4.5 mt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between pb-3 mb-1">
                              <span className="text-xs font-medium text-gray-700">Show all steps</span>
                              <button
                                type="button"
                                onClick={() => setShowAllStepsV2(!showAllStepsV2)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${showAllStepsV2 ? 'bg-blue-500' : 'bg-gray-300'}`}
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showAllStepsV2 ? 'translate-x-4' : 'translate-x-0.5'}`}/>
                              </button>
                            </div>
                            <div className="relative">
                              {SUMMARY_STEPS.map((step, i) => showAllStepsV2 || i === 0 || i === 1 || i === 3 ? (
                                <div
                                  key={i}
                                  className="group relative grid grid-cols-[40px_1fr] items-start gap-3 p-2 w-full text-left rounded-lg"
                                >
                                  <span className={`w-9.5 h-9.5 rounded-lg flex items-center justify-center mt-1 ${step.dim ? 'text-blue-500' : ''} ${step.dim ? 'opacity-70' : ''} bg-gray-100 border border-gray-200`}>
                                    {step.icon === 'instagram' && (
                                      <svg width="20" height="20" viewBox="0 0 20 20">
                                        <rect x="1.5" y="1.5" width="17" height="17" rx="5.5" fill="url(#ig-grad)"/>
                                        <rect x="6.2" y="6.2" width="7.6" height="7.6" rx="2.4" fill="none" stroke="#fff" strokeWidth="1.3"/>
                                        <circle cx="10" cy="10" r="2.3" fill="none" stroke="#fff" strokeWidth="1.3"/>
                                        <circle cx="14.1" cy="5.9" r="0.9" fill="#fff"/>
                                      </svg>
                                    )}
                                    {step.icon === 'shopify' && (
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#96bf48">
                                        <path d="M11.6 0C5.2 0 .1 5.2.1 11.6c0 6.4 5.1 11.6 11.5 11.6s11.5-5.2 11.5-11.6C23.1 5.2 18 0 11.6 0zm5.6 5.7l-.5 3.2c-.1.4-.4.5-.7.4l-2.3-.4c-.4-.1-.5-.4-.4-.7l.3-1.9c-1.2-.2-2.5-.3-3.7-.3-1.3 0-2.5.1-3.8.3l.3 2c.1.4-.2.7-.6.7l-2.3.2c-.4 0-.7-.2-.8-.6l-.4-3.1C1.7 7.1.1 9.1.1 11.6c0 6.4 5.1 11.6 11.5 11.6 6.4 0 11.5-5.2 11.5-11.6 0-2.6-1.7-4.7-4.5-5.9z"/>
                                      </svg>
                                    )}
                                    {step.icon === 'timer' && (
                                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                        <circle cx="12" cy="13" r="7.5"/>
                                        <path d="M12 9v4l2.8 1.6"/>
                                        <path d="M9 2.5h6"/>
                                      </svg>
                                    )}
                                    {step.icon === 'check' && (
                                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 6L9 17l-5-5"/>
                                      </svg>
                                    )}
                                    {step.icon === 'gmail' && (
                                      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                      </svg>
                                    )}
                                    {step.icon === 'retry' && (
                                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                        <path d="M1 4v6h6M23 20v-6h-6"/>
                                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                                      </svg>
                                    )}
                                    {step.icon === 'log' && (
                                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                        <line x1="16" y1="13" x2="8" y2="13"/>
                                        <line x1="16" y1="17" x2="8" y2="17"/>
                                        <polyline points="10 9 9 9 8 9"/>
                                      </svg>
                                    )}
                                  </span>
                                  <div className="flex flex-col gap-2 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className={`text-sm font-medium truncate ${step.dim ? 'text-gray-400' : 'text-gray-900'}`}>
                                        {step.label}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setSummarySelectedStep(i)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium text-blue-500 hover:text-blue-600 cursor-pointer"
                                      >
                                        Advance →
                                      </button>
                                    </div>
                                    <div className="flex items-center flex-wrap gap-2 p-2.5 rounded-lg border bg-gray-50 border-gray-200">
                                      <span className="text-xs text-gray-900 font-medium">
                                        {step.field.label} <span className="text-red-500">*</span>
                                      </span>
                                      <input
                                        type="text"
                                        defaultValue={step.field.chip}
                                        className="flex-1 min-w-0 px-2.5 py-1 rounded-md border border-gray-300 bg-white text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ) : null)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Detail Panel */}
                  <div className={`min-w-0 overflow-hidden ${summarySelectedStep !== null ? '' : 'w-0'}`}>
                    <div className={`min-w-[420px] pl-6 ${summarySelectedStep !== null ? 'animate-in slide-in-from-left-2' : ''}`}>
                      {summarySelectedStep !== null && SUMMARY_STEPS[summarySelectedStep] && (
                        <>
                          <div className="flex items-center gap-3.5 pb-4.5 border-b mb-5.5">
                            <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                              {SUMMARY_STEPS[summarySelectedStep].icon === 'instagram' && (
                                <svg width="20" height="20" viewBox="0 0 20 20">
                                  <rect x="1.5" y="1.5" width="17" height="17" rx="5.5" fill="url(#ig-grad)"/>
                                  <rect x="6.2" y="6.2" width="7.6" height="7.6" rx="2.4" fill="none" stroke="#fff" strokeWidth="1.3"/>
                                  <circle cx="10" cy="10" r="2.3" fill="none" stroke="#fff" strokeWidth="1.3"/>
                                  <circle cx="14.1" cy="5.9" r="0.9" fill="#fff"/>
                                </svg>
                              )}
                              {SUMMARY_STEPS[summarySelectedStep].icon === 'shopify' && (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#96bf48">
                                  <path d="M11.6 0C5.2 0 .1 5.2.1 11.6c0 6.4 5.1 11.6 11.5 11.6s11.5-5.2 11.5-11.6C23.1 5.2 18 0 11.6 0zm5.6 5.7l-.5 3.2c-.1.4-.4.5-.7.4l-2.3-.4c-.4-.1-.5-.4-.4-.7l.3-1.9c-1.2-.2-2.5-.3-3.7-.3-1.3 0-2.5.1-3.8.3l.3 2c.1.4-.2.7-.6.7l-2.3.2c-.4 0-.7-.2-.8-.6l-.4-3.1C1.7 7.1.1 9.1.1 11.6c0 6.4 5.1 11.6 11.5 11.6 6.4 0 11.5-5.2 11.5-11.6 0-2.6-1.7-4.7-4.5-5.9z"/>
                                </svg>
                              )}
                              {SUMMARY_STEPS[summarySelectedStep].icon === 'timer' && (
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                  <circle cx="12" cy="13" r="7.5"/>
                                  <path d="M12 9v4l2.8 1.6"/>
                                  <path d="M9 2.5h6"/>
                                </svg>
                              )}
                              {SUMMARY_STEPS[summarySelectedStep].icon === 'check' && (
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M20 6L9 17l-5-5"/>
                                </svg>
                              )}
                              {SUMMARY_STEPS[summarySelectedStep].icon === 'gmail' && (
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                </svg>
                              )}
                              {SUMMARY_STEPS[summarySelectedStep].icon === 'retry' && (
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                  <path d="M1 4v6h6M23 20v-6h-6"/>
                                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                                </svg>
                              )}
                              {SUMMARY_STEPS[summarySelectedStep].icon === 'log' && (
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                  <polyline points="14 2 14 8 20 8"/>
                                  <line x1="16" y1="13" x2="8" y2="13"/>
                                  <line x1="16" y1="17" x2="8" y2="17"/>
                                  <polyline points="10 9 9 9 8 9"/>
                                </svg>
                              )}
                            </span>
                            <h3 className="text-xl font-semibold flex-1 text-gray-900">
                              {SUMMARY_STEPS[summarySelectedStep].label}
                            </h3>
                            <button
                              type="button"
                              onClick={() => setSummarySelectedStep(null)}
                              className="w-8.5 h-8.5 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <path d="M5 5l14 14M19 5L5 19"/>
                              </svg>
                            </button>
                          </div>

                          <div className="flex items-center flex-wrap gap-3.5 p-5 rounded-xl border mb-4 bg-gray-50 border-gray-200">
                            <span className="text-sm text-gray-900 font-medium">
                              Using Connection <span className="text-red-500">*</span>
                            </span>
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-200 text-sm font-medium text-gray-900">
                              {SUMMARY_STEPS[summarySelectedStep].connection.name}
                            </span>
                            <span className="text-xs font-bold tracking-wider text-blue-500 cursor-pointer">
                              ADD TITLE
                            </span>
                          </div>

                          <div className="flex items-center flex-wrap gap-3.5 p-5 rounded-xl border mb-4 bg-gray-50 border-gray-200">
                            <span className="text-sm text-gray-900 font-medium">
                              {SUMMARY_STEPS[summarySelectedStep].field.label} <span className="text-red-500">*</span>
                            </span>
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-200 text-sm font-medium text-gray-900">
                              {SUMMARY_STEPS[summarySelectedStep].field.chip}
                              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-500">
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <path d="M5 5l14 14M19 5L5 19"/>
                                </svg>
                              </span>
                            </span>
                          </div>

                          <div className="flex gap-2.5 my-1 mb-5.5">
                            <button className="px-6 py-2.5 rounded-lg border-2 border-blue-500 text-blue-500 text-sm font-bold tracking-wider">
                              TEST
                            </button>
                            <button className="px-6 py-2.5 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 text-sm font-bold tracking-wider" disabled>
                              SAVE
                            </button>
                          </div>

                          <div className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-lg border mb-5 bg-gray-50 border-gray-200 text-sm text-gray-900">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            {SUMMARY_STEPS[summarySelectedStep].status}
                          </div>

                          <div className="flex justify-end mb-2.5">
                            <span className="text-sm font-bold tracking-wider text-blue-500 pb-1.5 border-b-2.5 border-blue-500">
                              RESPONSE
                            </span>
                          </div>

                          <div className="rounded-xl border p-4 bg-gray-50 border-gray-200">
                            <p className="text-sm text-gray-500 mb-2.5">body</p>
                            <div className="overflow-x-auto rounded-lg">
                              <div className="rounded-lg p-3.5 font-mono text-sm leading-7 min-w-[320px] bg-gray-100 text-gray-900">
                                {SUMMARY_STEPS[summarySelectedStep].json.map((line, idx) => {
                                  if (line.length === 1) return <div key={idx}><span className="text-gray-500 inline-block w-[2.2em] mr-2">{idx + 1}</span>{line[0]}</div>;
                                  const keyColor = '#c2453a';
                                  const strColor = '#b05a1e';
                                  const numColor = '#9a6b10';
                                  let valColor = strColor;
                                  if (line[4] === 'n') valColor = numColor;
                                  if (line[4] === 'k') valColor = keyColor;
                                  return (
                                    <div key={idx}>
                                      <span className="text-gray-500 inline-block w-[2.2em] mr-2">{idx + 1}</span>
                                      <span style={{ color: keyColor }}>{line[0]}</span>{line[2]}<span style={{ color: valColor }}>{line[3]}</span>{line[5]}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="h-8"></div>
                <div className="border-t border-gray-200"></div>

                <button
                  type="button"
                  onClick={() => setSummaryAdvancedOpen(!summaryAdvancedOpen)}
                  className="inline-flex items-center gap-1.5 mt-4.5 text-sm font-semibold underline underline-offset-4 text-gray-500 hover:text-gray-700"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.7 7.7 0 0 0-1.7-1L15 3h-4l-.3 2.9a7.7 7.7 0 0 0-1.7 1l-2.4-1-2 3.4L6.6 11a7.6 7.6 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.7 7.7 0 0 0 1.7 1L11 21h4l.3-2.9a7.7 7.7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6Z"/>
                  </svg>
                  Advanced flow
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-gray-100 text-gray-400">
                    optional
                  </span>
                </button>

                <div className={`grid transition-all duration-280 ${summaryAdvancedOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="text-sm mt-3 mb-3.5 text-gray-500">
                      Add extra steps to customize this template.
                    </p>
                    <button className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-lg border text-xs font-bold tracking-wider hover:bg-gray-100">
                      <div className="flex">
                        <span className="w-5 h-5 rounded flex items-center justify-center ml-0" style={{ background: '#20a95a' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                            <path d="M6 3h9l3 3v15H6z"/>
                            <path d="M9 12h6M9 16h6M9 8h3"/>
                          </svg>
                        </span>
                        <span className="w-5 h-5 rounded flex items-center justify-center -ml-1.5" style={{ background: '#e8792f' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                            <path d="M12 3 4 7v10l8 4 8-4V7z"/>
                            <path d="M4 7l8 4 8-4M12 11v10"/>
                          </svg>
                        </span>
                        <span className="w-5 h-5 rounded flex items-center justify-center -ml-1.5" style={{ background: '#c04ab0' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                            <rect x="3.5" y="4.5" width="17" height="15" rx="2"/>
                            <path d="m6 16 4-4.5 3 3 3-3.5 3 5"/>
                          </svg>
                        </span>
                      </div>
                      SWITCH TO ADVANCED FLOW →
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}
            
            {/* SVG gradient definition */}
            <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
              <defs>
                <linearGradient id="ig-grad" x1="0" y1="20" x2="20" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#feda75"/>
                  <stop offset="0.35" stopColor="#d62976"/>
                  <stop offset="0.7" stopColor="#962fbf"/>
                  <stop offset="1" stopColor="#4f5bd5"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
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
          {
            id: "loop-1",
            title: "For each pending item",
            subtitle: "Loop",
            app: "loop",
            type: "loop",
            loopLabel: "FOR EACH item",
            loopBody: [
              {
                id: "loop-action-1",
                title: "Notify customer via Slack",
                subtitle: "Action",
                app: "slack",
                type: "action",
              },
            ],
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
    loop: "bg-indigo-500",
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
    loop: "↻",
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
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleCollapse = (stepId: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  };

  return (
    <div className="w-full">
      <FlowSteps
        steps={steps}
        onStepClick={onStepClick}
        selectedStepId={selectedStepId}
        collapsed={collapsed}
        toggleCollapse={toggleCollapse}
        isRoot
      />
    </div>
  );
}

type SectionLabelProps = {
  kind: "when" | "do" | "if" | "else" | "loop";
  count?: number;
  text?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
};

function SectionLabel({ kind, count, text, collapsible, collapsed, onToggle }: SectionLabelProps) {
  const styles: Record<SectionLabelProps["kind"], { label: string; cls: string }> = {
    when: { label: "WHEN", cls: "bg-black text-white" },
    do: { label: "DO", cls: "bg-black text-white" },
    if: { label: "IF", cls: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100" },
    else: { label: "ELSE", cls: "bg-pink-50 text-pink-600 ring-1 ring-pink-100" },
    loop: { label: "LOOP", cls: "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100" },
  };
  const s = styles[kind];
  const content = (
    <>
      <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${s.cls}`}>
        {s.label}
      </span>
      {text && <span className="text-sm font-semibold text-foreground">{text}</span>}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">
          {count} step{count !== 1 ? "s" : ""}
        </span>
      )}
      {collapsible && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-3 text-muted-foreground transition-transform ${collapsed ? "-rotate-90" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      )}
    </>
  );
  if (collapsible) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 py-1.5 relative z-10 cursor-pointer hover:opacity-80 transition-opacity"
      >
        {content}
      </button>
    );
  }
  return <div className="flex items-center gap-2 py-1.5 relative z-10">{content}</div>;
}

function FlowSteps({
  steps,
  onStepClick,
  selectedStepId,
  collapsed,
  toggleCollapse,
  isRoot = false,
}: {
  steps: FlowStep[];
  onStepClick: (step: FlowStep) => void;
  selectedStepId?: string;
  collapsed: Set<string>;
  toggleCollapse: (id: string) => void;
  isRoot?: boolean;
}) {
  return (
    <div className="relative">
      <div className="flex flex-col">
        {steps.map((step, idx) => {
          const hasBranches = !!step.branches;
          const isLoop = step.type === "loop" && step.loopBody;
          const isCollapsed = collapsed.has(step.id);
          // Skip line on the trigger (first root step); line starts from the DO step's first card
          const showLine = !(isRoot && idx === 0);
          // For the DO step, offset the line to start below the DO label
          const lineTopClass = isRoot && idx === 1 ? "top-[44px]" : "top-0";

          return (
            <div key={step.id} className="relative">
              {showLine && (
                <div className={`absolute ${lineTopClass} bottom-0 left-[20px] w-px bg-black`} />
              )}
              {/* WHEN / DO labels for root level */}
              {isRoot && idx === 0 && <SectionLabel kind="when" />}
              {isRoot && idx === 1 && <SectionLabel kind="do" />}

              {/* Step card row — hidden for condition/loop since IF/ELSE/LOOP labels serve as headers */}
              {!hasBranches && !isLoop && (
                <div className="flex items-center gap-2 py-1.5 relative">
                  <div
                    onClick={() => onStepClick(step)}
                    className={`relative z-10 inline-flex w-fit items-center gap-2.5 rounded-xl border bg-white px-3 py-2.5 transition-all cursor-pointer ${
                      selectedStepId === step.id
                        ? "border-2 border-black shadow-sm"
                        : step.type === "stop"
                        ? "border-rose-200 hover:shadow-sm"
                        : "border-border/80 hover:border-violet-300 hover:shadow-sm"
                    }`}
                  >
                    <AppIconBadge app={step.app} />
                    <span className="text-sm font-semibold text-foreground whitespace-nowrap">{step.title}</span>
                    {step.subtitle && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{step.subtitle}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Branches (IF / ELSE) */}
              {hasBranches && (
                <div className="mt-1 mb-2 space-y-1">
                  {step.branches!.map((branch) => {
                    const kind = branch.label === "Yes" ? "if" : "else";
                    const sectionId = `${step.id}::${branch.label}`;
                    const branchCollapsed = collapsed.has(sectionId);
                    return (
                      <div key={branch.label} className="relative">
                        <SectionLabel
                          kind={kind}
                          text={step.title}
                          count={branch.steps.length}
                          collapsible
                          collapsed={branchCollapsed}
                          onToggle={() => toggleCollapse(sectionId)}
                        />
                        {!branchCollapsed && (
                          <div className="mt-1 ml-10">
                            <FlowSteps
                              steps={branch.steps}
                              onStepClick={onStepClick}
                              selectedStepId={selectedStepId}
                              collapsed={collapsed}
                              toggleCollapse={toggleCollapse}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Loop body */}
              {isLoop && (() => {
                const sectionId = `${step.id}::loop`;
                const loopSectionCollapsed = collapsed.has(sectionId);
                return (
                  <div className="mt-1 mb-2">
                    <SectionLabel
                      kind="loop"
                      text={step.loopLabel || "Repeat"}
                      count={step.loopBody!.length}
                      collapsible
                      collapsed={loopSectionCollapsed}
                      onToggle={() => toggleCollapse(sectionId)}
                    />
                    {!loopSectionCollapsed && (
                      <div className="mt-1 ml-10 w-fit rounded-xl border border-dashed border-indigo-200 bg-indigo-50/20 p-2">
                        <FlowSteps
                          steps={step.loopBody!}
                          onStepClick={onStepClick}
                          selectedStepId={selectedStepId}
                          collapsed={collapsed}
                          toggleCollapse={toggleCollapse}
                        />
                      </div>
                    )}
                  </div>
                );
              })()}
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
