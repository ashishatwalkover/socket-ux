"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, CircularProgress, MenuItem, Switch, TextField } from "@mui/material";
import { APP_BASE } from "@/lib/app-routes";
import { BetaTag, CapabilityList, PLANS, useCapabilityBuild } from "@/components/ai/plug-capabilities";

/* ------------------------------------------------------------------ */
/* Dummy data (mock prototype)                                         */
/* ------------------------------------------------------------------ */

type AppMeta = { color: string; letter: string };

const APPS: Record<string, AppMeta> = {
  Slack: { color: "#4A154B", letter: "#" },
  HubSpot: { color: "#FF7A59", letter: "H" },
  "Google Sheets": { color: "#0F9D58", letter: "S" },
};

const PRIMARY = "#2f6bff";

/** Sensible default step names so the canvas always shows a full flow. */
const DEFAULTS: Record<string, { trigger: string; action: string; channels: string[] }> = {
  Slack: {
    trigger: "New Message in Channels",
    action: "Send Channel Message",
    channels: ["#support", "#general", "#revenue", "#random"],
  },
  HubSpot: {
    trigger: "New Contact Created",
    action: "Create Follow-up Task",
    channels: ["Sales pipeline", "Onboarding", "Support"],
  },
  "Google Sheets": {
    trigger: "New Row Added",
    action: "Add Row",
    channels: ["Leads", "Orders", "Signups"],
  },
};

type Slot = "trigger" | "action";

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

function BackIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 18l-6-6 6-6" />
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

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function MinimizeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function AppTile({ app, size = 32 }: { app: string; size?: number }) {
  const meta = APPS[app] ?? APPS.Slack;
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-white"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className="inline-flex items-center justify-center rounded font-bold text-white"
        style={{
          width: size * 0.62,
          height: size * 0.62,
          backgroundColor: meta.color,
          fontSize: size * 0.32,
        }}
      >
        {meta.letter}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function PlugBuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50" />}>
      <PlugBuilder />
    </Suspense>
  );
}

function PlugBuilder() {
  const router = useRouter();
  const params = useSearchParams();

  const app = params.get("app") ?? "Slack";
  const defaults = DEFAULTS[app] ?? DEFAULTS.Slack;
  const item = params.get("item") ?? defaults.trigger;
  const kind = (params.get("kind") as Slot) === "action" ? "action" : "trigger";
  const prompt = params.get("prompt") ?? "";

  // The flow's two steps. The modified item fills its matching slot.
  const steps = useMemo(
    () => ({
      trigger: kind === "trigger" ? item : defaults.trigger,
      action: kind === "action" ? item : defaults.action,
    }),
    [kind, item, defaults]
  );

  const [selected, setSelected] = useState<Slot>(kind);
  const [saved, setSaved] = useState(false);

  function backToAi() {
    router.push(`${APP_BASE}/components/ai-plug-builder`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900">
      {/* Top bar */}
      <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-6 py-3">
        <button
          type="button"
          onClick={backToAi}
          aria-label="Back to AI Plug Builder"
          className="flex size-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <BackIcon className="size-[18px]" />
        </button>
        <AppTile app={app} size={30} />
        <div className="leading-tight">
          <h1 className="text-[15px] font-semibold">{app} plug</h1>
          <p className="text-[12px] text-neutral-500">Plug Builder · editing {kind}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: "none", borderColor: "#e5e5e5", color: "#525252", "&:hover": { borderColor: "#d4d4d4", backgroundColor: "#fafafa" } }}
          >
            Test
          </Button>
          <Button
            variant="contained"
            size="small"
            disableElevation
            startIcon={<BoltIcon className="size-4" />}
            sx={{ textTransform: "none", fontWeight: 600, backgroundColor: PRIMARY, "&:hover": { backgroundColor: "#2559d8" } }}
          >
            Deploy
          </Button>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        {/* ---- Flow canvas ---- */}
        <section>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Flow</p>
          <div className="flex flex-col items-stretch">
            <StepNode
              app={app}
              kind="trigger"
              name={steps.trigger}
              active={selected === "trigger"}
              onClick={() => setSelected("trigger")}
            />
            <div className="ml-[26px] h-6 w-px bg-neutral-300" />
            <StepNode
              app={app}
              kind="action"
              name={steps.action}
              active={selected === "action"}
              onClick={() => setSelected("action")}
            />
          </div>
        </section>

        {/* ---- Config panel ---- */}
        <section>
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-neutral-200 px-5 py-4">
              <AppTile app={app} size={28} />
              <div className="leading-tight">
                <p className="text-[14px] font-semibold">{steps[selected]}</p>
                <p className="text-[12px] text-neutral-500">
                  {selected === "trigger" ? "Trigger" : "Action"} · {app}
                </p>
              </div>
              <span
                className={[
                  "ml-auto rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  selected === "trigger" ? "bg-[#2f6bff]/10 text-[#2f6bff]" : "bg-neutral-100 text-neutral-500",
                ].join(" ")}
              >
                {selected}
              </span>
            </div>

            <div className="flex flex-col gap-4 px-5 py-5">
              <Field label="Connection">
                <TextField select size="small" fullWidth defaultValue="ws-1" sx={fieldSx}>
                  <MenuItem value="ws-1">My {app} workspace</MenuItem>
                  <MenuItem value="ws-2">Connect a new account…</MenuItem>
                </TextField>
              </Field>

              <Field label={selected === "trigger" ? "Trigger event" : "Action"}>
                <TextField size="small" fullWidth value={steps[selected]} slotProps={{ input: { readOnly: true } }} sx={fieldSx} />
              </Field>

              <Field label={app === "Google Sheets" ? "Sheet" : "Channel"}>
                <TextField select size="small" fullWidth defaultValue={defaults.channels[0]} sx={fieldSx}>
                  {defaults.channels.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>
              </Field>

              {selected === "trigger" ? (
                <Field label="Only when text contains" hint="Optional filter">
                  <TextField size="small" fullWidth placeholder="e.g. urgent, refund" sx={fieldSx} />
                </Field>
              ) : (
                <Field label="Message">
                  <TextField
                    multiline
                    minRows={3}
                    size="small"
                    fullWidth
                    defaultValue={"New activity in {{trigger.channel}}:\n{{trigger.text}}"}
                    sx={fieldSx}
                  />
                </Field>
              )}

              <label className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2">
                <span className="text-[13px] text-neutral-700">Run only during business hours</span>
                <Switch defaultChecked size="small" sx={{ "& .Mui-checked": { color: PRIMARY }, "& .Mui-checked + .MuiSwitch-track": { backgroundColor: PRIMARY } }} />
              </label>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-neutral-200 px-5 py-3">
              {saved ? (
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-emerald-600">
                  <CheckIcon className="size-4" /> Changes saved
                </span>
              ) : (
                <span className="text-[12px] text-neutral-500">Editing this step won&apos;t stop the live plug.</span>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={backToAi}
                  size="small"
                  sx={{ textTransform: "none", color: "#525252", "&:hover": { backgroundColor: "#f5f5f5" } }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setSaved(true)}
                  variant="contained"
                  size="small"
                  disableElevation
                  sx={{ textTransform: "none", fontWeight: 600, backgroundColor: PRIMARY, "&:hover": { backgroundColor: "#2559d8" } }}
                >
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Minimized AI chat widget */}
      <ChatWidget app={app} item={item} prompt={prompt} />
    </div>
  );
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: "14px",
    "& fieldset": { borderColor: "#e5e5e5" },
    "&:hover fieldset": { borderColor: "#d4d4d4" },
    "&.Mui-focused fieldset": { borderColor: PRIMARY, borderWidth: "1.5px" },
  },
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <label className="text-[13px] font-medium text-neutral-700">{label}</label>
        {hint && <span className="text-[11px] text-neutral-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function StepNode({
  app,
  kind,
  name,
  active,
  onClick,
}: {
  app: string;
  kind: Slot;
  name: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-3 rounded-xl border bg-white p-3 text-left transition-colors",
        active ? "border-[#2f6bff] ring-1 ring-[#2f6bff]/30" : "border-neutral-200 hover:border-neutral-300",
      ].join(" ")}
    >
      <AppTile app={app} size={30} />
      <div className="min-w-0 flex-1">
        <span
          className={[
            "inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            kind === "trigger" ? "bg-[#2f6bff]/10 text-[#2f6bff]" : "bg-neutral-100 text-neutral-500",
          ].join(" ")}
        >
          {kind}
        </span>
        <p className="mt-1 truncate text-[14px] font-medium">{name}</p>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Minimized AI chat widget                                            */
/* ------------------------------------------------------------------ */

type Msg = { from: "user" | "ai"; text: string };

function ChatWidget({ app, item, prompt }: { app: string; item: string; prompt: string }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Msg[]>(() => {
    const seed: Msg[] = [];
    if (prompt) seed.push({ from: "user", text: prompt });
    seed.push({ from: "ai", text: `Opened “${item}” in the Plug Builder. Tell me what to change, or pick more triggers & actions on the right.` });
    return seed;
  });

  // Integrated triggers & actions list — same builder as the AI Plug Builder.
  const plan = useMemo(() => PLANS[app] ?? PLANS.Slack, [app]);
  const b = useCapabilityBuild(plan, { seedSuggested: true });

  function send() {
    const t = draft.trim();
    if (!t) return;
    setMessages((m) => [
      ...m,
      { from: "user", text: t },
      { from: "ai", text: `Got it — I’ll adjust “${item}” accordingly. Review the config and the triggers & actions, then save.` },
    ]);
    setDraft("");
  }

  // Minimized: a floating pill.
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#2f6bff] py-2.5 pl-3 pr-4 text-[13px] font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-white/20">
          <SparkIcon className="size-3.5" />
        </span>
        AI Plug Builder
        {messages.length > 0 && (
          <span className="ml-0.5 flex size-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#2f6bff]">
            {messages.length}
          </span>
        )}
      </button>
    );
  }

  // Expanded: chat on the left, integrated triggers & actions list on the right.
  return (
    <div className="fixed bottom-5 right-5 z-40 flex h-[480px] w-[min(640px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">
      {/* header */}
      <div className="flex items-center gap-2 border-b border-neutral-200 bg-white px-3 py-2.5">
        <span className="flex size-7 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
          <SparkIcon className="size-4" />
        </span>
        <span className="text-[13px] font-semibold">AI Plug Builder</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Minimize"
          className="ml-auto flex size-7 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
        >
          <MinimizeIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="flex size-7 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
        >
          <CloseIcon className="size-4" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* ---- chat ---- */}
        <div className="flex min-w-0 flex-1 flex-col border-r border-neutral-200">
          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((m, i) =>
              m.from === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[88%] rounded-2xl rounded-br-sm bg-[#2f6bff] px-3 py-2 text-[13px] font-medium text-white">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-600">
                    <SparkIcon className="size-3.5" />
                  </span>
                  <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-neutral-100 px-3 py-2 text-[13px] leading-relaxed text-neutral-700">
                    {m.text}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="border-t border-neutral-200 p-2">
            <div className="flex items-end gap-2 rounded-xl border border-neutral-300 bg-white p-1.5 focus-within:border-[#2f6bff]">
              <textarea
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={`Ask AI to tweak this ${app} step…`}
                className="min-h-[24px] flex-1 resize-none bg-transparent px-1.5 py-1 text-[13px] text-neutral-900 outline-none placeholder:text-neutral-400"
              />
              <button
                type="button"
                onClick={send}
                disabled={!draft.trim()}
                aria-label="Send"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2f6bff] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <SendIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ---- integrated triggers & actions list ---- */}
        <div className="flex w-[290px] shrink-0 flex-col bg-white">
          <div className="flex items-center gap-2 border-b border-neutral-200 px-3 py-2">
            <AppTile app={app} size={22} />
            <span className="text-[13px] font-semibold">{app}</span>
            <BetaTag />
          </div>

          <CapabilityList
            plan={plan}
            statuses={b.statuses}
            search={b.search}
            locked={b.building}
            onSearch={b.setSearch}
            onToggle={b.toggle}
            onModify={b.modify}
          />

          <div className="flex items-center justify-between gap-2 border-t border-neutral-200 px-3 py-2.5">
            {b.building ? (
              <span className="inline-flex items-center gap-2 text-[12px] text-neutral-500">
                <CircularProgress size={12} thickness={5} sx={{ color: PRIMARY }} />
                Creating {b.createdCount + 1} of {b.selected.length}…
              </span>
            ) : b.toBuild.length > 0 ? (
              <>
                <span className="text-[12px] text-neutral-500">{b.toBuild.length} selected</span>
                <Button
                  onClick={b.build}
                  variant="contained"
                  size="small"
                  disableElevation
                  sx={{ textTransform: "none", fontWeight: 600, backgroundColor: PRIMARY, "&:hover": { backgroundColor: "#2559d8" } }}
                >
                  Build {b.toBuild.length}
                </Button>
              </>
            ) : (
              <span className="text-[12px] text-neutral-500">
                {b.createdCount > 0 ? `${b.createdCount} built · ready` : "Select triggers & actions"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
