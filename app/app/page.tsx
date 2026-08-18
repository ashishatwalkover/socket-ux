"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { APP_BASE } from "@/lib/app-routes";
import { HomeVersionSwitcher } from "@/components/home-version-switcher";

const Icon = {
  alert: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M10.3 3.9l-8 13.9A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.2l-8-13.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="1"/></svg>
  ),
  sparkles: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z"/><path d="M19 3l.5 1.5L21 5l-1.5.5L19 7l-.5-1.5L17 5l1.5-.5L19 3z"/></svg>
  ),
};

const RECENT_WORKFLOWS = [
  { id: "1", name: "Lookup Tasks", status: "Paused", description: "Find tasks with Status = Pending and, if any are…", runs: 0 },
  { id: "2", name: "template_…", status: "Draft", description: "Executes a chosen AI action and returns the…", runs: 0 },
  { id: "3", name: "Automate…", status: "Draft", description: "Sends a welcome email and message, and…", runs: 0 },
  { id: "4", name: "Web Sear…", status: "Draft", description: "This workflow sends your message to an AI for…", runs: 0 },
];

export default function WorkflowsControlCenterV2() {
  const router = useRouter();
  const [input, setInput] = useState("");

  const handleCreateFlow = () => {
    if (input.trim()) {
      router.push(`/ai?prompt=${encodeURIComponent(input)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <HomeVersionSwitcher />
      {/* Main */}
      <main className="bg-white overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-10 space-y-10">
          {/* Hero */}
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-slate-900 text-center">
              What should we automate for you?
            </h1>
            <div className="relative max-w-2xl mx-auto">
              <div className="relative bg-white rounded-xl border-2 border-blue-400 shadow-sm">
                <div className="absolute top-3 left-3 text-blue-500">
                  <Icon.sparkles className="size-4" />
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && input.trim()) {
                      e.preventDefault();
                      handleCreateFlow();
                    }
                  }}
                  placeholder="Describe what you want to automate..."
                  rows={3}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white focus:outline-none text-sm placeholder:text-slate-400 resize-none"
                />
                <button
                  onClick={handleCreateFlow}
                  className="absolute bottom-3 right-3 text-slate-400 hover:text-blue-600"
                  title="Send"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                </button>
              </div>
              <div className="mt-3 text-center">
                <span className="text-sm text-slate-500">or</span>
                <button onClick={() => router.push(`${APP_BASE}`)} className="text-sm text-blue-600 hover:text-blue-700 font-medium ml-1 cursor-pointer">
                  build flow manually
                </button>
              </div>
            </div>
          </div>

          {/* WhatsApp Alerts */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Complete your workspace setup</h2>
            <div className="border border-slate-200 rounded-lg p-4 flex items-center gap-3 bg-slate-50/50">
              <div className="size-9 rounded-full flex items-center justify-center flex-shrink-0">
                <img src="https://stuff.thingsofbrand.com/whatsapp.com/images/imga_whatsapp.png" alt="WhatsApp" className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-slate-900">Get critical alerts on WhatsApp</div>
                <div className="text-xs text-slate-600 mt-0.5">Add your WhatsApp number to receive important alerts about your workflows and automations.</div>
              </div>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0 cursor-pointer">
                Add number →
              </button>
            </div>
          </section>

          {/* Expired Connections */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Expired Connections</h2>
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3">
              <div className="size-8 rounded-md bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <Icon.alert className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-slate-900">2 connections need your attention</div>
                <div className="text-xs text-slate-600 mt-0.5">Shopify · HubSpot are expired and pausing 4 flows</div>
              </div>
              <button className="text-sm font-medium text-red-600 hover:text-red-700 flex-shrink-0">Fix now →</button>
            </div>
          </section>

          {/* Recent Workflows */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Recent Workflows</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">All workflows →</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {RECENT_WORKFLOWS.map((wf) => (
                <div key={wf.id} className="border border-slate-200 rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm text-slate-900 truncate">{wf.name}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      wf.status === "Paused" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {wf.status}
                    </span>
                    <button className="text-slate-400 hover:text-slate-600 flex-shrink-0">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-snug">{wf.description}</p>
                  <div className="mt-3 text-xs text-slate-500">Runs <span className="text-slate-900 font-medium">{wf.runs}</span></div>
                </div>
              ))}
            </div>
          </section>

          {/* What's New + Workspace Health */}
          <section className="grid grid-cols-3 gap-4">
            <div className="col-span-2 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">What's New</h3>
                <button className="text-slate-400 hover:text-slate-600">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
                </button>
              </div>
              <div className="mt-3">
                <div className="text-sm font-semibold text-slate-900">Smarter template suggestions</div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Templates now adapt to the apps you've connected and the workflows you've built. Get personalized suggestions that match your stack and save time on common automation patterns.
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-slate-300" />
                  <span className="size-1.5 rounded-full bg-slate-300" />
                  <span className="w-4 h-1.5 rounded-full bg-blue-500" />
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-900">Workspace Health</h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: "80%" }} />
                </div>
                <span className="text-sm font-semibold text-slate-900">80</span>
              </div>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Your workspace is in <span className="font-semibold">good shape</span>. Most flows are running without errors.{" "}
                <button className="text-blue-600 hover:text-blue-700 font-medium">View flows</button>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
