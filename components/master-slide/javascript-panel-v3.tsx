"use client";

import { useEffect, useRef, useState } from "react";
import type { PanelProps } from "./types";

/* ---------------- icons ---------------- */
function IconSparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className={className}>
      <path d="M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6L12 2zM19 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1zM5 15l.7 1.6L7.3 17.3 5.7 18l-.7 1.6L4.3 18l-1.6-.7 1.6-.7L5 15z" />
    </svg>
  );
}
function IconCode({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
function IconPlay({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function IconCopy({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconChat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconMore({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className={className}>
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}
function IconClose({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center px-1 h-[18px] rounded border border-gray-200 bg-gray-50 text-[10px] font-medium text-gray-500 font-mono">
      {children}
    </kbd>
  );
}

/* ---------------- main ---------------- */
const DEFAULT_CODE = [
  `const moment = require("moment");`,
  ``,
  `function getTodaysDate() {`,
  `  return moment().format("YYYY-MM-DD");`,
  `}`,
  ``,
  `return getTodaysDate();`,
].join("\n");

type RunStatus = "idle" | "running" | "ok" | "error";

export function JavaScriptPanelV3({ item, onClose }: PanelProps) {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState(DEFAULT_CODE);
  const [codeOpen, setCodeOpen] = useState(false);
  const [askedAI, setAskedAI] = useState(false);
  const [status, setStatus] = useState<RunStatus>("idle");
  const [lastRunMs, setLastRunMs] = useState<number | null>(null);
  const [responseTab, setResponseTab] = useState<"response" | "logs">("response");
  const [savedFlash, setSavedFlash] = useState(false);
  const [copied, setCopied] = useState(false);
  const promptRef = useRef<HTMLTextAreaElement | null>(null);

  // autosize prompt textarea
  useEffect(() => {
    const el = promptRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 240) + "px";
  }, [prompt]);

  const run = () => {
    setStatus("running");
    setResponseTab("response");
    const start = performance.now();
    // simulate; real impl would invoke a sandbox
    window.setTimeout(() => {
      setLastRunMs(Math.round(performance.now() - start));
      setStatus("ok");
    }, 350);
  };
  const save = () => {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1500);
  };
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch { /* noop */ }
  };

  // keyboard shortcuts: ⌘/Ctrl+Enter = run, ⌘/Ctrl+S = save
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === "Enter") { e.preventDefault(); run(); }
      else if (e.key.toLowerCase() === "s") { e.preventDefault(); save(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const codeLines = code.split("\n");

  return (
    <div className="flex flex-col h-full bg-white">
      {/* header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <span className={`w-7 h-7 rounded ${item.badgeBg} flex items-center justify-center text-[11px] font-bold ${item.badgeFg} flex-shrink-0`}>
          {item.badge}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-800 truncate">{item.label}</div>
          <div className="text-[11px] text-gray-400 truncate">JavaScript · Node 20 sandbox</div>
        </div>
        <StatusPill status={status} ms={lastRunMs} />
        <button aria-label="More" className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <IconMore />
        </button>
        <button aria-label="Close" onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <IconClose />
        </button>
      </div>

      {/* body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 bg-white">
        {/* prompt — magic box */}
        <section className="space-y-2">
          {/* header — outside the box */}
          <div className="flex items-center gap-2 px-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm">
              <IconSparkle />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-semibold text-gray-900">Magic Box</span>
                <span className="text-[9px] font-semibold uppercase tracking-wide text-purple-600 bg-purple-50 border border-purple-100 px-1.5 py-[1px] rounded-full">AI</span>
              </div>
              <div className="text-[11px] text-gray-500 leading-snug">
                Just describe what you want in plain English — AI will write the script for you.
              </div>
            </div>
          </div>

          {/* gradient frame — wraps only the input */}
          <div className="relative rounded-lg p-[1.5px] overflow-hidden bg-[linear-gradient(135deg,#6366f1_0%,#a855f7_45%,#ec4899_100%)] shadow-[0_8px_24px_-12px_rgba(168,85,247,0.45)]">
            <div className="relative bg-white rounded-[7px] overflow-hidden">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_0%_0%,rgba(99,102,241,0.08),transparent_60%),radial-gradient(120%_60%_at_100%_100%,rgba(236,72,153,0.08),transparent_60%)]" />
              <textarea
                ref={promptRef}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder='e.g. "Add 7 days to today and return as YYYY-MM-DD"'
                rows={2}
                className="relative block w-full resize-none bg-transparent px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* footer — outside the box */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => setAskedAI(true)}
              disabled={!prompt.trim()}
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110 disabled:bg-none disabled:bg-gray-200 disabled:text-gray-400 text-white px-3 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wide shadow-sm transition-all"
            >
              <IconSparkle />
              Ask AI
            </button>
            <button className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-800 hover:bg-gray-50 px-2 py-1 rounded transition-colors">
              <IconChat />
              Chat
            </button>            
          </div>

          {/* example chips — stacked vertically */}
          <div className="flex flex-col items-start gap-1.5 px-1 pt-1">
            <span className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Try:</span>
            {[
              "Get today's date as YYYY-MM-DD",
              "Add 7 days to today",
              "Generate a random UUID",
            ].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setPrompt(s)}
                className="text-[11px] text-gray-600 bg-white border border-gray-200 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50/50 px-2 py-0.5 rounded-full transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {askedAI && (<>
        {/* code editor */}
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCodeOpen(o => !o)}
              aria-expanded={codeOpen}
              className="flex items-center gap-1.5 text-[12px] font-medium text-gray-700 hover:text-gray-900"
            >
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transition-transform ${codeOpen ? "rotate-90" : ""}`}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <IconCode className="text-gray-500" />
              Code
              <span className="text-[10px] text-gray-400 font-normal">· {codeLines.length} lines</span>
            </button>
            <span className="ml-auto" />
            {codeOpen && (
              <button
                onClick={copyCode}
                className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-800 px-1.5 py-1 rounded hover:bg-gray-100 transition-colors"
                aria-label="Copy code"
              >
                {copied ? <IconCheck className="text-green-600" /> : <IconCopy />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>

          {codeOpen && (
            <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
              <div className="flex items-center px-3 py-1.5 bg-gray-50 border-b border-gray-200 text-[10px] font-mono text-gray-500 uppercase tracking-wide">
                javascript
              </div>
              <div className="font-mono text-xs">
                {codeLines.map((line, i) => (
                  <div key={i} className="flex hover:bg-blue-50/30">
                    <div className="bg-gray-50 px-3 py-0.5 text-gray-400 w-10 text-right border-r border-gray-100 select-none">{i + 1}</div>
                    <div className="px-3 py-0.5 text-gray-800 whitespace-pre flex-1">{line || "\u00A0"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* output */}
        <section className="space-y-2">
          <div className="flex items-center gap-1">
            {([
              { key: "response", label: "Response" },
              { key: "logs", label: "Console" },
            ] as const).map(t => {
              const isActive = responseTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setResponseTab(t.key)}
                  className={`text-[12px] font-medium px-2.5 py-1 rounded transition-colors ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                >
                  {t.label}
                </button>
              );
            })}
            <span className="ml-auto text-[11px] text-gray-400">
              {status === "ok" && lastRunMs != null ? `Showing data from 6h, 12:00 PM` : status === "running" ? "Testing…" : "Not tested yet"}
            </span>
          </div>

          <div>
            {status === "idle" ? (
              <EmptyState onRun={run} />
            ) : responseTab === "response" ? (
              <ResponseView running={status === "running"} />
            ) : (
              <LogsView running={status === "running"} />
            )}
          </div>
        </section>
        </>)}
      </div>

      {/* sticky action bar */}
      <div className="border-t border-gray-200 bg-white px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <span aria-hidden>💡</span>
          <a href="#" className="hover:text-gray-800 underline-offset-2 hover:underline">How to use JS Code?</a>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {askedAI && (
            <>
              <span className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400 mr-1">
                <Kbd>⌘</Kbd><Kbd>↵</Kbd>
              </span>
              <button
                onClick={run}
                disabled={status === "running"}
                className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-60 px-4 py-1.5 rounded text-[11px] font-semibold uppercase tracking-wide transition-colors"
              >
                {status === "running" ? <Spinner /> : <IconPlay />}
                {status === "running" ? "Testing" : "Test"}
              </button>
            </>
          )}
          <span className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400 mr-1">
            <Kbd>⌘</Kbd><Kbd>S</Kbd>
          </span>
          <button
            onClick={save}
            className={`px-4 py-1.5 rounded text-[11px] font-semibold uppercase tracking-wide transition-colors ${savedFlash ? "bg-green-600 hover:bg-green-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          >
            {savedFlash ? (<span className="inline-flex items-center gap-1"><IconCheck /> Saved</span>) : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- subcomponents ---------------- */
function StatusPill({ status, ms }: { status: RunStatus; ms: number | null }) {
  if (status === "idle") return null;
  const map = {
    running: { dot: "bg-blue-500 animate-pulse", text: "text-blue-700", bg: "bg-blue-50", label: "Testing" },
    ok: { dot: "bg-green-500", text: "text-green-700", bg: "bg-green-50", label: ms != null ? `Passed · ${ms}ms` : "Passed" },
    error: { dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50", label: "Failed" },
  } as const;
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 ${s.bg} ${s.text} text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" className="animate-spin">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function EmptyState({ onRun }: { onRun: () => void }) {
  return (
    <div className="border border-dashed border-gray-300 rounded-md py-6 px-4 flex flex-col items-center text-center bg-gray-50/50">
      <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 mb-2">
        <IconPlay />
      </div>
      <div className="text-sm font-medium text-gray-700">No response yet</div>
      <div className="text-[12px] text-gray-500 mt-0.5">Test your code to see the output and console logs.</div>
      <button
        onClick={onRun}
        className="mt-3 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-[11px] font-semibold uppercase tracking-wide transition-colors"
      >
        <IconPlay /> Test code
      </button>
    </div>
  );
}

function ResponseView({ running }: { running: boolean }) {
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <div className="flex items-center justify-between px-3 pt-2 pb-1.5">
        <div className="text-xs text-gray-500 font-mono">todays_date</div>
        <span className="text-[10px] text-gray-400 uppercase tracking-wide">string</span>
      </div>
      <div className="border-t border-gray-100 flex font-mono text-xs">
        <div className="bg-gray-50 px-3 py-2 text-gray-400 w-8 text-right border-r border-gray-100 select-none">1</div>
        <div className="px-3 py-2 text-gray-800">
          {running ? <span className="text-gray-400">…</span> : <span className="text-emerald-700">&quot;2026-05-21&quot;</span>}
        </div>
      </div>
    </div>
  );
}

function LogsView({ running }: { running: boolean }) {
  const logs = [
    { t: "12:00:01.001", level: "info", msg: "Executing script…" },
    { t: "12:00:01.002", level: "info", msg: "moment loaded (v2.30.1)" },
    { t: "12:00:01.005", level: "ok", msg: "Script completed in 4ms" },
  ];
  const visible = running ? logs.slice(0, 1) : logs;
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden font-mono text-xs">
      {visible.map((l, i) => (
        <div key={i} className="flex border-b border-gray-100 last:border-b-0">
          <div className="bg-gray-50 px-3 py-1.5 text-gray-400 w-28 border-r border-gray-100 select-none">{l.t}</div>
          <div className={`px-3 py-1.5 flex-1 ${l.level === "ok" ? "text-emerald-700" : "text-gray-700"}`}>{l.msg}</div>
        </div>
      ))}
    </div>
  );
}
