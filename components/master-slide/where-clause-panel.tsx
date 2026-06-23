"use client";

import { useState } from "react";
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
/* ---------------- main ---------------- */
export function WhereClausePanel({ item, onClose }: PanelProps) {
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
              </div>
              <div className="text-[11px] text-gray-500 leading-snug">
                Build your filter condition using chips or describe it in plain English.
              </div>
            </div>
          </div>

          {/* Visual WHERE clause builder */}
          <WhereClauseBuilder />
        </section>
      </div>
    </div>
  );
}

/* ---------------- WHERE clause builder ---------------- */
type WhereClausePart = {
  id: string;
  type: "text" | "dropdown";
  label: string;
  value?: string;
  options?: string[];
  isRequired: boolean;
};

function WhereClauseBuilder() {
  const [parts, setParts] = useState<WhereClausePart[]>([
    { id: "1", type: "text", label: "Send a", isRequired: false },
    { id: "2", type: "dropdown", label: "type", options: ["user", "system", "notification"], isRequired: true },
    { id: "3", type: "text", label: "message to", isRequired: false },
    { id: "4", type: "dropdown", label: "channels", options: ["general", "random", "alerts"], isRequired: true },
    { id: "5", type: "text", label: "and notify", isRequired: false },
    { id: "6", type: "dropdown", label: "recipients", options: ["everyone", "admins", "moderators"], isRequired: true },
  ]);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handlePartClick = (part: WhereClausePart) => {
    if (part.type === "dropdown") {
      setOpenDropdownId(openDropdownId === part.id ? null : part.id);
    }
  };

  const handleOptionSelect = (partId: string, value: string) => {
    setParts(prev => prev.map(p => 
      p.id === partId ? { ...p, value } : p
    ));
    setOpenDropdownId(null);
  };

  const handleClickOutside = () => {
    setOpenDropdownId(null);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50" onClick={handleClickOutside}>
      <div className="flex flex-wrap items-center">
        {parts.map((part) => {
          const isOpen = openDropdownId === part.id;
          const hasValue = part.value && part.value.length > 0;
          
          return (
            <div key={part.id} className="relative">
              {part.type === "text" ? (
                <span className="px-2 py-1 text-sm text-gray-900">
                  {part.label}
                </span>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePartClick(part);
                    }}
                    className={`
                      text-sm transition-all relative
                      ${hasValue
                        ? "text-blue-700 border-b-1 border-blue-500"
                        : "text-gray-400 border-b-1 border-dashed border-gray-400 hover:border-purple-400 hover:text-purple-600"
                      }
                    `}
                  >
                    {hasValue ? part.value : part.label}
                  </button>
                  
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[120px]">
                      {part.options?.map((option) => (
                        <button
                          key={option}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionSelect(part.id, option);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        >
                          {option}
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
            </div>
          );
        })}
      </div>
          
    </div>
  );
}

