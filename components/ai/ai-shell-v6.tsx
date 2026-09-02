"use client";

import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatThread, type ChatMessage } from "./chat-thread";
import { Composer } from "./composer";
import { FlowConfigPanel } from "./flow-config-panel";
import { ASSISTANT_SCRIPT, type AssistantBlock } from "@/lib/ai/mock-data";
import { cn } from "@/lib/utils";

// Version 6 — cloned from Version 4 (AiShellV4) so it can evolve independently.
// Difference vs V4: [future variations to be implemented]

let idCounter = 0;
const nextId = () => `m6-${++idCounter}`;

const FLOW_PLANS: Record<string, AssistantBlock & { kind: "flowPlan" }> = {
  "send a reminder email to users who abandoned their cart 2 hours ago.": {
    kind: "flowPlan",
    title: "Abandoned cart recovery",
    description: "Send a reminder email to users who abandoned their cart 2 hours ago",
    steps: [
      {
        id: "schedule-abandoned",
        number: 1,
        icon: "SC",
        title: "A schedule starts this",
        status: "configured",
        description: "Check every 2 hours for abandoned carts",
        details: [],
        type: "trigger",
        config: { frequency: "Every 2 hours", timezone: "UTC" },
      },
      {
        id: "find-abandoned",
        number: 2,
        icon: "TR",
        title: "Find abandoned carts",
        status: "proposed",
        description: "Find carts abandoned more than 2 hours ago",
        details: ["Cart age threshold", "Customer filter", "Exclusion rules"],
        type: "action",
      },
      {
        id: "send-email",
        number: 3,
        icon: "SX",
        title: "Send reminder email",
        status: "proposed",
        description: "Send personalized reminder email with cart details",
        details: ["Email template", "Customer email field", "Cart details mapping"],
        type: "action",
      },
    ]
  },
  "if a customer spends above ₹50,000, notify the sales head on slack.": {
    kind: "flowPlan",
    title: "High-value order alert",
    description: "If a customer spends above ₹50,000, notify the sales head on Slack",
    steps: [
      {
        id: "order-trigger",
        number: 1,
        icon: "TR",
        title: "When an order is placed",
        status: "configured",
        description: "Triggered when a new order is created",
        details: [],
        type: "trigger",
        config: { event: "Order created", filter: "Amount > ₹50,000" },
      },
      {
        id: "check-amount",
        number: 2,
        icon: "D",
        title: "Check order amount",
        status: "proposed",
        description: "Verify order amount exceeds ₹50,000 threshold",
        details: ["Amount field", "Currency conversion", "Tax handling"],
        type: "action",
      },
      {
        id: "notify-slack",
        number: 3,
        icon: "SX",
        title: "Send Slack notification",
        status: "proposed",
        description: "Notify sales head on Slack with order details",
        details: ["Slack channel", "Message format", "Customer details"],
        type: "action",
      },
    ]
  },
  "whenever an invoice is unpaid for 3 days, send a whatsapp reminder.": {
    kind: "flowPlan",
    title: "Invoice reminder",
    description: "Whenever an invoice is unpaid for 3 days, send a WhatsApp reminder",
    steps: [
      {
        id: "invoice-check",
        number: 1,
        icon: "SC",
        title: "Check unpaid invoices daily",
        status: "configured",
        description: "Daily check for invoices unpaid for 3+ days",
        details: [],
        type: "trigger",
        config: { frequency: "Daily at 9 AM", timezone: "IST" },
      },
      {
        id: "find-unpaid",
        number: 2,
        icon: "TR",
        title: "Find overdue invoices",
        status: "proposed",
        description: "Find invoices unpaid for more than 3 days",
        details: ["Invoice status field", "Date calculation", "Customer list"],
        type: "action",
      },
      {
        id: "send-whatsapp",
        number: 3,
        icon: "SX",
        title: "Send WhatsApp reminder",
        status: "proposed",
        description: "Send WhatsApp reminder with invoice details and payment link",
        details: ["WhatsApp API", "Message template", "Payment gateway link"],
        type: "action",
      },
    ]
  },
  "when a stripe payment fails, alert finance and retry after 1 hour.": {
    kind: "flowPlan",
    title: "Failed payment retry",
    description: "When a Stripe payment fails, alert finance and retry after 1 hour",
    steps: [
      {
        id: "payment-fail",
        number: 1,
        icon: "TR",
        title: "Payment fails on Stripe",
        status: "configured",
        description: "Triggered when a Stripe payment fails",
        details: [],
        type: "trigger",
        config: { source: "Stripe webhook", failureTypes: "All" },
      },
      {
        id: "alert-finance",
        number: 2,
        icon: "SX",
        title: "Alert finance team",
        status: "proposed",
        description: "Send alert email to finance team with payment details",
        details: ["Finance email", "Alert template", "Payment reference"],
        type: "action",
      },
      {
        id: "schedule-retry",
        number: 3,
        icon: "SC",
        title: "Retry payment after 1 hour",
        status: "proposed",
        description: "Schedule automatic retry of failed payment",
        details: ["Retry logic", "Max retry count", "Fallback action"],
        type: "action",
      },
    ]
  }
};

const FLOWS_MAP: Record<string, { name: string; icon: React.ReactNode }> = {
  "cart-recovery": {
    name: "Abandoned cart recovery",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="12" cy="18" r="2" />
        <path d="M6 8v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
        <path d="M12 12v4" />
      </svg>
    ),
  },
  "invoice-reminder": {
    name: "Daily invoice reminder",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="14 3 14 9 20 9" />
      </svg>
    ),
  },
  "sync-leads": {
    name: "Sync new leads to HubSpot",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      </svg>
    ),
  },
};

function getFlowInfo(flowId: string) {
  return FLOWS_MAP[flowId] ?? null;
}

export function AiShellV6() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [turn, setTurn] = useState(0);
  const [pending, setPending] = useState(false);
  const [selectedStep, setSelectedStep] = useState<{ name: string; description: string } | undefined>(undefined);
  const [selectedStepId, setSelectedStepId] = useState<string | undefined>(undefined);
  const [selectedFlow, setSelectedFlow] = useState<string | undefined>(undefined);
  // The flow the user settled on, and whether they've deployed it. The right
  // pane only appears once a deployed flow exists.
  const [activeFlowKey, setActiveFlowKey] = useState<string | undefined>(undefined);
  const [deployed, setDeployed] = useState(false);

  const handleStepSelect = useCallback((step: { name: string; description: string; id: string }) => {
    setSelectedStep({ name: step.name, description: step.description });
    setSelectedStepId(step.id);
  }, []);

  const handleStepDeselect = useCallback(() => {
    setSelectedStep(undefined);
    setSelectedStepId(undefined);
  }, []);
  const searchParams = useSearchParams();
  const router = useRouter();
  // Default both panes open: chat on the left, configuration on the right.
  const panel = searchParams.get("panel") ?? "home";
  const flowId = searchParams.get("flow") ?? "cart-recovery";
  const prompt = searchParams.get("prompt");
  // The right pane stays hidden until the user deploys a flow.
  const activeFlow = activeFlowKey ? FLOW_PLANS[activeFlowKey] : undefined;
  const hasPanel = deployed && !!activeFlow;

  // Get flow info if viewing a flow detail
  const flowInfo = panel === "home" && flowId ? getFlowInfo(flowId) : null;

  // Auto-submit prompt from home page
  useEffect(() => {
    if (prompt && messages.length === 0) {
      const userMsg: ChatMessage = { id: nextId(), role: "user", text: prompt };
      const pendingId = nextId();
      setMessages([userMsg, { id: pendingId, role: "assistant", pending: true }]);
      setPending(true);

      const assistantTurn = ASSISTANT_SCRIPT[0];

      window.setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pendingId
              ? {
                  id: pendingId,
                  role: "assistant" as const,
                  blocks: assistantTurn.blocks,
                }
              : m
          )
        );
        setPending(false);
        setTurn(1);
      }, 700);
    }
  }, [prompt]);

  const submitText = useCallback(
    (text: string) => {
      if (!text.trim() || pending) return;

      const userMsg: ChatMessage = { id: nextId(), role: "user", text };
      const pendingId = nextId();
      setMessages((prev) => [
        ...prev,
        userMsg,
        { id: pendingId, role: "assistant", pending: true },
      ]);
      setDraft("");
      setPending(true);

      // Check if this is a flow selection
      const key = text.toLowerCase();
      const flowPlan = FLOW_PLANS[key];
      let assistantBlocks: AssistantBlock[];

      if (flowPlan) {
        setActiveFlowKey(key);
        assistantBlocks = [flowPlan];
      } else {
        const assistantTurn =
          ASSISTANT_SCRIPT[Math.min(turn, ASSISTANT_SCRIPT.length - 1)];
        assistantBlocks = assistantTurn.blocks;
      }

      window.setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pendingId
              ? {
                  id: pendingId,
                  role: "assistant" as const,
                  blocks: assistantBlocks,
                }
              : m
          )
        );
        setPending(false);
        setTurn((t) => t + 1);
      }, 700);
    },
    [pending, turn]
  );

  const handleAction = useCallback(
    (label: string) => {
      if (label === "Add it" && flowId === "cart-recovery" && panel === "home") {
        router.push("/ai6?panel=home&flow=cart-recovery&extended=true");
      }
      if (label === "Deploy") setDeployed(true);
      setSelectedFlow(label);

      // "Build this flow" from a flow-plan card: reply with an inline
      // stepper-config UI (same as the right-pane FlowConfigPanel) so the user
      // can walk each step's fields with a Next button.
      if (label === "Build this flow" && activeFlowKey) {
        const flow = FLOW_PLANS[activeFlowKey];
        if (flow) {
          const userMsg: ChatMessage = { id: nextId(), role: "user", text: label };
          const pendingId = nextId();
          setMessages((prev) => [
            ...prev,
            userMsg,
            { id: pendingId, role: "assistant", pending: true },
          ]);
          setPending(true);
          window.setTimeout(() => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === pendingId
                  ? {
                      id: pendingId,
                      role: "assistant" as const,
                      blocks: [
                        {
                          kind: "text",
                          text: "Let's walk through each step. Fill what's needed and hit Next.",
                        },
                        {
                          kind: "stepperConfig",
                          title: flow.title,
                          description: flow.description,
                          webhookUrl: "https://flow.sokt.io/func/scripQGnrZSF",
                          steps: flow.steps,
                        },
                      ],
                    }
                  : m
              )
            );
            setPending(false);
            setTurn((t) => t + 1);
          }, 500);
          return;
        }
      }

      submitText(label);
    },
    [submitText, flowId, panel, router, activeFlowKey, pending]
  );

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setTurn(0);
    setDraft("");
  }, []);

  const handleFlowSelected = useCallback(() => {
    // When a flow is selected, show the plan on first turn
    return turn === 0;
  }, [turn]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white text-gray-900">
      <TopHeader
        onNewChat={handleNewChat}
        hasPanel={hasPanel}
        panel={panel}
        flowName={flowInfo?.name}
        flowIcon={flowInfo?.icon}
      />
      <div className="flex min-h-0 flex-1 w-full overflow-hidden bg-white">
        <div
          className={cn(
            "flex min-w-0 flex-col bg-white transition-[width] duration-300 ease-out",
            hasPanel ? "w-[42%]" : "w-full"
          )}
        >
          <ChatThread
            messages={messages}
            empty={messages.length === 0}
            onPickStarter={(p) => {
              setSelectedFlow(p);
              submitText(p);
            }}
            onAction={handleAction}
          />
          <Composer
            bare
            value={draft}
            onChange={setDraft}
            onSend={() => submitText(draft)}
            disabled={pending}
            flowName={flowInfo?.name}
            flowIcon={flowInfo?.icon}
            selectedStep={selectedStep}
            onTest={() => console.log("Test clicked")}
            onPublish={() => console.log("Publish clicked")}
            onClose={() => {
              if (selectedStep) {
                setSelectedStep(undefined);
                setSelectedStepId(undefined);
              } else {
                router.push("/ai6");
              }
            }}
          />
        </div>
        {hasPanel && activeFlow && (
          <div className="flex min-w-0 flex-1 border-l border-gray-200 animate-in slide-in-from-right-8 fade-in duration-300">
            <FlowConfigPanel
              title={activeFlow.title}
              description={activeFlow.description}
              steps={activeFlow.steps}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function TopHeader({
  hasPanel,
  panel,
  flowName,
  flowIcon,
}: {
  onNewChat: () => void;
  hasPanel: boolean;
  panel: string | null;
  flowName?: string;
  flowIcon?: React.ReactNode;
}) {
  const panelLabel = panel ? panel.charAt(0).toUpperCase() + panel.slice(1) : "";
  return (
    <header className="flex items-center gap-3 border-b border-gray-200 px-4 py-2 bg-white">
      <nav className="flex min-w-0 items-center gap-1.5 text-xs">
        {hasPanel ? (
          <>
            <Link
              href={`/ai6?panel=${panel}`}
              className="text-gray-600 hover:text-gray-900"
            >
              {panelLabel}
            </Link>
            {flowName && (
              <>
                <span className="text-gray-400">/</span>
                {flowIcon && (
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-500 text-white">
                    {flowIcon}
                  </span>
                )}
                <span className="truncate text-gray-900">{flowName}</span>
              </>
            )}
          </>
        ) : (
          <span className="text-gray-600">FlowMind</span>
        )}
      </nav>
      <div className="ml-auto flex items-center gap-2.5">
        {/* Hidden: Changes chip and Go Live button - will display after next step */}
        {/* <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/70 px-3 py-1 text-xs font-medium text-amber-800">
          <span className="size-1.5 rounded-full bg-amber-500" />
          Changes — not live yet
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-700"
            style={{ animation: "nudge-right 1s ease-in-out infinite" }}
            aria-hidden="true"
          >
            <line x1="4" y1="12" x2="18" y2="12" />
            <polyline points="12 6 18 12 12 18" />
          </svg>
        </span>
        <Button
          variant="contained"
          size="small"
          className="shrink-0"
          startIcon={<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5" /><polyline points="5 12 12 5 19 12" /></svg>}
          sx={{ bgcolor: "#2563eb", color: "#ffffff", "&:hover": { bgcolor: "#1d4ed8" } }}
        >
          Go Live
        </Button> */}
      </div>
    </header>
  );
}
