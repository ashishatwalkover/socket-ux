"use client";

import { useState, useEffect } from "react";
import { Popover, Tooltip, Alert } from "@mui/material";
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

/* ---------------- markdown converter ---------------- */
function markdownToHtml(md: string): string {
  if (!md) return "<p style='color:#9ca3af;font-size:14px;font-family:sans-serif;padding:16px;'>No content to preview</p>";
  let html = md
    // Escape HTML first
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headers
    .replace(/^#{6}\s+(.*$)/gim, "<h6 style='margin:8px 0;font-size:14px;color:#374151;'>$1</h6>")
    .replace(/^#{5}\s+(.*$)/gim, "<h5 style='margin:10px 0;font-size:15px;color:#374151;'>$1</h5>")
    .replace(/^#{4}\s+(.*$)/gim, "<h4 style='margin:12px 0;font-size:16px;color:#374151;'>$1</h4>")
    .replace(/^#{3}\s+(.*$)/gim, "<h3 style='margin:14px 0;font-size:18px;color:#374151;'>$1</h3>")
    .replace(/^#{2}\s+(.*$)/gim, "<h2 style='margin:16px 0;font-size:20px;color:#374151;border-bottom:1px solid #e5e7eb;padding-bottom:4px;'>$1</h2>")
    .replace(/^#{1}\s+(.*$)/gim, "<h1 style='margin:18px 0;font-size:24px;color:#111827;border-bottom:2px solid #e5e7eb;padding-bottom:6px;'>$1</h1>")
    // Bold & Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/___(.*?)___/g, "<strong><em>$1</em></strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    // Code inline
    .replace(/`([^`]+)`/g, "<code style='background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:13px;font-family:monospace;color:#ef4444;'>$1</code>")
    // Code block
    .replace(/```([\s\S]*?)```/g, "<pre style='background:#1f2937;color:#e5e7eb;padding:16px;border-radius:8px;overflow-x:auto;font-size:13px;line-height:1.5;margin:12px 0;'><code>$1</code></pre>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' style='color:#3b82f6;text-decoration:underline;'>$1</a>")
    // Unordered lists
    .replace(/^(\s*)-\s+(.*$)/gim, "$1<li style='margin:4px 0;'>$2</li>")
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => `<ul style="padding-left:20px;margin:8px 0;">${match}</ul>`)
    // Ordered lists
    .replace(/^(\s*)\d+\.\s+(.*$)/gim, "$1<li style='margin:4px 0;'>$2</li>")
    // Blockquote
    .replace(/^>\s+(.*$)/gim, "<blockquote style='border-left:4px solid #d1d5db;padding-left:12px;margin:12px 0;color:#6b7280;font-style:italic;'>$1</blockquote>")
    // Horizontal rule
    .replace(/^-{3,}$/gim, "<hr style='border:none;border-top:1px solid #e5e7eb;margin:16px 0;'>")
    // Paragraphs (line breaks)
    .replace(/\n\n/g, "</p><p style='margin:10px 0;line-height:1.6;color:#374151;'>")
    .replace(/\n/g, "<br>");
  // Wrap in paragraph if not already wrapped
  if (!html.startsWith("<")) {
    html = `<p style="margin:10px 0;line-height:1.6;color:#374151;">${html}</p>`;
  }
  return `<div style="font-family:system-ui,sans-serif;padding:16px;max-width:100%;">${html}</div>`;
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
    { id: "2", type: "dropdown", label: "custom", options: ["creates", "updates", "deletes"], isRequired: true },
    { id: "3", type: "text", label: "a", isRequired: false },
    { id: "4", type: "dropdown", label: "dynamic list", options: ["post", "comment", "page"], isRequired: true },
    { id: "5", type: "text", label: "with", isRequired: false },
    { id: "6", type: "boolean", label: "published", isRequired: true },
    { id: "7", type: "text", label: "status and", isRequired: false },
    { id: "8", type: "multiselect", label: "tags", options: ["urgent", "important", "review", "archive"], isRequired: true },
    { id: "9", type: "text", label: "containing", isRequired: false },
    { id: "10", type: "longtext", label: "markdown", isRequired: true },
    { id: "11", type: "text", label: "formatted as", isRequired: false },
    { id: "12", type: "html", label: "html", isRequired: true },
    { id: "13", type: "text", label: "send notification to", isRequired: false },
    { id: "14", type: "dropdown", label: "channel", options: ["email", "slack", "webhook"], isRequired: true },
    { id: "15", type: "text", label: "and trigger", isRequired: false },
    { id: "16", type: "dropdown", label: "dictionary", options: ["webhook", "email", "slack", "sms"], isRequired: true },
    { id: "17", type: "text", label: "with priority", isRequired: false },
    { id: "18", type: "boolean", label: "ai/help", isRequired: true },
    { id: "19", type: "text", label: "retry on failure", isRequired: false },
    { id: "20", type: "multiselect", label: "conditions", options: ["success", "failure", "timeout", "error"], isRequired: true },    
  ]);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(null);
  const [dynamicListAnchor, setDynamicListAnchor] = useState<HTMLButtonElement | null>(null);
  const [dynamicListInputs, setDynamicListInputs] = useState<string[]>([""]);
  const [dictionaryAnchor, setDictionaryAnchor] = useState<HTMLButtonElement | null>(null);
  const [dictionaryPairs, setDictionaryPairs] = useState<Array<{ key: string; value: string }>>([{ key: "", value: "" }]);
  const [aiHelpAnchor, setAiHelpAnchor] = useState<HTMLButtonElement | null>(null);
  const [aiHelpText, setAiHelpText] = useState<string>("");
  const [aiHelpResult, setAiHelpResult] = useState<string>("");
  const [aiHelpLoading, setAiHelpLoading] = useState<boolean>(false);
  const [chainDropdownId, setChainDropdownId] = useState<string | null>(null);
  const [chainValue, setChainValue] = useState<string | null>(null);
  const [chainPrefix, setChainPrefix] = useState<string>("");
  const [chainSuffix, setChainSuffix] = useState<string>("");
  const [maximizedPartId, setMaximizedPartId] = useState<string | null>(null);
  const [editorViewMode, setEditorViewMode] = useState<"code" | "preview">("code");
  const [editingInlineId, setEditingInlineId] = useState<string | null>(null);
  const [inlinePrefix, setInlinePrefix] = useState("");
  const [inlineSuffix, setInlineSuffix] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const dropdown = target.closest('[data-dropdown]');
      if (!dropdown) {
        if (openDropdownId) setOpenDropdownId(null);
        if (chainDropdownId) setChainDropdownId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdownId, chainDropdownId]);

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
    setEditorViewMode("code");
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
                  {part.id === "18" ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAiHelpAnchor(e.currentTarget);
                        }}
                        className={`text-sm transition-all inline-block truncate max-w-[120px] align-bottom ${hasValue ? "text-blue-700 border-b-1 border-blue-500" : "text-gray-400 border-b-1 border-dashed border-gray-400 hover:border-purple-400 hover:text-purple-600"}`}
                        title={hasValue ? part.value : undefined}
                      >
                        {hasValue ? (part.value!.length > 15 ? part.value!.substring(0, 15) + "..." : part.value) : part.label}
                      </button>

                      <Popover
                        open={Boolean(aiHelpAnchor)}
                        anchorEl={aiHelpAnchor}
                        onClose={() => setAiHelpAnchor(null)}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                        slotProps={{ paper: { sx: { mt: 1, minWidth: 420, p: 0, overflow: "hidden" } } }}
                      >
                        <div className="p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="space-y-3">
                            {aiHelpLoading ? (
                              <div className="flex flex-col items-center justify-center py-8 gap-3">
                                <div className="relative">
                                  <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                                  <IconSparkle className="absolute inset-0 m-auto text-purple-600" />
                                </div>
                                <p className="text-sm text-purple-600 font-medium">AI is processing...</p>
                                <p className="text-xs text-gray-500">Please wait a moment</p>
                              </div>
                            ) : !aiHelpResult ? (
                              <>
                                <textarea
                                  value={aiHelpText}
                                  onChange={(e) => setAiHelpText(e.target.value)}
                                  placeholder="Enter your question or request for AI assistance..."
                                  className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-purple-400 resize-none"
                                  rows={5}
                                />
                                <button
                                  onClick={() => {
                                    if (!aiHelpText.trim()) return;
                                    setAiHelpLoading(true);
                                    setTimeout(() => {
                                      setAiHelpResult(`Based on your input: "${aiHelpText}"\n\nHere is the AI-generated response with recommendations and insights.`);
                                      setAiHelpLoading(false);
                                    }, 1500);
                                  }}
                                  disabled={!aiHelpText.trim()}
                                  className="w-full text-sm bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                  Ask AI
                                </button>
                              </>
                            ) : (
                              <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm text-gray-900 font-medium">AI Response:</p>
                                  <button
                                    onClick={() => {
                                      setAiHelpResult("");
                                    }}
                                    className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                                  >
                                    Ask again
                                  </button>
                                </div>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiHelpResult}</p>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                            <button
                              onClick={() => {
                                setAiHelpText("");
                                setAiHelpResult("");
                                setAiHelpAnchor(null);
                              }}
                              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              Clear
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOptionSelect(part.id, aiHelpResult || aiHelpText);
                                setAiHelpAnchor(null);
                              }}
                              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              Done
                            </button>
                          </div>

                          <div className="mt-4 space-y-2">
                            <Alert severity="info">
                              <p style={{ margin: 0, marginBottom: 6 }}>
                                <strong>Quick Setup Guide:</strong> Follow these steps to configure your <em>webhook</em>.
                              </p>
                              <ul style={{ margin: 0, paddingLeft: 20 }}>
                                <li>Copy the <strong>webhook URL</strong> above.</li>
                                <li>Paste it into your platform's <em>webhook settings</em>.</li>
                                <li>Save and <strong>trigger a test event</strong>.</li>
                              </ul>
                            </Alert>

                            <Alert severity="success">
                              <p style={{ margin: 0, marginBottom: 6 }}>
                                <strong>Pro Tips</strong> <em>(recommended)</em>:
                              </p>
                              <ol style={{ margin: 0, paddingLeft: 20 }}>
                                <li>Use <code style={{ background: "#e0f2fe", padding: "1px 4px"}}>secret keys</code> for authentication.</li>
                                <li>Enable <strong>retry logic</strong> for failed events.</li>
                                <li>Monitor with <em>real-time logs</em>.</li>
                              </ol>
                            </Alert>

                            <Alert severity="warning">
                              <p style={{ margin: 0 }}>
                                <strong>Important:</strong> <em>Never share</em> your webhook URL publicly. It can be used to <strong>send unauthorized events</strong> to your system.
                              </p>
                            </Alert>
                          </div>
                        </div>
                      </Popover>
                    </>
                  ) : (
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
                  )}
                </>
              ) : part.type === "dropdown" || part.type === "multiselect" ? (
                <>
                  {part.id === "4" ? (
                    <>
                      <span
                        data-inline-row
                        data-dropdown
                        className={`inline-flex items-center text-sm border-b-1 leading-none ${
                          part.value ? "border-blue-500 text-blue-700" : "border-dashed border-gray-400 text-gray-400"
                        }`}
                      >
                        {part.value ? (
                          (part.value.split(",").map(v => v.trim()) || []).map((val, idx, arr) => (
                            <span key={idx} className="inline-flex items-center">
                              {idx > 0 && (
                                <span className="text-gray-400">,</span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDynamicListInputs(part.value?.split(",").map(v => v.trim()) || [""]);
                                  setDynamicListAnchor(e.currentTarget);
                                }}
                                className="text-sm text-blue-700 hover:text-blue-800 cursor-pointer inline-block truncate max-w-[80px]"
                                title={val}
                              >
                                {val.length > 10 ? val.substring(0, 10) + "..." : val}
                              </button>
                            </span>
                          ))
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDynamicListInputs([""]);
                              setDynamicListAnchor(e.currentTarget);
                            }}
                            className="text-gray-400 hover:text-purple-600 cursor-pointer"
                          >
                            {part.label}
                          </button>
                        )}
                      </span>

                      <Popover
                        open={Boolean(dynamicListAnchor)}
                        anchorEl={dynamicListAnchor}
                        onClose={() => setDynamicListAnchor(null)}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                        slotProps={{ paper: { sx: { mt: 1, minWidth: 320, p: 0, overflow: "hidden" } } }}
                      >
                        <div className="p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="space-y-3">
                            {dynamicListInputs.map((val, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={val}
                                  onChange={(e) => {
                                    const newValues = [...dynamicListInputs];
                                    newValues[idx] = e.target.value;
                                    setDynamicListInputs(newValues);
                                  }}
                                  placeholder={`Item ${idx + 1}`}
                                  className="flex-1 text-sm border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-purple-400"
                                />
                                {dynamicListInputs.length > 1 && (
                                  <button
                                    onClick={() => {
                                      setDynamicListInputs(dynamicListInputs.filter((_, i) => i !== idx));
                                    }}
                                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Remove"
                                  >
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                      <line x1="18" y1="6" x2="6" y2="18" />
                                      <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              onClick={() => setDynamicListInputs([...dynamicListInputs, ""])}
                              className="w-full text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded border border-dashed border-purple-300 transition-colors font-medium"
                            >
                              + Add
                            </button>
                          </div>
                          <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                            <button
                              onClick={() => {
                                handleOptionSelect(part.id, "");
                                setDynamicListInputs([""]);
                                setDynamicListAnchor(null);
                              }}
                              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              Clear
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const filteredValues = dynamicListInputs.filter(v => v.trim());
                                handleOptionSelect(part.id, filteredValues.join(","));
                                setDynamicListAnchor(null);
                              }}
                              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </Popover>
                    </>
                  ) : part.id === "16" ? (
                    <>
                      <span
                        data-inline-row
                        data-dropdown
                        className={`inline-flex items-center text-sm border-b-1 leading-none ${
                          part.value ? "border-blue-500 text-blue-700" : "border-dashed border-gray-400 text-gray-400"
                        }`}
                      >
                        {part.value ? (
                          <>
                            {JSON.parse(part.value).slice(0, 2).map((pair: { key: string; value: string }, idx: number) => (
                              <span key={idx} className="inline-flex items-center">
                                {idx > 0 && (
                                  <span className="text-gray-400">,</span>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDictionaryPairs(JSON.parse(part.value || "[]"));
                                    setDictionaryAnchor(e.currentTarget);
                                  }}
                                  className="text-sm text-blue-700 hover:text-blue-800 cursor-pointer inline-block truncate max-w-[80px]"
                                  title={`${pair.key}: ${pair.value}`}
                                >
                                  {pair.key.length > 10 ? pair.key.substring(0, 10) + "..." : pair.key}:{pair.value.length > 10 ? pair.value.substring(0, 10) + "..." : pair.value}
                                </button>
                              </span>
                            ))}
                            {JSON.parse(part.value).length > 2 && (
                              <span className="text-purple-600 font-medium">
                                +{JSON.parse(part.value).length - 2}
                              </span>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDictionaryPairs([{ key: "", value: "" }]);
                              setDictionaryAnchor(e.currentTarget);
                            }}
                            className="text-gray-400 hover:text-purple-600 cursor-pointer"
                          >
                            {part.label}
                          </button>
                        )}
                      </span>

                      <Popover
                        open={Boolean(dictionaryAnchor)}
                        anchorEl={dictionaryAnchor}
                        onClose={() => setDictionaryAnchor(null)}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                        slotProps={{ paper: { sx: { mt: 1, minWidth: 380, p: 0, overflow: "hidden" } } }}
                      >
                        <div className="p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="space-y-3">
                            {dictionaryPairs.map((pair, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={pair.key}
                                  onChange={(e) => {
                                    const newPairs = [...dictionaryPairs];
                                    newPairs[idx].key = e.target.value;
                                    setDictionaryPairs(newPairs);
                                  }}
                                  placeholder="Key"
                                  className="flex-1 text-sm border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-purple-400"
                                />
                                <span className="text-gray-400">:</span>
                                <input
                                  type="text"
                                  value={pair.value}
                                  onChange={(e) => {
                                    const newPairs = [...dictionaryPairs];
                                    newPairs[idx].value = e.target.value;
                                    setDictionaryPairs(newPairs);
                                  }}
                                  placeholder="Value"
                                  className="flex-1 text-sm border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-purple-400"
                                />
                                {dictionaryPairs.length > 1 && (
                                  <button
                                    onClick={() => {
                                      setDictionaryPairs(dictionaryPairs.filter((_, i) => i !== idx));
                                    }}
                                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Remove"
                                  >
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                      <line x1="18" y1="6" x2="6" y2="18" />
                                      <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              onClick={() => setDictionaryPairs([...dictionaryPairs, { key: "", value: "" }])}
                              className="w-full text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded border border-dashed border-purple-300 transition-colors font-medium"
                            >
                              + Add
                            </button>
                          </div>
                          <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                            <button
                              onClick={() => {
                                handleOptionSelect(part.id, "");
                                setDictionaryPairs([{ key: "", value: "" }]);
                                setDictionaryAnchor(null);
                              }}
                              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              Clear
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const filteredPairs = dictionaryPairs.filter(p => p.key.trim() || p.value.trim());
                                handleOptionSelect(part.id, JSON.stringify(filteredPairs));
                                setDictionaryAnchor(null);
                              }}
                              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </Popover>
                    </>
                  ) : part.id === "2" && chainValue ? (
                    <>
                      <span
                        data-inline-row
                        data-dropdown
                        className="inline-flex items-center text-sm border-b-1 border-blue-500 text-blue-700 leading-none"
                      >
                        <InlineSizer
                          value={chainPrefix}
                          onChange={setChainPrefix}
                          onFocus={() => setChainDropdownId(part.id)}
                        />
                        <LockedTag onClick={() => setChainDropdownId(part.id)}>{chainValue}</LockedTag>
                        <InlineSizer
                          value={chainSuffix}
                          onChange={setChainSuffix}
                          onFocus={() => setChainDropdownId(part.id)}
                        />
                      </span>
                      {chainDropdownId === part.id && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[120px]" data-dropdown>
                          {["body", "query", "header"].map((opt) => (
                            <button
                              key={opt}
                              onClick={(e) => {
                                e.stopPropagation();
                                setChainValue(opt);
                                setChainDropdownId(null);
                              }}
                              className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors capitalize"
                            >
                              {opt}
                            </button>
                          ))}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setChainValue(null);
                              setChainDropdownId(null);
                            }}
                            className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border-t border-gray-100"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
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

                  {/* Chain plus icon — only for "action" (id=2) when its dropdown is open */}
                  {part.id === "2" && isOpen && (
                    <Tooltip title="PROVIDE MANUAL/DYNAMIC INPUT" placement="top" arrow>
                      <button
                        data-dropdown
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(null);
                          setChainDropdownId(part.id);
                        }}
                        className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors align-middle"
                      >
                        <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </Tooltip>
                  )}

                  {/* Show chain selection inline */}
                  {part.id === "2" && chainValue && (
                    <span className="ml-1 text-sm text-purple-700 font-medium bg-purple-50 px-1.5 rounded">
                      {chainValue}
                    </span>
                  )}

                  {/* Chain dropdown (body / query / header) */}
                  {part.id === "2" && chainDropdownId === part.id && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[120px]" data-dropdown>
                      {["body", "query", "header"].map((opt) => (
                        <button
                          key={opt}
                          onClick={(e) => {
                            e.stopPropagation();
                            setChainValue(opt);
                            setChainDropdownId(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors capitalize"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[120px]" data-dropdown>
                      {part.options?.map((option) => {
                        const isSelected = part.value && part.value.split(",").includes(option);
                        const isMultiselect = part.type === "multiselect";
                        return (
                          <button
                            key={option}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOptionSelect(part.id, option);
                            }}
                            className={`flex items-center w-full text-left px-3 py-2 text-sm transition-colors ${isSelected ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"}`}
                          >
                            {isMultiselect ? (
                              <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                fill="none"
                                stroke={isSelected ? "#16a34a" : "#d1d5db"}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 flex-shrink-0"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              isSelected && <span className="mr-2">✓</span>
                            )}
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
                  )}
                </>
              ) : part.type === "longtext" || part.type === "html" ? (
                <>
                  <button
                    ref={(el) => {
                      if (isOpen && el) setPopoverAnchor(el);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePartClick(part);
                      setPopoverAnchor(e.currentTarget);
                    }}
                    className={`text-sm transition-all relative ${hasValue ? "text-blue-700 border-b-1 border-blue-500" : "text-gray-400 border-b-1 border-dashed border-gray-400 hover:border-purple-400 hover:text-purple-600"}`}
                  >
                    {hasValue ? ((part.value || "").length > 20 ? (part.value || "").substring(0, 20) + "..." : part.value) : part.label}
                  </button>
                  
                  <Popover
                    open={isOpen}
                    anchorEl={popoverAnchor}
                    onClose={() => setOpenDropdownId(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    slotProps={{ paper: { sx: { mt: 1, minWidth: 320, p: 0, overflow: "hidden" } } }}
                  >
                    <div className="p-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase">{part.label}</span>
                        <div className="flex items-center gap-2">
                          {(part.type === "html" || part.type === "longtext") && (
                            <div className="flex items-center bg-gray-100 rounded-md p-0.5">
                              <button
                                onClick={() => setEditorViewMode("code")}
                                className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                                  editorViewMode === "code"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                              >
                                Code
                              </button>
                              <button
                                onClick={() => setEditorViewMode("preview")}
                                className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                                  editorViewMode === "preview"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                              >
                                Preview
                              </button>
                            </div>
                          )}
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
                      </div>
                      {(part.type === "html" || part.type === "longtext") && editorViewMode === "preview" ? (
                        <iframe
                          srcDoc={part.type === "html" ? (part.value || "<p style='color:#9ca3af;font-size:14px;font-family:sans-serif;padding:16px;'>No content to preview</p>") : markdownToHtml(part.value || "")}
                          className="w-full border border-gray-200 rounded bg-white"
                          style={{ height: 150 }}
                          sandbox=""
                          title="Preview"
                        />
                      ) : (
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
                      )}
                      {part.type === "html" && editorViewMode === "code" && (
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
                  </Popover>
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
                <div className="flex items-center gap-3">
                  {(part.type === "html" || part.type === "longtext") && (
                    <div className="flex items-center bg-gray-100 rounded-md p-0.5">
                      <button
                        onClick={() => setEditorViewMode("code")}
                        className={`px-3 py-1 text-[11px] font-medium rounded transition-colors ${
                          editorViewMode === "code"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Code
                      </button>
                      <button
                        onClick={() => setEditorViewMode("preview")}
                        className={`px-3 py-1 text-[11px] font-medium rounded transition-colors ${
                          editorViewMode === "preview"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Preview
                      </button>
                    </div>
                  )}
                  <button
                    onClick={handleCloseMaximize}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <IconClose />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                {(part.type === "html" || part.type === "longtext") && editorViewMode === "preview" ? (
                  <iframe
                    srcDoc={part.type === "html" ? (part.value || "<p style='color:#9ca3af;font-size:14px;font-family:sans-serif;padding:16px;'>No content to preview</p>") : markdownToHtml(part.value || "")}
                    className="w-full min-h-[300px] border border-gray-200 rounded bg-white"
                    sandbox=""
                    title="Preview"
                  />
                ) : (
                  <textarea
                    value={part.value || ""}
                    onChange={(e) => handleTextChange(part.id, e.target.value)}
                    placeholder={`Enter ${part.label}...`}
                    rows={part.type === "html" ? 20 : 15}
                    className="w-full text-sm text-gray-700 border border-gray-200 rounded p-3 outline-none focus:border-purple-400 resize-y font-mono"
                  />
                )}
                {part.type === "html" && editorViewMode === "code" && (
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

