"use client";

import { useState } from "react";
import { Button, Chip } from "@mui/material";
import { cn } from "@/lib/utils";

export type ConfigStep = {
  id: string;
  number: number;
  icon: string;
  title: string;
  status: "proposed" | "configured" | "pending";
  description: string;
  details: string[];
  type: "trigger" | "action";
  config?: Record<string, string | number | boolean>;
};

type Props = {
  title: string;
  description: string;
  steps: ConfigStep[];
};

const ICON_COLORS: Record<string, string> = {
  SC: "bg-blue-100 text-blue-700",
  TR: "bg-green-100 text-green-700",
  D: "bg-purple-100 text-purple-700",
  SX: "bg-orange-100 text-orange-700",
  GM: "bg-red-100 text-red-700",
};

function iconClass(icon: string) {
  return ICON_COLORS[icon] ?? "bg-gray-100 text-gray-700";
}

const OUTPUT_SHAPES: Record<string, Array<{ name: string; type: string }>> = {
  SC: [
    { name: "run_at", type: "datetime" },
    { name: "next_run", type: "datetime" },
    { name: "iteration", type: "number" },
  ],
  TR: [
    { name: "records", type: "array" },
    { name: "count", type: "number" },
    { name: "cursor", type: "string" },
  ],
  D: [
    { name: "deleted", type: "array" },
    { name: "failed", type: "array" },
    { name: "count", type: "number" },
  ],
  SX: [
    { name: "message_id", type: "string" },
    { name: "sent_at", type: "datetime" },
    { name: "success", type: "boolean" },
  ],
  GM: [
    { name: "message_id", type: "string" },
    { name: "thread_id", type: "string" },
    { name: "to", type: "string" },
  ],
};

function outputFor(icon: string) {
  return OUTPUT_SHAPES[icon] ?? [{ name: "result", type: "object" }];
}

function TabChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
        active
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      )}
    >
      {children}
    </button>
  );
}

const isReady = (s: ConfigStep) => s.details.length === 0;

export function FlowConfigPanelV7({ title, description, steps }: Props) {
  const firstIncomplete = steps.find((s) => !isReady(s));
  const [openId, setOpenId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "flow" | "log">("summary");
  const [showSteps, setShowSteps] = useState(true);

  const fieldsLeft = steps.reduce((n, s) => n + s.details.length, 0);
  const stepsLeft = steps.filter((s) => !isReady(s)).length;
  const allReady = fieldsLeft === 0;

  const nextBlockerId =
    (openId && steps.find((s) => s.id === openId && !isReady(s))?.id) ||
    firstIncomplete?.id;

  const jumpToNext = () => {
    const incomplete = steps.filter((s) => !isReady(s));
    if (!incomplete.length) return;
    const currentIdx = incomplete.findIndex((s) => s.id === openId);
    const next = incomplete[(currentIdx + 1) % incomplete.length];
    setOpenId(next.id);
  };

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((cur) => (cur === msg ? null : cur)), 2200);
  };

  let actionCounter = 0;
  const actionNumbers = new Map<string, number>();
  for (const s of steps) {
    if (s.type === "action") actionNumbers.set(s.id, ++actionCounter);
  }

  return (
    <div className="relative h-full overflow-y-auto bg-white">
      <div className="flex max-w-3xl flex-col gap-3.5 py-6 pl-4 pr-7">
        {/* Tabs and Buttons in same row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex w-fit items-center gap-1 rounded-lg bg-gray-100 p-1">
            {(
              [
                { id: "summary", label: "Summary" },
                { id: "flow", label: "Flow" },
                { id: "log", label: "Log" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action Buttons - moved to the right */}
          <div className="flex gap-2">
            <Button
              size="small"
              variant="contained"
              onClick={() => flash("Flow is going live…")}
              sx={{ bgcolor: "#16a34a", color: "#fff", "&:hover": { bgcolor: "#15803d" } }}
              startIcon={
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19V5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              }
            >
              Go Live
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => flash("Testing flow…")}
              sx={{ color: "text.primary", borderColor: "divider" }}
            >
              ▶ Test Flow
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-2.5">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="text-[22px] font-semibold leading-tight tracking-tight text-gray-900">
              {title}
            </h2>
            <p className="text-sm leading-relaxed text-gray-500">{description}</p>
          </div>
        </div>

        {/* Webhook URL */}
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Webhook URL</p>
          <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2">
            <span className="flex-1 truncate font-mono text-xs text-gray-700">https://flow.sokt.io/func/scripQGnrZSF</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText("https://flow.sokt.io/func/scripQGnrZSF");
              }}
              className="flex size-6 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-100"
              title="Copy webhook URL"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Steps Description */}
        <div className="mb-4">
          <ol className="space-y-2">
            {steps.map((step, i) => (
              <li key={step.id} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 font-medium text-gray-600">{i + 1}.</span>
                <span className="text-gray-700">{step.description}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Readiness bar OR Go Live - Only shown when Configure is clicked */}
        {showSteps && (
          <>
            {allReady ? (
              <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                <span className="flex-1 text-[13px] text-gray-800">
                  <span className="font-semibold text-green-700">✓ Everything is filled in.</span>{" "}
                  Test with real data, then take it live.
                </span>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    bgcolor: "#16a34a",
                    color: "#fff",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#15803d" },
                  }}
                  onClick={() => flash("Automation is going live…")}
                >
                  ↑ Go Live
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <span className="flex-1 text-[13px] text-gray-700">
                  <span className="font-semibold text-gray-900">
                    {fieldsLeft} {fieldsLeft === 1 ? "field" : "fields"}
                  </span>{" "}
                  across {stepsLeft} {stepsLeft === 1 ? "step" : "steps"} to fill before this can go live.
                </span>
                <span className="flex gap-1">
                  {steps.map((s) => (
                    <span
                      key={s.id}
                      className={cn(
                        "block h-[5px] w-[26px] rounded-full",
                        isReady(s) ? "bg-green-500" : s.id === openId ? "bg-blue-500" : "bg-gray-300"
                      )}
                    />
                  ))}
                </span>
                <button
                  onClick={jumpToNext}
                  className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Jump to next ↓
                </button>
              </div>
            )}

            {/* Steps */}
            {steps.map((step) => (
                <StepCard
                  key={step.id}
                  step={step}
                  eyebrow={
                    step.type === "trigger" ? "TRIGGER" : `STEP ${actionNumbers.get(step.id)}`
                  }
                  open={openId === step.id}
                  isNextBlocker={step.id === nextBlockerId}
                  onToggle={() => setOpenId(openId === step.id ? null : step.id)}
                  onTest={() => flash(`Testing "${step.title}"…`)}
                  onSave={() => flash("Step saved.")}
                />
              ))}
          </>
        )}

      </div>

      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function StepCard({
  step,
  eyebrow,
  open,
  isNextBlocker,
  onToggle,
  onTest,
  onSave,
}: {
  step: ConfigStep;
  eyebrow: string;
  open: boolean;
  isNextBlocker: boolean;
  onToggle: () => void;
  onTest: () => void;
  onSave: () => void;
}) {
  const ready = isReady(step);
  const [tab, setTab] = useState<"input" | "output">("input");
  const chipPalette = ready
    ? { bg: "#dcfce7", fg: "#15803d" }
    : isNextBlocker
      ? { bg: "#fef3c7", fg: "#b45309" }
      : { bg: "#dbeafe", fg: "#1d4ed8" };
  const outputFields = outputFor(step.icon);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-white transition-shadow",
        open ? "border-blue-500 ring-[3px] ring-blue-500/10" : "border-gray-200"
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          "flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors",
          open ? "border-b border-gray-200 bg-white" : "hover:bg-gray-50"
        )}
      >
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md text-[11px] font-extrabold",
            iconClass(step.icon)
          )}
        >
          {step.icon}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[11px] font-semibold tracking-[0.09em] text-gray-500">
            {eyebrow}
          </span>
          <span className="text-[15px] font-semibold text-gray-900">{step.title}</span>
          {!open && step.config && (
            <span className="truncate text-xs text-gray-500">
              {Object.values(step.config).join(" · ")}
            </span>
          )}
          {!open && !ready && step.details.length > 0 && (
            <span className="truncate text-xs text-gray-500">
              Needs: <span className="text-gray-700">{step.details.join(", ")}</span>
            </span>
          )}
        </span>
        <Chip
          label={
            ready
              ? "READY"
              : `${step.details.length} ${step.details.length === 1 ? "FIELD" : "FIELDS"} NEEDED`
          }
          size="small"
          sx={{
            height: 22,
            fontSize: 11,
            fontWeight: 650,
            letterSpacing: ".03em",
            bgcolor: chipPalette.bg,
            color: chipPalette.fg,
          }}
        />
        <span className="text-xs text-gray-500">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="flex flex-col gap-4 p-4">
          <p className="text-[13px] leading-relaxed text-gray-700">{step.description}</p>

          <div className="flex items-center gap-1.5">
            <TabChip active={tab === "input"} onClick={() => setTab("input")}>
              Input
            </TabChip>
            <TabChip active={tab === "output"} onClick={() => setTab("output")}>
              Output
            </TabChip>
            <span className="ml-1 text-xs text-gray-500">
              {tab === "input"
                ? "What this step needs to run."
                : "What this step produces for the next one."}
            </span>
          </div>

          {tab === "input" ? (
            <>
              {step.details.length > 0 && (
                <div className="flex flex-wrap gap-3.5">
                  {step.details.slice(0, 2).map((d) => (
                    <div key={d} className="flex min-w-[200px] flex-1 flex-col gap-1.5">
                      <span className="text-xs font-semibold text-gray-500">{d}</span>
                      <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5">
                        <span
                          className={cn(
                            "flex size-4 items-center justify-center rounded text-[8px] font-extrabold",
                            iconClass(step.icon)
                          )}
                        >
                          {step.icon}
                        </span>
                        <span className="truncate text-[13px] text-gray-900">Choose {d.toLowerCase()}</span>
                        <span className="flex-1" />
                        <span className="text-[11px] text-gray-500">▾</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {step.details.slice(2).map((d) => (
                <div key={d} className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-gray-900">{d}</span>
                    <Chip
                      label="required"
                      size="small"
                      sx={{
                        height: 19,
                        fontSize: 11,
                        fontWeight: 600,
                        bgcolor: "#fef3c7",
                        color: "#b45309",
                      }}
                    />
                  </div>
                  <div className="flex max-w-[340px] items-center gap-2 rounded-md border border-blue-500 bg-white px-3 py-2.5">
                    <span className="text[13px] text-gray-900">5</span>
                    <span className="block h-3.5 w-px bg-gray-200" />
                    <span className="text-[13px] text-gray-500">per run</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Set by the AI from your prompt — raise it once you&rsquo;ve seen a clean run.
                  </span>
                </div>
              ))}

              {step.details.length === 0 && step.config && (
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-md border border-gray-200 bg-gray-50 p-3">
                  {Object.entries(step.config).map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-3 text-[13px]">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-medium text-gray-900">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Fields available downstream
              </div>
              <div className="flex flex-col gap-1.5">
                {outputFields.map((f) => (
                  <div key={f.name} className="flex items-center gap-3 text-[13px]">
                    <span className="font-mono text-gray-900">{f.name}</span>
                    <span className="rounded bg-white px-1.5 py-0.5 text-[11px] font-medium text-gray-500 ring-1 ring-gray-200">
                      {f.type}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Reference these in the next step with{" "}
                <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px] text-gray-700 ring-1 ring-gray-200">
                  {`{{${step.icon.toLowerCase()}.${outputFields[0]?.name}}}`}
                </code>
                .
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-0.5">
            <Button
              size="small"
              variant="contained"
              sx={{ bgcolor: "#2563eb", color: "#fff", "&:hover": { bgcolor: "#1d4ed8" } }}
              onClick={onSave}
            >
              Save step
            </Button>
            <Button
              size="small"
              variant="text"
              sx={{ color: "text.secondary" }}
              onClick={onTest}
            >
              Test this step
            </Button>
            <span className="flex-1" />
            <span className="text-xs text-gray-500">Set by AI from your prompt · edit anything</span>
          </div>
        </div>
      )}
    </div>
  );
}
