"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AssistantBlockView } from "@/components/ai/message-cards";
import { AiVersionNav } from "@/components/ai/ai-version-nav";
import { FlowMiniApp } from "@/components/ai/flow-mini-app";
import { ASSISTANT_SCRIPT, PAST_CONVERSATIONS } from "@/lib/ai/mock-data";
import type { AssistantBlock } from "@/lib/ai/mock-data";

const ArrowUp = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
);
const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z"/><path d="M19 14l.9 2.1 2.1.9-2.1.9L19 20l-.9-2.1-2.1-.9 2.1-.9L19 14z"/></svg>
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
const Mic = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4"/></svg>
);
const Upload = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>
);
const Headset = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 14v3a2 2 0 0 1-2 2h-3v-6h3a2 2 0 0 1 2 1zM3 14a2 2 0 0 1 2-1h3v6H5a2 2 0 0 1-2-2z"/><path d="M16 19a4 4 0 0 1-4 3"/></svg>
);
const Layers = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5M3 17l9 5 9-5"/></svg>
);
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const Plus = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const Chevron = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
);
const Check = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
);
const FileIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
);
const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
);
const CodeIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/></svg>
);

type Message =
  | { id: string; role: "user"; content: string }
  | { id: string; role: "assistant"; content?: string; blocks?: AssistantBlock[] };

// Minimal shape of the Web Speech API we use (not in TS DOM lib by default).
type SpeechRecognitionEventLike = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: (e: SpeechRecognitionEventLike) => void;
  onend: () => void;
  onerror: () => void;
  start: () => void;
  stop: () => void;
};

const SUGGESTIONS = [
  "Draft a Shopify cart-abandonment email",
  "Explain how AI Reply Templates work",
  "Summarize my latest campaign performance",
  "Help me set up an Instagram auto-reply flow",
];

export function FreshChatbot({ miniAppOnTop = false }: { miniAppOnTop?: boolean } = {}) {
  const router = useRouter();
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

  // Feature integrations
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [showExpert, setShowExpert] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [showMicMenu, setShowMicMenu] = useState(false);
  const [holdToRecord, setHoldToRecord] = useState(true);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

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

  const handleImport = () => {
    const raw = importJson.trim();
    if (!raw) {
      setImportError("Paste some JSON first.");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      const name =
        (typeof parsed?.name === "string" && parsed.name) ||
        (typeof parsed?.title === "string" && parsed.title) ||
        "Imported flow";
      setShowImport(false);
      setImportJson("");
      setImportError(null);
      setFlowActive(true);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", content: `Import flow from JSON: ${name}` },
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Imported “${name}” from JSON. I've loaded the steps into the flow panel below — open it to review and configure.`,
        },
      ]);
    } catch {
      setImportError("That doesn't look like valid JSON. Check for typos.");
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      setVoiceSupported(false);
      return;
    }
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (e: SpeechRecognitionEventLike) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setInput(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const switchToManual = () => {
    router.push("/app/flows/1/v2");
  };

  const empty = messages.length === 0;

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200/70 bg-white px-6 py-3">
        <AiVersionNav />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowImport(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            <Upload className="h-3.5 w-3.5" />
            Import JSON
          </button>
          <button
            type="button"
            onClick={() => setShowExpert(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            <Headset className="h-3.5 w-3.5" />
            Talk to expert
          </button>
          {flowActive && (
            <button
              type="button"
              onClick={switchToManual}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 shadow-sm transition-colors hover:bg-blue-100"
            >
              <Layers className="h-3.5 w-3.5" />
              Switch to manual flow
            </button>
          )}
        </div>
      </header>

      {/* Main: Chat Area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          {/* Flow micro-app pinned on top (Version 3) */}
          {miniAppOnTop && flowActive && (
            <div className="border-b border-gray-200 bg-white px-4 py-4">
              <div className="mx-auto w-full max-w-4xl">
                <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4">
                  <FlowMiniApp
                    showFlowPanel={showFlowPanel}
                    setShowFlowPanel={setShowFlowPanel}
                    showEllipsisMenu={showEllipsisMenu}
                    setShowEllipsisMenu={setShowEllipsisMenu}
                    selectedFlowStep={selectedFlowStep}
                    setSelectedFlowStep={setSelectedFlowStep}
                    showOptionalSteps={showOptionalSteps}
                    setShowOptionalSteps={setShowOptionalSteps}
                    showOptionalFields={showOptionalFields}
                    setShowOptionalFields={setShowOptionalFields}
                    changedSteps={changedSteps}
                    onStepChange={handleStepChange}
                  />
                </div>
              </div>
            </div>
          )}
          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
          {empty ? (
            <div className="mt-12 flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg">
                <Sparkles className="h-6 w-6" />
              </span>
              <h1 className="mt-5 text-2xl font-semibold text-gray-900">Build any automation with AI</h1>
              <p className="mt-2 max-w-md text-sm text-gray-500">
                Describe what you want to happen in plain language — Flow by AI wires up
                the triggers, steps, and apps for you. Refine it anytime by chatting.
              </p>

              <div className="mt-8 w-full text-left">
                <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                  Try an example
                </p>
                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-3 text-left text-sm text-gray-700 shadow-sm transition-colors hover:border-violet-200 hover:bg-violet-50/40"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-600">
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 w-full text-left">
                <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                  Or start another way
                </p>
                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setShowImport(true)}
                    className="flex flex-col items-start gap-1.5 rounded-xl border border-gray-200 bg-white p-3.5 text-left shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                      <Upload className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-gray-900">Import a flow</span>
                    <span className="text-xs text-gray-500">Paste JSON to load an existing flow.</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowExpert(true)}
                    className="flex flex-col items-start gap-1.5 rounded-xl border border-gray-200 bg-white p-3.5 text-left shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                      <Headset className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-gray-900">Talk to an expert</span>
                    <span className="text-xs text-gray-500">Get a human to help you build it.</span>
                  </button>
                  <Link
                    href="/app/templates/v4"
                    className="flex flex-col items-start gap-1.5 rounded-xl border border-gray-200 bg-white p-3.5 text-left shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                      <Layers className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-gray-900">Browse templates</span>
                    <span className="text-xs text-gray-500">Start from a ready-made flow.</span>
                  </Link>
                </div>
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
              <div className={!miniAppOnTop && flowActive ? "rounded-2xl border border-gray-200 bg-gray-50/60 p-4" : ""}>
                {!miniAppOnTop && flowActive && (
                  <FlowMiniApp
                    showFlowPanel={showFlowPanel}
                    setShowFlowPanel={setShowFlowPanel}
                    showEllipsisMenu={showEllipsisMenu}
                    setShowEllipsisMenu={setShowEllipsisMenu}
                    selectedFlowStep={selectedFlowStep}
                    setSelectedFlowStep={setSelectedFlowStep}
                    showOptionalSteps={showOptionalSteps}
                    setShowOptionalSteps={setShowOptionalSteps}
                    showOptionalFields={showOptionalFields}
                    setShowOptionalFields={setShowOptionalFields}
                    changedSteps={changedSteps}
                    onStepChange={handleStepChange}
                  />
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
                  {!miniAppOnTop && (
                    <button
                      type="button"
                      onClick={toggleVoice}
                      title={isListening ? "Stop listening" : "Speak your prompt"}
                      aria-label={isListening ? "Stop listening" : "Speak your prompt"}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isListening
                          ? "bg-red-100 text-red-600 animate-pulse"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      }`}
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!input.trim() && !hasChanges}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-opacity hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                </form>

                {/* Version 3: attach + mic controls below the input box */}
                {miniAppOnTop && (
                  <div className="mt-2 flex items-center gap-0.5 px-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={() => setShowAddMenu(false)}
                    />
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={() => setShowAddMenu(false)}
                    />
                    <div className="relative">
                      <button
                        type="button"
                        aria-label="Add"
                        onClick={() => setShowAddMenu(!showAddMenu)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      {showAddMenu && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
                          <div className="absolute bottom-full left-0 z-50 mb-2 w-52 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddMenu(false);
                                setShowImport(true);
                              }}
                              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm text-gray-800 hover:bg-gray-50"
                            >
                              <CodeIcon className="h-4 w-4 shrink-0 text-gray-500" />
                              Import JSON
                            </button>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm text-gray-800 hover:bg-gray-50"
                            >
                              <FileIcon className="h-4 w-4 shrink-0 text-gray-500" />
                              Upload file
                            </button>
                            <button
                              type="button"
                              onClick={() => photoInputRef.current?.click()}
                              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm text-gray-800 hover:bg-gray-50"
                            >
                              <ImageIcon className="h-4 w-4 shrink-0 text-gray-500" />
                              Photo
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <button
                        type="button"
                        onClick={toggleVoice}
                        title={isListening ? "Stop listening" : "Speak your prompt"}
                        aria-label={isListening ? "Stop listening" : "Speak your prompt"}
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                          isListening
                            ? "bg-red-100 text-red-600 animate-pulse"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        }`}
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowMicMenu(!showMicMenu)}
                        aria-label="Microphone settings"
                        className="flex h-6 w-4 items-center justify-center rounded text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <Chevron className="h-3 w-3" />
                      </button>
                      {showMicMenu && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowMicMenu(false)} />
                          <div className="absolute bottom-full left-0 z-50 mb-2 w-72 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
                            <p className="px-2 pb-1 pt-1.5 text-xs font-medium text-gray-400">Microphone</p>
                            <button
                              type="button"
                              onClick={() => setShowMicMenu(false)}
                              className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-gray-800 hover:bg-gray-50"
                            >
                              <span>Default - iMac Microphone (Built-in)</span>
                              <Check className="h-4 w-4 shrink-0 text-blue-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowMicMenu(false)}
                              className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-gray-800 hover:bg-gray-50"
                            >
                              <span>iMac Microphone (Built-in)</span>
                            </button>
                            <div className="my-1 border-t border-gray-100" />
                            <div className="flex items-center justify-between px-2 py-1.5">
                              <span className="text-sm text-gray-800">Hold to record</span>
                              <button
                                type="button"
                                role="switch"
                                aria-checked={holdToRecord}
                                onClick={() => setHoldToRecord(!holdToRecord)}
                                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${holdToRecord ? "bg-blue-600" : "bg-gray-300"}`}
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${holdToRecord ? "translate-x-4" : "translate-x-0.5"}`} />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick actions */}
                {!miniAppOnTop && (
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowImport(true)}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      <Upload className="h-3 w-3" />
                      Import JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowExpert(true)}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      <Headset className="h-3 w-3" />
                      Talk to expert
                    </button>
                    <button
                      type="button"
                      onClick={switchToManual}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      <Layers className="h-3 w-3" />
                      Advanced flow
                    </button>
                  </div>
                )}

                <p className={`mt-2 text-[11px] text-gray-600 ${miniAppOnTop ? "text-right" : "text-center"}`}>
                  {isListening
                    ? "Listening… speak now."
                    : voiceSupported
                      ? "Type, or tap the mic to speak. Press Enter to send, Shift+Enter for new line."
                      : "Voice input isn't supported in this browser. Type your prompt instead."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import JSON dialog */}
      {showImport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowImport(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                  <Upload className="h-4 w-4" />
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-gray-900">Import flow from JSON</div>
                  <div className="text-[11px] text-gray-500">Paste an exported flow definition</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImport(false)}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-4">
              <textarea
                value={importJson}
                onChange={(e) => {
                  setImportJson(e.target.value);
                  if (importError) setImportError(null);
                }}
                rows={10}
                placeholder={'{\n  "name": "My flow",\n  "steps": [ ... ]\n}'}
                className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-xs text-gray-800 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              {importError && (
                <p className="mt-2 text-xs text-red-600">{importError}</p>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-3">
              <button
                type="button"
                onClick={() => setShowImport(false)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImport}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Import flow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Talk to expert dialog */}
      {showExpert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowExpert(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white">
                  <Headset className="h-4 w-4" />
                </span>
                <div className="text-sm font-semibold text-gray-900">Talk to an expert</div>
              </div>
              <button
                type="button"
                onClick={() => setShowExpert(false)}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-gray-600">
                Stuck on a flow? Book a free 20-minute session with an automation
                specialist, or start a live chat and we'll help you build it.
              </p>
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => setShowExpert(false)}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-3 text-left transition-colors hover:border-blue-200 hover:bg-blue-50/40"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-gray-900">Start live chat</span>
                    <span className="block text-xs text-gray-500">Typical reply in a few minutes</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowExpert(false)}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-3 text-left transition-colors hover:border-blue-200 hover:bg-blue-50/40"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Headset className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-gray-900">Book a call</span>
                    <span className="block text-xs text-gray-500">Schedule a 20-min screen share</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
