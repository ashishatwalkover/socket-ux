"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HomeVersionSwitcher } from "@/components/home-version-switcher";

const LOGO = {
  sheets: "https://stuff.thingsofbrand.com/google.com/images/img4_googlesheet.png",
  slack: "https://stuff.thingsofbrand.com/slack.com/images/img668216333e_slack.jpg",
};

const Sparkle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M12 2l1.8 5.6L19.5 9l-5.7 1.4L12 16l-1.8-5.6L4.5 9l5.7-1.4L12 2z" />
  </svg>
);
const Arrow = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
);
const Check = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6L9 17l-5-5" /></svg>
);

function AppTile({ src, label }: { src: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden shadow-sm">
        <img src={src} alt={label} className="size-6 object-contain" />
      </div>
      <span className="font-medium text-sm text-slate-900">{label}</span>
    </div>
  );
}

type Step = "describe" | "connect" | "configure" | "done";

const STEP_ORDER: Step[] = ["describe", "connect", "configure", "done"];
const STEP_LABELS: Record<Step, string> = {
  describe: "Describe",
  connect: "Connect",
  configure: "Configure",
  done: "Done",
};

const USE_CASE = "When a new row is added in Google Sheets, send a Slack message";

export default function HomeV3() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("describe");
  const [input, setInput] = useState("");
  const [useCase, setUseCase] = useState("");

  const [sheetsConnected, setSheetsConnected] = useState(false);
  const [slackConnected, setSlackConnected] = useState(false);

  const [channel, setChannel] = useState("#general");
  const [message, setMessage] = useState("New row added: {{Name}} — {{Email}}");

  const bothConnected = sheetsConnected && slackConnected;
  const stepIndex = STEP_ORDER.indexOf(step);

  const start = (text: string) => {
    setUseCase(text);
    setStep("connect");
  };

  const reset = () => {
    setStep("describe");
    setInput("");
    setUseCase("");
    setSheetsConnected(false);
    setSlackConnected(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HomeVersionSwitcher />

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-violet-600">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13l0-8z" /></svg>
          </span>
          <span className="text-lg font-bold text-slate-900">ViaSocket</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="size-8 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold flex items-center justify-center">AY</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-6 flex flex-col justify-center">
        {/* Stepper (hidden on the very first step) */}
        {step !== "describe" && (
          <div className="flex items-center justify-center gap-2 mb-10">
            {STEP_ORDER.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 text-xs font-medium ${i <= stepIndex ? "text-violet-700" : "text-slate-400"}`}>
                  <span className={`size-5 rounded-full flex items-center justify-center text-[10px] ${i < stepIndex ? "bg-violet-600 text-white" : i === stepIndex ? "bg-violet-100 text-violet-700 ring-2 ring-violet-300" : "bg-slate-100 text-slate-400"}`}>
                    {i < stepIndex ? <Check width={11} height={11} /> : i + 1}
                  </span>
                  {STEP_LABELS[s]}
                </div>
                {i < STEP_ORDER.length - 1 && <span className="w-6 h-px bg-slate-200" />}
              </div>
            ))}
          </div>
        )}

        {/* STEP 1 — Describe */}
        {step === "describe" && (
          <div className="animate-in fade-in duration-500">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-900 relative inline-block">
                What would you like to do?
                <Sparkle className="absolute -right-6 -top-2 text-violet-500" />
              </h1>
              <p className="mt-4 text-slate-500">Describe it in plain words — we&apos;ll set it up step by step.</p>
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 shadow-sm p-5">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && input.trim()) {
                    e.preventDefault();
                    start(input);
                  }
                }}
                placeholder="E.g. When a new row is added in Google Sheets, send a Slack message"
                rows={2}
                className="w-full resize-none outline-none text-[15px] text-slate-900 placeholder:text-slate-400"
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => start(input)}
                  disabled={!input.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue <Arrow />
                </button>
              </div>
            </div>

            {/* Example use case */}
            <div className="mt-6">
              <div className="text-xs text-slate-400 mb-2">Try an example</div>
              <button
                onClick={() => start(USE_CASE)}
                className="w-full text-left rounded-xl border border-slate-200 p-4 hover:border-violet-300 hover:shadow-sm transition-all flex items-center gap-3"
              >
                <img src={LOGO.sheets} alt="" className="size-5 object-contain" />
                <Arrow className="text-slate-300" />
                <img src={LOGO.slack} alt="" className="size-5 object-contain" />
                <span className="ml-1 text-sm text-slate-700">{USE_CASE}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — Connect */}
        {step === "connect" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="text-2xl font-bold text-slate-900 text-center">Connect your apps</h1>
            <p className="mt-2 text-center text-slate-500 text-sm">{useCase}</p>

            <div className="mt-8 space-y-3">
              {/* Google Sheets */}
              <div className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Trigger</div>
                  <AppTile src={LOGO.sheets} label="Google Sheets" />
                </div>
                <ConnectButton connected={sheetsConnected} onClick={() => setSheetsConnected(true)} />
              </div>
              {/* Slack */}
              <div className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Action</div>
                  <AppTile src={LOGO.slack} label="Slack" />
                </div>
                <ConnectButton connected={slackConnected} onClick={() => setSlackConnected(true)} />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep("describe")} className="text-sm text-slate-500 hover:text-slate-800">← Back</button>
              <button
                onClick={() => setStep("configure")}
                disabled={!bothConnected}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <Arrow />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Configure Slack message */}
        {step === "configure" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="text-2xl font-bold text-slate-900 text-center">What should we send on Slack?</h1>
            <p className="mt-2 text-center text-slate-500 text-sm">This message is sent every time a new row is added.</p>

            <div className="mt-8 rounded-2xl border border-slate-200 p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500">Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                >
                  <option>#general</option>
                  <option>#sales</option>
                  <option>#leads</option>
                  <option>#alerts</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                />
                <p className="mt-1.5 text-xs text-slate-400">Use <code className="text-violet-600">{"{{column}}"}</code> to insert values from the new row.</p>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep("connect")} className="text-sm text-slate-500 hover:text-slate-800">← Back</button>
              <button
                onClick={() => setStep("done")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
              >
                <Sparkle width={14} height={14} /> Activate workflow
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Done */}
        {step === "done" && (
          <div className="animate-in fade-in zoom-in-95 duration-500 text-center">
            <div className="mx-auto size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Check width={30} height={30} />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-slate-900">Task is done! 🎉</h1>
            <p className="mt-3 text-slate-500">
              Your workflow is live. New rows in Google Sheets will now post to <span className="font-medium text-slate-700">{channel}</span>.
            </p>

            <div className="mt-10 text-left">
              <div className="text-sm font-semibold text-slate-900 text-center mb-4">What more would you like to do?</div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { title: "Add a condition", desc: "Only send when a column matches a value." },
                  { title: "Notify by email too", desc: "Send a Gmail message alongside Slack." },
                  { title: "Create another workflow", desc: "Automate a new task from scratch." },
                ].map((s) => (
                  <button
                    key={s.title}
                    onClick={reset}
                    className="w-full text-left rounded-xl border border-slate-200 p-4 hover:border-violet-300 hover:shadow-sm transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-sm text-slate-900">{s.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
                    </div>
                    <Arrow className="text-slate-300" />
                  </button>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button onClick={reset} className="text-sm font-medium text-violet-600 hover:text-violet-700">Start over</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          Your data is secure and private.
        </span>
      </footer>
    </div>
  );
}

function ConnectButton({ connected, onClick }: { connected: boolean; onClick: () => void }) {
  if (connected) {
    return (
      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
        <Check width={14} height={14} /> Connected
      </span>
    );
  }
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 rounded-lg border border-violet-300 text-violet-700 text-sm font-medium hover:bg-violet-50 transition-colors"
    >
      Connect
    </button>
  );
}
