"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { HomeVersionSwitcher } from "@/components/home-version-switcher";

type Connection = { name: string; logo: string };

const TOP_CONNECTIONS: Connection[] = [
  { name: "Slack", logo: "https://stuff.thingsofbrand.com/slack.com/images/img668216333e_slack.jpg" },
  { name: "Gmail", logo: "https://stuff.thingsofbrand.com/gmail.com/images/imge_idrA5FDGTH_1763454052978.svg" },
  { name: "HubSpot", logo: "https://stuff.thingsofbrand.com/hubspot.com/images/img61728fea98_hubspot.jpg" },
  { name: "Stripe", logo: "https://stuff.thingsofbrand.com/stripe.com/images/img67eab239fe_stripe.jpg" },
  { name: "Google Sheets", logo: "https://stuff.thingsofbrand.com/google.com/images/img4_googlesheet.png" },
];

const APP_PLACEHOLDERS: Record<string, string> = {
  Slack: "Summarize unread activity, draft replies, or prepare updates",
  Gmail: "Draft replies, sort by intent, or send follow-ups",
  HubSpot: "Enrich contacts, log activities, or update deal stages",
  Stripe: "Recap revenue, recover failed charges, or forecast MRR",
  "Google Sheets": "Summarize a sheet, spot outliers, or draft a report",
};

const APP_SUGGESTIONS: Record<string, string[]> = {
  Slack: [
    "Send a message to #general with today's summary",
    "Schedule a Slack message for 4:00 PM tomorrow",
    "Remind me every Monday at 10am about the standup",
  ],
  Gmail: [
    "Draft replies to unread emails in my inbox",
    "Label incoming emails by intent — lead, support, personal",
    "Send a follow-up if a prospect hasn't replied in 3 days",
  ],
  HubSpot: [
    "Add a new contact and assign a lead score",
    "Log a call as an activity on the linked deal",
    "Move deals with no activity in 5 days to a review stage",
  ],
  Stripe: [
    "Send me a weekly digest of new customers and MRR",
    "Retry failed charges with a smart dunning cadence",
    "Notify me in Slack when an invoice over $500 is paid",
  ],
  "Google Sheets": [
    "Summarize the current sheet in plain English",
    "Add a new row when a HubSpot deal closes",
    "Flag rows where revenue dropped week over week",
  ],
};

const DEFAULT_PLACEHOLDER = "Remind me on slack at 4:00 PM for weekly meeting";

const HINT_BANK: Record<string, string[]> = {
  Slack: [
    "Repeat this message every day at 9am",
    "Send as a DM instead of channel post",
    "Also notify me if this workflow fails",
    "Pause this on weekends",
  ],
  Gmail: [
    "Follow up automatically if no reply in 3 days",
    "CC my manager on all these emails",
    "Auto-label emails after sending",
    "Run this every weekday morning",
  ],
  HubSpot: [
    "Auto-update deal stage when this triggers",
    "Assign to a team member based on region",
    "Create a follow-up task 2 days later",
    "Log this activity to the contact timeline",
  ],
  Stripe: [
    "Send a weekly MRR digest every Monday",
    "Alert me in Slack on failed payments over $100",
    "Retry failed charges automatically after 24h",
    "Only trigger on invoices above $500",
  ],
  "Google Sheets": [
    "Also trigger on row updates, not just new rows",
    "Only run when column 'Status' = 'Active'",
    "Run only on a specific sheet tab",
    "Export a weekly summary to a new sheet",
  ],
};

const GENERIC_HINTS = [
  "Run this every weekday morning",
  "Only trigger when a condition is met",
  "Notify me if this workflow fails",
  "Pause this on weekends",
  "Set a 30-day expiry",
  "Add a retry on failure",
];

function buildHints(text: string, app?: string): string[] {
  const hints: string[] = [];
  const lower = text.toLowerCase();

  // Attached app gets 2 hints
  if (app && HINT_BANK[app]) {
    hints.push(...HINT_BANK[app].slice(0, 2));
  }

  // Detect additional apps mentioned in text (max 1 more hint)
  for (const [appName, appHints] of Object.entries(HINT_BANK)) {
    if (hints.length >= 3) break;
    if (appName !== app && lower.includes(appName.toLowerCase())) {
      hints.push(appHints[0]);
    }
  }

  // Fill remainder with generic hints, deduplicating on key words
  for (const h of GENERIC_HINTS) {
    if (hints.length >= 4) break;
    const hLower = h.toLowerCase();
    const isDupe = hints.some((existing) =>
      existing.toLowerCase().includes("every day") && hLower.includes("every day")
    );
    if (!isDupe && !hints.includes(h)) hints.push(h);
  }

  return hints.slice(0, 4);
}

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  hints?: string[];
  isFirst?: boolean;
};

const Sparkle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M12 2l1.8 5.6L19.5 9l-5.7 1.4L12 16l-1.8-5.6L4.5 9l5.7-1.4L12 2z" />
  </svg>
);
const Arrow = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const Check = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function HomeV4() {
  const [mode, setMode] = useState<"input" | "chat">("input");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [processing, setProcessing] = useState(false);
  const [input, setInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [attachedApp, setAttachedApp] = useState<Connection | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, processing]);

  const attachApp = (app: Connection) => {
    setAttachedApp((prev) => (prev?.name === app.name ? null : app));
  };
  const clearAttachedApp = () => setAttachedApp(null);

  const placeholder = attachedApp
    ? APP_PLACEHOLDERS[attachedApp.name] ?? DEFAULT_PLACEHOLDER
    : DEFAULT_PLACEHOLDER;

  const submitFirst = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMsg = { id: `${Date.now()}`, role: "user", content: text };
    setMessages([userMsg]);
    setMode("chat");
    setInput("");
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      const hints = buildHints(text, attachedApp?.name);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          role: "assistant",
          content: text,
          hints,
          isFirst: true,
        },
      ]);
    }, 2000);
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || processing) return;
    const userMsg: ChatMsg = { id: `${Date.now()}`, role: "user", content: text };
    setChatInput("");
    setMessages((prev) => [...prev, userMsg]);
    setProcessing(true);

    setTimeout(() => {
      const hints = buildHints(text, attachedApp?.name);
      setProcessing(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now() + 1}`,
          role: "assistant",
          content: text,
          hints,
        },
      ]);
    }, 1200);
  };

  return (
    <div className={`bg-white flex flex-col ${mode === "chat" ? "h-screen" : "min-h-screen"}`}>
      <HomeVersionSwitcher />

      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3 shrink-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
          <Link
            href="/app/v4/workers"
            className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="3" />
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            </svg>
            Workers
          </Link>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400" aria-hidden>
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="font-medium text-slate-900">Untitled</span>
        </nav>
        <span className="size-8 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold flex items-center justify-center">AY</span>
      </header>

      {/* INPUT MODE */}
      {mode === "input" && (
        <>
          <main className="flex-1 w-full max-w-3xl mx-auto px-6 flex flex-col justify-center">
            <div className="animate-in fade-in duration-500">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-900 relative inline-block">
                  What would you like to do?
                  <Sparkle className="absolute -right-6 -top-2 text-violet-500" />
                </h1>
              </div>

              <div className="mt-10 rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex flex-wrap items-start gap-2">
                  {attachedApp && (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-slate-800">
                      <img src={attachedApp.logo} alt="" className="size-4 object-contain" />
                      {attachedApp.name}
                      <button type="button" onClick={clearAttachedApp} className="ml-0.5 text-slate-500 hover:text-slate-900" aria-label={`Remove ${attachedApp.name}`}>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </span>
                  )}
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && input.trim()) {
                        e.preventDefault();
                        submitFirst(input);
                      }
                      if (e.key === "Backspace" && input === "" && attachedApp) {
                        e.preventDefault();
                        clearAttachedApp();
                      }
                    }}
                    placeholder={placeholder}
                    rows={2}
                    className="min-w-[200px] flex-1 resize-none outline-none text-[15px] text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setPlusMenuOpen((o) => !o)}
                      className="flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 transition-colors"
                      aria-label="Attach or insert"
                      aria-expanded={plusMenuOpen}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${plusMenuOpen ? "rotate-45" : ""}`}>
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                    {plusMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setPlusMenuOpen(false)} />
                        <div className="absolute bottom-full left-0 z-40 mb-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                          <PlusMenuItem onClick={() => setPlusMenuOpen(false)} icon={<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>} label="Upload file" hint="PDF, image, CSV" />
                          <PlusMenuItem onClick={() => { setInput((v) => v + (v.endsWith(" ") || !v ? "" : " ") + "/"); setPlusMenuOpen(false); }} icon={<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>} label="Search apps" hint="Type / to browse" />
                          <PlusMenuItem onClick={() => setPlusMenuOpen(false)} icon={<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>} label="Insert template" hint="From your library" />
                          <PlusMenuItem onClick={() => setPlusMenuOpen(false)} icon={<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 12h8M12 8v8" /></svg>} label="Insert variable" hint="{{name}}, {{email}}…" />
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => submitFirst(input)}
                    disabled={!input.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue <Arrow />
                  </button>
                </div>
              </div>

              {attachedApp && APP_SUGGESTIONS[attachedApp.name] && (
                <div className="mt-4">
                  <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                    <img src={attachedApp.logo} alt="" className="size-3.5 object-contain" />
                    Popular {attachedApp.name} tasks
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {APP_SUGGESTIONS[attachedApp.name].map((s) => (
                      <button key={s} type="button" onClick={() => setInput(s)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-xs text-slate-700 hover:border-violet-300 hover:text-violet-700 hover:shadow-sm transition-all">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <div className="text-xs text-slate-400 mb-2">Top/recent connections</div>
                <div className="flex flex-wrap gap-2">
                  {TOP_CONNECTIONS.map((c) => {
                    const attached = attachedApp?.name === c.name;
                    return (
                      <button key={c.name} type="button" onClick={() => attachApp(c)} className={`group flex items-center gap-2 rounded-full border px-3 py-2 transition-all ${attached ? "border-violet-400 bg-violet-50 text-violet-800 shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:shadow-sm"}`}>
                        <img src={c.logo} alt="" className="size-5 object-contain" />
                        <span className="text-sm font-medium">{c.name}</span>
                        {attached && <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-600"><polyline points="20 6 9 17 4 12" /></svg>}
                      </button>
                    );
                  })}
                  <button type="button" className="flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-white px-3 py-2 text-slate-500 hover:border-violet-400 hover:text-violet-600 transition-all">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    <span className="text-sm font-medium">Add</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
          <footer className="py-6 text-center text-xs text-slate-400 shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              Your data is secure and private.
            </span>
          </footer>
        </>
      )}

      {/* CHAT MODE */}
      {mode === "chat" && (
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-3xl mx-auto space-y-5">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} msg={msg} onHintClick={sendMessage} />
              ))}
              {processing && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat input */}
          <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-4">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl border border-slate-200 shadow-sm px-4 pt-3 pb-2">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(chatInput);
                    }
                  }}
                  placeholder="Add to this automation or describe another task…"
                  rows={1}
                  className="w-full resize-none outline-none text-sm text-slate-900 placeholder:text-slate-400"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Enter to send · Shift+Enter for new line</span>
                  <button
                    onClick={() => sendMessage(chatInput)}
                    disabled={!chatInput.trim() || processing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Send <Arrow width={13} height={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

function ChatBubble({ msg, onHintClick }: { msg: ChatMsg; onHintClick: (h: string) => void }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] rounded-2xl rounded-tr-sm bg-violet-600 px-4 py-2.5 text-sm text-white leading-relaxed">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start">
      <div className="size-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
        <Sparkle width={13} height={13} className="text-violet-600" />
      </div>
      <div className="flex-1 min-w-0">
        {msg.isFirst ? (
          <div className="rounded-2xl rounded-tl-sm border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold mb-2">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              Work done!
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              Do you want me to automate your task? Here are some suggestions:
            </p>
            {msg.hints && msg.hints.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {msg.hints.map((h) => (
                  <button
                    key={h}
                    onClick={() => onHintClick(h)}
                    className="flex items-center gap-1.5 rounded-full border border-emerald-300 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 transition-all"
                  >
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
                      <path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                    {h}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl rounded-tl-sm border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center gap-2.5">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <span className="text-sm font-medium text-emerald-800">Successfully set your automation</span>
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-start">
      <div className="size-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
        <Sparkle width={13} height={13} className="text-violet-600" />
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3.5 flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
        <span className="size-2 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
        <span className="size-2 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function PlusMenuItem({
  icon, label, hint, onClick,
}: {
  icon: React.ReactNode; label: string; hint?: string; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 transition-colors">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-slate-900">{label}</div>
        {hint && <div className="text-xs text-slate-500">{hint}</div>}
      </div>
    </button>
  );
}
