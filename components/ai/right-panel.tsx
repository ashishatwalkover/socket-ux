"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = { panel: string };

type FlowDef = {
  id: string;
  name: string;
  status: "running" | "paused" | "failed";
  trigger: string;
  summary: string;
  steps: string[];
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
  flows: { title: "Flows", description: "All automations created from chat." },
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

export function RightPanel({ panel }: Props) {
  const searchParams = useSearchParams();
  const flowId = searchParams.get("flow");
  const extended = searchParams.get("extended");
  
  let flow = null;
  if (panel === "flows" && flowId) {
    const flows = getFlows(extended ? flowId : undefined);
    flow = flows.find((f) => f.id === flowId);
  }

  if (flow) {
    return <FlowDetail flow={flow} />;
  }

  const meta = META[panel] ?? { title: panel, description: "Coming soon." };

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-background">
      <div className="flex items-start justify-between gap-3 border-b border-border/70 px-5 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight">{meta.title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{meta.description}</p>
        </div>
        <a
          href="/ai"
          aria-label="Close panel"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
        >
          <CloseIcon />
        </a>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {panel === "flows" ? <FlowList /> : <PanelPlaceholder panel={panel} />}
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
            href={`/ai?panel=flows&flow=${f.id}`}
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

function FlowDetail({ flow }: { flow: FlowDef }) {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-background">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-2.5">
        <nav className="flex min-w-0 items-center gap-1.5 text-xs">
          <Link
            href="/ai?panel=flows"
            className="text-muted-foreground hover:text-foreground"
          >
            Flows
          </Link>
          <span className="text-muted-foreground/60">/</span>
          <span className="truncate text-foreground">{flow.name}</span>
        </nav>
        <a
          href="/ai"
          aria-label="Close panel"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
        >
          <CloseIcon />
        </a>
      </div>

      {/* Header: icon + name + Test action */}
      <div className="flex items-start justify-between gap-4 border-b border-border/70 px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 text-white">
            <FlowIcon className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-base font-semibold tracking-tight">{flow.name}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                <span className={`size-1.5 rounded-full ${statusStyle[flow.status]}`} />
                {flow.status}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{flow.trigger}</p>
          </div>
        </div>
        <Button size="sm" variant="outline">
          <PlayIcon className="size-3.5" />
          Test
        </Button>
      </div>

      {/* Summary body */}
      <div className="flex-1 overflow-y-auto p-5">
        <section>
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Summary
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{flow.summary}</p>
        </section>

        <section className="mt-6">
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
