"use client";

import { Button, CircularProgress } from "@mui/material";
import { PlugBuilderVersionNav } from "@/components/ai/plug-builder-version-nav";
import {
  AppTile,
  BetaTag,
  CapabilityList,
  PLANS,
  PRIMARY,
  useCapabilityBuild,
} from "@/components/ai/plug-capabilities";

function BoltIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
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

/* ------------------------------------------------------------------ */
/* v1 — starts with the capability-selection panel only.               */
/* The surrounding layout will be defined later.                       */
/* ------------------------------------------------------------------ */

export default function AiPlugBuilderV1Page() {
  const plan = PLANS.HubSpot;
  const {
    statuses,
    building,
    search,
    setSearch,
    selected,
    createdCount,
    toBuild,
    triggerCreated,
    actionCreated,
    toggle,
    modify,
    build,
  } = useCapabilityBuild(plan, { seedSuggested: true });

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
        <PlugBuilderVersionNav current="v1" />
      </header>

      {/* Capability-selection panel */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <section>
          <div className="flex max-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            {/* panel header */}
            <div className="flex items-center gap-2.5 border-b border-neutral-200 px-4 py-3">
              <AppTile app={plan.app} size={30} />
              <h2 className="text-[17px] font-semibold">{plan.app}</h2>
              <BetaTag />
              <span className="ml-auto text-[12px] text-neutral-400">{plan.tagline}</span>
            </div>

            <CapabilityList
              plan={plan}
              statuses={statuses}
              search={search}
              locked={building}
              onSearch={setSearch}
              onToggle={toggle}
              onModify={modify}
            />

            {/* footer */}
            <div className="flex items-center justify-between gap-3 border-t border-neutral-200 px-4 py-3">
              {building ? (
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
                <span className="inline-flex w-full items-center justify-between text-[13px]">
                  <span className="text-neutral-500">
                    {createdCount === 0
                      ? "Select triggers & actions, then Build"
                      : `${createdCount} ready · ${triggerCreated} trigger${triggerCreated === 1 ? "" : "s"}, ${actionCreated} action${actionCreated === 1 ? "" : "s"}`}
                  </span>
                  {createdCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
                      <CheckIcon className="size-4" /> Built
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
