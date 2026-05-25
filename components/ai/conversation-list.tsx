"use client";

import Link from "next/link";
import { APP_BASE } from "@/lib/app-routes";
import { PAST_CONVERSATIONS, type Conversation } from "@/lib/ai/mock-data";
import { cn } from "@/lib/utils";

type Props = {
  activeId?: string;
  onNew: () => void;
  onSelect: (c: Conversation) => void;
};

const statusStyles: Record<Conversation["status"], string> = {
  running: "bg-emerald-500",
  draft: "bg-slate-400",
  paused: "bg-amber-500",
  failed: "bg-red-500",
};

export function ConversationList({ activeId, onNew, onSelect }: Props) {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-border/70 bg-muted/20">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/70">
        <Link
          href={APP_BASE}
          className="flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground"
        >
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-500 text-white">
            <SparkIcon className="size-3.5" />
          </span>
          FlowMind
        </Link>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Beta
        </span>
      </div>

      <div className="p-3">
        <button
          onClick={onNew}
          className="flex w-full items-center gap-2 rounded-lg border border-border/70 bg-background px-3 py-2 text-left text-sm font-medium hover:bg-muted/40 transition-colors"
        >
          <PlusIcon className="size-4 text-muted-foreground" />
          New automation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        <p className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Your automations
        </p>
        <ul className="space-y-0.5">
          {PAST_CONVERSATIONS.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c)}
                className={cn(
                  "group flex w-full items-start gap-2 rounded-md px-2 py-2 text-left transition-colors",
                  activeId === c.id
                    ? "bg-background shadow-sm"
                    : "hover:bg-background/60"
                )}
              >
                <span
                  className={cn(
                    "mt-1.5 size-1.5 shrink-0 rounded-full",
                    statusStyles[c.status]
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-foreground">
                    {c.title}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {c.updated}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border/70 p-3">
        <Link
          href={APP_BASE}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-background/60 hover:text-foreground"
        >
          <BackIcon className="size-3.5" />
          Back to Workflows
        </Link>
      </div>
    </aside>
  );
}

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
function BackIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
