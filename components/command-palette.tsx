"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  actionItems,
  navigationItems,
  flowItems,
  collectionItems,
  logItems,
  helpItems,
  type CommandItem,
  type CommandKind,
} from "@/lib/command-data";

const KindIcon = {
  action: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  navigation: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  flow: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M8 6h8M7 8l4 8M17 8l-4 8" />
    </svg>
  ),
  collection: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h5l2 2h11v8a2 2 0 0 1-2 2H3z" />
      <path d="M3 7V5a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2" />
    </svg>
  ),
  log: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  ),
  help: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  search: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  ),
  close: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
};

type Section = {
  kind: CommandKind;
  title: string;
  items: CommandItem[];
};

function fuzzy(query: string, item: CommandItem) {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return (
    item.name.toLowerCase().includes(q) ||
    item.collection?.toLowerCase().includes(q) ||
    item.description?.toLowerCase().includes(q) ||
    item.kind.toLowerCase().includes(q)
  );
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Cmd+K / Ctrl+K to open + custom event trigger
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  // Reset state on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      // Focus input after render
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const sections: Section[] = useMemo(() => {
    const filteredAction = actionItems.filter((i) => fuzzy(query, i));
    const filteredNav = navigationItems.filter((i) => fuzzy(query, i));
    const filteredFlow = flowItems.filter((i) => fuzzy(query, i));
    const filteredCollection = collectionItems.filter((i) => fuzzy(query, i));
    const filteredLog = logItems.filter((i) => fuzzy(query, i));
    const filteredHelp = helpItems.filter((i) => fuzzy(query, i));
    const out: Section[] = [];
    if (filteredAction.length) out.push({ kind: "action", title: "Actions", items: filteredAction });
    if (filteredFlow.length) out.push({ kind: "flow", title: "Flows", items: filteredFlow });
    if (filteredCollection.length) out.push({ kind: "collection", title: "Collections", items: filteredCollection });
    if (filteredLog.length) out.push({ kind: "log", title: "Logs", items: filteredLog });
    if (filteredHelp.length) out.push({ kind: "help", title: "Help & Docs", items: filteredHelp });
    if (filteredNav.length) out.push({ kind: "navigation", title: "Navigation", items: filteredNav });
    return out;
  }, [query]);

  const flatItems = useMemo(() => sections.flatMap((s) => s.items), [sections]);

  // Clamp active index
  useEffect(() => {
    if (activeIndex >= flatItems.length) setActiveIndex(0);
  }, [flatItems.length, activeIndex]);

  // Scroll active into view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flatItems[activeIndex];
      if (item) selectItem(item);
    }
  }

  function selectItem(item: CommandItem) {
    setOpen(false);
    if (item.href) {
      if (item.href.startsWith("http")) {
        window.open(item.href, "_blank");
      } else {
        router.push(item.href);
      }
    }
  }

  if (!open) return null;

  let runningIndex = -1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-start pointer-events-none"
      onClick={() => setOpen(false)}
    >
      <div
        className="pointer-events-auto w-full max-w-3xl h-screen bg-[#0f1729] border-r border-white/10 shadow-2xl text-white overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKey}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-xl font-semibold">Search</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <KindIcon.close />
          </button>
        </div>

        {/* Search input */}
        <div className="px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-3 bg-white/5 rounded-md px-3 py-2.5">
            <span className="text-white/50">
              <KindIcon.search />
            </span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              placeholder="Search flows, logs, navigation, docs..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/40"
            />
            <kbd className="text-[11px] bg-white/10 text-white/70 px-2 py-0.5 rounded">
              Cmd K
            </kbd>
          </div>
        </div>

        {/* Results */}
        <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto">
          {sections.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-white/50">
              No results for &quot;{query}&quot;
            </div>
          )}

          {sections.map((section) => (
            <div key={section.kind} className="py-3">
              <div className="px-5 mb-2 flex items-center gap-2">
                <h3 className="text-base font-semibold">{section.title}</h3>
                <span className="text-xs text-white/40">{section.items.length}</span>
              </div>

              {/* Column headers */}
              <div className="px-5 grid grid-cols-12 gap-3 text-xs text-white/50 pb-2">
                <div className="col-span-6 flex items-center gap-2">Name</div>
                {section.kind === "flow" && (
                  <>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Updated</div>
                    <div className="col-span-2">Collection</div>
                  </>
                )}
                {section.kind === "log" && (
                  <>
                    <div className="col-span-3">Time</div>
                    <div className="col-span-3">Collection</div>
                  </>
                )}
                {section.kind === "navigation" && (
                  <div className="col-span-6">Path</div>
                )}
                {section.kind === "help" && (
                  <div className="col-span-6">Description</div>
                )}
                {section.kind === "action" && (
                  <div className="col-span-6">Description</div>
                )}
                {section.kind === "collection" && (
                  <div className="col-span-6">Flows</div>
                )}
              </div>

              {/* Rows */}
              {section.items.map((item) => {
                runningIndex++;
                const idx = runningIndex;
                const active = idx === activeIndex;
                const Icon = KindIcon[item.kind];
                return (
                  <div
                    key={item.id}
                    data-index={idx}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => selectItem(item)}
                    className={`px-5 py-2.5 grid grid-cols-12 gap-3 text-sm cursor-pointer transition-colors ${
                      active ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="col-span-6 flex items-center gap-2.5 min-w-0">
                      <span className="text-white/50 flex-shrink-0">
                        <Icon />
                      </span>
                      <span className="truncate">{item.name}</span>
                    </div>

                    {section.kind === "flow" && (
                      <>
                        <div className="col-span-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                            {item.status}
                          </span>
                        </div>
                        <div className="col-span-2 text-white/70">{item.updated}</div>
                        <div className="col-span-2 text-white/70 truncate">{item.collection}</div>
                      </>
                    )}

                    {section.kind === "log" && (
                      <>
                        <div className="col-span-3 text-white/70">{item.time}</div>
                        <div className="col-span-3 text-white/70 truncate">{item.collection ?? ""}</div>
                      </>
                    )}

                    {section.kind === "navigation" && (
                      <div className="col-span-6 text-white/50 truncate">{item.href}</div>
                    )}

                    {section.kind === "help" && (
                      <div className="col-span-6 text-white/60 truncate">{item.description}</div>
                    )}

                    {section.kind === "action" && (
                      <div className="col-span-6 flex items-center justify-between gap-2 text-white/60 truncate">
                        <span className="truncate">{item.description}</span>
                        {item.shortcut && (
                          <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded">
                            {item.shortcut}
                          </kbd>
                        )}
                      </div>
                    )}

                    {section.kind === "collection" && (
                      <div className="col-span-6 text-white/60">
                        {item.flowCount} {item.flowCount === 1 ? "flow" : "flows"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/10 text-[11px] text-white/50">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded mr-1">↑↓</kbd>Navigate</span>
            <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded mr-1">↵</kbd>Open</span>
            <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded mr-1">Esc</kbd>Close</span>
          </div>
          <span>{flatItems.length} results</span>
        </div>
      </div>
    </div>
  );
}
