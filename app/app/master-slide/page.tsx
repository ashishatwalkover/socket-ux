"use client";

import Link from "next/link";
import { APP_BASE } from "@/lib/app-routes";
import { useEffect, useState } from "react";
import type { MasterItem } from "@/components/master-slide/types";
import { MasterPanel } from "@/components/master-slide/master-panel";
import { AIChatPanel } from "@/components/master-slide/ai-chat-panel";

const ITEMS: MasterItem[] = [
  { id: "javascript", label: "JavaScript", badge: "JS", badgeBg: "bg-yellow-400", badgeFg: "text-black" },
];

export default function MasterSlidePage() {
  const [selected, setSelected] = useState<MasterItem | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPrompt, setChatPrompt] = useState("");

  const closePanel = () => {
    setSelected(null);
    setChatOpen(false);
    setChatPrompt("");
  };

  const openChat = (prompt: string) => {
    setChatPrompt(prompt);
    setChatOpen(true);
  };

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closePanel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <header className="flex items-center h-11 px-4 border-b border-gray-200 bg-white gap-3 flex-shrink-0 shadow-sm">
        <nav className="flex items-center gap-1 text-sm text-gray-500">
          <Link href={APP_BASE} className="hover:text-gray-700 transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-medium">Master Slide</span>
        </nav>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="max-w-[960px] mx-auto py-10 px-6">
          <h1 className="text-2xl font-semibold text-gray-800">Master Slide</h1>
          <p className="text-sm text-gray-500 mt-1">
            A high-level overview surface. Add your master slide content here.
          </p>

          <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {ITEMS.map(item => {
                const isActive = selected?.id === item.id;
                return (
                  <li
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isActive ? "bg-blue-50" : "hover:bg-gray-50"}`}
                  >
                    <span className={`w-6 h-6 rounded ${item.badgeBg} flex items-center justify-center text-[10px] font-bold ${item.badgeFg} flex-shrink-0`}>{item.badge}</span>
                    <span className="text-sm text-gray-800 font-medium flex-1">{item.label}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>

      {selected && (
        <div className="fixed right-0 top-11 bottom-0 z-40 flex flex-row-reverse shadow-xl">
          <aside className="w-[600px] max-w-[90vw] bg-white border-l border-gray-200 flex flex-col">
            <MasterPanel
              item={selected}
              onClose={closePanel}
              chatOpen={chatOpen}
              onOpenChat={openChat}
            />
          </aside>
          {chatOpen && (
            <aside className="w-[380px] max-w-[45vw] bg-white border-l border-gray-200 flex flex-col">
              <AIChatPanel prompt={chatPrompt} onClose={() => setChatOpen(false)} />
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
