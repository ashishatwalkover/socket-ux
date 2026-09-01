"use client";

import { LuKey, LuUnplug, LuEye, LuShieldCheck } from "react-icons/lu";
import { SiShopify } from "react-icons/si";
import type { IconType } from "react-icons";
import { Button, Chip } from "@mui/material";
import { blue } from "@mui/material/colors";
import { cn } from "@/lib/utils";
import type { AssistantBlock } from "@/lib/ai/mock-data";
import { TRUST_SIGNALS } from "@/lib/connections-data";

const TRUST_ICON: Record<string, IconType> = {
  key: LuKey,
  unplug: LuUnplug,
  eye: LuEye,
  lock: LuShieldCheck,
};

type CardProps = {
  block: AssistantBlock;
  onAction?: (label: string) => void;
};

export function AssistantBlockView({ block, onAction }: CardProps) {
  switch (block.kind) {
    case "text":
      return <p className="text-sm leading-relaxed text-gray-900/90">{block.text}</p>;

    case "clarify":
      return (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-gray-900">{block.question}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {block.options.map((opt) => (
              <Button
                key={opt}
                size="small"
                variant="outlined"
                onClick={() => onAction?.(opt)}
              >
                {opt}
              </Button>
            ))}
          </div>
        </div>
      );

    case "template":
      return (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-gray-900">{block.question}</p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {block.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onAction?.(opt.title)}
                className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md cursor-pointer text-left"
              >
                {/* Header: app badges */}
                <div className="flex items-center mb-3">
                  {opt.apps?.map((app, index) => (
                    <span
                      key={app.name}
                      className={cn(
                        "relative inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-gray-200 bg-white",
                        index > 0 && "-ml-2.5"
                      )}
                      style={{ zIndex: index + 1 }}
                    >
                      <span
                        className={cn(
                          "inline-flex size-full items-center justify-center text-[10px] font-bold text-white",
                          app.color
                        )}
                      >
                        {app.letter}
                      </span>
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 mb-2">
                  {opt.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                  {opt.description}
                </p>

                {/* Footer: chips + installs */}
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1.5">
                    {opt.chips?.slice(0, 2).map((chip, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-700"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                  {opt.installs && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <DownloadIcon className="size-3.5" />
                      <span className="font-medium text-gray-900">{opt.installs >= 1000 ? (opt.installs / 1000).toFixed(1) + 'k' : opt.installs}</span>
                      <span>installs</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              size="small"
              variant="text"
              onClick={() => onAction?.("Skip")}
            >
              Skip
            </Button>
          </div>
        </div>
      );

    case "plan":
      return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <SparkIcon className="size-4 text-violet-500" />
                <h3 className="text-sm font-semibold">{block.title}</h3>
              </div>
              <p className="mt-1 text-sm text-gray-600">{block.summary}</p>
            </div>
            <Chip label="Draft" size="small" variant="outlined" />
          </div>

          <ol className="mt-4 space-y-2">
            {block.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-gray-600">
                  {i + 1}
                </span>
                <span className="text-gray-900/90">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="text-xs text-gray-600">{block.estimate}</span>
            <div className="flex gap-2">
              <Button size="small" variant="text" onClick={() => onAction?.("Edit plan")}>
                Edit
              </Button>
              <Button size="small" variant="contained" onClick={() => onAction?.("Deploy")}>
                Deploy
              </Button>
            </div>
          </div>
        </div>
      );

    case "credentials":
      return (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          {/* Trust reassurance — reduces the "connect step" bounce */}
          <div className="rounded-lg border border-border/60 bg-muted/40 p-3">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {TRUST_SIGNALS.map((s) => {
                const SignalIcon = TRUST_ICON[s.icon];
                return (
                  <div key={s.title} className="flex items-center gap-2.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                      <SignalIcon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-gray-900">{s.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex justify-start">
            <Button
              size="large"
              variant="outlined"
              onClick={() => onAction?.(`Connect ${block.service}`)}
              startIcon={<SiShopify className="text-[#5E8E3E]" />}
              sx={{
                borderColor: "#3b82f6",
                color: "#2563eb",
                "&:hover": {
                  borderColor: "#2563eb",
                  bgcolor: "#eff6ff",
                  color: "#1d4ed8",
                },
              }}
            >
              Connect {block.service}
            </Button>
          </div>
        </div>
      );

    case "deployed":
      return (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-2 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-semibold">{block.name}</h3>
              <Chip label="Running" size="small" variant="outlined" />
            </div>
            <Button variant="text" size="small" sx={{ color: "text.secondary" }}>
              View all logs →
            </Button>
          </div>
          <ul className="mt-3 space-y-1.5">
            {block.logs.map((l, i) => (
              <li key={i} className="flex items-start gap-3 text-xs">
                <span className="w-16 shrink-0 text-gray-600 tabular-nums">
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
                <span className="text-gray-900/90">{l.text}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "flowPlan":
      return (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                ✓ Your flow plan is ready
              </div>
            </div>
            <div className="mb-2 flex flex-wrap gap-3 text-xs text-gray-600">
              <span>📋 {block.steps.length} steps</span>
              <span>📝 Roughly {block.steps.reduce((sum, s) => sum + s.details.length, 0)} details needed</span>
              <span>⏱️ About 8 minutes to build</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{block.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{block.description}</p>
          </div>

          <div className="space-y-3">
            {block.steps.map((step, index) => {
              const iconColors: Record<string, { bg: string; text: string }> = {
                SC: { bg: "bg-blue-100", text: "text-blue-700" },
                TR: { bg: "bg-green-100", text: "text-green-700" },
                D: { bg: "bg-purple-100", text: "text-purple-700" },
                SX: { bg: "bg-orange-100", text: "text-orange-700" },
              };
              const colors = iconColors[step.icon] || { bg: "bg-gray-100", text: "text-gray-700" };

              return (
                <div key={step.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-start gap-3">
                    <div className={cn("flex size-8 items-center justify-center rounded font-semibold text-xs flex-shrink-0", colors.bg, colors.text)}>
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-gray-900">{step.title}</h4>
                        {step.status !== "pending" && (
                          <Chip
                            label={step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: "11px" }}
                          />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-600">{step.description}</p>
                      {step.details.length > 0 && (
                        <p className="mt-1.5 text-xs text-gray-500">
                          Will need: <span className="text-gray-700 font-medium">{step.details.join(", ")}</span>
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-gray-500 flex-shrink-0">STEP {step.number}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              Happy with this plan? I&rsquo;ll walk you through each step and connect
              the apps it needs — you can still change anything along the way.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button
                size="small"
                variant="contained"
                onClick={() => onAction?.("Build this flow")}
                sx={{ bgcolor: blue[600], color: "#fff", "&:hover": { bgcolor: blue[700] } }}
              >
                Build this flow
              </Button>
              <Button
                size="small"
                variant="text"
                onClick={() => onAction?.("Change the plan")}
                sx={{ color: "text.secondary" }}
              >
                Change the plan
              </Button>
            </div>
          </div>
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
                  size="small"
                  variant="outlined"
                  onClick={() => onAction?.("Not now")}
                >
                  Not now
                </Button>
                <Button size="small" variant="contained" onClick={() => onAction?.("Add it")}>
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

function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
