"use client";

import { useMemo, useState } from "react";
import type { FlowStep, VariableRef } from "@/lib/flow-types";
import { formatSample, getUpstreamVariableGroups } from "@/lib/map-variables";

export function UpstreamVariablesPanel({
  stepIndex,
  steps,
  activeInputKey,
  onSelectVariable,
}: {
  stepIndex: number;
  steps: FlowStep[];
  activeInputKey?: string | null;
  onSelectVariable: (ref: VariableRef) => void;
}) {
  const [filter, setFilter] = useState("");

  const groups = useMemo(
    () => getUpstreamVariableGroups(stepIndex, steps),
    [stepIndex, steps],
  );

  const filteredGroups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        variables: g.variables.filter(
          (v) =>
            v.pathLabel.toLowerCase().includes(q) ||
            g.stepTitle.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.variables.length > 0);
  }, [groups, filter]);

  return (
    <aside className="flex h-full w-[38%] min-w-[320px] max-w-[520px] shrink-0 flex-col border-l border-gray-200 bg-gray-50/90">
      <div className="flex-shrink-0 border-b border-gray-200 px-4 py-3">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Upstream outputs
        </div>
        {activeInputKey ? (
          <p className="mt-1 text-[12px] text-gray-700">
            Mapping to{" "}
            <span className="font-mono font-semibold text-purple-700">{activeInputKey}</span>
          </p>
        ) : (
          <p className="mt-1 text-[11px] text-gray-500">
            Select an input on the left, then pick a variable below.
          </p>
        )}
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search variables…"
          className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {stepIndex <= 0 && (
          <p className="py-8 text-center text-sm text-gray-500 italic">
            This is the first step — no upstream output variables yet.
          </p>
        )}
        {stepIndex > 0 && filteredGroups.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500 italic">
            {filter ? "No variables match your search." : "No output variables on upstream steps."}
          </p>
        )}
        {filteredGroups.map((group) => (
          <div key={group.stepId} className="mb-4 last:mb-0">
            <div className="sticky top-0 z-[1] mb-2 flex items-center gap-2 rounded-lg bg-gray-200/80 px-2.5 py-2">
              <span className="font-mono text-xs font-bold text-purple-700">
                #{group.stepIndex + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs font-semibold text-gray-800">
                {group.stepTitle}
              </span>
              <span className="text-[10px] text-gray-500">{group.variables.length}</span>
            </div>
            <ul className="space-y-1">
              {group.variables.map((v) => (
                <li key={`${group.stepId}-${v.pathLabel}`}>
                  <button
                    type="button"
                    disabled={!activeInputKey}
                    onClick={() => onSelectVariable(v.ref)}
                    className="w-full rounded-lg border border-transparent bg-white px-3 py-2 text-left shadow-sm hover:border-purple-200 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-transparent disabled:hover:shadow-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-medium text-purple-800">
                        {v.pathLabel}
                      </span>
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono uppercase text-gray-500">
                        {v.type}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-gray-500">
                      {formatSample(v.sample)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
