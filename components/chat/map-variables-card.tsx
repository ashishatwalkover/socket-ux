"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  FlowStep,
  InputValue,
  VariableRef,
} from "@/lib/flow-types";
import {
  fieldType,
  formatSample,
  resolveSampleFromStep,
  suggestRefForKey,
} from "@/lib/map-variables";
/** Inputs still stored as literals (candidates for upstream mapping). */
export function countLiteralInputs(step: FlowStep): number {
  return Object.values(step.inputs).filter((v) => v.kind === "literal").length;
}

export function stepNeedsVariableMapping(step: FlowStep): boolean {
  return countLiteralInputs(step) > 0;
}

export function getStepsNeedingVariableMap(steps: FlowStep[]): FlowStep[] {
  return steps.filter(stepNeedsVariableMapping);
}

type RowState =
  | { kind: "auto" }
  | { kind: "needs-map" }
  | { kind: "mapping" }
  | { kind: "mapped"; ref: VariableRef; via: "ai" | "manual" }
  | { kind: "no-match" };

function rowStateFromInput(value: InputValue): RowState {
  if (value.kind === "ref") return { kind: "auto" };
  return { kind: "needs-map" };
}

export function MapVariablesCard({
  stepId,
  steps,
  onApplyMapping,
  onOpenManualMap,
}: {
  stepId: string;
  steps: FlowStep[];
  onApplyMapping?: (inputKey: string, ref: VariableRef) => void;
  /** Opens Configure step dialog with variable picker for this input. */
  onOpenManualMap?: (inputKey: string) => void;
}) {
  const step = steps.find((s) => s.id === stepId);
  const stepIndex = steps.findIndex((s) => s.id === stepId);

  const initial = useMemo<Record<string, RowState>>(() => {
    if (!step) return {};
    const out: Record<string, RowState> = {};
    for (const [k, v] of Object.entries(step.inputs)) {
      out[k] = rowStateFromInput(v);
    }
    return out;
  }, [step]);

  const [rows, setRows] = useState<Record<string, RowState>>(initial);

  useEffect(() => {
    setRows(initial);
  }, [initial]);

  if (!step) {
    return <p className="text-xs text-gray-500">Step not found.</p>;
  }

  const entries = Object.entries(step.inputs);
  const totalMapped = Object.values(rows).filter(
    (r) => r.kind === "auto" || r.kind === "mapped",
  ).length;
  const totalNeeds = Object.values(rows).filter(
    (r) => r.kind === "needs-map" || r.kind === "mapping",
  ).length;

  const applyMapping = (key: string, ref: VariableRef, via: "ai" | "manual") => {
    setRows((prev) => ({ ...prev, [key]: { kind: "mapped", ref, via } }));
    onApplyMapping?.(key, ref);
  };

  const onAiMap = async (key: string) => {
    setRows((prev) => ({ ...prev, [key]: { kind: "mapping" } }));
    await new Promise((r) => setTimeout(r, 750 + Math.random() * 350));
    const suggestion = suggestRefForKey(key, stepIndex, steps);
    if (suggestion) {
      applyMapping(key, suggestion, "ai");
    } else {
      setRows((prev) => ({ ...prev, [key]: { kind: "no-match" } }));
    }
  };

  const onMapAll = async () => {
    const targets = Object.entries(rows).filter(([, r]) => r.kind === "needs-map");
    for (const [k] of targets) {
      // eslint-disable-next-line no-await-in-loop
      await onAiMap(k);
    }
  };

  return (
    <div className="w-full min-w-0 rounded-xl border border-purple-200 bg-gradient-to-br from-white to-purple-50/50 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-purple-100 bg-white/60">
          <span className="inline-flex size-5 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor">
              <path d="M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6L12 2z" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-semibold text-gray-800 truncate">
              Variable mapping · #{stepIndex + 1} {step.title}
            </div>
            <div className="text-[10px] text-gray-500">
              {totalMapped} mapped · {totalNeeds} need attention
            </div>
          </div>
          {totalNeeds > 0 && (
            <button
              type="button"
              onClick={onMapAll}
              className="rounded-md bg-purple-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-purple-700"
            >
              AI map all
            </button>
          )}
        </div>

        <ul className="divide-y divide-gray-100">
          {entries.length === 0 && (
            <li className="px-3 py-4 text-[11px] text-gray-500 italic">
              This step has no inputs.
            </li>
          )}
          {entries.map(([key, value]) => (
            <li key={key} className="flex items-start gap-2 px-3 py-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-gray-700">{key}</span>
                  <span className="text-[9px] text-gray-400 font-mono uppercase">
                    {fieldType(step.inputSchema, key)}
                  </span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px]">
                  <RowValue value={value} state={rows[key]} steps={steps} />
                </div>
              </div>
              <RowAction
                state={rows[key]}
                onOpenManual={() => onOpenManualMap?.(key)}
                onAiMap={() => onAiMap(key)}
              />
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-purple-100 bg-white/40 text-[10px] text-gray-500">
          <span>
            Use <strong className="font-semibold text-gray-600">Map</strong> to open Configure step, or{" "}
            <strong className="font-semibold text-gray-600">AI</strong> for auto-match.
          </span>
          <span className="font-mono text-purple-600">
            {totalMapped}/{entries.length}
          </span>
        </div>
    </div>
  );
}

function RowAction({
  state,
  onOpenManual,
  onAiMap,
}: {
  state: RowState | undefined;
  onOpenManual: () => void;
  onAiMap: () => void;
}) {
  if (!state) return null;
  if (state.kind === "auto" || state.kind === "mapped") {
    const label =
      state.kind === "mapped"
        ? state.via === "ai"
          ? "AI mapped"
          : "Mapped"
        : "Mapped";
    return (
      <div className="shrink-0 flex flex-col items-end gap-1">
        <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
          <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {label}
        </span>
        <MapButton onClick={onOpenManual} label="Change" />
      </div>
    );
  }
  if (state.kind === "mapping") {
    return (
      <span className="shrink-0 inline-flex items-center gap-1 rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700">
        <span className="inline-block size-2.5 rounded-full border-2 border-purple-300 border-t-purple-700 animate-spin" />
        Mapping…
      </span>
    );
  }
  if (state.kind === "no-match") {
    return (
      <div className="shrink-0 flex flex-col items-end gap-1">
        <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
          No match
        </span>
        <div className="flex gap-1">
          <MapButton onClick={onOpenManual} />
          <AiMapButton onClick={onAiMap} />
        </div>
      </div>
    );
  }
  return (
    <div className="shrink-0 flex gap-1">
      <MapButton onClick={onOpenManual} />
      <AiMapButton onClick={onAiMap} />
    </div>
  );
}

function MapButton({ onClick, label = "Map" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-md border border-purple-200 bg-white px-2 py-1 text-[10px] font-semibold text-purple-700 hover:bg-purple-50"
    >
      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  );
}

function AiMapButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-2 py-1 text-[10px] font-semibold text-white hover:brightness-110"
    >
      <svg viewBox="0 0 24 24" width="9" height="9" fill="currentColor">
        <path d="M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6L12 2z" />
      </svg>
      AI
    </button>
  );
}

function RowValue({
  value,
  state,
  steps,
}: {
  value: InputValue;
  state: RowState | undefined;
  steps: FlowStep[];
}) {
  if (state?.kind === "mapped") {
    return <RefPill refValue={state.ref} steps={steps} accent={state.via === "ai" ? "ai" : undefined} />;
  }
  if (state?.kind === "mapping") {
    return (
      <span className="text-purple-600 italic text-[11px]">
        scanning upstream outputs…
      </span>
    );
  }
  if (state?.kind === "no-match") {
    return (
      <span className="text-amber-700 text-[11px]">
        kept as literal — no upstream match
      </span>
    );
  }
  return <ExistingValue value={value} steps={steps} />;
}

function ExistingValue({ value, steps }: { value: InputValue; steps: FlowStep[] }) {
  if (value.kind === "literal") {
    const v = value.value;
    if (v === "" || v == null) return <span className="text-gray-400 italic">empty</span>;
    if (typeof v === "string")
      return <span className="text-gray-700">&ldquo;{truncate(String(v))}&rdquo;</span>;
    return <span className="font-mono text-gray-700">{String(v)}</span>;
  }
  if (value.kind === "ref") {
    return <RefPill refValue={value.ref} steps={steps} />;
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {value.parts.map((p, i) =>
        typeof p === "string" ? (
          <span key={i} className="text-gray-700 whitespace-pre-wrap">
            {truncate(p)}
          </span>
        ) : (
          <RefPill key={i} refValue={p} steps={steps} />
        ),
      )}
    </span>
  );
}

function RefPill({
  refValue,
  steps,
  accent,
}: {
  refValue: VariableRef;
  steps: FlowStep[];
  accent?: "ai";
}) {
  const step = steps.find((s) => s.id === refValue.stepId);
  const stepIdx = steps.findIndex((s) => s.id === refValue.stepId);
  const sample = step ? resolveSampleFromStep(step, refValue) : undefined;
  const path = refValue.path.join(".");
  const cls =
    accent === "ai"
      ? "border-pink-300 bg-pink-50 text-pink-800"
      : "border-purple-200 bg-purple-50 text-purple-800";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-mono ${cls}`}
      title={`{{steps.${refValue.stepId}.output.${path}}} → ${String(sample)}`}
    >
      {accent === "ai" && (
        <svg viewBox="0 0 24 24" width="9" height="9" fill="currentColor">
          <path d="M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6L12 2z" />
        </svg>
      )}
      <span>
        #{stepIdx >= 0 ? stepIdx + 1 : "?"}.{path}
      </span>
      <span className="opacity-50">·</span>
      <span className="font-sans normal-case opacity-80">{formatSample(sample)}</span>
    </span>
  );
}

function truncate(v: string, n = 26): string {
  return v.length > n ? v.slice(0, n - 1) + "…" : v;
}

// ---------- Guided multi-step flow (when no step is selected) ----------

export function MapVariablesGuidedFlow({
  steps,
  onFocusStep,
  onApplyMapping,
  onOpenManualMap,
}: {
  steps: FlowStep[];
  onFocusStep?: (stepId: string) => void;
  onApplyMapping?: (stepId: string, inputKey: string, ref: VariableRef) => void;
  onOpenManualMap?: (stepId: string, inputKey: string) => void;
}) {
  const stepsNeedingMap = useMemo(() => {
    const needing = getStepsNeedingVariableMap(steps);
    if (needing.length > 0) return needing;
    return steps.filter((s) => Object.keys(s.inputs).length > 0);
  }, [steps]);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = stepsNeedingMap[index];
  const totalLiterals = useMemo(
    () => stepsNeedingMap.reduce((n, s) => n + countLiteralInputs(s), 0),
    [stepsNeedingMap],
  );

  useEffect(() => {
    if (finished || !current) return;
    onFocusStep?.(current.id);
  }, [current?.id, finished, onFocusStep]);

  if (stepsNeedingMap.length === 0) return null;

  if (finished) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-[12px] text-emerald-800">
        <div className="font-semibold">Mapping walkthrough complete</div>
        <p className="mt-1 text-emerald-700/90">
          You reviewed all {stepsNeedingMap.length} step
          {stepsNeedingMap.length === 1 ? "" : "s"}. Select any step on the canvas and say
          &ldquo;map&rdquo; again to adjust a single step.
        </p>
      </div>
    );
  }

  const stepIndex = current ? steps.findIndex((s) => s.id === current.id) : -1;
  const literalsOnStep = current ? countLiteralInputs(current) : 0;
  const isLast = index >= stepsNeedingMap.length - 1;

  const goNext = () => {
    if (isLast) setFinished(true);
    else setIndex((i) => i + 1);
  };

  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-purple-100 bg-purple-50/60 px-3 py-2">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="font-semibold text-purple-800">
            Step {index + 1} of {stepsNeedingMap.length}
          </span>
          <span className="text-purple-600/80">
            {totalLiterals} literal input{totalLiterals === 1 ? "" : "s"} across flow
          </span>
        </div>
        <div className="mt-1.5 flex gap-1">
          {stepsNeedingMap.map((s, i) => {
            const idx = steps.findIndex((st) => st.id === s.id);
            const active = i === index;
            const done = i < index;
            return (
              <span
                key={s.id}
                className={`h-1 flex-1 rounded-full ${
                  done ? "bg-emerald-400" : active ? "bg-purple-500" : "bg-purple-200"
                }`}
                title={`#${idx + 1} ${s.title}`}
              />
            );
          })}
        </div>
        {current && (
          <p className="mt-2 text-[11px] text-gray-600">
            Mapping <span className="font-medium text-gray-800">#{stepIndex + 1} {current.title}</span>
            {" — "}
            {literalsOnStep} input{literalsOnStep === 1 ? "" : "s"} still literal
          </p>
        )}
      </div>

      {current && (
        <MapVariablesCard
          stepId={current.id}
          steps={steps}
          onApplyMapping={(inputKey, ref) =>
            onApplyMapping?.(current.id, inputKey, ref)
          }
          onOpenManualMap={(inputKey) =>
            onOpenManualMap?.(current.id, inputKey)
          }
        />
      )}

      <div className="flex items-center justify-end gap-2">
        {index > 0 && (
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-50"
          >
            Previous
          </button>
        )}
        <button
          type="button"
          onClick={goNext}
          className="rounded-md bg-purple-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-purple-700"
        >
          {isLast ? "Finish walkthrough" : "Next step →"}
        </button>
      </div>
    </div>
  );
}
