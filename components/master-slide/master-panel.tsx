"use client";

import type { ComponentType } from "react";
import type { MasterItem, PanelProps } from "./types";
import { JavaScriptPanelV3 } from "./javascript-panel-v3";
import { WhereClausePanel } from "./where-clause-panel";

/**
 * Registry mapping a master-slide item id to its panel component.
 * Add new entries here as more languages / item types are introduced.
 */
const PANEL_REGISTRY: Record<string, ComponentType<PanelProps>> = {
  javascript: JavaScriptPanelV3,
  "where-clause": WhereClausePanel,
};

function DefaultPanel({ item, onClose }: PanelProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-800">{item.label}</span>
        <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="p-4 text-sm text-gray-500">No panel defined for &quot;{item.id}&quot; yet.</div>
    </div>
  );
}

export function MasterPanel({
  item,
  onClose,
  chatOpen,
  onOpenChat,
}: {
  item: MasterItem;
  onClose: () => void;
  chatOpen?: boolean;
  onOpenChat?: (prompt: string) => void;
}) {
  const Cmp = PANEL_REGISTRY[item.id] ?? DefaultPanel;
  return <Cmp item={item} onClose={onClose} chatOpen={chatOpen} onOpenChat={onOpenChat} />;
}
