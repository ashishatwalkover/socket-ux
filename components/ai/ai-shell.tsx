"use client";

import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatThread, type ChatMessage } from "./chat-thread";
import { Composer } from "./composer";
import { RightPanel } from "./right-panel";
import { ASSISTANT_SCRIPT } from "@/lib/ai/mock-data";
import { cn } from "@/lib/utils";

let idCounter = 0;
const nextId = () => `m-${++idCounter}`;

function SparkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    </svg>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

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

export function AiShell() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [turn, setTurn] = useState(0);
  const [pending, setPending] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const panel = searchParams.get("panel");
  const flowId = searchParams.get("flow");
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

  // Auto-open flows panel when flow is created (turn 2 - after plan shown)
  useEffect(() => {
    if (turn === 2 && !panel) {
      router.push("/ai?panel=home&flow=cart-recovery");
    }
  }, [turn, panel, router]);

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
      // Handle "Add it" action to show extended flow
      if (label === "Add it" && flowId === "cart-recovery" && panel === "home") {
        router.push("/ai?panel=home&flow=cart-recovery&extended=true");
      }
      // Treat inline action clicks as synthetic user messages so the script advances naturally.
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
            "flex min-w-0 flex-col transition-[width] duration-300 ease-out",
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
            value={draft}
            onChange={setDraft}
            onSend={() => submitText(draft)}
            disabled={pending}
            flowName={flowInfo?.name}
            flowIcon={flowInfo?.icon}
          />
        </div>
        {hasPanel && (
          <div
            key={panel}
            className="flex min-w-0 flex-1 border-l border-border/70 animate-in slide-in-from-right-8 fade-in duration-300"
          >
            <RightPanel panel={panel!} />
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
    <header className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-2">
      <nav className="flex min-w-0 items-center gap-1.5 text-xs">
        {hasPanel ? (
          <>
            <Link
              href={`/ai?panel=${panel}`}
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
    </header>
  );
}
