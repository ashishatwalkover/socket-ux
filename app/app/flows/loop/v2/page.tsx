"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  useState,
  useRef,
  useEffect,
  useMemo,
  createContext,
  useContext,
  type ReactElement,
  type ReactNode,
} from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ViewListIcon from "@mui/icons-material/ViewList";
import LoopIcon from "@mui/icons-material/Loop";
import { Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AddStepDrawer, type AddStepItem } from "@/components/flow/add-step-drawer";
import LoopIconWithPopover from "@/components/flow/loop-icon-with-popover";

type JsonLineProps = { children?: ReactNode };

const CW = 2120;
const CH = 1660;

type NK = "trigger" | "action" | "condition" | "empty" | "group" | "add";
interface NF { k: string; v: string }
interface FN {
  id: string; kind: NK;
  x: number; y: number; w: number; h: number;
  title?: string; subtitle?: string;
  badge?: string; bc?: "blue" | "green" | "red" | "orange";
  icon?: string; fields?: NF[];
  gv?: "true" | "false"; gl?: string;
}
interface FE { id: string; from: string; to: string; v?: "true" | "false"; side?: "left" | "right" }

const STATIC_NODES: FN[] = [
  { id: "trigger", kind: "trigger", x: 866, y: 40, w: 280, h: 160,
    title: "New Email Matching Search - three", subtitle: "Every 5 minutes",
    badge: "In Sync", bc: "green", icon: "gmail" },
  { id: "check-email", kind: "action", x: 751, y: 230, w: 510, h: 158,
    title: "check team member email", icon: "robot",
    fields: [
      { k: "email", v: "susan@y...   cc: Susan-side...   check: 0x7f1ca1b0913..." },
      { k: "subject", v: "date: 6 May 2026   n-out: Finance Inbox   id: 0x6f7f7m4b0705..." },
      { k: "sections", v: "Subject: alehod   In-teamManager" },
    ] },
];

const STATIC_EDGES: FE[] = [
  { id: "e1", from: "trigger", to: "check-email" },
];

const LOOP_STATIC_NODES: FN[] = [
  { id: "trigger", kind: "trigger", x: 866, y: 40, w: 280, h: 100,
    title: "New Email Matching Search - four", subtitle: "Every 5 minutes",
    badge: "In Sync", bc: "green", icon: "gmail" },
  { id: "check-email", kind: "action", x: 751, y: 150, w: 510, h: 158,
    title: "check team member email", icon: "robot",
    fields: [
      { k: "email", v: "susan@y...   cc: Susan-side...   check: 0x7f1ca1b0913..." },
      { k: "subject", v: "date: 6 May 2026   n-out: Finance Inbox   id: 0x6f7f7m4b0705..." },
      { k: "sections", v: "Subject: alehod   In-teamManager" },
    ] },
];

const STEP_W = 360;
const STEP_H = 80;
const STEP_GAP = 30;
const STEP_START_Y = 438;
const STEP_CENTER_X = 1006;
const ADD_STEP_GAP = 30;

function buildFlow(extras: FN[]): { nodes: FN[]; edges: FE[] } {
  const nodes: FN[] = STATIC_NODES.map((n) => ({ ...n }));
  const edges: FE[] = STATIC_EDGES.map((e) => ({ ...e }));

  const placed = extras.map((step, i) => ({
    ...step,
    x: STEP_CENTER_X - STEP_W / 2,
    y: STEP_START_Y + i * (STEP_H + STEP_GAP),
    w: step.w ?? STEP_W,
    h: step.h ?? STEP_H,
  }));

  let prevId = "check-email";
  placed.forEach((step) => {
    nodes.push(step);
    edges.push({ id: `e-${prevId}-${step.id}`, from: prevId, to: step.id });
    prevId = step.id;
  });

  const lastBottom = placed.length > 0
    ? placed[placed.length - 1].y + (placed[placed.length - 1].h ?? STEP_H)
    : STEP_START_Y - ADD_STEP_GAP;
  const addY = lastBottom + ADD_STEP_GAP;

  nodes.push({ id: "add-step", kind: "add", x: STEP_CENTER_X - 16, y: addY, w: 32, h: 32 });
  edges.push({ id: "e-add-step", from: prevId, to: "add-step" });

  return { nodes, edges };
}

function buildLoopFlow(extras: FN[]): { nodes: FN[]; edges: FE[] } {
  const nodes: FN[] = LOOP_STATIC_NODES.map((n) => ({ ...n }));
  const edges: FE[] = STATIC_EDGES.map((e) => ({ ...e }));

  const placed = extras.map((step, i) => ({
    ...step,
    x: STEP_CENTER_X - STEP_W / 2,
    y: STEP_START_Y + i * (STEP_H + STEP_GAP),
    w: step.w ?? STEP_W,
    h: step.h ?? STEP_H,
  }));

  let prevId = "check-email";
  placed.forEach((step) => {
    nodes.push(step);
    edges.push({ id: `e-${prevId}-${step.id}`, from: prevId, to: step.id });
    prevId = step.id;
  });

  const lastBottom = placed.length > 0
    ? placed[placed.length - 1].y + (placed[placed.length - 1].h ?? STEP_H)
    : STEP_START_Y - ADD_STEP_GAP;
  const addY = lastBottom + ADD_STEP_GAP;

  nodes.push({ id: "add-step", kind: "add", x: STEP_CENTER_X - 16, y: addY, w: 32, h: 32 });
  edges.push({ id: "e-add-step", from: prevId, to: "add-step" });

  return { nodes, edges };
}

const AddStepContext = createContext<((tool: AddStepItem) => void) | null>(null);
const LoopOpenContext = createContext<((nodeId: string) => void) | null>(null);

function edgePath(a: FN, b: FN, side?: "left" | "right"): string {
  const ex = b.x + b.w / 2, ey = b.kind === "condition" ? b.y + b.h : b.y;
  if (side === "left" || side === "right") {
    const sx = a.x + a.w / 2, sy = a.y + a.h;
    const mid = (sy + ey) / 2;
    return `M${sx},${sy} L${sx},${mid} L${ex},${mid} L${ex},${ey}`;
  }
  const sx = a.x + a.w / 2, sy = a.y + a.h;
  const my = (sy + ey) / 2;
  return `M${sx},${sy} L${sx},${my} L${ex},${my} L${ex},${ey}`;
}

const BADGE_CLS: Record<string, string> = {
  blue:   "bg-gray-100 text-gray-500",
  green:  "bg-gray-100 text-gray-500",
  red:    "bg-gray-100 text-gray-500",
  orange: "bg-gray-100 text-gray-500",
};

const GROUP_BG: Record<string, { bg: string; bd: string }> = {
  "grp-left":       { bg: "rgba(239,68,68,0.07)",    bd: "#ef4444" },
  "grp-rows":       { bg: "rgba(249,115,22,0.07)",   bd: "#f97316" },
  "grp-else-left":  { bg: "rgba(34,197,94,0.07)",    bd: "#22c55e" },
  "grp-right":      { bg: "rgba(139,92,246,0.07)",   bd: "#8b5cf6" },
  "grp-thread":     { bg: "rgba(59,130,246,0.07)",   bd: "#3b82f6" },
  "grp-awaiting":   { bg: "rgba(234,179,8,0.07)",    bd: "#eab308" },
  "grp-foo":        { bg: "rgba(20,184,166,0.07)",   bd: "#14b8a6" },
  "grp-else-right": { bg: "rgba(236,72,153,0.07)",   bd: "#ec4899" },
};

function AIc({ k }: { k?: string }) {
  const map: Record<string, [string, string]> = {
    gmail:   ["bg-red-500",    "M"],
    sheets:  ["bg-green-600",  "S"],
    robot:   ["bg-violet-600", "R"],
    message: ["bg-blue-500",   "✉"],
    loop:    ["bg-teal-500",   "↻"],
  };
  const [bg, lbl] = map[k ?? ""] ?? ["bg-gray-400", "?"];
  return (
    <span className={`w-5 h-5 rounded ${bg} flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0`}>
      {lbl}
    </span>
  );
}

function Bdg({ label, color }: { label: string; color?: string }) {
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${BADGE_CLS[color ?? ""] ?? "bg-gray-100 text-gray-600"}`}>
      {label}
    </span>
  );
}

function MoreMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex-shrink-0" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <MoreVertIcon sx={{ fontSize: 14 }} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[130px]">
          {[
            { label: "Edit",      icon: <EditIcon sx={{ fontSize: 13 }} />, cls: "text-gray-700" },
            { label: "Duplicate", icon: <ContentCopyIcon sx={{ fontSize: 13 }} />, cls: "text-gray-700" },
            { label: "Delete",    icon: <DeleteOutlineIcon sx={{ fontSize: 13 }} />, cls: "text-red-500" },
          ].map(({ label, icon, cls }) => (
            <button key={label} onClick={() => setOpen(false)} className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium hover:bg-gray-50 transition-colors ${cls}`}>
              {icon}{label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ParentTriggerEl({ n }: { n: FN }) {
  const [loopConfigOpen, setLoopConfigOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
        {/* Trigger header bar */}
        <div className="flex items-center justify-between bg-gray-100 px-3 py-1.5 border-b border-gray-200">
          <span className="text-xs font-bold text-gray-800">Trigger</span>
          <div className="flex items-center gap-2 text-gray-600">
            <button type="button" className="hover:text-gray-900" title="Download">
              <DownloadIcon sx={{ fontSize: 16 }} />
            </button>
            <LoopIconWithPopover />
            <button type="button" className="hover:text-gray-900" title="Branch">
              <CallSplitIcon sx={{ fontSize: 16 }} />
            </button>
            <button type="button" className="hover:text-gray-900" title="Run">
              <PlayArrowIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
        {/* Trigger content */}
        <div className="px-3 py-2 flex flex-col justify-center gap-1.5">
          <div className="flex items-center gap-2">
            <AIc k={n.icon} />
            <span className="text-xs font-semibold text-gray-800 leading-tight flex-1">{n.title}</span>
            <MoreMenu />
          </div>
          {n.subtitle && <span className="text-[10px] text-gray-400">{n.subtitle}</span>}
        </div>
        {/* Loop step */}
        <button
          onClick={() => setLoopConfigOpen(true)}
          className="px-3 py-2 border-t border-gray-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-between flex-1 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LoopIcon sx={{ fontSize: 18 }} className="text-gray-700" />
            <span className="text-xs font-semibold text-gray-800">Loop</span>
          </div>
          <MoreMenu />
        </button>
      </div>
      <LoopConfigPanel open={loopConfigOpen} onClose={() => setLoopConfigOpen(false)} />
    </>
  );
}

function ChildTriggerEl({ n }: { n: FN }) {
  const [loopConfigOpen, setLoopConfigOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setLoopConfigOpen(true)}
        className="w-full h-full bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      >
        {/* Trigger header bar - child flow */}
        <div className="flex items-center justify-between bg-blue-100 px-3 py-1.5 border-b border-blue-200">
          <span className="text-xs font-bold text-blue-800">Child Trigger</span>
          <div className="flex items-center gap-2 text-blue-600">
            <button type="button" className="hover:text-blue-900" title="Download" onClick={(e) => e.stopPropagation()}>
              <DownloadIcon sx={{ fontSize: 16 }} />
            </button>
            <button type="button" className="hover:text-blue-900" title="Branch" onClick={(e) => e.stopPropagation()}>
              <CallSplitIcon sx={{ fontSize: 16 }} />
            </button>
            <button type="button" className="hover:text-blue-900" title="Run" onClick={(e) => e.stopPropagation()}>
              <PlayArrowIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
        {/* Trigger content - child flow */}
        <div className="px-3 py-2 flex flex-col justify-center gap-1.5 flex-1 bg-blue-50">
          <div className="flex items-center gap-2">
            <LoopIconWithPopover />
            <span className="text-xs font-semibold text-blue-800 leading-tight flex-1">{n.title}</span>
            <MoreMenu />
          </div>
          {n.subtitle && <span className="text-[10px] text-blue-600">{n.subtitle}</span>}
        </div>
      </button>
      <ChildLoopConfigPanel open={loopConfigOpen} onClose={() => setLoopConfigOpen(false)} />
    </>
  );
}

function ActionEl({ n }: { n: FN }) {
  const openLoop = useContext(LoopOpenContext);
  const isLoop = n.icon === "loop";
  const handleClick = isLoop && openLoop
    ? (e: React.MouseEvent) => { e.stopPropagation(); openLoop(n.id); }
    : undefined;
  return (
    <div
      onClick={handleClick}
      onMouseDown={isLoop ? (e) => e.stopPropagation() : undefined}
      className={`bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden ${isLoop ? "cursor-pointer hover:border-teal-400 hover:shadow-md transition-all" : ""}`}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <AIc k={n.icon} />
        <span className="text-xs font-semibold text-gray-800 flex-1 leading-tight">{n.title}</span>
        {n.badge && <Bdg label={n.badge} color={n.bc} />}
        <MoreMenu />
      </div>
      {n.fields && n.fields.length > 0 && (
        <div className="border-t border-gray-100 px-3 py-1.5 flex flex-col gap-0.5 bg-gray-50/70 flex-1 overflow-hidden">
          {n.fields.map((f, i) => (
            <div key={i} className="flex gap-1 text-[10px] leading-snug">
              <span className="text-gray-400 shrink-0">{f.k}:</span>
              <span className="text-gray-500 truncate">{f.v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ConditionEl() { return null; }

function EmptyEl({ n }: { n: FN }) {
  return (
    <div className="h-full rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center gap-1 text-[11px] text-gray-400 cursor-pointer hover:border-blue-300 hover:text-blue-400 transition-colors">
      <AddIcon sx={{ fontSize: 13 }} />
      {n.title}
    </div>
  );
}

function GroupEl({ n, collapsed = false, onToggle }: { n: FN; collapsed?: boolean; onToggle?: () => void }) {
  const c = GROUP_BG[n.id] ?? { bg: "rgba(148,163,184,0.07)", bd: "rgba(148,163,184,0.28)" };
  const ChevronBtn = (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
      className="w-4 h-4 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
      aria-label={collapsed ? "Expand" : "Collapse"}
    >
      <KeyboardArrowDownIcon
        sx={{ fontSize: 14, transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}
      />
    </button>
  );
  return (
    <div className="w-full h-full relative border-2" style={{ backgroundColor: c.bg, borderColor: c.bd }}>
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
        {n.gl && (
          n.gl === "Else" ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm px-2 py-0.5 rounded-sm">
                <span className="text-[8px] font-bold bg-gray-500 text-white px-1 py-0.5 rounded leading-none">ELSE</span>
                <span className="text-[10px] font-medium text-gray-500">Nothing Matched</span>
                <MoreMenu />
                {ChevronBtn}
              </span>
              {n.id !== "grp-else-left" && (
                <span className="inline-flex items-center justify-center rounded-sm bg-green-500" style={{ width: "20px", height: "20px" }}>
                  <CheckIcon sx={{ fontSize: 14, color: "white" }} />
                </span>
              )}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm px-2 py-0.5 rounded-sm">
                <span className="text-[8px] font-bold bg-blue-500 text-white px-1 py-0.5 rounded leading-none">IF</span>
                <span className="text-[10px] font-medium text-gray-700">{n.gl}</span>
                <MoreMenu />
                {ChevronBtn}
              </span>
              {!["grp-thread", "grp-awaiting", "grp-foo"].includes(n.id) && (
                <span className="inline-flex items-center justify-center rounded-sm bg-green-500" style={{ width: "20px", height: "20px" }}>
                  <CheckIcon sx={{ fontSize: 14, color: "white" }} />
                </span>
              )}
            </span>
          )
        )}
      </div>
      {!collapsed && (
        <button className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap">
          <AddIcon sx={{ fontSize: 13 }} />
          Add or drag step here
        </button>
      )}
    </div>
  );
}

type SummaryStepItem = { type: "step"; node: FN; n: number };
type SummaryBranchItem = { type: "branch"; condition: FN; n: number; branches: { group: FN; items: SummaryItem[] }[] };
type SummaryItem = SummaryStepItem | SummaryBranchItem;

function smallestEnclosingGroup(node: FN, groups: FN[]): FN | null {
  let best: FN | null = null;
  for (const g of groups) {
    if (g.id === node.id) continue;
    if (
      node.x >= g.x && node.y >= g.y &&
      node.x + node.w <= g.x + g.w &&
      node.y + node.h <= g.y + g.h
    ) {
      if (!best || (g.w * g.h) < (best.w * best.h)) best = g;
    }
  }
  return best;
}

function buildSummary(nodes: FN[], edges: FE[]): SummaryItem[] {
  const groups = nodes.filter(n => n.kind === "group");
  let counter = 1;
  const visit = (parentId: string | null): SummaryItem[] => {
    const direct = nodes.filter(n => {
      if (n.id === parentId) return false;
      if (n.kind === "group") return false;
      const enc = smallestEnclosingGroup(n, groups);
      return (enc?.id ?? null) === parentId;
    }).sort((a, b) => a.y - b.y || a.x - b.x);
    const out: SummaryItem[] = [];
    for (const node of direct) {
      if (node.kind === "condition") {
        const n = counter++;
        const outgoing = edges.filter(e => e.from === node.id && e.side);
        const branches = outgoing
          .map(e => {
            const grp = nodes.find(g => g.id === e.to && g.kind === "group");
            if (!grp) return null;
            return { group: grp, items: visit(grp.id) };
          })
          .filter((x): x is { group: FN; items: SummaryItem[] } => Boolean(x));
        out.push({ type: "branch", condition: node, n, branches });
      } else if (node.kind === "empty" || node.kind === "add") {
        // skip placeholders in summary
      } else {
        out.push({ type: "step", node, n: counter++ });
      }
    }
    return out;
  };
  return visit(null);
}

function SummaryStepRow({ item }: { item: SummaryStepItem }) {
  const { node, n } = item;
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60 transition-colors">
      <span className="text-[11px] text-gray-400 font-medium w-5 text-right tabular-nums flex-shrink-0">{n}</span>
      <AIc k={node.icon} />
      <span className="text-[12px] text-gray-800 flex-1 truncate">{node.title ?? "Step"}</span>
      {node.badge && <Bdg label={node.badge} color={node.bc} />}
    </div>
  );
}

function SummaryBranchRow({ item }: { item: SummaryBranchItem }) {
  const [active, setActive] = useState(0);
  const { branches, n, condition } = item;
  if (!branches.length) return null;
  const cur = branches[active];
  const headLabel = cur.group.gl ?? "Branch";
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50/40">
        <span className="text-[11px] text-gray-400 font-medium w-5 text-right tabular-nums flex-shrink-0">{n}</span>
        <span className="text-[9px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded leading-none">IF</span>
        <span className="text-[12px] text-gray-700 flex-1 truncate">{headLabel}</span>
        <span className="text-[10px] text-gray-400" title={condition.id}>{branches.length} paths</span>
      </div>
      <div className="px-4 pt-2 flex gap-1 flex-wrap bg-gray-50/40 border-t border-gray-100">
        {branches.map((b, i) => {
          const isActive = i === active;
          const c = GROUP_BG[b.group.id];
          return (
            <button
              key={b.group.id}
              onClick={() => setActive(i)}
              className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-t-md border transition-colors ${isActive ? "bg-white border-gray-200 border-b-white text-gray-800 font-medium -mb-px" : "bg-transparent border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {c && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.bd }} />}
              <span className="font-semibold uppercase tracking-wide">{b.group.badge ?? "Branch"}</span>
              <span className="text-gray-400 truncate max-w-[160px] normal-case font-normal">· {b.group.gl}</span>
            </button>
          );
        })}
      </div>
      <div className="border-t border-gray-200 bg-white pl-4">
        {cur.items.length === 0 ? (
          <div className="px-4 py-3 text-[11px] text-gray-400 italic">No steps in this branch</div>
        ) : cur.items.map((it, i) => (
          it.type === "step"
            ? <SummaryStepRow key={`s-${i}`} item={it} />
            : <SummaryBranchRow key={`b-${i}`} item={it} />
        ))}
      </div>
    </div>
  );
}

function FlowSummary({ variant, nodes, edges }: { variant: "page" | "drawer"; nodes: FN[]; edges: FE[] }) {
  const items = useMemo(() => buildSummary(nodes, edges), [nodes, edges]);
  const isDrawer = variant === "drawer";
  return (
    <div className={isDrawer ? "p-3" : "max-w-[760px] mx-auto py-8 px-6"}>
      {!isDrawer && (
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-800">Flow Summary</h2>
          <p className="text-xs text-gray-500 mt-0.5">Read-only linear view of all steps in execution order.</p>
        </div>
      )}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {items.map((it, i) => (
          it.type === "step"
            ? <SummaryStepRow key={`s-${i}`} item={it} />
            : <SummaryBranchRow key={`b-${i}`} item={it} />
        ))}
      </div>
    </div>
  );
}

function NodeEl({ n, collapsed, onToggle, isChild }: { n: FN; collapsed?: boolean; onToggle?: () => void; isChild?: boolean }) {
  switch (n.kind) {
    case "trigger":   return isChild ? <ChildTriggerEl n={n} /> : <ParentTriggerEl n={n} />;
    case "action":    return <ActionEl n={n} />;
    case "condition": return <ConditionEl />;
    case "empty":     return <EmptyEl n={n} />;
    case "group":     return <GroupEl n={n} collapsed={collapsed} onToggle={onToggle} />;
    case "add":       return <AddEl />;
  }
}

function AddEl() {
  const [open, setOpen] = useState(false);
  const onAddStep = useContext(AddStepContext);
  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-8 h-8 rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-colors shadow-sm"
        title="Add step"
      >
        <AddIcon sx={{ fontSize: 18 }} />
      </button>
      <AddStepDrawer
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(item) => { onAddStep?.(item); setOpen(false); }}
      />
    </>
  );
}

const VERSIONS = [
  { v: "v3", label: "Current",   date: "Today, 1:00 am", active: true  },
  { v: "v2", label: "Published", date: "2 days ago",      active: false },
  { v: "v1", label: "Initial",   date: "5 days ago",      active: false },
];

function VersionDropdown({ currentVersion }: { currentVersion: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const selected = VERSIONS.find(v => v.v === currentVersion) ?? VERSIONS[0];

  const handleSelect = (ver: typeof VERSIONS[0]) => {
    setOpen(false);
    const base = pathname.replace(/\/(v1|v2)$/, "");
    router.push(ver.v === "v3" ? base : `${base}/${ver.v}`);
  };

  return (
    <div className="relative flex-shrink-0" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }} tabIndex={-1}>
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-600 px-2.5 py-1 rounded font-medium hover:bg-gray-50 transition-colors">
        <AccessTimeIcon sx={{ fontSize: 13 }} />
        {selected.v}
        <span className={`text-[9px] font-semibold px-1 py-0.5 rounded leading-none ${currentVersion === "v2" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
          {selected.label}
        </span>
        <KeyboardArrowDownIcon sx={{ fontSize: 14 }} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[200px]">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-3 pt-1 pb-1.5">Versions</p>
          {VERSIONS.map(ver => (
            <button key={ver.v} onClick={() => handleSelect(ver)} className={`w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors ${ver.v === currentVersion ? "bg-blue-50" : ""}`}>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center ${ver.v === currentVersion ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>{ver.v.replace("v","")}</span>
                <div className="text-left">
                  <p className="text-[11px] font-medium text-gray-800">{ver.v}</p>
                  <p className="text-[10px] text-gray-400">{ver.date}</p>
                </div>
              </div>
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded leading-none ${ver.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{ver.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FlowHeader({ currentVersion, onToggleSummary, summaryOpen }: { currentVersion: string; onToggleSummary: () => void; summaryOpen: boolean }) {
  return (
    <header className="relative flex items-center h-11 px-4 border-b border-gray-200 bg-white gap-3 flex-shrink-0 shadow-sm z-10">
      <nav className="flex items-center gap-1 text-sm text-gray-500">
        <Link href="/app" className="hover:text-gray-700 transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="cursor-pointer hover:text-gray-700 transition-colors">Client Flows</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Partnership email tracking</span>
        <span className="ml-1.5 text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-semibold leading-none">
          PUBLISHED
        </span>
      </nav>
      <div className="absolute left-1/2 -translate-x-1/2 flex border border-gray-200 rounded overflow-hidden text-xs">
        <button className="px-3 py-1 bg-white font-semibold text-gray-800 border-b-2 border-blue-500">FLOW</button>
        <button className="px-3 py-1 text-gray-500 hover:bg-gray-50 transition-colors">PUBLISHED</button>
        <button className="px-3 py-1 text-gray-500 hover:bg-gray-50 transition-colors">LOG</button>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <VersionDropdown currentVersion={currentVersion} />
        <button
          onClick={onToggleSummary}
          aria-label="Toggle summary"
          className={`flex items-center gap-1 text-xs border px-2.5 py-1 rounded font-medium transition-colors ${summaryOpen ? "bg-gray-100 border-gray-300 text-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
        >
          <ViewListIcon sx={{ fontSize: 14 }} />
          SUMMARY
        </button>
        <button className="text-xs border border-red-200 text-red-500 px-2.5 py-1 rounded hover:bg-red-50 transition-colors font-medium">
          DISCARD CHANGES
        </button>
        <button className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded hover:bg-blue-700 transition-colors font-medium flex items-center gap-1">
          <PlayArrowIcon sx={{ fontSize: 12 }} />
          PUBLISH CHANGES
        </button>
        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600 ml-1 flex-shrink-0">A</div>
      </div>
    </header>
  );
}

function FlowCanvas({
  initialTransform = { x: 20, y: 16, scale: 0.58 },
  onLoopClick,
}: {
  initialTransform?: { x: number; y: number; scale: number };
  onLoopClick?: (nodeId: string) => void;
}) {
  const [tf, setTf] = useState(initialTransform);
  const [isPanning, setIsPanning] = useState(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"diagram" | "summary">("diagram");
  const [extraSteps, setExtraSteps] = useState<FN[]>([]);
  const { nodes: NODES, edges: EDGES } = useMemo(() => buildFlow(extraSteps), [extraSteps]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (viewMode === "summary") return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setTf(t => {
        const next = Math.min(2, Math.max(0.15, +(t.scale + delta).toFixed(2)));
        return { scale: next, x: mx - (mx - t.x) * (next / t.scale), y: my - (my - t.y) * (next / t.scale) };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [viewMode]);

  const zoomBy = (d: number) =>
    setTf(t => ({ ...t, scale: Math.min(2, Math.max(0.15, +(t.scale + d).toFixed(2))) }));

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (viewMode === "summary") return;
    setIsPanning(true);
    lastMouse.current.x = e.clientX;
    lastMouse.current.y = e.clientY;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current.x = e.clientX;
    lastMouse.current.y = e.clientY;
    setTf(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
  };

  const stopPan = () => setIsPanning(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const toggleCollapse = (id: string) =>
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const handleAddStep = (tool: AddStepItem) => {
    if (tool.name !== "Loop") return;
    setExtraSteps(prev => {
      const lastY = prev.length > 0
        ? prev[prev.length - 1].y + (prev[prev.length - 1].h ?? STEP_H) + STEP_GAP
        : STEP_START_Y;
      const newNode: FN = {
        id: `loop-${Date.now()}`,
        kind: "action",
        x: STEP_CENTER_X - STEP_W / 2,
        y: lastY,
        w: STEP_W,
        h: STEP_H,
        title: "Loop",
        icon: "loop",
      };
      return [...prev, newNode];
    });
  };

  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));
  const groups  = NODES.filter(n => n.kind === "group");
  const rest    = NODES.filter(n => n.kind !== "group");

  const hiddenIds = new Set<string>();
  groups.forEach(g => {
    if (!collapsed.has(g.id)) return;
    NODES.forEach(c => {
      if (c.id === g.id) return;
      const fullyInside =
        c.x >= g.x &&
        c.y >= g.y &&
        c.x + c.w <= g.x + g.w &&
        c.y + c.h <= g.y + g.h;
      if (fullyInside) hiddenIds.add(c.id);
    });
  });
  const COLLAPSED_H = 28;

  const INACTIVE_ID = "grp-thread";
  const inactiveGroup = nodeMap[INACTIVE_ID];
  const inactiveChildIds = new Set<string>();
  if (inactiveGroup) {
    NODES.forEach(c => {
      if (c.id === INACTIVE_ID) return;
      if (
        c.x >= inactiveGroup.x &&
        c.y >= inactiveGroup.y &&
        c.x + c.w <= inactiveGroup.x + inactiveGroup.w &&
        c.y + c.h <= inactiveGroup.y + inactiveGroup.h
      ) inactiveChildIds.add(c.id);
    });
  }

  return (
    <AddStepContext.Provider value={handleAddStep}>
    <LoopOpenContext.Provider value={onLoopClick ?? null}>
      <div
        ref={viewportRef}
        className={`flex-1 relative ${viewMode === "summary" ? "overflow-auto bg-gray-50" : "overflow-hidden bg-[#f4f4f4]"}`}
        style={viewMode === "summary" ? undefined : { backgroundImage: "radial-gradient(circle, #c8c8c8 1px, transparent 1px)", backgroundSize: "28px 28px", cursor: isPanning ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={stopPan} onMouseLeave={stopPan}
      >
        <div className="absolute top-3 left-3 z-20 flex bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden text-[11px]">
          <button onClick={() => setViewMode("diagram")} className={`px-2.5 py-1 transition-colors ${viewMode === "diagram" ? "bg-gray-100 text-gray-800 font-medium" : "text-gray-500 hover:bg-gray-50"}`}>Diagram</button>
          <button onClick={() => setViewMode("summary")} className={`px-2.5 py-1 transition-colors ${viewMode === "summary" ? "bg-gray-100 text-gray-800 font-medium" : "text-gray-500 hover:bg-gray-50"}`}>Summary</button>
        </div>
        {viewMode === "summary" && <FlowSummary variant="page" nodes={NODES} edges={EDGES} />}
        {viewMode === "diagram" && (<>
        <div className="absolute bottom-5 left-5 z-20 flex flex-col gap-1">
          {([{ lbl: "+", fn: () => zoomBy(0.1) }, { lbl: "−", fn: () => zoomBy(-0.1) }, { lbl: "↺", fn: () => setTf(initialTransform) }] as { lbl: string; fn: () => void }[]).map(b => (
            <button key={b.lbl} onClick={b.fn} className="w-8 h-8 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 flex items-center justify-center text-gray-600 text-sm font-medium transition-colors">{b.lbl}</button>
          ))}
        </div>
        <div className="absolute bottom-5 left-[3.75rem] z-20 bg-white/90 border border-gray-200 rounded-md shadow-sm px-2 py-1 text-[10px] text-gray-500 font-medium pointer-events-none">{Math.round(tf.scale * 100)}%</div>
        <div style={{ transform: `translate(${tf.x}px, ${tf.y}px) scale(${tf.scale})`, transformOrigin: "0 0", width: CW, height: CH, position: "absolute" }}>
          <svg className="absolute top-0 left-0 overflow-visible pointer-events-none" width={CW} height={CH}>
            {EDGES.map(e => {
              const a = nodeMap[e.from], b = nodeMap[e.to];
              if (!a || !b) return null;
              if (hiddenIds.has(e.from) || hiddenIds.has(e.to)) return null;
              const isSide = e.side === "left" || e.side === "right";
              const sx = a.x + a.w / 2, sy = a.y + a.h;
              const ex = b.x + b.w / 2, ey = b.kind === "condition" ? b.y + b.h : b.y;
              const lx = (sx + ex) / 2, mid = (sy + ey) / 2;
              const ly = isSide ? mid - 5 : (sy + b.y) / 2 - 6;
              return (
                <g key={e.id}>
                  <path d={edgePath(a, b, e.side)} stroke="#000000" strokeWidth={2} fill="none" />
                  {e.v && <text x={lx} y={ly} textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">{e.v === "true" ? "True" : "False"}</text>}
                </g>
              );
            })}
          </svg>
          {groups.map(n => {
            if (hiddenIds.has(n.id)) return null;
            if (inactiveChildIds.has(n.id)) return null;
            const isCollapsed = collapsed.has(n.id);
            const h = isCollapsed ? COLLAPSED_H : n.h;

            if (n.id === INACTIVE_ID) {
              return (
                <div
                  key={n.id}
                  data-node-id={n.id}
                  className="absolute grayscale hover:grayscale-0 hover:opacity-100 transition-[filter,opacity] duration-200"
                  style={{ left: n.x, top: n.y, width: n.w, height: h }}
                >
                  <GroupEl n={n} collapsed={isCollapsed} onToggle={() => toggleCollapse(n.id)} />
                  {!isCollapsed && Array.from(inactiveChildIds).map(id => {
                    const c = nodeMap[id];
                    if (!c) return null;
                    if (hiddenIds.has(c.id)) return null;
                    const cIsCollapsed = collapsed.has(c.id);
                    const ch = c.kind === "group" && cIsCollapsed ? COLLAPSED_H : c.h;
                    return (
                      <div
                        key={c.id}
                        data-node-id={c.id}
                        style={{ position: "absolute", left: c.x - n.x, top: c.y - n.y, width: c.w, height: ch }}
                      >
                        <NodeEl n={c} collapsed={cIsCollapsed} onToggle={() => toggleCollapse(c.id)} />
                      </div>
                    );
                  })}
                </div>
              );
            }

            return (
              <div
                key={n.id}
                data-node-id={n.id}
                style={{ position: "absolute", left: n.x, top: n.y, width: n.w, height: h }}
              >
                <GroupEl n={n} collapsed={isCollapsed} onToggle={() => toggleCollapse(n.id)} />
              </div>
            );
          })}
          {rest.map(n => {
            if (hiddenIds.has(n.id)) return null;
            if (inactiveChildIds.has(n.id)) return null;
            return (
              <div
                key={n.id}
                data-node-id={n.id}
                style={{ position: "absolute", left: n.x, top: n.y, width: n.w, height: n.h }}
              >
                <NodeEl n={n} />
              </div>
            );
          })}
        </div>
        </>)}
      </div>
    </LoopOpenContext.Provider>
    </AddStepContext.Provider>
  );
}

function LoopFlowCanvas({
  initialTransform = { x: 20, y: 16, scale: 0.58 },
}: {
  initialTransform?: { x: number; y: number; scale: number };
}) {
  const [tf, setTf] = useState(initialTransform);
  const [isPanning, setIsPanning] = useState(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"diagram" | "summary">("diagram");
  const [extraSteps, setExtraSteps] = useState<FN[]>([]);
  const { nodes: NODES, edges: EDGES } = useMemo(() => buildLoopFlow(extraSteps), [extraSteps]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (viewMode === "summary") return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setTf(t => {
        const next = Math.min(2, Math.max(0.15, +(t.scale + delta).toFixed(2)));
        return { scale: next, x: mx - (mx - t.x) * (next / t.scale), y: my - (my - t.y) * (next / t.scale) };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [viewMode]);

  const zoomBy = (d: number) =>
    setTf(t => ({ ...t, scale: Math.min(2, Math.max(0.15, +(t.scale + d).toFixed(2))) }));

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (viewMode === "summary") return;
    setIsPanning(true);
    lastMouse.current.x = e.clientX;
    lastMouse.current.y = e.clientY;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current.x = e.clientX;
    lastMouse.current.y = e.clientY;
    setTf(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
  };

  const stopPan = () => setIsPanning(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const toggleCollapse = (id: string) =>
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const handleAddStep = (tool: AddStepItem) => {
    if (tool.name !== "Loop") return;
    setExtraSteps(prev => {
      const lastY = prev.length > 0
        ? prev[prev.length - 1].y + (prev[prev.length - 1].h ?? STEP_H) + STEP_GAP
        : STEP_START_Y;
      const newNode: FN = {
        id: `loop-${Date.now()}`,
        kind: "action",
        x: STEP_CENTER_X - STEP_W / 2,
        y: lastY,
        w: STEP_W,
        h: STEP_H,
        title: "Loop",
        icon: "loop",
      };
      return [...prev, newNode];
    });
  };

  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));
  const groups  = NODES.filter(n => n.kind === "group");
  const rest    = NODES.filter(n => n.kind !== "group");

  const hiddenIds = new Set<string>();
  groups.forEach(g => {
    if (!collapsed.has(g.id)) return;
    NODES.forEach(c => {
      if (c.id === g.id) return;
      const fullyInside =
        c.x >= g.x &&
        c.y >= g.y &&
        c.x + c.w <= g.x + g.w &&
        c.y + c.h <= g.y + g.h;
      if (fullyInside) hiddenIds.add(c.id);
    });
  });
  const COLLAPSED_H = 28;

  const INACTIVE_ID = "grp-thread";
  const inactiveGroup = nodeMap[INACTIVE_ID];
  const inactiveChildIds = new Set<string>();
  if (inactiveGroup) {
    NODES.forEach(c => {
      if (c.id === INACTIVE_ID) return;
      if (
        c.x >= inactiveGroup.x &&
        c.y >= inactiveGroup.y &&
        c.x + c.w <= inactiveGroup.x + inactiveGroup.w &&
        c.y + c.h <= inactiveGroup.y + inactiveGroup.h
      ) inactiveChildIds.add(c.id);
    });
  }

  return (
    <AddStepContext.Provider value={handleAddStep}>
    <LoopOpenContext.Provider value={null}>
      <div
        ref={viewportRef}
        className={`flex-1 relative ${viewMode === "summary" ? "overflow-auto bg-gray-50" : "overflow-hidden bg-[#f4f4f4]"}`}
        style={viewMode === "summary" ? undefined : { backgroundImage: "radial-gradient(circle, #c8c8c8 1px, transparent 1px)", backgroundSize: "28px 28px", cursor: isPanning ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={stopPan} onMouseLeave={stopPan}
      >
        <div className="absolute top-3 left-3 z-20 flex bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden text-[11px]">
          <button onClick={() => setViewMode("diagram")} className={`px-2.5 py-1 transition-colors ${viewMode === "diagram" ? "bg-gray-100 text-gray-800 font-medium" : "text-gray-500 hover:bg-gray-50"}`}>Diagram</button>
          <button onClick={() => setViewMode("summary")} className={`px-2.5 py-1 transition-colors ${viewMode === "summary" ? "bg-gray-100 text-gray-800 font-medium" : "text-gray-500 hover:bg-gray-50"}`}>Summary</button>
        </div>
        {viewMode === "summary" && <FlowSummary variant="page" nodes={NODES} edges={EDGES} />}
        {viewMode === "diagram" && (<>
        <div className="absolute bottom-5 left-5 z-20 flex flex-col gap-1">
          {([{ lbl: "+", fn: () => zoomBy(0.1) }, { lbl: "−", fn: () => zoomBy(-0.1) }, { lbl: "↺", fn: () => setTf(initialTransform) }] as { lbl: string; fn: () => void }[]).map(b => (
            <button key={b.lbl} onClick={b.fn} className="w-8 h-8 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 flex items-center justify-center text-gray-600 text-sm font-medium transition-colors">{b.lbl}</button>
          ))}
        </div>
        <div className="absolute bottom-5 left-[3.75rem] z-20 bg-white/90 border border-gray-200 rounded-md shadow-sm px-2 py-1 text-[10px] text-gray-500 font-medium pointer-events-none">{Math.round(tf.scale * 100)}%</div>
        <div style={{ transform: `translate(${tf.x}px, ${tf.y}px) scale(${tf.scale})`, transformOrigin: "0 0", width: CW, height: CH, position: "absolute" }}>
          <svg className="absolute top-0 left-0 overflow-visible pointer-events-none" width={CW} height={CH}>
            {EDGES.map(e => {
              const a = nodeMap[e.from], b = nodeMap[e.to];
              if (!a || !b) return null;
              if (hiddenIds.has(e.from) || hiddenIds.has(e.to)) return null;
              const isSide = e.side === "left" || e.side === "right";
              const sx = a.x + a.w / 2, sy = a.y + a.h;
              const ex = b.x + b.w / 2, ey = b.kind === "condition" ? b.y + b.h : b.y;
              const lx = (sx + ex) / 2, mid = (sy + ey) / 2;
              const ly = isSide ? mid - 5 : (sy + b.y) / 2 - 6;
              return (
                <g key={e.id}>
                  <path d={edgePath(a, b, e.side)} stroke="#000000" strokeWidth={2} fill="none" />
                  {e.v && <text x={lx} y={ly} textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">{e.v === "true" ? "True" : "False"}</text>}
                </g>
              );
            })}
          </svg>
          {groups.map(n => {
            if (hiddenIds.has(n.id)) return null;
            if (inactiveChildIds.has(n.id)) return null;
            const isCollapsed = collapsed.has(n.id);
            const h = isCollapsed ? COLLAPSED_H : n.h;

            if (n.id === INACTIVE_ID) {
              return (
                <div
                  key={n.id}
                  data-node-id={n.id}
                  className="absolute grayscale hover:grayscale-0 hover:opacity-100 transition-[filter,opacity] duration-200"
                  style={{ left: n.x, top: n.y, width: n.w, height: h }}
                >
                  <GroupEl n={n} collapsed={isCollapsed} onToggle={() => toggleCollapse(n.id)} />
                  {!isCollapsed && Array.from(inactiveChildIds).map(id => {
                    const c = nodeMap[id];
                    if (!c) return null;
                    if (hiddenIds.has(c.id)) return null;
                    const cIsCollapsed = collapsed.has(c.id);
                    const ch = c.kind === "group" && cIsCollapsed ? COLLAPSED_H : c.h;
                    return (
                      <div
                        key={c.id}
                        data-node-id={c.id}
                        style={{ position: "absolute", left: c.x - n.x, top: c.y - n.y, width: c.w, height: ch }}
                      >
                        <NodeEl n={c} collapsed={cIsCollapsed} onToggle={() => toggleCollapse(c.id)} isChild={true} />
                      </div>
                    );
                  })}
                </div>
              );
            }

            return (
              <div
                key={n.id}
                data-node-id={n.id}
                style={{ position: "absolute", left: n.x, top: n.y, width: n.w, height: h }}
              >
                <GroupEl n={n} collapsed={isCollapsed} onToggle={() => toggleCollapse(n.id)} />
              </div>
            );
          })}
          {rest.map(n => {
            if (hiddenIds.has(n.id)) return null;
            if (inactiveChildIds.has(n.id)) return null;
            return (
              <div
                key={n.id}
                data-node-id={n.id}
                style={{ position: "absolute", left: n.x, top: n.y, width: n.w, height: n.h }}
              >
                <NodeEl n={n} isChild={true} />
              </div>
            );
          })}
        </div>
        </>)}
      </div>
    </LoopOpenContext.Provider>
    </AddStepContext.Provider>
  );
}

function LoopFlowDrawer({ open, onClose, nodeId }: { open: boolean; onClose: () => void; nodeId: string | null }) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: "75vw" } } }}
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-teal-500 flex items-center justify-center text-white text-sm font-bold">↻</span>
          <span className="text-sm font-semibold text-gray-800">Loop Flow</span>
          {nodeId && <span className="text-[10px] text-gray-400 font-mono">{nodeId}</span>}
        </div>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <LoopFlowCanvas />
      </div>
    </Drawer>
  );
}

export default function FlowPageV2() {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [loopOpenId, setLoopOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!summaryOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSummaryOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [summaryOpen]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <FlowHeader currentVersion="v2" onToggleSummary={() => setSummaryOpen(o => !o)} summaryOpen={summaryOpen} />
      <FlowCanvas onLoopClick={(id) => setLoopOpenId(id)} />
      <LoopFlowDrawer open={loopOpenId !== null} onClose={() => setLoopOpenId(null)} nodeId={loopOpenId} />
      {summaryOpen && (
        <>
          <div className="fixed inset-0 top-11 bg-black/10 z-30" onClick={() => setSummaryOpen(false)} />
          <aside className="fixed right-0 top-11 bottom-0 w-[420px] bg-white border-l border-gray-200 shadow-xl z-40 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 sticky top-0 bg-white z-10">
              <span className="text-sm font-semibold text-gray-800">Flow Summary</span>
              <button onClick={() => setSummaryOpen(false)} aria-label="Close" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <FlowSummaryStandalone />
          </aside>
        </>
      )}
    </div>
  );
}

function FlowSummaryStandalone() {
  const { nodes, edges } = useMemo(() => buildFlow([]), []);
  return <FlowSummary variant="drawer" nodes={nodes} edges={edges} />;
}

function ChildLoopConfigPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const responseData = {
    order_id: "ORD-1001",
    customer: "John Doe",
    items: [
      {
        userId: 101,
        name: "Alice",
        isActive: true,
        score: 95.5,
        tags: ["premium", "beta-user"],
      },
      {
        userId: 102,
        name: "Bob",
        isActive: false,
        score: 82.3,
        tags: ["free"],
      },
      {
        userId: 103,
        name: "Charlie",
        isActive: true,
        score: null,
        tags: [],
      },
    ],
  };

  const renderJsonLines = (value: any, lineNum: { current: number }): ReactElement[] => {
    const lines: ReactElement[] = [];

    const renderJsonRecursive = (val: any, indent: number) => {
      const indentStr = "  ".repeat(indent);

      if (val === null) {
        lines.push(
          <div key={lineNum.current} className="flex gap-2">
            <span className="text-gray-400 select-none">{lineNum.current}</span>
            <span className="text-blue-600">null</span>
          </div>
        );
        lineNum.current++;
      } else if (typeof val === "boolean") {
        lines.push(
          <div key={lineNum.current} className="flex gap-2">
            <span className="text-gray-400 select-none">{lineNum.current}</span>
            <span className="text-blue-600">{String(val)}</span>
          </div>
        );
        lineNum.current++;
      } else if (typeof val === "number") {
        lines.push(
          <div key={lineNum.current} className="flex gap-2">
            <span className="text-gray-400 select-none">{lineNum.current}</span>
            <span className="text-orange-600">{val}</span>
          </div>
        );
        lineNum.current++;
      } else if (typeof val === "string") {
        lines.push(
          <div key={lineNum.current} className="flex gap-2">
            <span className="text-gray-400 select-none">{lineNum.current}</span>
            <span className="text-red-600">"{val}"</span>
          </div>
        );
        lineNum.current++;
      } else if (Array.isArray(val)) {
        if (val.length === 0) {
          lines.push(
            <div key={lineNum.current} className="flex gap-2">
              <span className="text-gray-400 select-none">{lineNum.current}</span>
              <span>[]</span>
            </div>
          );
          lineNum.current++;
        } else {
          lines.push(
            <div key={lineNum.current} className="flex gap-2">
              <span className="text-gray-400 select-none">{lineNum.current}</span>
              <span>[</span>
            </div>
          );
          lineNum.current++;
          val.forEach((item, idx) => {
            renderJsonRecursive(item, indent + 1);
            if (idx < val.length - 1) {
              const lastLine = lines[lines.length - 1] as ReactElement<JsonLineProps>;
              lines[lines.length - 1] = (
                <div key={lineNum.current - 1} className="flex gap-2">
                  {lastLine.props.children}
                  <span>,</span>
                </div>
              );
            }
          });
          lines.push(
            <div key={lineNum.current} className="flex gap-2">
              <span className="text-gray-400 select-none">{lineNum.current}</span>
              <span>{indentStr}]</span>
            </div>
          );
          lineNum.current++;
        }
      } else if (typeof val === "object") {
        const keys = Object.keys(val);
        if (keys.length === 0) {
          lines.push(
            <div key={lineNum.current} className="flex gap-2">
              <span className="text-gray-400 select-none">{lineNum.current}</span>
              <span>{"{}"}</span>
            </div>
          );
          lineNum.current++;
        } else {
          lines.push(
            <div key={lineNum.current} className="flex gap-2">
              <span className="text-gray-400 select-none">{lineNum.current}</span>
              <span>{indentStr}{"{"}</span>
            </div>
          );
          lineNum.current++;
          keys.forEach((key, idx) => {
            lines.push(
              <div key={lineNum.current} className="flex gap-2">
                <span className="text-gray-400 select-none">{lineNum.current}</span>
                <div style={{ marginLeft: `${(indent + 1) * 12}px` }}>
                  <span className="text-red-600">"{key}"</span>
                  <span>: </span>
                  {typeof val[key] === "object" && val[key] !== null ? (
                    ""
                  ) : val[key] === null ? (
                    <span className="text-blue-600">null</span>
                  ) : typeof val[key] === "boolean" ? (
                    <span className="text-blue-600">{String(val[key])}</span>
                  ) : typeof val[key] === "number" ? (
                    <span className="text-orange-600">{val[key]}</span>
                  ) : typeof val[key] === "string" ? (
                    <span className="text-red-600">"{val[key]}"</span>
                  ) : (
                    ""
                  )}
                  {typeof val[key] !== "object" || val[key] === null ? (
                    <span>{idx < keys.length - 1 ? "," : ""}</span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            );
            lineNum.current++;
            if (typeof val[key] === "object" && val[key] !== null) {
              renderJsonRecursive(val[key], indent + 1);
              const lastIdx = lines.length - 1;
              const lastLineDiv = lines[lastIdx] as ReactElement<JsonLineProps>;
              if (idx < keys.length - 1) {
                lines[lastIdx] = (
                  <div key={lastIdx} className="flex gap-2">
                    {lastLineDiv.props.children}
                    <span>,</span>
                  </div>
                );
              }
            }
          });
          lines.push(
            <div key={lineNum.current} className="flex gap-2">
              <span className="text-gray-400 select-none">{lineNum.current}</span>
              <span>{indentStr}{"}"}</span>
            </div>
          );
          lineNum.current++;
        }
      }
    };

    renderJsonRecursive(value, 0);
    return lines;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 500 } } }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <LoopIcon sx={{ fontSize: 24 }} className="text-blue-700" />
          <span className="text-lg font-semibold text-gray-800">Response Data</span>
        </div>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Response section */}
        <div>
          <div className="flex gap-4 mb-4 border-b border-gray-200">
            <span className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 px-4 py-2">
              RESPONSE
            </span>
          </div>

          {/* Code block */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-xs text-gray-700 overflow-auto max-h-[500px] leading-relaxed">
            {renderJsonLines(responseData, { current: 1 })}
          </div>
        </div>
      </div>
    </Drawer>
  );
}

function LoopConfigPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [runIndividually, setRunIndividually] = useState(true);
  const [selectedKey, setSelectedKey] = useState("Root (No key selected)");
  const [responseTab, setResponseTab] = useState(0);

  const responseData = {
    order_id: "ORD-1001",
    customer: "John Doe",
    items: [
      {
        userId: 101,
        name: "Alice",
        isActive: true,
        score: 95.5,
        tags: ["premium", "beta-user"],
      },
      {
        userId: 102,
        name: "Bob",
        isActive: false,
        score: 82.3,
        tags: ["free"],
      },
      {
        userId: 103,
        name: "Charlie",
        isActive: true,
        score: null,
        tags: [],
      },
    ],
  };

  const dropdownOptions = [
    "Root (No key selected)",
    "items",
    "items[0].tags",
    "items[1].tags",
    "items[2].tags",
  ];

  const getSelectedData = () => {
    if (selectedKey === "Root (No key selected)") {
      return responseData;
    } else if (selectedKey === "items") {
      return responseData.items;
    } else if (selectedKey === "items[0].tags") {
      return responseData.items[0].tags;
    } else if (selectedKey === "items[1].tags") {
      return responseData.items[1].tags;
    } else if (selectedKey === "items[2].tags") {
      return responseData.items[2].tags;
    }
    return responseData;
  };

  const renderJsonLines = (value: any, lineNum: { current: number }): ReactElement[] => {
    const lines: ReactElement[] = [];

    const renderJsonRecursive = (val: any, indent: number) => {
      const indentStr = "  ".repeat(indent);

      if (val === null) {
        lines.push(
          <div key={lineNum.current} className="flex gap-2">
            <span className="text-gray-400 select-none">{lineNum.current}</span>
            <span className="text-blue-600">null</span>
          </div>
        );
        lineNum.current++;
      } else if (typeof val === "boolean") {
        lines.push(
          <div key={lineNum.current} className="flex gap-2">
            <span className="text-gray-400 select-none">{lineNum.current}</span>
            <span className="text-blue-600">{String(val)}</span>
          </div>
        );
        lineNum.current++;
      } else if (typeof val === "number") {
        lines.push(
          <div key={lineNum.current} className="flex gap-2">
            <span className="text-gray-400 select-none">{lineNum.current}</span>
            <span className="text-orange-600">{val}</span>
          </div>
        );
        lineNum.current++;
      } else if (typeof val === "string") {
        lines.push(
          <div key={lineNum.current} className="flex gap-2">
            <span className="text-gray-400 select-none">{lineNum.current}</span>
            <span className="text-red-600">"{val}"</span>
          </div>
        );
        lineNum.current++;
      } else if (Array.isArray(val)) {
        if (val.length === 0) {
          lines.push(
            <div key={lineNum.current} className="flex gap-2">
              <span className="text-gray-400 select-none">{lineNum.current}</span>
              <span>[]</span>
            </div>
          );
          lineNum.current++;
        } else {
          lines.push(
            <div key={lineNum.current} className="flex gap-2">
              <span className="text-gray-400 select-none">{lineNum.current}</span>
              <span>[</span>
            </div>
          );
          lineNum.current++;
          val.forEach((item, idx) => {
            renderJsonRecursive(item, indent + 1);
            if (idx < val.length - 1) {
              const lastLine = lines[lines.length - 1] as ReactElement<JsonLineProps>;
              lines[lines.length - 1] = (
                <div key={lineNum.current - 1} className="flex gap-2">
                  {lastLine.props.children}
                  <span>,</span>
                </div>
              );
            }
          });
          lines.push(
            <div key={lineNum.current} className="flex gap-2">
              <span className="text-gray-400 select-none">{lineNum.current}</span>
              <span>{indentStr}]</span>
            </div>
          );
          lineNum.current++;
        }
      } else if (typeof val === "object") {
        const keys = Object.keys(val);
        if (keys.length === 0) {
          lines.push(
            <div key={lineNum.current} className="flex gap-2">
              <span className="text-gray-400 select-none">{lineNum.current}</span>
              <span>{"{}"}</span>
            </div>
          );
          lineNum.current++;
        } else {
          lines.push(
            <div key={lineNum.current} className="flex gap-2">
              <span className="text-gray-400 select-none">{lineNum.current}</span>
              <span>{indentStr}{"{"}</span>
            </div>
          );
          lineNum.current++;
          keys.forEach((key, idx) => {
            lines.push(
              <div key={lineNum.current} className="flex gap-2">
                <span className="text-gray-400 select-none">{lineNum.current}</span>
                <div style={{ marginLeft: `${(indent + 1) * 12}px` }}>
                  <span className="text-red-600">"{key}"</span>
                  <span>: </span>
                  {typeof val[key] === "object" && val[key] !== null ? (
                    ""
                  ) : val[key] === null ? (
                    <span className="text-blue-600">null</span>
                  ) : typeof val[key] === "boolean" ? (
                    <span className="text-blue-600">{String(val[key])}</span>
                  ) : typeof val[key] === "number" ? (
                    <span className="text-orange-600">{val[key]}</span>
                  ) : typeof val[key] === "string" ? (
                    <span className="text-red-600">"{val[key]}"</span>
                  ) : (
                    ""
                  )}
                  {typeof val[key] !== "object" || val[key] === null ? (
                    <span>{idx < keys.length - 1 ? "," : ""}</span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            );
            lineNum.current++;
            if (typeof val[key] === "object" && val[key] !== null) {
              renderJsonRecursive(val[key], indent + 1);
              const lastIdx = lines.length - 1;
              const lastLineDiv = lines[lastIdx] as ReactElement<JsonLineProps>;
              if (idx < keys.length - 1) {
                lines[lastIdx] = (
                  <div key={lastIdx} className="flex gap-2">
                    {lastLineDiv.props.children}
                    <span>,</span>
                  </div>
                );
              }
            }
          });
          lines.push(
            <div key={lineNum.current} className="flex gap-2">
              <span className="text-gray-400 select-none">{lineNum.current}</span>
              <span>{indentStr}{"}"}</span>
            </div>
          );
          lineNum.current++;
        }
      }
    };

    renderJsonRecursive(value, 0);
    return lines;
  };

  const selectedData = getSelectedData();
  const selectedItemCount = Array.isArray(selectedData) ? selectedData.length : 0;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 500 } } }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <LoopIcon sx={{ fontSize: 24 }} className="text-gray-700" />
          <span className="text-lg font-semibold text-gray-800">Advance Configuration</span>
        </div>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Run flow individually section */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Run flow individually</h3>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold">Note:</span> The flow executes a maximum of 1000 times, with a 1-sec delay between each run.
          </p>

          {/* Toggle */}
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              checked={runIndividually}
              onChange={(e) => setRunIndividually(e.target.checked)}
              className="w-10 h-6 rounded-full appearance-none bg-gray-300 checked:bg-blue-500 cursor-pointer transition-colors"
              style={{
                backgroundImage: runIndividually
                  ? "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"white\"><circle cx=\"18\" cy=\"12\" r=\"5\"/></svg>')"
                  : "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"white\"><circle cx=\"6\" cy=\"12\" r=\"5\"/></svg>')",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <span className="text-sm font-medium text-gray-800">Run flow one by one</span>
          </div>

          {/* Dropdown */}
          <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-lg text-gray-700 focus:outline-none text-sm bg-white ${
              selectedKey === "Root (No key selected)" ? "border-red-500" : "border-blue-500"
            }`}
          >
            {dropdownOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {selectedKey === "Root (No key selected)" ? (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-700 mb-1">⚠️ Invalid Selection</p>
              <p className="text-sm text-red-600">
                The loop cannot execute over an object. The selected key must be an array to iterate through items. Please select a valid array path like "items", "items[0].tags", etc.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600 mt-4">
              Flow will execute <span className="font-semibold">{selectedItemCount}</span> item{selectedItemCount !== 1 ? "s" : ""} for this data.
            </p>
          )}
        </div>

        {/* Response section with tabs */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex gap-4 mb-4 border-b border-gray-200">
            <button
              onClick={() => setResponseTab(0)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                responseTab === 0
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              RESPONSE
            </button>
          </div>

          {/* Code block */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-xs text-gray-700 overflow-auto max-h-[500px] leading-relaxed">
            {renderJsonLines(selectedData, { current: 1 })}
          </div>
        </div>
      </div>
    </Drawer>
  );
}

