"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AssistantBlock } from "@/lib/ai/mock-data";

type CardProps = {
  block: AssistantBlock;
  onAction?: (label: string) => void;
};

export function AssistantBlockView({ block, onAction }: CardProps) {
  switch (block.kind) {
    case "text":
      return <p className="text-sm leading-relaxed text-foreground/90">{block.text}</p>;

    case "clarify":
      return (
        <div className="rounded-xl border border-border/70 bg-background p-4">
          <p className="text-sm font-medium text-foreground">{block.question}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {block.options.map((opt) => (
              <Button
                key={opt}
                size="sm"
                variant="outline"
                onClick={() => onAction?.(opt)}
                className="cursor-pointer"
              >
                {opt}
              </Button>
            ))}
          </div>
        </div>
      );

    case "plan":
      return (
        <div className="rounded-xl border border-border/70 bg-background p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <SparkIcon className="size-4 text-violet-500" />
                <h3 className="text-sm font-semibold">{block.title}</h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{block.summary}</p>
            </div>
            <Badge variant="secondary">Draft</Badge>
          </div>

          <ol className="mt-4 space-y-2">
            {block.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
                  {i + 1}
                </span>
                <span className="text-foreground/90">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
            <span className="text-xs text-muted-foreground">{block.estimate}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => onAction?.("Edit plan")} className="cursor-pointer">
                Edit
              </Button>
              <Button size="sm" onClick={() => onAction?.("Deploy")} className="cursor-pointer">
                Deploy
              </Button>
            </div>
          </div>
        </div>
      );

    case "credentials":
      return (
        <div className="rounded-xl border border-border/70 bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <PlugIcon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">Connect {block.service}</p>
              <p className="text-xs text-muted-foreground">{block.description}</p>
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => onAction?.("Skip")} className="cursor-pointer">
              Skip
            </Button>
            <Button size="sm" onClick={() => onAction?.(`Connect ${block.service}`)} className="cursor-pointer">
              Connect {block.service}
            </Button>
          </div>
        </div>
      );

    case "deployed":
      return (
        <div className="rounded-xl border border-border/70 bg-background p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-2 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-semibold">{block.name}</h3>
              <Badge variant="secondary">Running</Badge>
            </div>
            <button className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">
              View all logs →
            </button>
          </div>
          <ul className="mt-3 space-y-1.5">
            {block.logs.map((l, i) => (
              <li key={i} className="flex items-start gap-3 text-xs">
                <span className="w-16 shrink-0 text-muted-foreground tabular-nums">
                  {l.time}
                </span>
                <span
                  className={cn(
                    "mt-1.5 size-1.5 shrink-0 rounded-full",
                    l.status === "ok" && "bg-emerald-500",
                    l.status === "warn" && "bg-amber-500",
                    l.status === "err" && "bg-red-500"
                  )}
                />
                <span className="text-foreground/90">{l.text}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "suggestion":
      return (
        <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4">
          <div className="flex items-start gap-3">
            <SparkIcon className="mt-0.5 size-4 text-violet-600" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-violet-900">{block.title}</p>
              <p className="mt-1 text-sm text-violet-900/80">{block.body}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAction?.("Not now")}
                  className="cursor-pointer"
                >
                  Not now
                </Button>
                <Button size="sm" onClick={() => onAction?.("Add it")} className="cursor-pointer">
                  Add it
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
  }
}

function SparkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9L19 14z" />
    </svg>
  );
}

function PlugIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 2v6" />
      <path d="M15 2v6" />
      <path d="M6 8h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8z" />
      <path d="M12 17v5" />
    </svg>
  );
}
