"use client";

import { useState } from "react";
import type { PanelProps } from "./types";

function IconSparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className={className}>
      <path d="M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6L12 2zM19 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1zM5 15l.7 1.6L7.3 17.3 5.7 18l-.7 1.6L4.3 18l-1.6-.7 1.6-.7L5 15z" />
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

function IconCode({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconPlus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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

export function JavaScriptPanelV2({ item, onClose }: PanelProps) {
  const [hasTested, setHasTested] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [responseTab, setResponseTab] = useState<"response" | "logs">("response");
  return (
    <div className="flex flex-col h-full bg-white">
      {/* header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <span className={`w-7 h-7 rounded ${item.badgeBg} flex items-center justify-center text-[11px] font-bold ${item.badgeFg} flex-shrink-0`}>
          {item.badge}
        </span>
        <span className="text-sm font-medium text-gray-800 flex-1 truncate">{item.label}</span>
        <button aria-label="More" className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <IconMore />
        </button>
        <button aria-label="Close" onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <IconClose />
        </button>
      </div>

      {/* body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white">
        {/* prompt input */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-700">Tell the AI what you want</span>
            <span className="text-[10px] text-gray-400">· in plain English</span>
          </div>
          <p className="text-xs text-gray-500 leading-snug">
            Write what you want in your own words — no coding needed.
            For example: <span className="text-gray-700">&ldquo;Give me today&rsquo;s date as 2026-05-21&rdquo;</span> or
            <span className="text-gray-700"> &ldquo;Add 7 days to today and show the result&rdquo;</span>.
          </p>
        </div>
        <div className="relative bg-white border-2 border-blue-500 rounded-md px-3 py-2.5 min-h-[110px]">
          <div className="flex items-start gap-2">
            <IconSparkle className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 leading-relaxed flex-1">
              Get today&apos;s date in YYYY-MM-DD format using moment.js
            </p>
          </div>
          <button
            aria-label="Add"
            className="absolute bottom-2 right-2 w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
          >
            <IconPlus />
          </button>
        </div>

        {/* ask ai / chat history */}
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-1.5 bg-gray-200 text-gray-500 px-3 py-1.5 rounded text-[11px] font-semibold uppercase tracking-wide">
            <IconSparkle />
            Ask AI
          </button>
          <button className="flex items-center gap-1.5 text-blue-600 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide hover:bg-blue-50 rounded transition-colors">
            <IconChat />
            Chat history
          </button>
        </div>

        {/* divider above code */}
        <div className="border-t border-gray-200" />

        {/* code editor: chip-style header + collapsible editor */}
        <div className="space-y-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCodeOpen(o => !o)}
              className={`flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded transition-colors ${codeOpen ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              <IconCode />
              Code
            </button>
            <div className="flex gap-2 ml-auto">
              <button className="border border-green-500 text-green-600 bg-white px-5 py-1.5 rounded text-[11px] font-semibold uppercase tracking-wide hover:bg-green-50 transition-colors">
                Save
              </button>
              <button
                onClick={() => setHasTested(true)}
                className="bg-blue-600 text-white px-5 py-1.5 rounded text-[11px] font-semibold uppercase tracking-wide hover:bg-blue-700 transition-colors"
              >
                Test
              </button>
              {hasTested && (
                <button className="border border-gray-300 text-gray-600 bg-white px-5 py-1.5 rounded text-[11px] font-semibold uppercase tracking-wide hover:text-gray-800 hover:border-gray-400 transition-colors">
                  Save
                </button>
              )}
            </div>
          </div>
          {codeOpen && (
            <div className="border border-gray-200 rounded overflow-hidden bg-white font-mono text-xs">
              {[
                `const moment = require("moment");`,
                ``,
                `function getTodaysDate() {`,
                `  return moment().format("YYYY-MM-DD");`,
                `}`,
                ``,
                `return getTodaysDate();`,
              ].map((line, i) => (
                <div key={i} className="flex">
                  <div className="bg-gray-50 px-3 py-0.5 text-gray-400 w-10 text-right border-r border-gray-100 select-none">{i + 1}</div>
                  <div className="px-3 py-0.5 text-gray-800 whitespace-pre">{line || "\u00A0"}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* divider between code and response */}
        <div className="border-t border-gray-200" />

        {/* response tabs (chip style) */}
        <div>
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
            <span className="ml-auto text-xs text-gray-500">Showing data from 6h, 12:00 PM</span>
          </div>

          <div className="pt-3">
            {responseTab === "response" && (
              <div className="bg-white border border-gray-200 rounded overflow-hidden">
                <div className="px-3 pt-2 pb-1.5 text-xs text-gray-500">todays_date</div>
                <div className="border-t border-gray-100 flex font-mono text-xs">
                  <div className="bg-gray-50 px-3 py-2 text-gray-400 w-8 text-right border-r border-gray-100 select-none">1</div>
                  <div className="px-3 py-2 text-red-600">&quot;2026-05-21&quot;</div>
                </div>
              </div>
            )}
            {responseTab === "logs" && (
              <div className="bg-white border border-gray-200 rounded overflow-hidden font-mono text-xs">
                {[
                  { t: "12:00:01", msg: "Executing script…" },
                  { t: "12:00:01", msg: "moment loaded (v2.30.1)" },
                  { t: "12:00:01", msg: "Script completed in 4ms" },
                ].map((l, i) => (
                  <div key={i} className="flex border-b border-gray-100 last:border-b-0">
                    <div className="bg-gray-50 px-3 py-1.5 text-gray-400 w-20 border-r border-gray-100 select-none">{l.t}</div>
                    <div className="px-3 py-1.5 text-gray-700 flex-1">{l.msg}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2.5 flex items-center gap-2 text-xs text-gray-600 flex-shrink-0">
        <span aria-hidden>💡</span>
        <span>How to use JS Code?</span>
      </div>
    </div>
  );
}
