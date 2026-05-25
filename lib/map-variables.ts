import type { FlowStep, JsonSchema, VariableRef } from "@/lib/flow-types";

export type OutputVariable = {
  ref: VariableRef;
  pathLabel: string;
  type: string;
  sample: unknown;
};

export type UpstreamVariableGroup = {
  stepId: string;
  stepIndex: number;
  stepTitle: string;
  variables: OutputVariable[];
};

export function collectLeafPaths(
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

function pathType(schema: JsonSchema | undefined, path: string[]): string {
  if (!schema || path.length === 0) return "any";
  let cur: JsonSchema | undefined = schema;
  for (const segment of path) {
    if (!cur || cur.type !== "object" || !cur.properties) return "any";
    cur = cur.properties[segment];
  }
  if (!cur) return "any";
  if (cur.type === "object") return "object";
  if (cur.type === "array") return "array";
  return cur.type;
}

export function resolveSampleFromStep(step: FlowStep, ref: VariableRef): unknown {
  let cur: unknown = step.sampleOutput;
  for (const p of ref.path) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

export function formatSample(v: unknown): string {
  if (v === undefined) return "—";
  if (v === null) return "null";
  if (typeof v === "string") return v.length > 22 ? v.slice(0, 20) + "…" : v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return `[${v.length}]`;
  if (typeof v === "object") return "{…}";
  return String(v);
}

export function fieldType(schema: JsonSchema | undefined, key: string): string {
  if (!schema || schema.type !== "object" || !schema.properties) return "any";
  const child = schema.properties[key];
  if (!child) return "any";
  if (child.type === "object") return "object";
  if (child.type === "array") return "array";
  return child.type;
}

export function getUpstreamVariableGroups(
  stepIndex: number,
  steps: FlowStep[],
): UpstreamVariableGroup[] {
  if (stepIndex <= 0) return [];
  return steps.slice(0, stepIndex).map((s, stepIndexInFlow) => {
    const paths = collectLeafPaths(s.outputSchema);
    return {
      stepId: s.id,
      stepIndex: stepIndexInFlow,
      stepTitle: s.title,
      variables: paths.map((path) => {
        const ref: VariableRef = { stepId: s.id, path };
        return {
          ref,
          pathLabel: path.join("."),
          type: pathType(s.outputSchema, path),
          sample: resolveSampleFromStep(s, ref),
        };
      }),
    };
  }).filter((g) => g.variables.length > 0);
}

export function suggestRefForKey(
  key: string,
  stepIndex: number,
  steps: FlowStep[],
): VariableRef | null {
  if (stepIndex <= 0) return null;
  const upstream = steps.slice(0, stepIndex);
  const target = key.toLowerCase();

  for (let i = upstream.length - 1; i >= 0; i--) {
    const s = upstream[i];
    const paths = collectLeafPaths(s.outputSchema);
    const exact = paths.find((p) => p[p.length - 1].toLowerCase() === target);
    if (exact) return { stepId: s.id, path: exact };
  }

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
