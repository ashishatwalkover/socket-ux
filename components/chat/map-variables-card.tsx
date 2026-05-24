"use client";

import { useMemo, useState } from "react";
import type {
  FlowStep,
  InputValue,
  JsonSchema,
  VariableRef,
} from "@/lib/flow-types";

type RowState =
  | { kind: "auto" } // already a ref/template — already mapped
  | { kind: "needs-map" } // literal input — could be mapped
  | { kind: "mapping" } // user clicked Map, AI thinking…
  | { kind: "ai-mapped"; ref: VariableRef } // AI assigned a suggested ref
  | { kind: "no-match" }; // AI found no good upstream variable

export function MapVariablesCard({
  stepId,
  steps,
}: {
  stepId: string;
  steps: FlowStep[];
}) {
  const step = steps.find((s) => s.id === stepId);
  const stepIndex = steps.findIndex((s) => s.id === stepId);

  const initial = useMemo<Record<string, RowState>>(() => {
    if (!step) return {};
    const out: Record<string, RowState> = {};
    for (const [k, v] of Object.entries(step.inputs)) {
      out[k] = v.kind === "literal" ? { kind: "needs-map" } : { kind: "auto" };
    }
    return out;
  }, [step]);

  const [rows, setRows] = useState<Record<string, RowState>>(initial);

  if (!step) {
    return (
      <p className="text-xs text-gray-500">Step not found.</p>
    );
  }

  const entries = Object.entries(step.inputs);
  const totalAuto = Object.values(rows).filter(
    (r) => r.kind === "auto" || r.kind === "ai-mapped",
  ).length;
  const totalNeeds = Object.values(rows).filter(
    (r) => r.kind === "needs-map" || r.kind === "mapping",
  ).length;

  const onMap = async (key: string) => {
    setRows((prev) => ({ ...prev, [key]: { kind: "mapping" } }));
    await new Promise((r) => setTimeout(r, 750 + Math.random() * 350));
    const suggestion = suggestRefForKey(key, stepIndex, steps);
    setRows((prev) => ({
      ...prev,
      [key]: suggestion
        ? { kind: "ai-mapped", ref: suggestion }
        : { kind: "no-match" },
    }));
  };

  const onMapAll = async () => {
    const targets = Object.entries(rows).filter(([, r]) => r.kind === "needs-map");
    for (const [k] of targets) {
      // sequential for nicer streaming feel
      // eslint-disable-next-line no-await-in-loop
      await onMap(k);
    }
  };

  return (
    <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-white to-purple-50/50 shadow-sm overflow-hidden">
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
            {totalAuto} auto-mapped · {totalNeeds} need attention
          </div>
        </div>
        {totalNeeds > 0 && (
          <button
            type="button"
            onClick={onMapAll}
            className="rounded-md bg-purple-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-purple-700"
          >
            Map all
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
                <span className="text-[11px] font-semibold text-gray-700">
                  {key}
                </span>
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
              onMap={() => onMap(key)}
            />
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-purple-100 bg-white/40 text-[10px] text-gray-500">
        <span>
          AI uses upstream output schemas + sample data to suggest matches.
        </span>
        <span className="font-mono text-purple-600">
          {totalAuto}/{entries.length}
        </span>
      </div>
    </div>
  );
}

function RowAction({
  state,
  onMap,
}: {
  state: RowState | undefined;
  onMap: () => void;
}) {
  if (!state) return null;
  if (state.kind === "auto" || state.kind === "ai-mapped") {
    return (
      <span className="shrink-0 inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
        <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {state.kind === "ai-mapped" ? "AI mapped" : "Mapped"}
      </span>
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
      <span className="shrink-0 inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
        No match
      </span>
    );
  }
  // needs-map
  return (
    <button
      type="button"
      onClick={onMap}
      className="shrink-0 inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-2 py-1 text-[10px] font-semibold text-white hover:brightness-110"
    >
      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Map
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
  if (state?.kind === "ai-mapped") {
    return <RefPill refValue={state.ref} steps={steps} accent="ai" />;
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
  // For "auto" or "needs-map", show the existing value
  return <ExistingValue value={value} steps={steps} />;
}

function ExistingValue({ value, steps }: { value: InputValue; steps: FlowStep[] }) {
  if (value.kind === "literal") {
    const v = value.value;
    if (v === "" || v == null) return <span className="text-gray-400 italic">empty</span>;
    if (typeof v === "string")
      return <span className="text-gray-700">&ldquo;{truncate(v)}&rdquo;</span>;
    return <span className="font-mono text-gray-700">{String(v)}</span>;
  }
  if (value.kind === "ref") {
    return <RefPill refValue={value.ref} steps={steps} />;
  }
  // template
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
  const stepIdx = steps.findIndex((s) => s.id === refValue.stepId);
  const sample = resolveSample(steps, refValue);
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
      <span className="font-sans normal-case opacity-80">
        {formatSample(sample)}
      </span>
    </span>
  );
}

// ---------- helpers ----------

function fieldType(schema: JsonSchema | undefined, key: string): string {
  if (!schema || schema.type !== "object" || !schema.properties) return "any";
  const child = schema.properties[key];
  if (!child) return "any";
  if (child.type === "object") return "object";
  if (child.type === "array") return "array";
  return child.type;
}

function truncate(v: string, n = 26): string {
  return v.length > n ? v.slice(0, n - 1) + "…" : v;
}

function resolveSample(steps: FlowStep[], ref: VariableRef): unknown {
  const s = steps.find((st) => st.id === ref.stepId);
  if (!s) return undefined;
  let cur: unknown = s.sampleOutput;
  for (const p of ref.path) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

function formatSample(v: unknown): string {
  if (v === undefined) return "—";
  if (v === null) return "null";
  if (typeof v === "string") return v.length > 22 ? v.slice(0, 20) + "…" : v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return `[${v.length}]`;
  if (typeof v === "object") return "{…}";
  return String(v);
}

function collectLeafPaths(
  schema: JsonSchema | undefined,
  prefix: string[] = [],
): string[][] {
  if (!schema) return [];
  if (schema.type === "object") {
    const props = schema.properties ?? {};
    const keys = Object.keys(props);
    if (keys.length === 0) return prefix.length ? [prefix] : [];
    const out: string[][] = [];
    for (const k of keys) {
      out.push(...collectLeafPaths(props[k], [...prefix, k]));
    }
    return out;
  }
  if (schema.type === "array") {
    return prefix.length ? [prefix] : [];
  }
  return prefix.length ? [prefix] : [];
}

function suggestRefForKey(
  key: string,
  stepIndex: number,
  steps: FlowStep[],
): VariableRef | null {
  if (stepIndex <= 0) return null;
  const upstream = steps.slice(0, stepIndex);
  const target = key.toLowerCase();

  // Pass 1: exact leaf-name match
  for (let i = upstream.length - 1; i >= 0; i--) {
    const s = upstream[i];
    const paths = collectLeafPaths(s.outputSchema);
    const exact = paths.find(
      (p) => p[p.length - 1].toLowerCase() === target,
    );
    if (exact) return { stepId: s.id, path: exact };
  }

  // Pass 2: substring match either direction
  for (let i = upstream.length - 1; i >= 0; i--) {
    const s = upstream[i];
    const paths = collectLeafPaths(s.outputSchema);
    const partial = paths.find((p) => {
      const leaf = p[p.length - 1].toLowerCase();
      return leaf.includes(target) || target.includes(leaf);
    });
    if (partial) return { stepId: s.id, path: partial };
  }

  return null;
}
