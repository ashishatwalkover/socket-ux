"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, CircularProgress } from "@mui/material";
import { APP_BASE } from "@/lib/app-routes";
import {
  AppTile,
  BetaTag,
  CapabilityList,
  PRIMARY,
  planFor,
  type AppPlan,
  type CapStatus,
} from "@/components/ai/plug-capabilities";

type Phase = "idle" | "thinking" | "workspace" | "deployed";

const SUGGESTIONS = [
  "Alert my team in Slack when something happens in a channel",
  "Sync new HubSpot contacts and create follow-up tasks",
  "Watch a Google Sheet and act on every new row",
];

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function SparkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9L19 14z" />
    </svg>
  );
}

function BoltIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 align-middle" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-neutral-400"
          style={{ animation: "plugDot 1.1s ease-in-out infinite", animationDelay: `${i * 160}ms` }}
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AiPlugBuilderPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [draft, setDraft] = useState("");
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<AppPlan | null>(null);
  const [search, setSearch] = useState("");
  // Single source of truth: a capability is "selected" iff it has a status.
  const [statuses, setStatuses] = useState<Record<string, CapStatus>>({});
  // Whether the AI is actively provisioning the selected items right now.
  const [building, setBuilding] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isActive = phase !== "idle";
  const locked = phase === "deployed";

  // Selected capabilities, in catalog order.
  const selected = useMemo(
    () => (plan ? plan.capabilities.filter((c) => statuses[c.id]) : []),
    [plan, statuses]
  );
  const createdCount = selected.filter((c) => statuses[c.id] === "created").length;
  // Checked but not built yet — these are what the Build button will create.
  const toBuild = selected.filter((c) => statuses[c.id] === "selected");
  const triggerCreated = selected.filter((c) => c.kind === "trigger" && statuses[c.id] === "created").length;
  const actionCreated = createdCount - triggerCreated;

  function start(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const next = planFor(trimmed);
    setPrompt(trimmed);
    setDraft("");
    setPlan(next);
    // Pre-check the suggested capabilities, but don't build until the user hits Build.
    const initial: Record<string, CapStatus> = {};
    next.capabilities.filter((c) => c.suggested).forEach((c) => (initial[c.id] = "selected"));
    setStatuses(initial);
    setBuilding(false);
    setSearch("");
    setPhase("thinking");
  }

  // thinking -> workspace
  useEffect(() => {
    if (phase !== "thinking") return;
    const t = window.setTimeout(() => setPhase("workspace"), 1200);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Builder loop: once the user hits Build, provision the selected items one at
  // a time, in list order. Turns itself off when there's nothing left to create.
  useEffect(() => {
    if (phase !== "workspace" || !building) return;
    const creating = selected.find((c) => statuses[c.id] === "creating");
    if (creating) {
      const t = window.setTimeout(
        () => setStatuses((s) => ({ ...s, [creating.id]: "created" })),
        1050
      );
      return () => window.clearTimeout(t);
    }
    const nextSelected = selected.find((c) => statuses[c.id] === "selected");
    if (nextSelected) {
      setStatuses((s) => ({ ...s, [nextSelected.id]: "creating" }));
      return;
    }
    setBuilding(false); // all selected items are built
  }, [phase, building, selected, statuses]);

  function toggle(id: string) {
    if (locked || building) return; // don't change the set mid-build
    setStatuses((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id]; // unselect — removes it, even after it's created
      else next[id] = "selected"; // select — but don't build until Build is clicked
      return next;
    });
  }

  function build() {
    if (building || toBuild.length === 0) return;
    setBuilding(true);
  }

  // Open a built item in the full Plug Builder to reconfigure it. The AI chat
  // carries over there as a minimized widget.
  function modify(id: string) {
    if (building || !plan) return;
    const cap = plan.capabilities.find((c) => c.id === id);
    if (!cap) return;
    const query = new URLSearchParams({
      app: plan.app,
      item: cap.name,
      kind: cap.kind,
      prompt,
    });
    router.push(`${APP_BASE}/components/plug-builder?${query.toString()}`);
  }

  function reset() {
    setPhase("idle");
    setPrompt("");
    setPlan(null);
    setStatuses({});
    setBuilding(false);
    setSearch("");
    setDraft("");
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#2f6bff] text-white">
            <BoltIcon className="size-4" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">AI Plug Builder</p>
            <p className="text-[12px] text-neutral-500">Describe it — AI builds the triggers & actions.</p>
          </div>
        </div>
        {isActive && (
          <Button
            onClick={reset}
            variant="outlined"
            size="small"
            sx={{
              textTransform: "none",
              borderColor: "#e5e5e5",
              color: "#525252",
              "&:hover": { borderColor: "#d4d4d4", backgroundColor: "#fafafa" },
            }}
          >
            New plug
          </Button>
        )}
      </header>

      <div className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* -------------------------------------------------------- */}
        {/* Left: prompt / conversation                             */}
        {/* -------------------------------------------------------- */}
        <section className="flex flex-col">
          {!isActive ? (
            <div className="flex flex-1 flex-col justify-center">
              <div className="mb-1 inline-flex items-center gap-2 text-violet-600">
                <SparkIcon className="size-4" />
                <span className="text-[13px] font-medium uppercase tracking-wide">AI builder</span>
              </div>
              <h1 className="text-[26px] font-semibold leading-tight tracking-tight">
                What should this plug do?
              </h1>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">
                Describe the outcome. I&apos;ll pick the app and list the triggers
                and actions — you select what you want, then hit Build.
              </p>

              <div className="mt-6 flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => start(s)}
                    className="group flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-left text-[14px] text-neutral-700 transition-colors hover:border-violet-300 hover:bg-violet-50/40"
                  >
                    <SparkIcon className="size-3.5 shrink-0 text-violet-400 group-hover:text-violet-500" />
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* user prompt bubble */}
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#2f6bff] px-4 py-2.5 text-[14px] font-medium text-white shadow-sm">
                  {prompt}
                </div>
              </div>

              {/* assistant status */}
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                  <SparkIcon className="size-4" />
                </span>
                <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-[14px] leading-relaxed text-neutral-700 shadow-sm ring-1 ring-neutral-200">
                  {phase === "thinking" && (
                    <span className="inline-flex items-center gap-2">
                      Matching your request to <span className="font-medium">{plan?.app}</span>
                      <ThinkingDots />
                    </span>
                  )}
                  {phase === "workspace" && building && (
                    <span className="inline-flex items-center gap-2">
                      Creating your selections — {createdCount} of {selected.length} done
                      <ThinkingDots />
                    </span>
                  )}
                  {phase === "workspace" && !building && createdCount > 0 && (
                    <span>
                      Created{" "}
                      <span className="font-medium">
                        {triggerCreated} trigger{triggerCreated === 1 ? "" : "s"}
                      </span>{" "}
                      and{" "}
                      <span className="font-medium">
                        {actionCreated} action{actionCreated === 1 ? "" : "s"}
                      </span>
                      .{" "}
                      {toBuild.length > 0
                        ? "Hit Build again to create the newly checked ones, or deploy."
                        : "Check more and Build again, or uncheck to remove — deploy when ready."}
                    </span>
                  )}
                  {phase === "workspace" && !building && createdCount === 0 && (
                    <span>
                      Here are <span className="font-medium">{plan?.app}</span> triggers and actions.
                      Pick the ones you want and hit <span className="font-medium">Build</span> — I&apos;ll
                      create them one by one.
                    </span>
                  )}
                  {phase === "deployed" && (
                    <span>
                      Your plug is <span className="font-semibold text-emerald-600">live</span>. I&apos;ll
                      keep the triggers listening and run the actions automatically.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Composer (idle only) */}
          {phase === "idle" && (
            <div className="mt-6">
              <div className="flex items-end gap-2 rounded-2xl border border-neutral-300 bg-white p-2 shadow-sm focus-within:border-[#2f6bff]">
                <textarea
                  ref={inputRef}
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      start(draft);
                    }
                  }}
                  placeholder="e.g. Notify my team in Slack whenever there's a new message in #support"
                  className="min-h-[48px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[14px] leading-relaxed text-neutral-900 outline-none placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => start(draft)}
                  disabled={!draft.trim()}
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#2f6bff] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Find triggers & actions"
                >
                  <ArrowUpIcon className="size-4" />
                </button>
              </div>
              <p className="mt-2 px-1 text-[12px] text-neutral-400">
                Enter to continue · Shift + Enter for a new line
              </p>
            </div>
          )}
        </section>

        {/* -------------------------------------------------------- */}
        {/* Right: one panel — select & build happen together        */}
        {/* -------------------------------------------------------- */}
        <section>
          <div className="sticky top-8 flex max-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            {/* Empty state */}
            {!plan && (
              <div className="flex min-h-[380px] flex-1 flex-col items-center justify-center px-6 text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
                  <BoltIcon className="size-5" />
                </span>
                <p className="mt-4 text-[14px] font-medium text-neutral-600">
                  Triggers &amp; actions appear here
                </p>
                <p className="mt-1 max-w-[240px] text-[13px] text-neutral-400">
                  Describe your automation and I&apos;ll list what this app can do.
                </p>
              </div>
            )}

            {/* Loading skeleton */}
            {plan && phase === "thinking" && (
              <div className="p-4">
                <div className="mb-4 flex items-center gap-2.5">
                  <AppTile app={plan.app} size={32} />
                  <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
                </div>
                <div className="mb-4 h-9 w-full animate-pulse rounded-md bg-neutral-100" />
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="mb-2 flex items-center gap-3 rounded-lg px-2 py-2.5">
                    <div className="size-5 animate-pulse rounded bg-neutral-200" />
                    <div className="size-7 animate-pulse rounded-md bg-neutral-200" />
                    <div className="h-3.5 flex-1 animate-pulse rounded bg-neutral-100" style={{ maxWidth: `${70 - i * 6}%` }} />
                  </div>
                ))}
              </div>
            )}

            {/* App panel — the single list */}
            {plan && phase !== "thinking" && (
              <>
                {/* header */}
                <div className="flex items-center gap-2.5 border-b border-neutral-200 px-4 py-3">
                  <button
                    type="button"
                    onClick={reset}
                    aria-label="Back"
                    className="flex size-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <AppTile app={plan.app} size={30} />
                  <h2 className="text-[17px] font-semibold">{plan.app}</h2>
                  <BetaTag />
                  <span className="ml-auto text-[12px] text-neutral-400">{plan.tagline}</span>
                </div>

                <CapabilityList
                  plan={plan}
                  statuses={statuses}
                  search={search}
                  locked={locked || building}
                  onSearch={setSearch}
                  onToggle={toggle}
                  onModify={modify}
                />

                {/* footer */}
                <div className="flex items-center justify-between gap-3 border-t border-neutral-200 px-4 py-3">
                  {phase === "deployed" ? (
                    <span className="inline-flex w-full items-center justify-between text-[13px]">
                      <span className="text-neutral-500">Live &amp; listening</span>
                      <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
                        <CheckIcon className="size-4" /> Deployed
                      </span>
                    </span>
                  ) : building ? (
                    <span className="inline-flex items-center gap-2 text-[12px] text-neutral-500">
                      <CircularProgress size={13} thickness={5} sx={{ color: PRIMARY }} />
                      Creating {createdCount + 1} of {selected.length}…
                    </span>
                  ) : toBuild.length > 0 ? (
                    <>
                      <span className="text-[12px] text-neutral-500">
                        {toBuild.length} selected
                        {createdCount > 0 ? ` · ${createdCount} already built` : ""}
                      </span>
                      <Button
                        onClick={build}
                        variant="contained"
                        disableElevation
                        startIcon={<BoltIcon className="size-4" />}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          backgroundColor: PRIMARY,
                          "&:hover": { backgroundColor: "#2559d8" },
                        }}
                      >
                        Build {toBuild.length}
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-[12px] text-neutral-500">
                        {createdCount === 0
                          ? "Select triggers & actions, then Build"
                          : `${createdCount} ready · ${triggerCreated} trigger${triggerCreated === 1 ? "" : "s"}, ${actionCreated} action${actionCreated === 1 ? "" : "s"}`}
                      </span>
                      <Button
                        onClick={() => setPhase("deployed")}
                        disabled={createdCount === 0}
                        variant="contained"
                        disableElevation
                        startIcon={<BoltIcon className="size-4" />}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          backgroundColor: PRIMARY,
                          "&:hover": { backgroundColor: "#2559d8" },
                          "&.Mui-disabled": { backgroundColor: "#e5e5e5", color: "#a3a3a3" },
                        }}
                      >
                        Deploy plug
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <style>{`
        @keyframes plugDot {
          0%, 80%, 100% { opacity: 0.35; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}
