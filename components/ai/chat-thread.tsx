"use client";

import { useEffect, useRef } from "react";
import { AssistantBlockView } from "./message-cards";
import { STARTER_SUGGESTIONS, type AssistantBlock } from "@/lib/ai/mock-data";
import { cn } from "@/lib/utils";

export type ChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; blocks: AssistantBlock[] }
  | { id: string; role: "assistant"; pending: true };

type Props = {
  messages: ChatMessage[];
  onAction: (label: string) => void;
  onPickStarter: (prompt: string) => void;
  empty: boolean;
};

export function ChatThread({ messages, onAction, onPickStarter, empty }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, messages[messages.length - 1]]);

  if (empty) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/20">
            <SparkIcon className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            What should we automate?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Describe a workflow in plain language. I&rsquo;ll handle the setup, code, and monitoring.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {STARTER_SUGGESTIONS.map((s) => (
            <button
              key={s.title}
              onClick={() => onPickStarter(s.prompt)}
              className="group rounded-xl border border-border/70 bg-background p-4 text-left transition-all hover:border-violet-300 hover:bg-violet-50/40 hover:shadow-sm"
            >
              <p className="text-sm font-medium text-foreground">{s.title}</p>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {s.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        {messages.map((m) => (
          <MessageRow key={m.id} message={m} onAction={onAction} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function MessageRow({
  message,
  onAction,
}: {
  message: ChatMessage;
  onAction: (label: string) => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end gap-3">
        <div className="min-w-0 flex-1 flex flex-col items-end space-y-3">
          <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-foreground px-4 py-2.5 text-sm text-background">
            {message.text}
          </div>
        </div>
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
          <UserIcon className="size-3.5" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="min-w-0 flex-1 space-y-3">
        {"pending" in message ? (
          <PendingBubble />
        ) : (
          message.blocks.map((b, i) => (
            <AssistantBlockView key={i} block={b} onAction={onAction} />
          ))
        )}
      </div>
    </div>
  );
}

function PendingBubble() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "size-1.5 rounded-full bg-muted-foreground/60 animate-bounce",
          )}
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

function SparkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
