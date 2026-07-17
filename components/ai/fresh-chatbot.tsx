"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AssistantBlockView } from "@/components/ai/message-cards";
import { ASSISTANT_SCRIPT, PAST_CONVERSATIONS } from "@/lib/ai/mock-data";
import type { AssistantBlock } from "@/lib/ai/mock-data";

const ArrowUp = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
);
const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z"/><path d="M19 14l.9 2.1 2.1.9-2.1.9L19 20l-.9-2.1-2.1-.9 2.1-.9L19 14z"/></svg>
);
const ExternalLink = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></svg>
);
const Bot = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="7" width="16" height="12" rx="2"/><path d="M12 3v4"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/></svg>
);
const User = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const Gear = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/></svg>
);

type Message =
  | { id: string; role: "user"; content: string }
  | { id: string; role: "assistant"; content?: string; blocks?: AssistantBlock[] };

type FlowStep = {
  id: string;
  label: string;
  icon: string;
  status?: "pending" | "active" | "completed";
  badge?: string;
  optional?: boolean;
};

const SUGGESTIONS = [
  "Draft a Shopify cart-abandonment email",
  "Explain how AI Reply Templates work",
  "Summarize my latest campaign performance",
  "Help me set up an Instagram auto-reply flow",
];

const FLOW_STEPS: FlowStep[] = [
  { id: "home", label: "Summary", icon: "home", status: "active" },
  { id: "1", label: "Lead Form Submitted", icon: "facebook", status: "completed", badge: "changes" },
  { id: "2", label: "Send Confirmation Message On W...", icon: "message", status: "completed" },
  { id: "3", label: "Send Welcome Email", icon: "mail", status: "completed", optional: true },
  { id: "4", label: "Add New Lead In CRM", icon: "crm", status: "completed" },
  { id: "5", label: "Notify Sales Team", icon: "bell", status: "completed", optional: true },
];

export function FreshChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [turn, setTurn] = useState(0);
  const [flowActive, setFlowActive] = useState(false);
  const [showFlowPanel, setShowFlowPanel] = useState(false);
  const [showDrafts, setShowDrafts] = useState(true);
  const [selectedFlowStep, setSelectedFlowStep] = useState<string | null>("home");
  const [showOptionalSteps, setShowOptionalSteps] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [showEllipsisMenu, setShowEllipsisMenu] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [changedSteps, setChangedSteps] = useState<Set<string>>(new Set());
  const [changesCount, setChangesCount] = useState(0);

  const handleStepChange = (stepId: string) => {
    const newChangedSteps = new Set(changedSteps);
    newChangedSteps.add(stepId);
    setChangedSteps(newChangedSteps);
    setChangesCount(newChangedSteps.size);
    setHasChanges(true);
  };
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const send = (text: string) => {
    const trimmed = text.trim();
    const shouldSendChanges = hasChanges && !trimmed;

    if (!trimmed && !hasChanges) return;

    const userMessages: Message[] = [];

    if (shouldSendChanges) {
      userMessages.push({
        id: crypto.randomUUID(),
        role: "user",
        content: "Changes made to configuration",
      });
    } else if (trimmed) {
      userMessages.push({
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
      });
    }

    setMessages((prev) => [...prev, ...userMessages]);
    setInput("");
    setHasChanges(false);
    setIsTyping(true);

    setTimeout(() => {
      let reply: Message;
      if (shouldSendChanges) {
        reply = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Configuration changes applied. Your automation is ready to test.",
        };
      } else if (turn < ASSISTANT_SCRIPT.length) {
        const assistantTurn = ASSISTANT_SCRIPT[turn];
        reply = {
          id: crypto.randomUUID(),
          role: "assistant",
          blocks: assistantTurn.blocks,
        };
        if (turn === 1) setFlowActive(true);
        setTurn((t) => t + 1);
      } else {
        reply = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Here's a thought on "${trimmed}":\n\nThis is a fresh AI assistant. Responses here are simulated for now — plug in your model of choice to make it real.`,
        };
      }
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 700);
  };

  const handleAction = useCallback((label: string) => {
    send(label);
  }, [send]);

  const empty = messages.length === 0;

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200/70 bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-gray-900">Fresh AI</div>
            <div className="text-[11px] text-gray-500">A clean, new assistant</div>
          </div>
        </div>
        <Link
          href="/ai2"
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          Open classic AI
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </header>

      {/* Main: Chat Area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
          {empty ? (
            <div className="mt-16 flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg">
                <Sparkles className="h-6 w-6" />
              </span>
              <h1 className="mt-5 text-2xl font-semibold text-gray-900">How can I help today?</h1>
              <p className="mt-2 text-sm text-gray-500">
                Ask anything, or start with one of the ideas below.
              </p>
              <div className="mt-8 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-xl border border-gray-200 bg-white p-3 text-left text-sm text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    m.role === "user"
                      ? "bg-gray-900 text-white"
                      : "bg-gradient-to-br from-blue-500 to-violet-500 text-white"
                  }`}
                >
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </span>
                {m.role === "assistant" && m.blocks ? (
                  <div className="flex min-w-0 flex-1 flex-col space-y-3">
                    {m.blocks.map((b, i) => (
                      <AssistantBlockView key={i} block={b} onAction={handleAction} />
                    ))}
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-gray-900 text-white"
                        : "border border-gray-200 bg-white text-gray-800 shadow-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                )}
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white">
                <Bot className="h-4 w-4" />
              </span>
              <div className="flex items-center gap-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.1s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
              </div>
            </div>
          )}
          </div>
          </div>

          {/* Composer wrapped in flow mini-app card */}
          <div className="bg-white px-4 py-4 relative">
            {/* Draft flows popover */}
            {empty && showDrafts && (
              <div className="mx-auto w-full max-w-4xl mb-2">
                <div className="rounded-xl border border-gray-200 bg-white shadow-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">Draft flows</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Continue where you left off</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDrafts(false)}
                      className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Skip
                    </button>
                  </div>
                  <div className="rounded-lg bg-gray-50 divide-y divide-gray-100">
                    {PAST_CONVERSATIONS.filter((c) => c.status === "draft").map((flow, i) => (
                      <button
                        key={flow.id}
                        type="button"
                        onClick={() => send(`Continue working on: ${flow.title}`)}
                        className="w-full p-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 flex items-center gap-3 cursor-pointer group"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-xs font-medium text-gray-600">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900">{flow.title}</div>
                        </div>
                        <div className="text-xs text-gray-500">{flow.updated}</div>
                        <svg className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mx-auto w-full max-w-4xl">
              <div className={flowActive ? "rounded-2xl border border-gray-200 bg-gray-50/60 p-4" : ""}>
                {/* Mini-app header */}
                {flowActive && (
                <div className="flex items-start mb-3" data-component="flow-config-box">
                  <button
                    type="button"
                    onClick={() => setShowFlowPanel(!showFlowPanel)}
                    className="flex flex-1 items-start gap-2 text-left group cursor-pointer"
                  >
                    <span className="text-gray-600 mt-0.5">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-gray-900">Abandoned cart recovery</span>
                        <svg
                          className={`transition-transform text-gray-700 ${showFlowPanel ? 'rotate-180' : ''}`}
                          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        >
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">Active automation running smoothly</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                      Test
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                      Publish
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEllipsisMenu(!showEllipsisMenu);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                      </button>
                      {showEllipsisMenu && (
                        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button type="button" className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100">
                            Flow
                          </button>
                          <button type="button" className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100">
                            Log
                          </button>
                          <button type="button" className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Settings
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                )}


                {/* Collapsible flow steps + config panel (combined) */}
                {showFlowPanel && (
                  <div className="mb-3 rounded-xl bg-white border border-gray-200 grid grid-cols-[minmax(240px,280px)_1fr]">
                    {/* Left: Steps list */}
                    <div className="p-3 space-y-0.5">
                      {FLOW_STEPS.map((step) => {
                        const isOptional = step.optional;
                        if (isOptional && !showOptionalSteps) return null;
                        const isSelected = selectedFlowStep === step.id;
                        return (
                          <button
                            key={step.id}
                            type="button"
                            onClick={() => setSelectedFlowStep(step.id)}
                            className={`w-full flex items-center gap-2 text-left p-2 rounded-lg transition-colors ${isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                          >
                            <span className="w-6 h-6 rounded flex items-center justify-center bg-gray-100 text-gray-600 text-xs shrink-0">
                              {step.icon === "home" && "📋"}
                              {step.icon === "facebook" && "f"}
                              {step.icon === "message" && "✓"}
                              {step.icon === "mail" && "✉"}
                              {step.icon === "crm" && "◆"}
                              {step.icon === "bell" && "🔔"}
                            </span>
                            <span className={`text-xs font-medium flex-1 truncate ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{step.label}</span>
                            <div className="flex items-center gap-1">
                              {step.badge && (
                                <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                  {step.badge}
                                </span>
                              )}
                              {changedSteps.has(step.id) && (
                                <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                  changes
                                </span>
                              )}
                              {step.id === "3" && (
                                <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                                  Error
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                      {!showOptionalSteps && (
                        <button
                          type="button"
                          onClick={() => setShowOptionalSteps(true)}
                          className="w-full text-left p-2 text-[10px] font-medium text-gray-500 hover:text-gray-700 transition-colors mt-1 cursor-pointer"
                        >
                          <span className="relative inline-block">
                            + Optional
                            {FLOW_STEPS.some(step => step.optional && step.id === "3") && (
                              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            )}
                          </span>
                        </button>
                      )}
                      {showOptionalSteps && (
                        <button
                          type="button"
                          onClick={() => setShowOptionalSteps(false)}
                          className="w-full text-left p-2 text-[10px] font-medium text-gray-500 hover:text-gray-700 transition-colors mt-1"
                        >
                          − Optional
                        </button>
                      )}
                    </div>

                    {/* Right: Config / Home content */}
                    <div className="p-4 min-h-[240px]">
                      {(() => {
                        const step = FLOW_STEPS.find((s) => s.id === selectedFlowStep);
                        if (!step) {
                          return (
                            <div className="h-full flex items-center justify-center text-xs text-gray-400">
                              Select a step to configure
                            </div>
                          );
                        }
                        if (step.id === "home") {
                          const configurableSteps = FLOW_STEPS.filter((s) => s.id !== "home");
                          return (
                            <>
                              <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-900">Flow Summary</h3>
                                <p className="text-[11px] text-gray-500 mt-0.5">Overview of your automation</p>
                              </div>
                              <div className="grid grid-cols-3 gap-2 mb-4">
                                <div className="rounded-lg bg-gray-100 p-2.5">
                                  <div className="text-[10px] text-gray-600 font-medium">Steps</div>
                                  <div className="text-lg font-semibold text-gray-900 mt-0.5">{configurableSteps.length}</div>
                                </div>
                                <div className="rounded-lg bg-blue-50 p-2.5">
                                  <div className="text-[10px] text-blue-700/80 font-medium">Status</div>
                                  <div className="text-sm font-semibold text-blue-900 mt-0.5">Active</div>
                                </div>
                                <div className="rounded-lg bg-orange-50 p-2.5">
                                  <div className="text-[10px] text-orange-700/80 font-medium">changes</div>
                                  <div className="text-lg font-semibold text-orange-900 mt-0.5">
                                    {
                                      configurableSteps.filter(
                                        (s) => s.badge === "changes" || changedSteps.has(s.id)
                                      ).length
                                    }
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="text-[11px] font-medium text-gray-700 mb-1.5">Description</div>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  Automated lead capture &amp; sales notification. Sends a welcome email and message, and notifies the sales team of new leads.
                                </p>
                              </div>
                              <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                                <div className="flex items-start gap-2">
                                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-xs font-medium text-emerald-900 mb-1">Your flow is working fine!</p>
                                    <p className="text-xs text-emerald-700 leading-relaxed">
                                      You can publish this as a template so that others can use it. When users use your template, you'll get credit for it.
                                    </p>
                                    <button
                                      type="button"
                                      className="mt-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-md transition-colors"
                                    >
                                      Publish as Template
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                                      <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700">Switch to Advanced Flow</span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5">Add extra steps to customize this template.</p>
                                </div>
                                <button
                                  type="button"
                                  className="px-2 py-1 bg-gray-800 hover:bg-gray-900 text-white text-xs font-medium rounded transition-colors"
                                >
                                  Switch
                                </button>
                              </div>
                            </>
                          );
                        }
                        return (
                          <>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-md flex items-center justify-center bg-gray-100 text-gray-600 text-sm shrink-0">
                                  {step.icon === "facebook" && "f"}
                                  {step.icon === "message" && "✓"}
                                  {step.icon === "mail" && "✉"}
                                  {step.icon === "crm" && "◆"}
                                  {step.icon === "bell" && "🔔"}
                                </span>
                                <div>
                                  <h3 className="text-sm font-semibold text-gray-900">{step.label}</h3>
                                  <p className="text-[11px] text-gray-500 mt-0.5">Configure this step</p>
                                </div>
                              </div>
                              {step.badge && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                  {step.badge}
                                </span>
                              )}
                            </div>
                            <div className="space-y-3">
                              {step.id === "1" && (
                                <>
                                  <div>
                                    <label className="text-[11px] font-medium text-gray-700 block mb-1">Form URL</label>
                                    <input
                                      type="url"
                                      placeholder="https://your-form-url.com"
                                      onChange={() => handleStepChange(step.id)}
                                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-medium text-gray-700 block mb-1">Field Mapping</label>
                                    <textarea
                                      rows={3}
                                      placeholder="name → firstName, email → emailAddress"
                                      onChange={() => handleStepChange(step.id)}
                                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                                    className="text-[10px] font-medium text-gray-500 hover:text-gray-700 transition-colors pt-1"
                                  >
                                    {showOptionalFields ? '− Optional Fields' : '+ Optional Fields'}
                                  </button>
                                  {showOptionalFields && (
                                    <div className="space-y-3 pt-2 border-t border-gray-100">
                                      <div>
                                        <label className="text-[11px] font-medium text-gray-700 block mb-1">Timeout (seconds)</label>
                                        <input
                                          type="number"
                                          placeholder="30"
                                          onChange={() => handleStepChange(step.id)}
                                          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[11px] font-medium text-gray-700 block mb-1">Retry on failure</label>
                                        <select onChange={() => handleStepChange(step.id)} className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
                                          <option>No</option>
                                          <option>Yes (max 3 times)</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-[11px] font-medium text-gray-700 block mb-1">Custom tags</label>
                                        <input
                                          type="text"
                                          placeholder="e.g., important, urgent"
                                          onChange={() => handleStepChange(step.id)}
                                          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                              {step.id === "2" && (
                                <>
                                  <div>
                                    <label className="text-[11px] font-medium text-gray-700 block mb-1">Message Template</label>
                                    <textarea
                                      rows={3}
                                      placeholder="Hi {name}, thanks for reaching out!"
                                      onChange={() => handleStepChange(step.id)}
                                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-medium text-gray-700 block mb-1">Send Delay</label>
                                    <select onChange={() => handleStepChange(step.id)} className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
                                      <option>Immediately</option>
                                      <option>After 5 minutes</option>
                                      <option>After 1 hour</option>
                                    </select>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                                    className="text-[10px] font-medium text-gray-500 hover:text-gray-700 transition-colors pt-1"
                                  >
                                    {showOptionalFields ? '− Optional Fields' : '+ Optional Fields'}
                                  </button>
                                  {showOptionalFields && (
                                    <div className="space-y-3 pt-2 border-t border-gray-100">
                                      <div>
                                        <label className="text-[11px] font-medium text-gray-700 block mb-1">Timeout (seconds)</label>
                                        <input
                                          type="number"
                                          placeholder="30"
                                          onChange={() => handleStepChange(step.id)}
                                          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[11px] font-medium text-gray-700 block mb-1">Retry on failure</label>
                                        <select onChange={() => handleStepChange(step.id)} className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
                                          <option>No</option>
                                          <option>Yes (max 3 times)</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-[11px] font-medium text-gray-700 block mb-1">Custom tags</label>
                                        <input
                                          type="text"
                                          placeholder="e.g., important, urgent"
                                          onChange={() => handleStepChange(step.id)}
                                          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                              {step.id === "3" && (
                                <>
                                  <div>
                                    <label className="text-[11px] font-medium text-gray-700 block mb-1">Email Template</label>
                                    <select onChange={() => handleStepChange(step.id)} className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
                                      <option>Welcome Email</option>
                                      <option>Confirmation Email</option>
                                      <option>Custom Template</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-medium text-gray-700 block mb-1">Subject Line</label>
                                    <input
                                      type="text"
                                      placeholder="Welcome to our service!"
                                      onChange={() => handleStepChange(step.id)}
                                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-medium text-gray-700 block mb-1">From Address</label>
                                    <input
                                      type="email"
                                      placeholder="welcome@yourcompany.com"
                                      onChange={() => handleStepChange(step.id)}
                                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                                    className="text-[10px] font-medium text-gray-500 hover:text-gray-700 transition-colors pt-1"
                                  >
                                    {showOptionalFields ? '− Optional Fields' : '+ Optional Fields'}
                                  </button>
                                  {showOptionalFields && (
                                    <div className="space-y-3 pt-2 border-t border-gray-100">
                                      <div>
                                        <label className="text-[11px] font-medium text-gray-700 block mb-1">Timeout (seconds)</label>
                                        <input
                                          type="number"
                                          placeholder="30"
                                          onChange={() => handleStepChange(step.id)}
                                          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[11px] font-medium text-gray-700 block mb-1">Retry on failure</label>
                                        <select onChange={() => handleStepChange(step.id)} className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
                                          <option>No</option>
                                          <option>Yes (max 3 times)</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-[11px] font-medium text-gray-700 block mb-1">Custom tags</label>
                                        <input
                                          type="text"
                                          placeholder="e.g., important, urgent"
                                          onChange={() => handleStepChange(step.id)}
                                          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                              {step.id === "4" && (
                                <>
                                  <div>
                                    <label className="text-[11px] font-medium text-gray-700 block mb-1">CRM Field Mapping</label>
                                    <textarea
                                      rows={3}
                                      placeholder="firstName → First Name, email → Email Address"
                                      onChange={() => handleStepChange(step.id)}
                                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-medium text-gray-700 block mb-1">Lead Source</label>
                                    <input
                                      type="text"
                                      placeholder="Website Form"
                                      onChange={() => handleStepChange(step.id)}
                                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                                    className="text-[10px] font-medium text-gray-500 hover:text-gray-700 transition-colors pt-1"
                                  >
                                    {showOptionalFields ? '− Optional Fields' : '+ Optional Fields'}
                                  </button>
                                  {showOptionalFields && (
                                    <div className="space-y-3 pt-2 border-t border-gray-100">
                                      <div>
                                        <label className="text-[11px] font-medium text-gray-700 block mb-1">Timeout (seconds)</label>
                                        <input
                                          type="number"
                                          placeholder="30"
                                          onChange={() => handleStepChange(step.id)}
                                          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[11px] font-medium text-gray-700 block mb-1">Retry on failure</label>
                                        <select onChange={() => handleStepChange(step.id)} className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
                                          <option>No</option>
                                          <option>Yes (max 3 times)</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-[11px] font-medium text-gray-700 block mb-1">Custom tags</label>
                                        <input
                                          type="text"
                                          placeholder="e.g., important, urgent"
                                          onChange={() => handleStepChange(step.id)}
                                          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                              {step.id === "5" && (
                                <>
                                  <div>
                                    <label className="text-[11px] font-medium text-gray-700 block mb-1">Notification Channel</label>
                                    <select onChange={() => handleStepChange(step.id)} className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
                                      <option>Slack #sales</option>
                                      <option>Email to team</option>
                                      <option>Both</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-medium text-gray-700 block mb-1">Message Content</label>
                                    <textarea
                                      rows={2}
                                      placeholder="New lead: {name} ({email}) - {company}"
                                      onChange={() => handleStepChange(step.id)}
                                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                                    className="text-[10px] font-medium text-gray-500 hover:text-gray-700 transition-colors pt-1"
                                  >
                                    {showOptionalFields ? '− Optional Fields' : '+ Optional Fields'}
                                  </button>
                                  {showOptionalFields && (
                                    <div className="space-y-3 pt-2 border-t border-gray-100">
                                      <div>
                                        <label className="text-[11px] font-medium text-gray-700 block mb-1">Timeout (seconds)</label>
                                        <input
                                          type="number"
                                          placeholder="30"
                                          onChange={() => handleStepChange(step.id)}
                                          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[11px] font-medium text-gray-700 block mb-1">Retry on failure</label>
                                        <select onChange={() => handleStepChange(step.id)} className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
                                          <option>No</option>
                                          <option>Yes (max 3 times)</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-[11px] font-medium text-gray-700 block mb-1">Custom tags</label>
                                        <input
                                          type="text"
                                          placeholder="e.g., important, urgent"
                                          onChange={() => handleStepChange(step.id)}
                                          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Composer input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex w-full items-end gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm focus-within:border-gray-300 transition-shadow"
                >
                  {hasChanges && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-100 border border-blue-200">
                      <span className="text-xs font-medium text-blue-900">{changesCount} changes made</span>
                      <button
                        type="button"
                        onClick={() => {
                          setHasChanges(false);
                          setChangedSteps(new Set());
                          setChangesCount(0);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  )}
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    rows={1}
                    placeholder="Describe an automation in plain language…"
                    className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() && !hasChanges}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-opacity hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                </form>
                <p className="mt-2 text-center text-[11px] text-gray-600">
                  FlowMind can ask follow-up questions before deploying. Press Enter to send, Shift+Enter for new line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
