"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  AppIntegration,
  FlowStep,
  InputValue,
  VariableRef,
} from "@/lib/flow-types";
import { getRequiredIntegrations, getStepIntegration } from "@/lib/flow-apps";
import {
  EXAMPLE_WORKFLOWS,
  resolveFlowName,
  resolveWorkflow,
} from "@/lib/flow-examples";
import { buildStepTree, type FlowTreeNode } from "@/lib/flow-tree";
import {
  countLiteralInputs,
  getStepsNeedingVariableMap,
  MapVariablesCard,
  MapVariablesGuidedFlow,
} from "@/components/chat/map-variables-card";
import {
  ReadinessCard,
  type ReadinessCardResult,
} from "@/components/chat/readiness-card";
import { ConfigureStepDialog } from "@/components/flow/configure-step-dialog";
import { APP_BASE } from "@/lib/app-routes";

type Message =
  | { role: "user"; content: string }
  | { role: "assistant"; type: "text"; content: string }
  | { role: "assistant"; type: "map-card"; mode: "single"; stepId: string }
  | { role: "assistant"; type: "map-card"; mode: "guided" }
  | { role: "assistant"; type: "readiness-card" };

// Loose keyword matcher for chat commands. Normalizes whitespace, case, and
// optional leading / or !. Pass one alias or many — e.g. "map", "map variables".
function matchesCommand(input: string, keywords: string | string[]): boolean {
  const norm = input.trim().toLowerCase().replace(/^[/!]+/, "").replace(/\s+/g, " ");
  const targets = (Array.isArray(keywords) ? keywords : [keywords]).map((k) =>
    k.toLowerCase().replace(/\s+/g, " "),
  );
  return targets.some((target) => {
    if (norm === target || norm.startsWith(target + " ")) return true;
    // Phrase match only for multi-word aliases (avoids "road map" → "map").
    if (target.includes(" ")) return norm.includes(" " + target);
    return false;
  });
}

function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const BRANCH_STYLES: Record<"yes" | "no", string> = {
  yes: "bg-emerald-100 text-emerald-700",
  no: "bg-red-100 text-red-700",
};

function IconSparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className={className}>
      <path d="M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6L12 2zM19 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1zM5 15l.7 1.6L7.3 17.3 5.7 18l-.7 1.6L4.3 18l-1.6-.7 1.6-.7L5 15z" />
    </svg>
  );
}

export default function FlowByAIPage() {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      type: "text",
      content:
        "Hi! Describe the workflow you want to build and I'll create the steps for you on the left. You can refine it anytime.",
    },
  ]);
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [flowName, setFlowName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [buildingStepIndex, setBuildingStepIndex] = useState<number | null>(null);
  const [pendingSteps, setPendingSteps] = useState<FlowStep[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [checkingReadiness, setCheckingReadiness] = useState(false);
  const [readinessResult, setReadinessResult] = useState<ReadinessCardResult | null>(null);
  const [connectedApps, setConnectedApps] = useState<Set<string>>(new Set());
  const [connectingAppId, setConnectingAppId] = useState<string | null>(null);
  const [configStepId, setConfigStepId] = useState<string | null>(null);
  const [configMappingInputKey, setConfigMappingInputKey] = useState<string | null>(null);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const stepRefs = useRef<Map<string, HTMLLIElement | null>>(new Map());

  const stepTree = useMemo(() => buildStepTree(steps), [steps]);

  const errorStepIds = useMemo(() => {
    if (!readinessResult) return [];
    return steps
      .filter((s) => {
        const i = getStepIntegration(s);
        return i && !connectedApps.has(i.id);
      })
      .map((s) => s.id);
  }, [readinessResult, steps, connectedApps]);

  const closeConfigureStep = () => {
    setConfigStepId(null);
    setConfigMappingInputKey(null);
  };

  const openConfigureForMapping = (stepId: string, inputKey: string) => {
    setConfigStepId(stepId);
    setConfigMappingInputKey(inputKey);
    setSelectedStepId(stepId);
    const el = stepRefs.current.get(stepId);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Close config modal on Escape.
  useEffect(() => {
    if (!configStepId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeConfigureStep();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [configStepId]);

  // Reset error cursor whenever the error set changes shape.
  useEffect(() => {
    setCurrentErrorIndex(0);
  }, [errorStepIds.length]);

  const goToError = (direction: 1 | -1) => {
    if (errorStepIds.length === 0) return;
    const next =
      (currentErrorIndex + direction + errorStepIds.length) % errorStepIds.length;
    setCurrentErrorIndex(next);
    const id = errorStepIds[next];
    const el = stepRefs.current.get(id);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    setSelectedStepId(id);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [input]);

  const buildSteps = (stepsToBuild: FlowStep[]) => {
    setPendingSteps(stepsToBuild);
    setSteps([]);
    setBuildingStepIndex(0);

    const interval = Math.min(400, Math.max(150, 4000 / stepsToBuild.length));

    stepsToBuild.forEach((step, index) => {
      window.setTimeout(() => {
        setSteps((prev) => [...prev, step]);
        setBuildingStepIndex(index + 1 < stepsToBuild.length ? index + 1 : null);
      }, (index + 1) * interval);
    });

    window.setTimeout(() => {
      setGenerating(false);
      setBuildingStepIndex(null);
    }, stepsToBuild.length * interval + 200);
  };

  const applyStepInputMapping = (
    stepId: string,
    inputKey: string,
    ref: VariableRef,
  ) => {
    setSteps((prev) =>
      prev.map((s) =>
        s.id !== stepId
          ? s
          : {
              ...s,
              inputs: {
                ...s.inputs,
                [inputKey]: { kind: "ref", ref },
              },
            },
      ),
    );
  };

  const send = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || generating) return;

    // ----- Keyword commands (intercepted before normal flow generation) -----
    if (matchesCommand(value, ["map", "map variables"])) {
      setInput("");
      setMessages((prev) => [...prev, { role: "user", content: value }]);

      if (!selectedStepId) {
        if (steps.length === 0) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              type: "text",
              content:
                "There are no steps yet — describe a workflow first, then say “map” to wire inputs across steps.",
            },
          ]);
          return;
        }

        const stepsNeedingMap = getStepsNeedingVariableMap(steps);
        const stepsWithInputs = steps.filter((s) => Object.keys(s.inputs).length > 0);
        const walkthroughSteps =
          stepsNeedingMap.length > 0 ? stepsNeedingMap : stepsWithInputs;

        if (walkthroughSteps.length === 0) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              type: "text",
              content: "Your flow has no step inputs to map yet.",
            },
          ]);
          return;
        }

        const literalCount = walkthroughSteps.reduce(
          (n, s) => n + countLiteralInputs(s),
          0,
        );
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "text",
            content:
              literalCount > 0
                ? `I found ${walkthroughSteps.length} step${walkthroughSteps.length === 1 ? "" : "s"} with ${literalCount} literal input${literalCount === 1 ? "" : "s"} to map. Use the card below — pick variables manually or use AI.`
                : `Reviewing ${walkthroughSteps.length} step${walkthroughSteps.length === 1 ? "" : "s"} — use the card below to adjust variable links.`,
          },
          {
            role: "assistant",
            type: "map-card",
            mode: "guided",
          },
        ]);
        return;
      }

      const targetStep = steps.find((s) => s.id === selectedStepId);
      if (!targetStep || Object.keys(targetStep.inputs).length === 0) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "text",
            content: "This step has no inputs to map. Select a different step or add inputs first.",
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "text",
          content: `Map inputs for step #${steps.findIndex((s) => s.id === selectedStepId) + 1} — choose upstream variables in the card below.`,
        },
        {
          role: "assistant",
          type: "map-card",
          mode: "single",
          stepId: selectedStepId,
        },
      ]);
      return;
    }

    if (matchesCommand(value, ["check readiness", "check"])) {
      setInput("");
      runReadinessCheck({ addToChat: true, userText: value });
      return;
    }
    // ----- end commands -----

    const workflowSteps = resolveWorkflow(value);
    const nextFlowName = resolveFlowName(value);

    setInput("");
    setFlowName(nextFlowName);
    setReadinessResult(null);
    setMessages((prev) => [...prev, { role: "user", content: value }]);
    setGenerating(true);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "text",
          content: "Got it — I'm building your workflow now. Watch the steps appear on the left.",
        },
      ]);
      buildSteps(workflowSteps);
    }, 600);
  };

  const reset = () => {
    setSteps([]);
    setPendingSteps([]);
    setBuildingStepIndex(null);
    setSelectedStepId(null);
    setGenerating(false);
    setInput("");
    setFlowName("");
    setReadinessResult(null);
    setConnectedApps(new Set());
    setConnectingAppId(null);
    closeConfigureStep();
    setMessages([
      {
        role: "assistant",
        type: "text",
        content:
          "Hi! Describe the workflow you want to build and I'll create the steps for you on the left. You can refine it anytime.",
      },
    ]);
  };

  const runReadinessCheck = (options?: { addToChat?: boolean; userText?: string }) => {
    if (steps.length === 0 || checkingReadiness) return;

    if (options?.addToChat) {
      const userText = options.userText?.trim();
      if (userText) {
        setMessages((prev) => [...prev, { role: "user", content: userText }]);
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "text",
          content:
            "Checking your flow — reviewing structure and app connections. See the card below.",
        },
        { role: "assistant", type: "readiness-card" },
      ]);
    }

    setCheckingReadiness(true);
    setReadinessResult(null);

    window.setTimeout(() => {
      const apps = getRequiredIntegrations(steps);
      const allConnected = apps.every((app) => connectedApps.has(app.id));
      setReadinessResult({
        flowValid: true,
        apps,
        message:
          apps.length === 0
            ? "Flow structure looks good. No external app connections required."
            : allConnected
              ? "All required apps are connected. Your flow is ready to run."
              : "Flow structure is valid, but some apps still need to be connected.",
      });
      setCheckingReadiness(false);
    }, 900);
  };

  const connectApp = (appId: string) => {
    setConnectingAppId(appId);
    window.setTimeout(() => {
      setConnectedApps((prev) => {
        const next = new Set([...prev, appId]);
        if (readinessResult) {
          const allConnected = readinessResult.apps.every((app) => next.has(app.id));
          setReadinessResult({
            ...readinessResult,
            message: allConnected
              ? "All required apps are connected. Your flow is ready to run."
              : "App connected. Connect remaining apps to finish setup.",
          });
        }
        return next;
      });
      setConnectingAppId(null);
    }, 1200);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <header className="flex items-center justify-between h-11 px-4 border-b border-gray-200 bg-white gap-3 flex-shrink-0 shadow-sm">
        <nav className="flex items-center gap-1 text-sm text-gray-500">
          <Link href={APP_BASE} className="hover:text-gray-700 transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-medium">Flow by AI</span>
        </nav>
        {steps.length > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={reset}>Start over</Button>
            <Button size="sm" onClick={() => router.push(`${APP_BASE}/flows/1/v2`)}>Open in editor</Button>
          </div>
        )}
      </header>

      <div className="flex flex-1 min-h-0">
        <main className="flex flex-1 min-w-0 flex-col overflow-y-auto bg-gray-50">
          <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/75 border-b border-gray-200">
            <div className="max-w-2xl px-6 py-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="min-w-0 truncate text-lg font-semibold text-gray-800">{flowName || "Flow name"}</h2>
                {steps.length > 0 && (
                  <div className="flex items-center gap-2 shrink-0">
                    {readinessResult && !checkingReadiness && (
                      errorStepIds.length > 0 ? (
                        <div className="inline-flex items-stretch rounded-md border border-red-200 bg-red-50 text-red-700 overflow-hidden">
                          <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold">
                            <span className="inline-block size-1.5 rounded-full bg-red-500" />
                            {errorStepIds.length} {errorStepIds.length === 1 ? "error" : "errors"}
                            <span className="ml-1 text-[10px] font-normal text-red-500/80">
                              {currentErrorIndex + 1}/{errorStepIds.length}
                            </span>
                          </div>
                          <div className="inline-flex items-stretch border-l border-red-200">
                            <button
                              type="button"
                              onClick={() => goToError(-1)}
                              className="flex items-center justify-center px-1.5 hover:bg-red-100 transition-colors"
                              aria-label="Previous error"
                            >
                              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => goToError(1)}
                              className="flex items-center justify-center px-1.5 border-l border-red-200 hover:bg-red-100 transition-colors"
                              aria-label="Next error"
                            >
                              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                          <IconCheck className="size-3" />
                          Ready
                        </span>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        runReadinessCheck({
                          addToChat: true,
                          userText: "check readiness",
                        })
                      }
                      disabled={checkingReadiness || buildingStepIndex !== null}
                      className="gap-1.5"
                    >
                      {checkingReadiness ? (
                        <>
                          <span className="inline-block size-3 rounded-full border-2 border-gray-300 border-t-purple-500 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <IconCheck />
                          Check readiness
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                {steps.length === 0
                  ? "Steps will appear here as AI builds your flow."
                  : `${steps.length} step${steps.length === 1 ? "" : "s"} in your workflow`}
              </p>
            </div>
          </div>

          {steps.length === 0 ? (
            <div className="flex flex-1 min-h-[calc(100vh-8rem)] items-center justify-center px-6">
              <div className="flex flex-col items-center text-center max-w-md">
                <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-gray-100">
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                    <path d="M12 3v18M3 12h18" strokeLinecap="round" />
                    <rect x="7" y="5" width="10" height="6" rx="1" />
                    <rect x="7" y="13" width="10" height="6" rx="1" />
                  </svg>
                </div>
                <p className="text-2xl font-semibold text-gray-700">No steps yet</p>
                <p className="mt-3 text-base text-gray-500 leading-relaxed">
                  Start a conversation with AI to generate your flow.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-lg">
                  {EXAMPLE_WORKFLOWS.map((example) => (
                    <button
                      key={example.id}
                      type="button"
                      onClick={() => send(example.prompt)}
                      disabled={generating}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 shadow-sm hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition-colors disabled:opacity-50"
                    >
                      {example.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl px-6 py-6">
              <div className="relative">
                <TreeNodes
                  nodes={stepTree}
                  selectedStepId={selectedStepId}
                  setSelectedStepId={setSelectedStepId}
                  onOpenConfigureStep={(id) => {
                    setConfigStepId(id);
                    setConfigMappingInputKey(null);
                  }}
                  readinessResult={readinessResult}
                  connectedApps={connectedApps}
                  connectingAppId={connectingAppId}
                  connectApp={connectApp}
                  stepRefs={stepRefs}
                />

                {buildingStepIndex !== null && buildingStepIndex < pendingSteps.length && (
                  <div className="relative flex gap-4 pt-2">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-50 border-2 border-dashed border-purple-200">
                      <span className="inline-block size-3 rounded-full border-2 border-purple-200 border-t-purple-500 animate-spin" />
                    </span>
                    <div className="flex-1 rounded-xl border border-dashed border-purple-200 bg-purple-50/50 px-4 py-3">
                      <p className="text-xs text-purple-600 font-medium">Adding next step...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {configStepId && (() => {
          const selectedStep = steps.find((s) => s.id === configStepId);
          if (!selectedStep) return null;
          const stepIndex = steps.findIndex((s) => s.id === configStepId);
          const integration = getStepIntegration(selectedStep);
          const isConnected = integration ? connectedApps.has(integration.id) : false;
          return (
            <ConfigureStepDialog
              step={selectedStep}
              stepIndex={stepIndex}
              steps={steps}
              mappingInputKey={configMappingInputKey}
              onMappingInputKeyChange={setConfigMappingInputKey}
              onClose={closeConfigureStep}
              onApplyMapping={(inputKey, ref) => {
                applyStepInputMapping(configStepId, inputKey, ref);
              }}
              renderInputValue={(value) => (
                <InputValueView value={value} steps={steps} />
              )}
              integration={integration}
              isConnected={isConnected}
              connectingAppId={connectingAppId}
              onConnectApp={connectApp}
              checkIcon={<IconCheck className="size-3" />}
            />
          );
        })()}

        <aside className="w-[380px] flex-shrink-0 border-l border-gray-200 bg-white flex flex-col">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-200 flex-shrink-0">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm">
              <IconSparkle />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800">Flow by AI</div>
              <div className="text-[11px] text-gray-400 truncate">Describe your automation</div>
            </div>
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">AI</Badge>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((m, i) => {
              if (m.role === "user") {
                return (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[90%] rounded-lg px-3 py-2 text-[13px] leading-relaxed bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                      {m.content}
                    </div>
                  </div>
                );
              }
              if (m.type === "readiness-card") {
                return (
                  <div key={i} className="flex justify-start w-full min-w-0">
                    <div className="w-full min-w-0">
                      <ReadinessCard
                        steps={steps}
                        checking={checkingReadiness}
                        result={readinessResult}
                        connectedApps={connectedApps}
                        connectingAppId={connectingAppId}
                        onConnectApp={connectApp}
                      />
                    </div>
                  </div>
                );
              }
              if (m.type === "map-card") {
                return (
                  <div key={i} className="flex justify-start w-full min-w-0">
                    <div className="w-full min-w-0">
                      {m.mode === "guided" ? (
                        <MapVariablesGuidedFlow
                          steps={steps}
                          onFocusStep={(id) => {
                            setSelectedStepId(id);
                            const el = stepRefs.current.get(id);
                            el?.scrollIntoView({ behavior: "smooth", block: "center" });
                          }}
                          onApplyMapping={applyStepInputMapping}
                          onOpenManualMap={openConfigureForMapping}
                        />
                      ) : (
                        <MapVariablesCard
                          stepId={m.stepId}
                          steps={steps}
                          onApplyMapping={(inputKey, ref) =>
                            applyStepInputMapping(m.stepId, inputKey, ref)
                          }
                          onOpenManualMap={(inputKey) =>
                            openConfigureForMapping(m.stepId, inputKey)
                          }
                        />
                      )}
                    </div>
                  </div>
                );
              }
              return (
                <div key={i} className="flex justify-start">
                  <div className="max-w-[90%] rounded-lg px-3 py-2 text-[13px] leading-relaxed bg-gray-50 border border-gray-200 text-gray-700">
                    {m.content}
                  </div>
                </div>
              );
            })}
            {generating && (
              <div className="flex justify-start">
                <div className="rounded-lg px-3 py-2 bg-gray-50 border border-gray-200 text-gray-500 text-[13px] flex items-center gap-2">
                  <span className="inline-block size-3 rounded-full border-2 border-gray-300 border-t-purple-500 animate-spin" />
                  Building workflow...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {selectedStepId && (() => {
            const selIdx = steps.findIndex((s) => s.id === selectedStepId);
            const sel = selIdx >= 0 ? steps[selIdx] : null;
            if (!sel) return null;
            return (
              <div className="border-t border-purple-200 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 px-4 py-2 flex items-center gap-2 flex-shrink-0">
                <span className="inline-block size-1.5 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-[11px] font-medium text-purple-700 min-w-0 truncate">
                  AI will modify only:
                  <span className="ml-1 inline-flex items-center gap-1 rounded bg-white/70 border border-purple-200 px-1.5 py-0.5 text-purple-800">
                    <span className="font-mono text-[10px]">#{selIdx + 1}</span>
                    <span className="truncate max-w-[160px]">{sel.title}</span>
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedStepId(null)}
                  className="ml-auto inline-flex items-center justify-center size-5 rounded text-purple-500 hover:text-purple-800 hover:bg-purple-100"
                  aria-label="Clear selection"
                >
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            );
          })()}

          <div className="border-t border-gray-200 px-4 py-3 flex-shrink-0">
            {steps.length === 0 && messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {EXAMPLE_WORKFLOWS.map((example) => (
                  <button
                    key={example.id}
                    type="button"
                    onClick={() => send(example.prompt)}
                    disabled={generating}
                    className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] text-gray-600 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition-colors text-left disabled:opacity-50"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-purple-300 focus-within:ring-1 focus-within:ring-purple-200">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Describe your workflow..."
                rows={1}
                disabled={generating}
                className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none leading-relaxed disabled:opacity-50"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || generating}
                className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white disabled:opacity-40 hover:brightness-110 transition-all"
                aria-label="Send"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ---------- Variable / input rendering ----------

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

function refStepLabel(steps: FlowStep[], stepId: string): string {
  const idx = steps.findIndex((s) => s.id === stepId);
  return idx >= 0 ? `#${idx + 1}` : stepId;
}

function formatSample(v: unknown): string {
  if (v === undefined) return "—";
  if (v === null) return "null";
  if (typeof v === "string") return v.length > 28 ? v.slice(0, 25) + "…" : v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return `[${v.length} items]`;
  if (typeof v === "object") return "{…}";
  return String(v);
}

function VariablePill({ refValue, steps }: { refValue: VariableRef; steps: FlowStep[] }) {
  const sample = resolveSample(steps, refValue);
  const path = refValue.path.join(".");
  return (
    <span
      className="inline-flex items-center gap-1 rounded border border-purple-200 bg-purple-50 px-1.5 py-0.5 text-[11px] font-mono text-purple-800"
      title={`{{steps.${refValue.stepId}.output.${path}}} → ${String(sample)}`}
    >
      <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{refStepLabel(steps, refValue.stepId)}.{path}</span>
      <span className="text-purple-400">·</span>
      <span className="font-sans not-italic text-purple-600/80 normal-case">
        {formatSample(sample)}
      </span>
    </span>
  );
}

function InputValueView({ value, steps }: { value: InputValue; steps: FlowStep[] }) {
  if (value.kind === "literal") {
    const v = value.value;
    if (v === "" || v === undefined || v === null) {
      return <span className="text-[11px] italic text-gray-400">empty</span>;
    }
    if (typeof v === "string") {
      return <span className="text-gray-800">&ldquo;{v}&rdquo;</span>;
    }
    if (Array.isArray(v)) {
      return (
        <span className="font-mono text-gray-700">
          [{v.length} {v.length === 1 ? "item" : "items"}]
        </span>
      );
    }
    if (typeof v === "object") {
      return <span className="font-mono text-gray-700">{"{…}"}</span>;
    }
    return <span className="font-mono text-gray-800">{String(v)}</span>;
  }
  if (value.kind === "ref") {
    return <VariablePill refValue={value.ref} steps={steps} />;
  }
  // template
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {value.parts.map((p, i) =>
        typeof p === "string" ? (
          <span key={i} className="text-gray-700 whitespace-pre-wrap">
            {p}
          </span>
        ) : (
          <VariablePill key={i} refValue={p} steps={steps} />
        ),
      )}
    </span>
  );
}

// ---------- Tree rendering ----------

type TreeRenderProps = {
  nodes: FlowTreeNode[];
  selectedStepId: string | null;
  setSelectedStepId: (id: string | null) => void;
  onOpenConfigureStep: (stepId: string) => void;
  readinessResult: ReadinessCardResult | null;
  connectedApps: Set<string>;
  connectingAppId: string | null;
  connectApp: (appId: string) => void;
  stepRefs: React.RefObject<Map<string, HTMLLIElement | null>>;
};

function TreeNodes(props: TreeRenderProps) {
  const { nodes } = props;
  if (nodes.length === 0) return null;
  return (
    <ul className="relative space-y-1">
      {nodes.map((node, i) => (
        <TreeNodeView
          key={node.step.id}
          node={node}
          isLast={i === nodes.length - 1}
          parent={props}
        />
      ))}
    </ul>
  );
}

function TreeNodeView({
  node,
  isLast,
  parent,
}: {
  node: FlowTreeNode;
  isLast: boolean;
  parent: TreeRenderProps;
}) {
  const { step } = node;
  const hasBranches = step.kind === "condition" && (node.yes || node.no);
  const [ifCollapsed, setIfCollapsed] = useState(false);
  const [elseCollapsed, setElseCollapsed] = useState(false);

  const yesCount = node.yes?.length ?? 0;
  const noCount = node.no?.length ?? 0;

  return (
    <li
      ref={(el) => {
        const map = parent.stepRefs.current;
        if (!map) return;
        if (el) map.set(step.id, el);
        else map.delete(step.id);
      }}
      className="relative scroll-mt-24"
    >
      <div className="relative">
        {/* vertical connector down to the next sibling (non-condition) */}
        {!isLast && !hasBranches && (
          <div className="absolute left-[15px] top-9 bottom-0 w-px bg-gray-200" />
        )}
        <StepRow
          node={node}
          parent={parent}
          collapseToggle={
            hasBranches
              ? {
                  collapsed: ifCollapsed,
                  toggle: () => setIfCollapsed((c) => !c),
                  count: yesCount,
                }
              : undefined
          }
        />
      </div>

      {hasBranches && (
        <>
          {/* IF body — no label, step rows are the body */}
          {!ifCollapsed && (
            <div className="mt-1 ml-[15px] border-l border-gray-200 pl-4 pb-1">
              {yesCount === 0 ? (
                <p className="text-[11px] text-gray-400 italic">no steps</p>
              ) : (
                <TreeNodes
                  nodes={node.yes!}
                  selectedStepId={parent.selectedStepId}
                  setSelectedStepId={parent.setSelectedStepId}
                  onOpenConfigureStep={parent.onOpenConfigureStep}
                  readinessResult={parent.readinessResult}
                  connectedApps={parent.connectedApps}
                  connectingAppId={parent.connectingAppId}
                  connectApp={parent.connectApp}
                  stepRefs={parent.stepRefs}
                />
              )}
            </div>
          )}

          {/* ELSE divider — at the SAME indent as the IF step (parallel) */}
          {noCount > 0 && (
            <>
              <button
                type="button"
                onClick={() => setElseCollapsed((c) => !c)}
                className="flex w-full items-center gap-2 mt-2 mb-1 group"
                aria-expanded={!elseCollapsed}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`text-gray-400 group-hover:text-gray-600 transition-transform ${elseCollapsed ? "-rotate-90" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${BRANCH_STYLES.no}`}>
                  else
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {noCount} {noCount === 1 ? "step" : "steps"}
                </span>
                <span className="h-px flex-1 bg-gray-200" />
              </button>
              {!elseCollapsed && (
                <div className="ml-[15px] border-l border-gray-200 pl-4 pb-1">
                  <TreeNodes
                    nodes={node.no!}
                    selectedStepId={parent.selectedStepId}
                    setSelectedStepId={parent.setSelectedStepId}
                    onOpenConfigureStep={parent.onOpenConfigureStep}
                    readinessResult={parent.readinessResult}
                    connectedApps={parent.connectedApps}
                    connectingAppId={parent.connectingAppId}
                    connectApp={parent.connectApp}
                    stepRefs={parent.stepRefs}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </li>
  );
}

function StepRow({
  node,
  parent,
  collapseToggle,
}: {
  node: FlowTreeNode;
  parent: TreeRenderProps;
  collapseToggle?: { collapsed: boolean; toggle: () => void; count: number };
}) {
  const { step, index } = node;
  const {
    selectedStepId,
    setSelectedStepId,
    readinessResult,
    connectedApps,
    connectingAppId,
    connectApp,
  } = parent;

  const isSelected = selectedStepId === step.id;
  const stepIntegration = readinessResult ? getStepIntegration(step) : null;
  const hasMissingConnection = Boolean(
    stepIntegration && !connectedApps.has(stepIntegration.id),
  );
  const showReadyCheck = Boolean(readinessResult && !hasMissingConnection);
  const isCondition = step.kind === "condition";

  return (
    <button
      type="button"
      onClick={() => {
        setSelectedStepId(step.id);
        collapseToggle?.toggle();
      }}
      className={`group relative z-10 flex w-full items-center gap-3 rounded-lg border px-2 py-2 text-left transition-colors ${
        hasMissingConnection
          ? isSelected
            ? "border-red-400 bg-red-100/70 ring-2 ring-red-300"
            : "border-red-300 bg-red-50/40 hover:bg-red-50"
          : isSelected
            ? "border-purple-200 bg-purple-50 ring-2 ring-purple-300"
            : isCondition
              ? "border-orange-200 bg-orange-50/60 hover:bg-orange-50"
              : "border-transparent hover:bg-gray-100"
      }`}
    >
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          isCondition
            ? "bg-orange-100 text-orange-700"
            : "text-purple-700"
        }`}
      >
        {isCondition ? (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" strokeLinecap="round" />
          </svg>
        ) : (
          index
        )}
      </span>
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className="min-w-0 truncate text-sm font-medium text-gray-800">{step.title}</span>
        <span className="min-w-0 truncate text-xs text-gray-500">{step.subtitle}</span>
      </span>
      <span className="ml-auto flex shrink-0 items-center gap-2">
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            parent.onOpenConfigureStep(step.id);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              parent.onOpenConfigureStep(step.id);
            }
          }}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 inline-flex size-6 items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-700 cursor-pointer transition-opacity"
          aria-label="Edit step"
          title="Edit step"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {hasMissingConnection && stepIntegration && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              connectApp(stepIntegration.id);
            }}
            disabled={connectingAppId === stepIntegration.id}
            className="h-6 px-2 text-[11px] border-red-200 text-red-700 hover:bg-red-50"
          >
            {connectingAppId === stepIntegration.id ? "Connecting..." : `Connect ${stepIntegration.name}`}
          </Button>
        )}
        {showReadyCheck && (
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <IconCheck className="size-3" />
          </span>
        )}
        {collapseToggle && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              collapseToggle.toggle();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                collapseToggle.toggle();
              }
            }}
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
            aria-expanded={!collapseToggle.collapsed}
            aria-label={collapseToggle.collapsed ? "Expand if body" : "Collapse if body"}
          >
            <svg
              viewBox="0 0 24 24"
              width="11"
              height="11"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className={`transition-transform ${collapseToggle.collapsed ? "-rotate-90" : ""}`}
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {collapseToggle.count}
          </span>
        )}
      </span>
    </button>
  );
}
