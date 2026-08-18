"use client";

import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatThread, type ChatMessage } from "./chat-thread";
import { Composer } from "./composer";
import { MiniAppConfig } from "./mini-app-config";
import { AiVersionNav } from "./ai-version-nav";
import { ASSISTANT_SCRIPT } from "@/lib/ai/mock-data";
import { cn } from "@/lib/utils";

// Version 4 — cloned from Version 1 (AiShell) so it can evolve independently.
// Difference vs V1: the left chat and right configuration are both open by
// default (V1 only opens the config once a flow is created).

let idCounter = 0;
const nextId = () => `m4-${++idCounter}`;

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

export function AiShellV4() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [turn, setTurn] = useState(0);
  const [pending, setPending] = useState(false);
  const [selectedStep, setSelectedStep] = useState<{ name: string; description: string } | undefined>(undefined);
  const [selectedStepId, setSelectedStepId] = useState<string | undefined>(undefined);

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
  const hasPanel = !!panel;

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

      const assistantTurn =
        ASSISTANT_SCRIPT[Math.min(turn, ASSISTANT_SCRIPT.length - 1)];

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
        setTurn((t) => t + 1);
      }, 700);
    },
    [pending, turn]
  );

  const handleAction = useCallback(
    (label: string) => {
      if (label === "Add it" && flowId === "cart-recovery" && panel === "home") {
        router.push("/ai4?panel=home&flow=cart-recovery&extended=true");
      }
      submitText(label);
    },
    [submitText, flowId, panel, router]
  );

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setTurn(0);
    setDraft("");
  }, []);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <TopHeader
        onNewChat={handleNewChat}
        hasPanel={hasPanel}
        panel={panel}
        flowName={flowInfo?.name}
        flowIcon={flowInfo?.icon}
      />
      <div className="flex min-h-0 flex-1 w-full overflow-hidden">
        <div
          className={cn(
            "flex min-w-0 flex-col bg-[#f5f5f5] transition-[width] duration-300 ease-out",
            hasPanel ? "w-[42%]" : "w-full"
          )}
        >
          <ChatThread
            messages={messages}
            empty={messages.length === 0}
            onPickStarter={(p) => submitText(p)}
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
                router.push("/ai4");
              }
            }}
          />
        </div>
        {hasPanel && (
          <div
            key={panel}
            className="flex min-w-0 flex-1 border-l border-border/70 animate-in slide-in-from-right-8 fade-in duration-300"
          >
            <MiniAppConfig />
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
    <header className="flex items-center gap-3 border-b border-border/70 px-4 py-2">
      <AiVersionNav />
      <nav className="flex min-w-0 items-center gap-1.5 text-xs">
        {hasPanel ? (
          <>
            <Link
              href={`/ai4?panel=${panel}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {panelLabel}
            </Link>
            {flowName && (
              <>
                <span className="text-muted-foreground/60">/</span>
                {flowIcon && (
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-500 text-white">
                    {flowIcon}
                  </span>
                )}
                <span className="truncate text-foreground">{flowName}</span>
              </>
            )}
          </>
        ) : (
          <span className="text-muted-foreground">FlowMind</span>
        )}
      </nav>
      <div className="ml-auto flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/70 px-3 py-1 text-xs font-medium text-amber-800">
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
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-blue-700"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5" /><polyline points="5 12 12 5 19 12" />
          </svg>
          Go Live
        </button>
      </div>
    </header>
  );
}
