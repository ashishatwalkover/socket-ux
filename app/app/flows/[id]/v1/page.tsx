"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

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
  { id: "trigger", kind: "trigger", x: 866, y: 40, w: 280, h: 68,
    title: "New Email Matching Search - two", subtitle: "Every 5 minutes",
    icon: "gmail" },
  { id: "check-email", kind: "action", x: 751, y: 150, w: 510, h: 110,
    title: "check team member email", icon: "robot",
    fields: [
      { k: "email", v: "susan@y..." },
      { k: "subject", v: "Finance Inbox" },
    ] },
  { id: "if-main", kind: "condition", x: 990, y: 310, w: 32, h: 32 },

  { id: "grp-left", kind: "group", x: 40, y: 400, w: 742, h: 300,
    gl: "is team member replied?", gv: "false" },
  { id: "lookup-2", kind: "action", x: 231, y: 454, w: 360, h: 80,
    title: "Lookup Spreadsheet Rows 2", icon: "sheets",
    badge: "Update available", bc: "blue",
    fields: [{ k: "With statusQueue", v: "169378e8b30138..." }] },
  { id: "empty-left-bottom", kind: "empty", x: 231, y: 554, w: 360, h: 56,
    title: "Add or drag step here" },

  { id: "grp-right", kind: "group", x: 822, y: 400, w: 740, h: 300,
    gl: "Flow", gv: "true" },
  { id: "lookup-1", kind: "action", x: 900, y: 454, w: 360, h: 80,
    title: "Lookup Spreadsheet Rows 1", icon: "sheets",
    badge: "Update available", bc: "blue",
    fields: [{ k: "With statusQueue", v: "169378..." }] },
  { id: "empty-right-bottom", kind: "empty", x: 900, y: 554, w: 360, h: 56,
    title: "Add or drag step here" },
];

const EDGES: FE[] = [
  { id: "e1", from: "trigger",    to: "check-email" },
  { id: "e2", from: "check-email", to: "if-main"   },
  { id: "e3", from: "if-main",    to: "grp-left",   v: "false", side: "left"  },
  { id: "e4", from: "if-main",    to: "grp-right",  v: "true",  side: "right" },
  { id: "e5", from: "lookup-2",   to: "empty-left-bottom" },
  { id: "e6", from: "lookup-1",   to: "empty-right-bottom" },
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
  "grp-left":  { bg: "rgba(239,68,68,0.07)",  bd: "#ef4444" },
  "grp-right": { bg: "rgba(139,92,246,0.07)", bd: "#8b5cf6" },
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
      <button onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }} className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
        <svg width="12" height="12" viewBox="0 0 4 16" fill="currentColor">
          <circle cx="2" cy="2" r="1.5"/><circle cx="2" cy="8" r="1.5"/><circle cx="2" cy="14" r="1.5"/>
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[130px]">
          {[
            { label: "Edit",      icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>, cls: "text-gray-700" },
            { label: "Duplicate", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>, cls: "text-gray-700" },
            { label: "Delete",    icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>, cls: "text-red-500" },
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

function TriggerEl({ n }: { n: FN }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full px-3 py-2 flex flex-col justify-center gap-1.5">
      <div className="flex items-center gap-2">
        <AIc k={n.icon} />
        <span className="text-xs font-semibold text-gray-800 leading-tight flex-1">{n.title}</span>
        <MoreMenu />
      </div>
      {n.subtitle && <span className="text-[10px] text-gray-400">{n.subtitle}</span>}
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
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      {n.title}
    </div>
  );
}

function GroupEl({ n }: { n: FN }) {
  const c = GROUP_BG[n.id] ?? { bg: "rgba(148,163,184,0.07)", bd: "rgba(148,163,184,0.28)" };
  return (
    <div className="w-full h-full relative border-2" style={{ backgroundColor: c.bg, borderColor: c.bd }}>
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
        {n.gl && (
          <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm px-2 py-0.5 rounded-sm">
            <span className="text-[8px] font-bold bg-blue-500 text-white px-1 py-0.5 rounded leading-none">IF</span>
            <span className="text-[10px] font-medium text-gray-700">{n.gl}</span>
            <MoreMenu />
          </span>
        )}
      </div>
      <button className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add or drag step here
      </button>
    </div>
  );
}

function NodeEl({ n }: { n: FN }) {
  switch (n.kind) {
    case "trigger":   return <TriggerEl n={n} />;
    case "action":    return <ActionEl n={n} />;
    case "condition": return <ConditionEl />;
    case "empty":     return <EmptyEl n={n} />;
    case "group":     return <GroupEl n={n} />;
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
  const selected = VERSIONS.find(v => v.v === currentVersion) ?? VERSIONS[2];

  const handleSelect = (ver: typeof VERSIONS[0]) => {
    setOpen(false);
    const base = pathname.replace(/\/(v1|v2)$/, "");
    router.push(ver.v === "v3" ? base : `${base}/${ver.v}`);
  };

  return (
    <div className="relative flex-shrink-0" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }} tabIndex={-1}>
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-600 px-2.5 py-1 rounded font-medium hover:bg-gray-50 transition-colors">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        {selected.v}
        <span className="text-[9px] font-semibold px-1 py-0.5 rounded leading-none bg-gray-100 text-gray-500">
          {selected.label}
        </span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
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

function FlowHeader({ currentVersion }: { currentVersion: string }) {
  return (
    <header className="flex items-center h-11 px-4 border-b border-gray-200 bg-white gap-3 flex-shrink-0 shadow-sm z-10">
      <nav className="flex items-center gap-1 text-sm text-gray-500">
        <Link href="/app" className="hover:text-gray-700 transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="cursor-pointer hover:text-gray-700 transition-colors">Client Flows</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Partnership email tracking</span>
        <span className="ml-1.5 text-[10px] bg-gray-400 text-white px-1.5 py-0.5 rounded-full font-semibold leading-none">
          DRAFT
        </span>
      </nav>
      <div className="flex items-center gap-2 ml-auto">
        <VersionDropdown currentVersion={currentVersion} />
        <button className="flex items-center gap-1 text-xs border border-blue-300 text-blue-600 px-2.5 py-1 rounded font-medium hover:bg-blue-50 transition-colors">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9"/><path d="M16.5 3.5l4 4L7 21l-4 1 1-4L16.5 3.5z"/>
          </svg>
          EDITING
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div className="flex border border-gray-200 rounded overflow-hidden text-xs">
          <button className="px-3 py-1 bg-white font-semibold text-gray-800 border-b-2 border-blue-500">FLOW</button>
          <button className="px-3 py-1 text-gray-500 hover:bg-gray-50 transition-colors">LOG</button>
        </div>
        <button className="text-xs border border-red-200 text-red-500 px-2.5 py-1 rounded hover:bg-red-50 transition-colors font-medium">DISCARD CHANGES</button>
        <button className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded hover:bg-blue-700 transition-colors font-medium flex items-center gap-1">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          PUBLISH CHANGES
        </button>
        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600 ml-1 flex-shrink-0">A</div>
      </div>
    </header>
  );
}

export default function FlowPageV1() {
  const [tf, setTf] = useState({ x: 20, y: 16, scale: 0.58 });
  const [isPanning, setIsPanning] = useState(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
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
  }, []);

  const zoomBy = (d: number) =>
    setTf(t => ({ ...t, scale: Math.min(2, Math.max(0.15, +(t.scale + d).toFixed(2))) }));

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
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
  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));
  const groups  = NODES.filter(n => n.kind === "group");
  const rest    = NODES.filter(n => n.kind !== "group");

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <FlowHeader currentVersion="v1" />
      <div
        ref={viewportRef}
        className="flex-1 relative overflow-hidden bg-[#f4f4f4]"
        style={{ backgroundImage: "radial-gradient(circle, #c8c8c8 1px, transparent 1px)", backgroundSize: "28px 28px", cursor: isPanning ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={stopPan} onMouseLeave={stopPan}
      >
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
          {groups.map(n => (
            <div key={n.id} data-node-id={n.id} style={{ position: "absolute", left: n.x, top: n.y, width: n.w, height: n.h }}><NodeEl n={n} /></div>
          ))}
          {rest.map(n => (
            <div key={n.id} data-node-id={n.id} style={{ position: "absolute", left: n.x, top: n.y, width: n.w, height: n.h }}><NodeEl n={n} /></div>
          ))}
        </div>
      </div>
    </div>
  );
}
