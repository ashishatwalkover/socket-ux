"use client";

import { useEffect, useRef, useState } from "react";

function IconSparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className={className}>
      <path d="M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6L12 2zM19 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1zM5 15l.7 1.6L7.3 17.3 5.7 18l-.7 1.6L4.3 18l-1.6-.7 1.6-.7L5 15z" />
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

type Message = { role: "user" | "assistant"; content: string };

type AIChatPanelProps = {
  prompt: string;
  onClose: () => void;
};

export function AIChatPanel({ prompt, onClose }: AIChatPanelProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setMessages([
      { role: "user", content: prompt },
      {
        role: "assistant",
        content: "I've generated the script based on your request. You can ask me to refine the code, explain how it works, or make changes — just type below.",
      },
    ]);
  }, [prompt]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [input]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    window.setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Got it — I'll update the script accordingly. Check the Code section in the panel for the latest version.",
        },
      ]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm">
          <IconSparkle />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-800">Ask AI</div>
          <div className="text-[11px] text-gray-400 truncate">Refine or explain your script</div>
        </div>
        <button aria-label="Close chat" onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <IconClose />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[90%] rounded-lg px-3 py-2 text-[13px] leading-relaxed ${
                m.role === "user"
                  ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                  : "bg-gray-50 border border-gray-200 text-gray-700"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-200 px-4 py-3 flex-shrink-0 bg-white">
        <div className="flex items-end gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-purple-300 focus-within:ring-1 focus-within:ring-purple-200">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask a follow-up…"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none leading-relaxed"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white disabled:opacity-40 hover:brightness-110 transition-all"
            aria-label="Send"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
