"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import LoopIcon from "@mui/icons-material/Loop";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Popover, Typography, Box, Button, Drawer, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CW = 2120;
const CH = 1660;

type NK = "trigger" | "action" | "condition" | "empty" | "group";
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

const NODES: FN[] = [
  { id: "trigger", kind: "trigger", x: 866, y: 40, w: 280, h: 100,
    title: "New Email Matching Search", subtitle: "Every 5 minutes",
    badge: "In Sync", bc: "green", icon: "gmail" },
  { id: "check-email", kind: "action", x: 751, y: 150, w: 510, h: 158,
    title: "check team member email", icon: "robot",
    fields: [
      { k: "email", v: "susan@y...   cc: Susan-side...   check: 0x7f1ca1b0913..." },
      { k: "subject", v: "date: 6 May 2026   n-out: Finance Inbox   id: 0x6f7f7m4b0705..." },
      { k: "sections", v: "Subject: alehod   In-teamManager" },
    ] },
  { id: "if-main", kind: "condition", x: 990, y: 363, w: 32, h: 32 },

  { id: "grp-left", kind: "group", x: 40, y: 450, w: 742, h: 620,
    gl: "is team member replied?", gv: "false", badge: "False" },
  { id: "lookup-2", kind: "action", x: 231, y: 504, w: 360, h: 92,
    title: "Lookup Spreadsheet Rows 2", icon: "sheets",
    badge: "In Sync", bc: "green",
    fields: [
      { k: "With statusQueue", v: "169378e8b30138..." },
      { k: "Output", v: "Lookup_Sp-erch... length" },
    ] },
  { id: "if-left", kind: "condition", x: 395, y: 651, w: 32, h: 32 },
  { id: "grp-rows", kind: "group", x: 55, y: 738, w: 342, h: 280,
    gl: "rows found", gv: "false", badge: "False" },
  { id: "get-row", kind: "action", x: 72, y: 784, w: 308, h: 80,
    title: "get row number", icon: "sheets",
    fields: [
      { k: "With", v: "Lookup_Spreadshe..." },
      { k: "Output", v: "get_row_number" },
    ] },
  { id: "update-row", kind: "action", x: 72, y: 891, w: 308, h: 80,
    title: "Update Spreadsheet row", icon: "sheets",
    badge: "In Sync", bc: "green",
    fields: [{ k: "With record", v: "get_row_number" }] },
  { id: "grp-else-left", kind: "group", x: 417, y: 738, w: 342, h: 280,
    gl: "Else", gv: "true", badge: "True" },
  { id: "empty-else-left", kind: "empty", x: 432, y: 784, w: 310, h: 56,
    title: "Add or drag step here" },

  { id: "grp-right", kind: "group", x: 822, y: 450, w: 1258, h: 860,
    gl: "Flow", gv: "true", badge: "True" },
  { id: "lookup-1", kind: "action", x: 1271, y: 504, w: 360, h: 92,
    title: "Lookup Spreadsheet Rows 1", icon: "sheets",
    badge: "In Sync", bc: "green",
    fields: [
      { k: "With statusQueue", v: "169378..." },
      { k: "Output", v: "Lookup_Spreadshe... data  length" },
    ] },
  { id: "if-right", kind: "condition", x: 1435, y: 651, w: 32, h: 32 },

  { id: "grp-thread", kind: "group", x: 847, y: 738, w: 630, h: 520,
    gl: "Thread exists", gv: "false", badge: "False" },
  { id: "lookup-1b", kind: "action", x: 982, y: 784, w: 360, h: 80,
    title: "Lookup Spreadsheet Rows 1", icon: "sheets",
    badge: "In Sync", bc: "green",
    fields: [{ k: "Output", v: "done" }] },
  { id: "if-thread", kind: "condition", x: 1146, y: 919, w: 32, h: 32 },
  { id: "grp-awaiting", kind: "group", x: 855, y: 1006, w: 328, h: 210,
    gl: "awaiting reply", gv: "false", badge: "False" },
  { id: "send-msg-1", kind: "action", x: 869, y: 1052, w: 300, h: 118,
    title: "Send Message 1", icon: "message",
    badge: "In Sync", bc: "green",
    fields: [
      { k: "With", v: "content: memberName + la-oom: outlook..." },
      { k: "subject", v: "Problem in Work...   date: 9 May 2023..." },
    ] },
  { id: "grp-foo", kind: "group", x: 1204, y: 1006, w: 258, h: 210,
    gl: "Foo", gv: "true", badge: "True" },
  { id: "empty-foo", kind: "empty", x: 1216, y: 1052, w: 230, h: 56,
    title: "Add or drag step here" },

  { id: "grp-else-right", kind: "group", x: 1499, y: 738, w: 556, h: 390,
    gl: "Else", gv: "true", badge: "True" },
  { id: "add-new-row", kind: "action", x: 1597, y: 784, w: 360, h: 80,
    title: "Add New Row to Sheet", icon: "sheets",
    badge: "In Sync", bc: "green",
    fields: [{ k: "With rowContent", v: "Table... 6 May 2023..." }] },
  { id: "send-message", kind: "action", x: 1597, y: 891, w: 360, h: 80,
    title: "Send Message", icon: "message",
    badge: "In Sync", bc: "green",
    fields: [
      { k: "With", v: "content: SusanmcN-ss: — SusanmcN-d..." },
      { k: "subject", v: "Problem in Work...   date: 9 May 2023..." },
    ] },
  { id: "update-sheet-1", kind: "action", x: 1597, y: 998, w: 360, h: 80,
    title: "Update Spreadsheet Row 1", icon: "sheets",
    badge: "In Sync", bc: "green",
    fields: [] },
];

const EDGES: FE[] = [
  { id: "e1",  from: "trigger",    to: "check-email"    },
  { id: "e2",  from: "check-email", to: "if-main"       },
  { id: "e3",  from: "if-main",    to: "grp-left",       v: "true",  side: "left"  },
  { id: "e4",  from: "if-main",    to: "grp-right",      v: "true",  side: "right" },
  { id: "e5",  from: "lookup-2",   to: "if-left"         },
  { id: "e6",  from: "if-left",    to: "grp-rows",       v: "true",  side: "left"  },
  { id: "e7",  from: "if-left",    to: "grp-else-left",  v: "false", side: "right" },
  { id: "e8",  from: "get-row",    to: "update-row"      },
  { id: "e9",  from: "lookup-1",   to: "if-right"        },
  { id: "e10", from: "if-right",   to: "grp-thread",     v: "false", side: "left"  },
  { id: "e11", from: "if-right",   to: "grp-else-right", v: "true",  side: "right" },
  { id: "e12", from: "lookup-1b",  to: "if-thread"       },
  { id: "e13", from: "if-thread",  to: "grp-awaiting",   v: "false", side: "left"  },
  { id: "e14", from: "if-thread",  to: "grp-foo",        v: "false", side: "right" },
  { id: "e15", from: "add-new-row", to: "send-message"   },
  { id: "e16", from: "send-message", to: "update-sheet-1" },
];

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

function LoopIconWithPopover() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const open = Boolean(anchorEl);

  return (
    <>
      <button
        type="button"
        className="hover:text-gray-900"
        title="Refresh"
        onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
        onMouseLeave={() => setAnchorEl(null)}
      >
        <LoopIcon sx={{ fontSize: 16 }} />
      </button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        onMouseEnter={() => setAnchorEl(anchorEl)}
        onMouseLeave={() => setAnchorEl(null)}
      >
        <Box sx={{ p: 2, width: 320 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, textAlign: "center" }}>
            How a Loop Works
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
            <svg width="300" height="210" viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="arrowGreen" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
                <marker id="arrowBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
                </marker>
                {/* Linear motion path: Trigger -> Step -> Complete (top to bottom) */}
                <path id="loopMotion" d="M 195 28 L 195 172" fill="none" />
              </defs>

              {/* Trigger box */}
              <rect x="140" y="10" width="110" height="36" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
              <text x="195" y="33" textAnchor="middle" fontSize="13" fontWeight="600" fill="#065f46">Trigger</text>

              {/* Step box */}
              <rect x="140" y="82" width="110" height="36" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="195" y="105" textAnchor="middle" fontSize="13" fontWeight="600" fill="#1e3a8a">Step</text>

              {/* Complete box */}
              <rect x="140" y="154" width="110" height="36" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="195" y="177" textAnchor="middle" fontSize="13" fontWeight="600" fill="#78350f">Complete</text>

              {/* Forward arrows */}
              <line x1="195" y1="46" x2="195" y2="78" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowGreen)" />
              <line x1="195" y1="118" x2="195" y2="150" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowGreen)" />

              {/* Sample data array on the left */}
              <text x="50" y="14" textAnchor="middle" fontSize="11" fontWeight="600" fill="#6b7280">Data</text>
              <rect x="15" y="20" width="70" height="172" rx="8" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Feeder arrow from array to Trigger */}
              <path d="M 85 28 Q 110 28 140 28" fill="none" stroke="#9ca3af" strokeWidth="1.5" markerEnd="url(#arrowGreen)" />

              {(() => {
                const items = [
                  { letter: "A", color: "#ef4444" },
                  { letter: "B", color: "#f59e0b" },
                  { letter: "C", color: "#10b981" },
                  { letter: "D", color: "#6366f1" },
                ];
                const total = 12;
                return items.map(({ letter, color }, i) => {
                  const start = i * 3;
                  const end = start + 3;
                  const k0 = (start / total).toFixed(4);
                  const k1 = (end / total).toFixed(4);
                  const fillKeyTimes =
                    i === 0 ? `0;${k1};${k1};1` : i === 3 ? `0;${k0};${k0};1` : `0;${k0};${k1};1`;
                  const fillVals =
                    i === 0
                      ? `${color};${color};#f9fafb;#f9fafb`
                      : i === 3
                      ? `#f9fafb;#f9fafb;${color};${color}`
                      : `#f9fafb;${color};#f9fafb;#f9fafb`;
                  const textVals =
                    i === 0
                      ? "#ffffff;#ffffff;#374151;#374151"
                      : i === 3
                      ? "#374151;#374151;#ffffff;#ffffff"
                      : "#374151;#ffffff;#374151;#374151";
                  const y = 28 + i * 40;
                  return (
                    <g key={`arr-${letter}`}>
                      <rect x="25" y={y} width="50" height="32" rx="6" fill="#f9fafb" stroke={color} strokeWidth="1.5">
                        <animate
                          attributeName="fill"
                          dur={`${total}s`}
                          repeatCount="indefinite"
                          calcMode="discrete"
                          keyTimes={fillKeyTimes}
                          values={fillVals}
                        />
                      </rect>
                      <text x="50" y={y + 21} textAnchor="middle" fontSize="14" fontWeight="700" fill="#374151">
                        {letter}
                        <animate
                          attributeName="fill"
                          dur={`${total}s`}
                          repeatCount="indefinite"
                          calcMode="discrete"
                          keyTimes={fillKeyTimes}
                          values={textVals}
                        />
                      </text>
                    </g>
                  );
                });
              })()}

              {/* Animated data items A, B, C, D — each completes the flow sequentially */}
              {[
                { letter: "A", color: "#ef4444" },
                { letter: "B", color: "#f59e0b" },
                { letter: "C", color: "#10b981" },
                { letter: "D", color: "#6366f1" },
              ].map(({ letter, color }, i) => {
                const total = 12; // total cycle in seconds (4 letters × 3s each)
                const start = i * 3;
                const end = start + 3;
                const k0 = (start / total).toFixed(4);
                const k1 = (end / total).toFixed(4);
                // keyTimes: hidden before window, move during, hidden after
                const keyTimes = `0;${k0};${k1};1`;
                const keyPoints = "0;0;1;1";
                // opacity discrete: 1 only during window
                const opacityValues =
                  i === 0
                    ? "1;1;0;0"
                    : i === 3
                    ? "0;0;1;1"
                    : "0;1;0;0";
                const opacityKeyTimes =
                  i === 0
                    ? `0;${k1};${k1};1`
                    : i === 3
                    ? `0;${k0};${k0};1`
                    : `0;${k0};${k1};1`;
                return (
                  <g key={letter}>
                    <circle r="11" fill={color} stroke="#fff" strokeWidth="2" opacity="0">
                      <animateMotion
                        dur={`${total}s`}
                        repeatCount="indefinite"
                        keyTimes={keyTimes}
                        keyPoints={keyPoints}
                      >
                        <mpath href="#loopMotion" />
                      </animateMotion>
                      <animate
                        attributeName="opacity"
                        dur={`${total}s`}
                        repeatCount="indefinite"
                        calcMode="discrete"
                        keyTimes={opacityKeyTimes}
                        values={opacityValues}
                      />
                    </circle>
                    <text textAnchor="middle" dy="4" fontSize="11" fontWeight="700" fill="#fff" opacity="0">
                      {letter}
                      <animateMotion
                        dur={`${total}s`}
                        repeatCount="indefinite"
                        keyTimes={keyTimes}
                        keyPoints={keyPoints}
                      >
                        <mpath href="#loopMotion" />
                      </animateMotion>
                      <animate
                        attributeName="opacity"
                        dur={`${total}s`}
                        repeatCount="indefinite"
                        calcMode="discrete"
                        keyTimes={opacityKeyTimes}
                        values={opacityValues}
                      />
                    </text>
                  </g>
                );
              })}
            </svg>
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.5, textAlign: "center" }}>
            Repeats the flow for every item in your data, then stops.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                setDrawerOpen(true);
                setAnchorEl(null);
              }}
            >
              Enable
            </Button>
          </Box>
        </Box>
      </Popover>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 400 } } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Enable Loop
          </Typography>
          <IconButton size="small" onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            Configure how this trigger iterates over your data. The flow will run once for each item in the source array.
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Data Source
          </Typography>
          <Box
            component="pre"
            sx={{
              bgcolor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 1,
              p: 1.5,
              fontSize: 12,
              fontFamily: "monospace",
              mb: 3,
            }}
          >
{`[
  { "id": "A" },
  { "id": "B" },
  { "id": "C" },
  { "id": "D" }
]`}
          </Box>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Settings
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
            <Typography variant="body2">• Run mode: <strong>Sequential</strong></Typography>
            <Typography variant="body2">• Stop on error: <strong>Yes</strong></Typography>
            <Typography variant="body2">• Max iterations: <strong>1000</strong></Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mt: 4 }}>
            <Button variant="outlined" fullWidth onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" fullWidth onClick={() => setDrawerOpen(false)}>
              Save & Enable
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

function TriggerEl({ n }: { n: FN }) {
  return (
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
      <div className="px-3 py-2 flex flex-col justify-center gap-1.5 flex-1">
        <div className="flex items-center gap-2">
          <AIc k={n.icon} />
          <span className="text-xs font-semibold text-gray-800 leading-tight flex-1">{n.title}</span>
          <MoreMenu />
        </div>
        {n.subtitle && <span className="text-[10px] text-gray-400">{n.subtitle}</span>}
      </div>
    </div>
  );
}

function ActionEl({ n }: { n: FN }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
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

function buildSummary(): SummaryItem[] {
  const groups = NODES.filter(n => n.kind === "group");
  let counter = 1;
  const visit = (parentId: string | null): SummaryItem[] => {
    const direct = NODES.filter(n => {
      if (n.id === parentId) return false;
      if (n.kind === "group") return false;
      const enc = smallestEnclosingGroup(n, groups);
      return (enc?.id ?? null) === parentId;
    }).sort((a, b) => a.y - b.y || a.x - b.x);
    const out: SummaryItem[] = [];
    for (const node of direct) {
      if (node.kind === "condition") {
        const n = counter++;
        const outgoing = EDGES.filter(e => e.from === node.id && e.side);
        const branches = outgoing
          .map(e => {
            const grp = NODES.find(g => g.id === e.to && g.kind === "group");
            if (!grp) return null;
            return { group: grp, items: visit(grp.id) };
          })
          .filter((x): x is { group: FN; items: SummaryItem[] } => Boolean(x));
        out.push({ type: "branch", condition: node, n, branches });
      } else if (node.kind === "empty") {
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

function FlowSummary({ variant }: { variant: "page" | "drawer" }) {
  const items = useMemo(() => buildSummary(), []);
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

function NodeEl({ n, collapsed, onToggle }: { n: FN; collapsed?: boolean; onToggle?: () => void }) {
  switch (n.kind) {
    case "trigger":   return <TriggerEl n={n} />;
    case "action":    return <ActionEl n={n} />;
    case "condition": return <ConditionEl />;
    case "empty":     return <EmptyEl n={n} />;
    case "group":     return <GroupEl n={n} collapsed={collapsed} onToggle={onToggle} />;
  }
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

export default function FlowPageV2() {
  const [tf, setTf] = useState({ x: 20, y: 16, scale: 0.58 });
  const [isPanning, setIsPanning] = useState(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"diagram" | "summary">("diagram");
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    if (!summaryOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSummaryOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [summaryOpen]);

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
    <div className="h-screen flex flex-col overflow-hidden">
      <FlowHeader currentVersion="v2" onToggleSummary={() => setSummaryOpen(o => !o)} summaryOpen={summaryOpen} />
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
        {viewMode === "summary" && <FlowSummary variant="page" />}
        {viewMode === "diagram" && (<>
        <div className="absolute bottom-5 left-5 z-20 flex flex-col gap-1">
          {([{ lbl: "+", fn: () => zoomBy(0.1) }, { lbl: "−", fn: () => zoomBy(-0.1) }, { lbl: "↺", fn: () => setTf({ x: 20, y: 16, scale: 0.58 }) }] as { lbl: string; fn: () => void }[]).map(b => (
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
            <FlowSummary variant="drawer" />
          </aside>
        </>
      )}
    </div>
  );
}
