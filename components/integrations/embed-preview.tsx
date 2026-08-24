"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { cn } from "@/lib/utils";

/* ─────────────────────────────── Icons ─────────────────────────────── */
const PlusIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
);
const DotsIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...p}><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></svg>
);
const BookIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
);

/* ─────────────────────────────── Data ──────────────────────────────── */
type Status = "active" | "paused" | "draft";
type Integration = { id: string; name: string; status: Status; icon: string };

/* A deliberately long enabled list (24) so the "primary action buried below a
   long list" problem — and its fix (sticky toolbar + search) — are visible. */
const ENABLED: Integration[] = [
  { id: "e1", name: "Corporate Offsite - TARK - Aug 2026", status: "active", icon: "📘" },
  { id: "e2", name: "New Comments on Wordpress", status: "paused", icon: "📝" },
  { id: "e3", name: "New Comments on Wordpress 2", status: "paused", icon: "📝" },
  { id: "e4", name: "New Comments on Wordpress 4", status: "paused", icon: "📝" },
  { id: "e5", name: "New Form Submission on Elementor", status: "paused", icon: "🧩" },
  { id: "e6", name: "New Form Submission on Elementor 2", status: "paused", icon: "🧩" },
  ...[10, 12, 13, 15, 16, 17, 18, 19, 2, 22, 3, 31, 33, 35, 37, 38, 39, 42].map((n) => ({
    id: `fb${n}`,
    name: `New Lead Arrives on Facebook Lead Ads ${n}`,
    status: "active" as Status,
    icon: "📘",
  })),
];

const CUSTOMIZED: Integration[] = [
  { id: "c1", name: "js code", status: "active", icon: "🤖" },
  { id: "c2", name: "[Untitled] Flow", status: "draft", icon: "💬" },
  { id: "c3", name: "[Untitled] Flow", status: "draft", icon: "📊" },
  { id: "c4", name: "[Untitled] Flow", status: "draft", icon: "✉️" },
];

type RunStatus = "success" | "failed";
type HistoryRun = { id: string; ago: string; clock: string; app: string; icon: string; status: RunStatus };

const HISTORY: HistoryRun[] = [
  { id: "h1", ago: "3m", clock: "15:33", app: "Facebook Lead Ads", icon: "📘", status: "success" },
  { id: "h2", ago: "14m", clock: "15:23", app: "Facebook Lead Ads", icon: "📘", status: "success" },
  { id: "h3", ago: "16m", clock: "15:21", app: "Facebook Lead Ads", icon: "📘", status: "success" },
  { id: "h4", ago: "16m", clock: "15:20", app: "Facebook Lead Ads", icon: "📘", status: "failed" },
  { id: "h5", ago: "19m", clock: "15:18", app: "Facebook Lead Ads", icon: "📘", status: "failed" },
  { id: "h6", ago: "19m", clock: "15:17", app: "Facebook Lead Ads", icon: "📘", status: "success" },
  { id: "h7", ago: "19m", clock: "15:18", app: "Facebook Lead Ads", icon: "📘", status: "failed" },
  { id: "h8", ago: "19m", clock: "15:17", app: "Facebook Lead Ads", icon: "📘", status: "failed" },
  { id: "h9", ago: "20m", clock: "15:17", app: "Facebook Lead Ads", icon: "📘", status: "failed" },
  { id: "h10", ago: "27m", clock: "15:09", app: "Facebook Lead Ads", icon: "📘", status: "success" },
  { id: "h11", ago: "33m", clock: "15:04", app: "Facebook Lead Ads", icon: "📘", status: "success" },
  { id: "h12", ago: "36m", clock: "15:00", app: "Facebook Lead Ads", icon: "📘", status: "success" },
  { id: "h13", ago: "43m", clock: "14:54", app: "Facebook Lead Ads", icon: "📘", status: "success" },
  { id: "h14", ago: "53m", clock: "14:43", app: "Facebook Lead Ads", icon: "📘", status: "failed" },
  { id: "h15", ago: "55m", clock: "14:42", app: "Facebook Lead Ads", icon: "📘", status: "success" },
  { id: "h16", ago: "1h", clock: "14:32", app: "Facebook Lead Ads", icon: "📘", status: "failed" },
];

const STATS = [
  { value: "2,200+", label: "Available Apps" },
  { value: "100%", label: "Secure" },
  { value: "24/7", label: "Support" },
];

/* ─────────────────────────────── Pieces ────────────────────────────── */
function StatusMark({ status }: { status: Status }) {
  if (status === "active") return <span className="size-2 shrink-0 rounded-full bg-green-500" aria-label="Active" />;
  if (status === "paused")
    return <Chip label="Paused" size="small" sx={{ height: 20, bgcolor: "#fff7ed", color: "#c2410c", fontWeight: 600, fontSize: "0.68rem", "& .MuiChip-label": { px: 1 } }} />;
  return <Chip label="Draft" size="small" sx={{ height: 20, bgcolor: "#f3f4f6", color: "#4b5563", fontWeight: 600, fontSize: "0.68rem", "& .MuiChip-label": { px: 1 } }} />;
}

function RunStatusChip({ status }: { status: RunStatus }) {
  const ok = status === "success";
  return (
    <Chip
      label={status}
      size="small"
      variant="outlined"
      sx={{
        height: 22,
        borderRadius: 999,
        fontWeight: 600,
        fontSize: "0.72rem",
        color: ok ? "#15803d" : "#b91c1c",
        borderColor: ok ? "#86efac" : "#fca5a5",
        bgcolor: "#fff",
        "& .MuiChip-label": { px: 1.25 },
      }}
    />
  );
}

function HistoryTable() {
  return (
    <div className="overflow-x-auto">
      <Table
        size="small"
        sx={{
          "& td, & th": { borderColor: "#f3f4f6" },
          "& th": { fontWeight: 700, color: "#111827", fontSize: "0.9rem" },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>App</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {HISTORY.map((r) => (
            <TableRow key={r.id} hover>
              <TableCell sx={{ whiteSpace: "nowrap", color: "#374151" }}>
                {r.ago}, {r.clock}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{r.icon}</span>
                  <span className="text-gray-700">New Lead Submitted on {r.app}</span>
                </div>
              </TableCell>
              <TableCell>
                <RunStatusChip status={r.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function IntegrationCard({ item, menu }: { item: Integration; menu?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 transition-colors hover:border-gray-300">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-gray-50 text-base">{item.icon}</span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800">{item.name}</span>
      <StatusMark status={item.status} />
      {menu && <span className="shrink-0 text-gray-300"><DotsIcon /></span>}
    </div>
  );
}

function SectionHeading({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <h4 className="text-sm font-semibold text-gray-900">{children}</h4>
      {count != null && (
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">{count}</span>
      )}
    </div>
  );
}

/* ─────────────────────────── Main preview ──────────────────────────── */
export function EmbedIntegrationsPreview({ title, subtitle }: { title: string; subtitle: string }) {
  const [tab, setTab] = useState<"integrations" | "history">("integrations");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const enabled = useMemo(
    () => (q ? ENABLED.filter((i) => i.name.toLowerCase().includes(q)) : ENABLED),
    [q]
  );
  // Search earns its place only once the list is long enough to get unwieldy.
  const showSearch = ENABLED.length > 8;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* ── Sticky toolbar: tabs + the ALWAYS-visible primary action ── */}
      <div className="shrink-0 border-b border-gray-100 bg-white/90 px-6 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3">
          <ToggleButtonGroup
            size="small"
            exclusive
            value={tab}
            onChange={(_, v) => v && setTab(v)}
            sx={{
              bgcolor: "#f3f4f6",
              borderRadius: 1.5,
              p: 0.5,
              "& .MuiToggleButton-root": {
                border: 0,
                textTransform: "none",
                px: 2,
                py: 0.5,
                borderRadius: "6px !important",
                color: "#6b7280",
                fontWeight: 600,
                "&.Mui-selected": { bgcolor: "#fff", color: "#111827", boxShadow: "0 1px 2px rgba(0,0,0,0.08)", "&:hover": { bgcolor: "#fff" } },
              },
            }}
          >
            <ToggleButton value="integrations">Integrations</ToggleButton>
            <ToggleButton value="history">History</ToggleButton>
          </ToggleButtonGroup>

          <div className="ml-auto flex items-center gap-3">
            <Button variant="text" size="small" startIcon={<BookIcon />} sx={{ color: "#2563eb", fontWeight: 600 }}>
              Learn How to Integrate
            </Button>
            {/* The fix: primary CTA pinned here, never scrolls out of reach. */}
            <Button variant="contained" startIcon={<PlusIcon />} sx={{ bgcolor: "#2563eb", fontWeight: 600, "&:hover": { bgcolor: "#1d4ed8" } }}>
              New Integration
            </Button>
          </div>
        </div>

        {(title.trim() || subtitle.trim()) && tab === "integrations" && (
          <div className="mt-3">
            {title.trim() && <p className="text-sm font-semibold text-gray-900">{title.trim()}</p>}
            {subtitle.trim() && <p className="mt-0.5 text-xs text-gray-500">{subtitle.trim()}</p>}
          </div>
        )}
      </div>

      {/* ── Scroll area ── */}
      <div className="min-h-0 flex-1 overflow-auto px-6 py-5">
        {tab === "history" ? (
          <HistoryTable />
        ) : (
          <>
            {/* Enabled */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <SectionHeading count={ENABLED.length}>Enabled Integrations</SectionHeading>
              {showSearch && (
                <TextField
                  size="small"
                  placeholder="Search integrations…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full sm:w-64"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <span className="mr-1.5 text-gray-400">
                          <SearchIcon />
                        </span>
                      ),
                    },
                  }}
                />
              )}
            </div>

            {enabled.length === 0 ? (
              <p className="rounded-lg border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-400">
                No integrations match “{query}”.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {enabled.map((i) => (
                  <IntegrationCard key={i.id} item={i} />
                ))}
              </div>
            )}

            {/* Customized */}
            <div className="mt-7">
              <SectionHeading count={CUSTOMIZED.length}>Customized Integrations</SectionHeading>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {CUSTOMIZED.map((i) => (
                  <IntegrationCard key={i.id} item={i} menu />
                ))}
                {/* Secondary, discoverable add path — no longer the only way in. */}
                <button
                  type="button"
                  className="flex items-center gap-2.5 rounded-lg border border-dashed border-gray-300 px-3 py-2.5 text-left transition-colors hover:border-gray-400 hover:bg-gray-50"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-500">
                    <PlusIcon />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-gray-800">Add new Custom Integration</span>
                    <span className="block truncate text-xs text-gray-400">Advanced steps, logic, delays &amp; more</span>
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Sticky trust bar ── */}
      <div className="grid shrink-0 grid-cols-3 border-t border-gray-100 bg-white">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center py-3">
            <span className="text-lg font-bold text-gray-900">{s.value}</span>
            <span className="text-xs text-gray-400">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
