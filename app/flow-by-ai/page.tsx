"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type FlowStep = {
  id: string;
  kind: "trigger" | "action" | "condition";
  title: string;
  subtitle: string;
  branch?: "yes" | "no";
  depth?: number;
};

type Message = { role: "user" | "assistant"; content: string };

type ExampleWorkflow = {
  id: string;
  label: string;
  prompt: string;
  steps: FlowStep[];
};

type AppIntegration = {
  id: string;
  name: string;
  icon: string;
};

type ReadinessResult = {
  flowValid: boolean;
  apps: AppIntegration[];
  message: string;
};

const INTEGRATION_RULES: { match: RegExp; app: AppIntegration }[] = [
  { match: /sheet|spreadsheet/i, app: { id: "sheets", name: "Google Sheets", icon: "📊" } },
  { match: /gmail|email|inbox/i, app: { id: "gmail", name: "Gmail", icon: "✉️" } },
  { match: /slack/i, app: { id: "slack", name: "Slack", icon: "💬" } },
  { match: /notion/i, app: { id: "notion", name: "Notion", icon: "📝" } },
  { match: /airtable/i, app: { id: "airtable", name: "Airtable", icon: "🗂️" } },
  { match: /shopify/i, app: { id: "shopify", name: "Shopify", icon: "🛒" } },
  { match: /whatsapp/i, app: { id: "whatsapp", name: "WhatsApp", icon: "📱" } },
  { match: /\bsms\b/i, app: { id: "twilio", name: "Twilio SMS", icon: "📲" } },
  { match: /\bcrm\b/i, app: { id: "crm", name: "CRM", icon: "👥" } },
];

function getRequiredIntegrations(steps: FlowStep[]): AppIntegration[] {
  const apps = new Map<string, AppIntegration>();
  for (const step of steps) {
    const text = `${step.title} ${step.subtitle}`;
    for (const rule of INTEGRATION_RULES) {
      if (rule.match.test(text)) apps.set(rule.app.id, rule.app);
    }
  }
  return Array.from(apps.values());
}

function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const SHEETS_STEPS: FlowStep[] = [
  { id: "1", kind: "trigger", title: "New Row in Google Sheets", subtitle: "Spreadsheet updated" },
  { id: "2", kind: "action", title: "Format notification message", subtitle: "Transform row data" },
  { id: "3", kind: "action", title: "Send Slack message", subtitle: "Post to #updates channel" },
];

const SHOPIFY_ORDER_STEPS: FlowStep[] = [
  { id: "s1", kind: "trigger", title: "New Shopify Order", subtitle: "Order created in Shopify", depth: 0 },
  { id: "s2", kind: "action", title: "Validate Payment", subtitle: "Verify payment status", depth: 0 },
  { id: "s3", kind: "action", title: "Check Fraud Score (AI)", subtitle: "AI fraud risk analysis", depth: 0 },
  { id: "s4", kind: "condition", title: "IF Fraud Risk High", subtitle: "Evaluate fraud score threshold", depth: 0 },
  { id: "s5", kind: "action", title: "Hold Order", subtitle: "Pause order processing", depth: 1, branch: "yes" },
  { id: "s6", kind: "action", title: "Notify Admin", subtitle: "Alert admin of high-risk order", depth: 1, branch: "yes" },
  { id: "s7", kind: "action", title: "Check Inventory", subtitle: "Verify stock levels", depth: 1, branch: "no" },
  { id: "s8", kind: "condition", title: "IF Stock Available", subtitle: "Check if items are in stock", depth: 1, branch: "no" },
  { id: "s9", kind: "action", title: "Reserve Inventory", subtitle: "Lock stock for order", depth: 2, branch: "yes" },
  { id: "s10", kind: "action", title: "Create Shipment", subtitle: "Generate shipping label", depth: 2, branch: "yes" },
  { id: "s11", kind: "action", title: "Generate Invoice PDF", subtitle: "Create invoice document", depth: 2, branch: "yes" },
  { id: "s12", kind: "action", title: "Send Order Confirmation Email", subtitle: "Email customer confirmation", depth: 2, branch: "yes" },
  { id: "s13", kind: "action", title: "Send SMS Update", subtitle: "SMS shipment notification", depth: 2, branch: "yes" },
  { id: "s14", kind: "action", title: "Send WhatsApp Tracking Message", subtitle: "WhatsApp delivery update", depth: 2, branch: "yes" },
  { id: "s15", kind: "action", title: "Update CRM", subtitle: "Sync order to CRM", depth: 2, branch: "yes" },
  { id: "s16", kind: "action", title: "Add Loyalty Points", subtitle: "Credit customer rewards", depth: 2, branch: "yes" },
  { id: "s17", kind: "action", title: "Notify Warehouse Team", subtitle: "Alert warehouse to pack", depth: 2, branch: "yes" },
  { id: "s18", kind: "action", title: "Track Delivery Status", subtitle: "Monitor shipment progress", depth: 2, branch: "yes" },
  { id: "s19", kind: "condition", title: "IF Delivery Delayed", subtitle: "Check if delivery is late", depth: 2, branch: "yes" },
  { id: "s20", kind: "action", title: "Notify Customer", subtitle: "Alert customer of delay", depth: 3, branch: "yes" },
  { id: "s21", kind: "action", title: "Check Alternative Warehouse", subtitle: "Search other locations", depth: 2, branch: "no" },
  { id: "s22", kind: "condition", title: "IF Available Elsewhere", subtitle: "Check alternate warehouse stock", depth: 2, branch: "no" },
  { id: "s23", kind: "action", title: "Split Shipment", subtitle: "Ship from multiple warehouses", depth: 3, branch: "yes" },
  { id: "s24", kind: "action", title: "Send Out-of-Stock Email", subtitle: "Notify customer of stock issue", depth: 3, branch: "no" },
  { id: "s25", kind: "action", title: "Offer Refund OR Waitlist", subtitle: "Customer recovery options", depth: 3, branch: "no" },
  { id: "s26", kind: "action", title: "Notify Procurement Team", subtitle: "Alert team to restock", depth: 3, branch: "no" },
];

const EXAMPLE_WORKFLOWS: ExampleWorkflow[] = [
  {
    id: "sheets",
    label: "Google Sheets → Slack",
    prompt: "When a new row is added to Google Sheets, send a Slack notification",
    steps: SHEETS_STEPS,
  },
  {
    id: "notion",
    label: "Daily email summary in Notion",
    prompt: "Every morning at 9am, fetch unread emails and create a summary in Notion",
    steps: [
      { id: "n1", kind: "trigger", title: "Daily at 9:00 AM", subtitle: "Cron schedule trigger" },
      { id: "n2", kind: "action", title: "Fetch unread emails", subtitle: "Pull from inbox" },
      { id: "n3", kind: "action", title: "Summarize with AI", subtitle: "Generate daily digest" },
      { id: "n4", kind: "action", title: "Create Notion page", subtitle: "Save summary to workspace" },
    ],
  },
  {
    id: "airtable",
    label: "Form → Airtable",
    prompt: "When a form is submitted, validate the data and add it to Airtable",
    steps: [
      { id: "a1", kind: "trigger", title: "Form submitted", subtitle: "New submission received" },
      { id: "a2", kind: "action", title: "Validate form data", subtitle: "Check required fields" },
      { id: "a3", kind: "action", title: "Add row to Airtable", subtitle: "Insert validated record" },
    ],
  },
  {
    id: "shopify",
    label: "New Shopify Order",
    prompt: "When a new Shopify order arrives, validate payment, check fraud with AI, and fulfill or hold the order based on inventory",
    steps: SHOPIFY_ORDER_STEPS,
  },
];

const STEP_KIND_STYLES: Record<FlowStep["kind"], string> = {
  trigger: "bg-blue-100 text-blue-700",
  action: "bg-green-100 text-green-700",
  condition: "bg-orange-100 text-orange-700",
};

const BRANCH_STYLES: Record<"yes" | "no", string> = {
  yes: "bg-emerald-100 text-emerald-700",
  no: "bg-red-100 text-red-700",
};

function IconSparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className={className}>
      <path d="M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6L12 2zM19 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1zM5 15l.7 1.6L7.3 17.3 5.7 18l-.7 1.6L4.3 18l-1.6-.7 1.6-.7L5 15z" />
    </svg>
  );
}

function resolveWorkflow(prompt: string): FlowStep[] {
  const match = EXAMPLE_WORKFLOWS.find((w) => w.prompt === prompt);
  return match?.steps ?? SHEETS_STEPS;
}

export default function FlowByAIPage() {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! Describe the workflow you want to build and I'll create the steps for you on the right. You can refine it anytime.",
    },
  ]);
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [generating, setGenerating] = useState(false);
  const [buildingStepIndex, setBuildingStepIndex] = useState<number | null>(null);
  const [pendingSteps, setPendingSteps] = useState<FlowStep[]>([]);
  const [checkingReadiness, setCheckingReadiness] = useState(false);
  const [readinessResult, setReadinessResult] = useState<ReadinessResult | null>(null);
  const [connectedApps, setConnectedApps] = useState<Set<string>>(new Set());
  const [connectingAppId, setConnectingAppId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [input]);

  const buildSteps = (stepsToBuild: FlowStep[]) => {
    setPendingSteps(stepsToBuild);
    setSteps([]);
    setBuildingStepIndex(0);

    const interval = Math.min(400, Math.max(150, 4000 / stepsToBuild.length));

    stepsToBuild.forEach((step, index) => {
      window.setTimeout(() => {
        setSteps((prev) => [...prev, step]);
        setBuildingStepIndex(index + 1 < stepsToBuild.length ? index + 1 : null);
      }, (index + 1) * interval);
    });

    window.setTimeout(() => {
      setGenerating(false);
      setBuildingStepIndex(null);
    }, stepsToBuild.length * interval + 200);
  };

  const send = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || generating) return;

    const workflowSteps = resolveWorkflow(value);

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: value }]);
    setGenerating(true);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Got it — I'm building your workflow now. Watch the steps appear on the right.",
        },
      ]);
      buildSteps(workflowSteps);
    }, 600);
  };

  const reset = () => {
    setSteps([]);
    setPendingSteps([]);
    setBuildingStepIndex(null);
    setGenerating(false);
    setInput("");
    setReadinessResult(null);
    setConnectedApps(new Set());
    setConnectingAppId(null);
    setMessages([
      {
        role: "assistant",
        content: "Hi! Describe the workflow you want to build and I'll create the steps for you on the right. You can refine it anytime.",
      },
    ]);
  };

  const checkReadiness = () => {
    if (steps.length === 0 || checkingReadiness) return;
    setCheckingReadiness(true);
    setReadinessResult(null);

    window.setTimeout(() => {
      const apps = getRequiredIntegrations(steps);
      const allConnected = apps.every((app) => connectedApps.has(app.id));
      setReadinessResult({
        flowValid: true,
        apps,
        message: apps.length === 0
          ? "Flow structure looks good. No external app connections required."
          : allConnected
            ? "All required apps are connected. Your flow is ready to run."
            : "Flow structure is valid, but some apps still need to be connected.",
      });
      setCheckingReadiness(false);
    }, 900);
  };

  const connectApp = (appId: string) => {
    setConnectingAppId(appId);
    window.setTimeout(() => {
      setConnectedApps((prev) => {
        const next = new Set([...prev, appId]);
        if (readinessResult) {
          const allConnected = readinessResult.apps.every((app) => next.has(app.id));
          setReadinessResult({
            ...readinessResult,
            message: allConnected
              ? "All required apps are connected. Your flow is ready to run."
              : "App connected. Connect remaining apps to finish setup.",
          });
        }
        return next;
      });
      setConnectingAppId(null);
    }, 1200);
  };

  const allAppsConnected =
    readinessResult?.apps.every((app) => connectedApps.has(app.id)) ?? false;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <header className="flex items-center justify-between h-11 px-4 border-b border-gray-200 bg-white gap-3 flex-shrink-0 shadow-sm">
        <nav className="flex items-center gap-1 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-medium">Flow by AI</span>
        </nav>
        {steps.length > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={reset}>Start over</Button>
            <Button
              variant="outline"
              size="sm"
              onClick={checkReadiness}
              disabled={checkingReadiness || buildingStepIndex !== null}
              className="gap-1.5"
            >
              {checkingReadiness ? (
                <>
                  <span className="inline-block size-3 rounded-full border-2 border-gray-300 border-t-purple-500 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <IconCheck />
                  Check readiness
                </>
              )}
            </Button>
            <Button size="sm" onClick={() => router.push("/flows/1/v2")}>Open in editor</Button>
          </div>
        )}
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="w-[420px] flex-shrink-0 border-r border-gray-200 bg-white flex flex-col">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-200 flex-shrink-0">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm">
              <IconSparkle />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800">Flow by AI</div>
              <div className="text-[11px] text-gray-400 truncate">Describe your automation</div>
            </div>
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">AI</Badge>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] rounded-lg px-3 py-2 text-[13px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                      : "bg-gray-50 border border-gray-200 text-gray-700"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {generating && (
              <div className="flex justify-start">
                <div className="rounded-lg px-3 py-2 bg-gray-50 border border-gray-200 text-gray-500 text-[13px] flex items-center gap-2">
                  <span className="inline-block size-3 rounded-full border-2 border-gray-300 border-t-purple-500 animate-spin" />
                  Building workflow...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-gray-200 px-4 py-3 flex-shrink-0">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {EXAMPLE_WORKFLOWS.map((example) => (
                <button
                  key={example.id}
                  type="button"
                  onClick={() => send(example.prompt)}
                  disabled={generating}
                  className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] text-gray-600 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition-colors text-left disabled:opacity-50"
                >
                  {example.label}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-purple-300 focus-within:ring-1 focus-within:ring-purple-200">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Describe your workflow..."
                rows={1}
                disabled={generating}
                className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none leading-relaxed disabled:opacity-50"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || generating}
                className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white disabled:opacity-40 hover:brightness-110 transition-all"
                aria-label="Send"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-2xl mx-auto py-8 px-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Workflow steps</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {steps.length === 0
                  ? "Steps will appear here as AI builds your flow."
                  : `${steps.length} step${steps.length === 1 ? "" : "s"} in your workflow`}
              </p>
            </div>

            {readinessResult && (
              <div className={`mb-6 rounded-xl border px-4 py-4 space-y-4 ${
                readinessResult.apps.length > 0 && !allAppsConnected
                  ? "border-amber-200 bg-amber-50/60"
                  : "border-emerald-200 bg-emerald-50/60"
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">Readiness check</h3>
                    <p className="text-xs text-gray-600 mt-1">{readinessResult.message}</p>
                  </div>
                  <Badge className={
                    readinessResult.apps.length === 0 || allAppsConnected
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                  }>
                    {readinessResult.apps.length === 0 || allAppsConnected ? "Ready" : "Action needed"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className={`inline-flex items-center justify-center size-5 rounded-full ${readinessResult.flowValid ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    <IconCheck className="size-3" />
                  </span>
                  <span className="text-gray-700">Flow structure is valid</span>
                </div>

                {readinessResult.apps.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Required app connections</p>
                    {readinessResult.apps.map((app) => {
                      const connected = connectedApps.has(app.id);
                      return (
                        <div key={app.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/80 bg-white px-3 py-2.5 shadow-sm">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-base">{app.icon}</span>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{app.name}</p>
                              <p className="text-[11px] text-gray-500">
                                {connected ? "Connected and authorized" : "Authorization required"}
                              </p>
                            </div>
                          </div>
                          {connected ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                              <IconCheck className="size-3.5" />
                              Connected
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => connectApp(app.id)}
                              disabled={connectingAppId === app.id}
                              className="shrink-0"
                            >
                              {connectingAppId === app.id ? "Connecting..." : "Connect"}
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {allAppsConnected && readinessResult.apps.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 text-xs text-emerald-700">
                    <IconCheck className="size-3.5" />
                    Your flow is ready to run.
                  </div>
                )}
              </div>
            )}

            {steps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                    <path d="M12 3v18M3 12h18" strokeLinecap="round" />
                    <rect x="7" y="5" width="10" height="6" rx="1" />
                    <rect x="7" y="13" width="10" height="6" rx="1" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-600">No steps yet</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Start a conversation on the left to generate your workflow.
                </p>
              </div>
            ) : (
              <ol className="relative space-y-0">
                {steps.map((step, index) => {
                  const depth = step.depth ?? 0;
                  const branchBorder =
                    step.branch === "yes"
                      ? "border-l-emerald-400"
                      : step.branch === "no"
                        ? "border-l-red-400"
                        : "";

                  return (
                    <li
                      key={step.id}
                      className="relative flex gap-4 pb-4 last:pb-0"
                      style={{ marginLeft: depth * 24 }}
                    >
                      {index < steps.length - 1 && depth === (steps[index + 1]?.depth ?? 0) && (
                        <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-200" />
                      )}
                      <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-white border-2 border-purple-200 text-xs font-semibold text-purple-700 shadow-sm">
                        {index + 1}
                      </span>
                      <div className={`flex-1 min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm ${branchBorder ? `border-l-4 ${branchBorder}` : ""}`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-gray-800">{step.title}</span>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STEP_KIND_STYLES[step.kind]}`}>
                            {step.kind}
                          </span>
                          {step.branch && (
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${BRANCH_STYLES[step.branch]}`}>
                              {step.branch}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{step.subtitle}</p>
                      </div>
                    </li>
                  );
                })}

                {buildingStepIndex !== null && buildingStepIndex < pendingSteps.length && (
                  <li className="relative flex gap-4 pb-0" style={{ marginLeft: (pendingSteps[buildingStepIndex]?.depth ?? 0) * 24 }}>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-50 border-2 border-dashed border-purple-200">
                      <span className="inline-block size-3 rounded-full border-2 border-purple-200 border-t-purple-500 animate-spin" />
                    </span>
                    <div className="flex-1 rounded-xl border border-dashed border-purple-200 bg-purple-50/50 px-4 py-3">
                      <p className="text-xs text-purple-600 font-medium">Adding next step...</p>
                    </div>
                  </li>
                )}
              </ol>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
