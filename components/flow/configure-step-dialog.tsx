"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { AppIntegration } from "@/lib/flow-types";
import type { FlowStep, InputValue, VariableRef } from "@/lib/flow-types";
import { fieldType } from "@/lib/map-variables";
import { UpstreamVariablesPanel } from "@/components/flow/upstream-variables-panel";

const BRANCH_STYLES: Record<"yes" | "no", string> = {
  yes: "bg-emerald-100 text-emerald-700",
  no: "bg-red-100 text-red-700",
};

type ConfigureStepDialogProps = {
  step: FlowStep;
  stepIndex: number;
  steps: FlowStep[];
  mappingInputKey: string | null;
  onMappingInputKeyChange: (key: string | null) => void;
  onClose: () => void;
  onApplyMapping: (inputKey: string, ref: VariableRef) => void;
  renderInputValue: (value: InputValue) => ReactNode;
  integration: AppIntegration | null;
  isConnected: boolean;
  connectingAppId: string | null;
  onConnectApp: (appId: string) => void;
  checkIcon: ReactNode;
};

export function ConfigureStepDialog({
  step,
  stepIndex,
  steps,
  mappingInputKey,
  onMappingInputKeyChange,
  onClose,
  onApplyMapping,
  renderInputValue,
  integration,
  isConnected,
  connectingAppId,
  onConnectApp,
  checkIcon,
}: ConfigureStepDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="configure-step-title"
    >
      <button
        type="button"
        aria-label="Close configuration"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-default"
      />
      {/* MUI: maxWidth="xl" (1536px) + fullWidth, full height */}
      <section className="relative z-10 flex h-[calc(100vh-64px)] w-full max-w-[1536px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
        <header className="flex items-center gap-3 border-b border-gray-200 px-5 py-3 flex-shrink-0">
          <div className="min-w-0 flex-1">
            <h2 id="configure-step-title" className="text-base font-semibold text-gray-800 truncate">
              Configure step
            </h2>
            <p className="text-xs text-gray-500 truncate">
              #{stepIndex + 1} {step.title}
              {mappingInputKey && (
                <span className="text-purple-600">
                  {" "}
                  · mapping <span className="font-mono">{mappingInputKey}</span>
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="flex flex-1 min-h-0">
          <div className="flex flex-1 flex-col min-w-0 min-h-0">
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {step.branch && (
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${BRANCH_STYLES[step.branch]}`}
                  >
                    {step.branch === "yes" ? "if" : "else"} branch
                  </span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium uppercase tracking-wide text-gray-500">
                  Title
                </label>
                <input
                  type="text"
                  defaultValue={step.title}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium uppercase tracking-wide text-gray-500">
                  Description
                </label>
                <textarea
                  defaultValue={step.subtitle}
                  rows={3}
                  className="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200"
                />
              </div>

              {step.kind === "condition" && step.condition && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-wide text-gray-500">
                    Condition
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-orange-100 bg-orange-50/40 px-2.5 py-2 text-[12px]">
                    {renderInputValue(step.condition.left)}
                    <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700">
                      {step.condition.operator}
                    </span>
                    {renderInputValue(step.condition.right)}
                  </div>
                </div>
              )}

              {Object.keys(step.inputs).length > 0 && (
                <div className="space-y-2">
                  <label className="block text-[11px] font-medium uppercase tracking-wide text-gray-500">
                    Inputs
                  </label>
                  <p className="text-[11px] text-gray-500">
                    Click an input to map it using the variable list on the right.
                  </p>
                  <div className="space-y-2">
                    {Object.entries(step.inputs).map(([key, value]) => {
                      const isActive = mappingInputKey === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => onMappingInputKeyChange(key)}
                          className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                            isActive
                              ? "border-purple-300 bg-purple-50 ring-2 ring-purple-200"
                              : "border-gray-200 bg-gray-50/50 hover:border-purple-200 hover:bg-purple-50/30"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <span className="text-xs font-semibold text-gray-800">{key}</span>
                            <span className="text-[10px] text-gray-400 font-mono uppercase shrink-0">
                              {fieldType(step.inputSchema, key)} · {value.kind}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1 text-[12px]">
                            {renderInputValue(value)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {integration && (
                <div className="space-y-2">
                  <label className="block text-[11px] font-medium uppercase tracking-wide text-gray-500">
                    Connection
                  </label>
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base">{integration.icon}</span>
                      <span className="text-sm text-gray-800 truncate">{integration.name}</span>
                    </div>
                    {isConnected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                        {checkIcon}
                        Connected
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onConnectApp(integration.id)}
                        disabled={connectingAppId === integration.id}
                        className="h-7 px-2 text-[11px]"
                      >
                        {connectingAppId === integration.id ? "Connecting..." : "Connect"}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium uppercase tracking-wide text-gray-500">
                  Notes
                </label>
                <textarea
                  placeholder="Add configuration notes..."
                  rows={3}
                  className="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200"
                />
              </div>
            </div>

            <footer className="border-t border-gray-200 px-5 py-3 flex items-center justify-end gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button size="sm" onClick={onClose}>
                Save
              </Button>
            </footer>
          </div>

          <UpstreamVariablesPanel
            stepIndex={stepIndex}
            steps={steps}
            activeInputKey={mappingInputKey}
            onSelectVariable={(ref) => {
              if (!mappingInputKey) return;
              onApplyMapping(mappingInputKey, ref);
            }}
          />
        </div>
      </section>
    </div>
  );
}
