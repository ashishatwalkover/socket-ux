"use client";

import { useState, useEffect } from "react";
import type { PanelProps } from "./types";

/* ---------------- icons ---------------- */
function IconSparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className={className}>
      <path d="M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6L12 2zM19 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1zM5 15l.7 1.6L7.3 17.3 5.7 18l-.7 1.6L4.3 18l-1.6-.7 1.6-.7L5 15z" />
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
function IconMaximize({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}
function IconSentence({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="14" y2="17" />
    </svg>
  );
}
function IconForm({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <rect x="3" y="11" width="18" height="4" rx="1" />
      <rect x="3" y="18" width="12" height="3" rx="1" />
    </svg>
  );
}
/* ---------------- main ---------------- */
export function WhereClausePanel({ item, onClose }: PanelProps) {
  const [viewMode, setViewMode] = useState<"sentence" | "form">("sentence");
  return (
    <div className="flex flex-col h-full bg-white">          
      {/* body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 bg-white">
        {/* WHERE clause builder */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm">
              <IconSparkle />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-semibold text-gray-900">WHERE Clause Builder</span>
                <span className="text-[9px] font-semibold uppercase tracking-wide text-purple-600 bg-purple-50 border border-purple-100 px-1.5 py-[1px] rounded-full">AI</span>
                <button
                  onClick={() => setViewMode(m => m === "sentence" ? "form" : "sentence")}
                  className="ml-auto p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                  title={viewMode === "sentence" ? "Switch to form view" : "Switch to sentence view"}
                >
                  {viewMode === "sentence" ? <IconForm /> : <IconSentence />}
                </button>
              </div>
              <div className="text-[11px] text-gray-500 leading-snug">
                Build your filter condition using chips or describe it in plain English.
              </div>
            </div>
          </div>

          {/* Visual WHERE clause builder */}
          <WhereClauseBuilder viewMode={viewMode} />
        </section>
      </div>
    </div>
  );
}

/* ---------------- WHERE clause builder ---------------- */
type WhereClausePart = {
  id: string;
  type: "text" | "dropdown" | "boolean" | "multiselect" | "longtext" | "html";
  label: string;
  value?: string;
  originalValue?: string;
  prefix?: string;
  suffix?: string;
  betweens?: string[];
  options?: string[];
  isRequired: boolean;
};

function WhereClauseBuilder({ viewMode = "sentence" }: { viewMode?: "sentence" | "form" }) {
  const [parts, setParts] = useState<WhereClausePart[]>([
    { id: "1", type: "text", label: "When a user", isRequired: false },
    { id: "2", type: "dropdown", label: "action", options: ["creates", "updates", "deletes"], isRequired: true },
    { id: "3", type: "text", label: "a", isRequired: false },
    { id: "4", type: "dropdown", label: "resource", options: ["post", "comment", "page"], isRequired: true },
    { id: "5", type: "text", label: "with", isRequired: false },
    { id: "6", type: "boolean", label: "published", isRequired: true },
    { id: "7", type: "text", label: "status and", isRequired: false },
    { id: "8", type: "multiselect", label: "tags", options: ["urgent", "important", "review", "archive"], isRequired: true },
    { id: "9", type: "text", label: "containing", isRequired: false },
    { id: "10", type: "longtext", label: "description", isRequired: true },
    { id: "11", type: "text", label: "formatted as", isRequired: false },
    { id: "12", type: "html", label: "content", isRequired: true },
    { id: "13", type: "text", label: "send notification to", isRequired: false },
    { id: "14", type: "dropdown", label: "channel", options: ["email", "slack", "webhook"], isRequired: true },
  ]);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [maximizedPartId, setMaximizedPartId] = useState<string | null>(null);
  const [editingInlineId, setEditingInlineId] = useState<string | null>(null);
  const [inlinePrefix, setInlinePrefix] = useState("");
  const [inlineSuffix, setInlineSuffix] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openDropdownId) {
        const target = e.target as HTMLElement;
        // Check if click is inside any dropdown
        const dropdown = target.closest('[data-dropdown]');
        if (!dropdown) {
          setOpenDropdownId(null);
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdownId]);

  const handlePartClick = (part: WhereClausePart) => {
    if (part.type === "dropdown" || part.type === "multiselect" || part.type === "boolean") {
      setOpenDropdownId(openDropdownId === part.id ? null : part.id);
    } else if (part.type === "longtext" || part.type === "html") {
      setOpenDropdownId(openDropdownId === part.id ? null : part.id);
    }
  };

  const handleOptionSelect = (partId: string, value: string) => {
    setParts(prev => prev.map(p => {
      if (p.id === partId) {
        if (p.type === "multiselect") {
          const currentValues = p.value ? p.value.split(",") : [];
          const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
          return { ...p, value: newValues.join(","), originalValue: newValues.join(","), prefix: "", suffix: "" };
        }
        return { ...p, value, originalValue: value, prefix: "", suffix: "" };
      }
      return p;
    }));
    if (openDropdownId !== partId) {
      setOpenDropdownId(null);
    }
  };

  const handleTextChange = (partId: string, value: string) => {
    setParts(prev => prev.map(p => 
      p.id === partId ? { ...p, value } : p
    ));
  };

  const handlePrefixChange = (partId: string, prefix: string) => {
    setParts(prev => prev.map(p => p.id === partId ? { ...p, prefix } : p));
  };

  const handleSuffixChange = (partId: string, suffix: string) => {
    setParts(prev => prev.map(p => p.id === partId ? { ...p, suffix } : p));
  };

  const handleBetweenChange = (partId: string, index: number, value: string) => {
    setParts(prev => prev.map(p => {
      if (p.id !== partId) return p;
      const betweens = [...(p.betweens || [])];
      betweens[index] = value;
      return { ...p, betweens };
    }));
  };

  const handleClickOutside = () => {
    setOpenDropdownId(null);
  };

  const handleMaximize = (partId: string) => {
    setMaximizedPartId(partId);
  };

  const handleCloseMaximize = () => {
    setMaximizedPartId(null);
  };

  const handleInlineEditStart = (part: WhereClausePart) => {
    setEditingInlineId(part.id);
    setInlinePrefix(part.prefix || "");
    setInlineSuffix(part.suffix || "");
  };

  const handleInlineEditSave = () => {
    if (editingInlineId) {
      setParts(prev => prev.map(p => {
        if (p.id === editingInlineId) {
          return { ...p, prefix: inlinePrefix, suffix: inlineSuffix };
        }
        return p;
      }));
      setEditingInlineId(null);
      setInlinePrefix("");
      setInlineSuffix("");
    }
  };

  const handleInlineEditCancel = () => {
    setEditingInlineId(null);
    setInlinePrefix("");
    setInlineSuffix("");
  };

  const handleInlineEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInlineEditSave();
    } else if (e.key === "Escape") {
      handleInlineEditCancel();
    }
  };

  // Group parts for form view: accumulate text parts as label prefix for the next interactive part
  const formRows: { labelText: string; part: WhereClausePart }[] = [];
  if (viewMode === "form") {
    let labelBuffer: string[] = [];
    parts.forEach((p) => {
      if (p.type === "text") {
        labelBuffer.push(p.label);
      } else {
        formRows.push({ labelText: [...labelBuffer, p.label].join(" "), part: p });
        labelBuffer = [];
      }
    });
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50" onClick={handleClickOutside}>
      <div className={viewMode === "form" ? "flex flex-col gap-3" : "flex flex-wrap items-center"}>
        {(viewMode === "form" ? formRows.map(r => r.part) : parts).map((part, rowIdx) => {
          if (viewMode === "form" && part.type === "text") return null;
          const labelText = viewMode === "form" ? formRows[rowIdx]?.labelText : "";
          const isOpen = openDropdownId === part.id;
          const hasValue = part.value && part.value.length > 0;
          
          const content = (
            <div key={part.id} className="relative">
              {part.type === "text" ? (
                <span className="px-2 py-1 text-sm text-gray-900">
                  {part.label}
                </span>
              ) : part.type === "boolean" ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePartClick(part);
                    }}
                    className={`text-sm transition-all relative ${hasValue ? "text-blue-700 border-b-1 border-blue-500" : "text-gray-400 border-b-1 border-dashed border-gray-400 hover:border-purple-400 hover:text-purple-600"}`}
                  >
                    {hasValue ? part.value : part.label}
                  </button>
                  
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[100px]" data-dropdown>
                      {["true", "false"].map((option) => (
                        <button
                          key={option}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionSelect(part.id, option);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        >
                          {option === "true" ? "Yes" : "No"}
                        </button>
                      ))}
                      {hasValue && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionSelect(part.id, "");
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border-t border-gray-100"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : part.type === "dropdown" || part.type === "multiselect" ? (
                <>
                  <span
                    data-inline-row
                    data-dropdown
                    className={`inline-flex items-center text-sm border-b-1 leading-none ${hasValue ? "border-blue-500 text-blue-700" : "border-dashed border-gray-400 text-gray-400"}`}
                  >
                    <InlineSizer
                      value={part.prefix || ""}
                      onChange={(v) => handlePrefixChange(part.id, v)}
                      onFocus={() => setOpenDropdownId(part.id)}
                      placeholder={!hasValue ? part.label : undefined}
                    />
                    {hasValue && (part.type === "multiselect" ? (
                      (part.value?.split(",") || []).map((val, idx, arr) => (
                        <span key={idx} className="inline-flex items-center">
                          <LockedTag onClick={() => setOpenDropdownId(part.id)}>{val}</LockedTag>
                          {idx < arr.length - 1 && (
                            <InlineSizer
                              value={part.betweens?.[idx] ?? ", "}
                              onChange={(v) => handleBetweenChange(part.id, idx, v)}
                              onFocus={() => setOpenDropdownId(part.id)}
                            />
                          )}
                        </span>
                      ))
                    ) : (
                      <LockedTag onClick={() => setOpenDropdownId(part.id)}>{part.originalValue || part.value}</LockedTag>
                    ))}
                    {hasValue && (
                      <InlineSizer
                        value={part.suffix || ""}
                        onChange={(v) => handleSuffixChange(part.id, v)}
                        onFocus={() => setOpenDropdownId(part.id)}
                      />
                    )}
                  </span>
                  
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[120px]" data-dropdown>
                      {part.options?.map((option) => {
                        const isSelected = part.value && part.value.split(",").includes(option);
                        return (
                          <button
                            key={option}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOptionSelect(part.id, option);
                            }}
                            className={`block w-full text-left px-3 py-2 text-sm transition-colors ${isSelected ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"}`}
                          >
                            {isSelected && <span className="mr-2">✓</span>}
                            {option}
                          </button>
                        );
                      })}
                      {hasValue && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionSelect(part.id, "");
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border-t border-gray-100"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : part.type === "longtext" || part.type === "html" ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePartClick(part);
                    }}
                    className={`text-sm transition-all relative ${hasValue ? "text-blue-700 border-b-1 border-blue-500" : "text-gray-400 border-b-1 border-dashed border-gray-400 hover:border-purple-400 hover:text-purple-600"}`}
                  >
                    {hasValue ? ((part.value || "").length > 20 ? (part.value || "").substring(0, 20) + "..." : part.value) : part.label}
                  </button>
                  
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[300px] p-3" onClick={(e) => e.stopPropagation()} data-dropdown>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase">{part.label}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMaximize(part.id);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Maximize"
                        >
                          <IconMaximize />
                        </button>
                      </div>
                      <textarea
                        value={part.value || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleTextChange(part.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        placeholder={`Enter ${part.label}...`}
                        rows={part.type === "html" ? 6 : 4}
                        className="w-full text-sm text-gray-700 border border-gray-200 rounded p-2 outline-none focus:border-purple-400 resize-y"
                      />
                      {part.type === "html" && (
                        <div className="mt-2 text-xs text-gray-500">
                          HTML content supported
                        </div>
                      )}
                      {hasValue && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionSelect(part.id, "");
                          }}
                          className="mt-2 block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border-t border-gray-100"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          );

          if (viewMode === "form") {
            return (
              <div key={part.id} className="flex items-center gap-3">
                <label className="text-sm text-gray-700 w-32 shrink-0">{labelText}:</label>
                <div className="flex-1">{content}</div>
              </div>
            );
          }
          return content;
        })}
      </div>
      
      {/* Maximized dialog for longtext/html */}
      {maximizedPartId && (() => {
        const part = parts.find(p => p.id === maximizedPartId);
        if (!part || (part.type !== "longtext" && part.type !== "html")) return null;
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCloseMaximize}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-900">{part.label}</span>
                <button
                  onClick={handleCloseMaximize}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <IconClose />
                </button>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                <textarea
                  value={part.value || ""}
                  onChange={(e) => handleTextChange(part.id, e.target.value)}
                  placeholder={`Enter ${part.label}...`}
                  rows={part.type === "html" ? 20 : 15}
                  className="w-full text-sm text-gray-700 border border-gray-200 rounded p-3 outline-none focus:border-purple-400 resize-y font-mono"
                />
                {part.type === "html" && (
                  <div className="mt-2 text-xs text-gray-500">
                    HTML content supported
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
                {part.value && (
                  <button
                    onClick={() => handleOptionSelect(part.id, "")}
                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={handleCloseMaximize}
                  className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ---------------- LockedTag ---------------- */
function LockedTag({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <span
      data-dropdown
      className="font-medium bg-blue-50 rounded cursor-pointer"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => {
        // Prevent default to keep caret placement under our control
        e.preventDefault();
        e.stopPropagation();
        const tag = e.currentTarget as HTMLElement;
        const row = tag.closest("[data-inline-row]");
        if (row) {
          const inputs = Array.from(row.querySelectorAll<HTMLInputElement>("input"));
          // Find the first input that comes after this tag in document order
          const next = inputs.find(inp => (tag.compareDocumentPosition(inp) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0);
          if (next) {
            next.focus();
            next.setSelectionRange(0, 0);
          }
        }
        onClick?.();
      }}
    >
      {children}
    </span>
  );
}

/* ---------------- InlineSizer ---------------- */
function InlineSizer({ value, onChange, onFocus, placeholder }: { value: string; onChange: (v: string) => void; onFocus?: () => void; placeholder?: string }) {
  const focusSibling = (current: HTMLInputElement, direction: "prev" | "next") => {
    // Find the nearest ancestor that contains all the inline inputs (the outer span)
    const container = current.closest("[data-inline-row]");
    if (!container) return;
    const inputs = Array.from(container.querySelectorAll<HTMLInputElement>("input"));
    const idx = inputs.indexOf(current);
    if (idx === -1) return;
    const target = direction === "next" ? inputs[idx + 1] : inputs[idx - 1];
    if (target) {
      target.focus();
      if (direction === "next") {
        target.setSelectionRange(0, 0);
      } else {
        const len = target.value.length;
        target.setSelectionRange(len, len);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const atStart = input.selectionStart === 0 && input.selectionEnd === 0;
    const atEnd = input.selectionStart === value.length && input.selectionEnd === value.length;
    if (e.key === "ArrowRight" && atEnd) {
      e.preventDefault();
      focusSibling(input, "next");
    } else if (e.key === "ArrowLeft" && atStart) {
      e.preventDefault();
      focusSibling(input, "prev");
    } else if (e.key === "Backspace" && atStart) {
      // Jump to previous input on backspace at start
      e.preventDefault();
      focusSibling(input, "prev");
    }
  };

  return (
    <span className="relative inline-block align-baseline" style={{ minWidth: "1px" }}>
      <span className="invisible whitespace-pre" aria-hidden>{value || placeholder || "\u200B"}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.value);
        }}
        onFocus={() => onFocus?.()}
        onClick={(e) => {
          e.stopPropagation();
          onFocus?.();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        className="absolute inset-0 w-full bg-transparent outline-none p-0 m-0 border-0 placeholder:text-gray-400"
      />
    </span>
  );
}

