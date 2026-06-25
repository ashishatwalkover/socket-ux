"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { APP_BASE } from "@/lib/app-routes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VersionSelector } from "@/components/version-selector";

const Icon = {
  search: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
  ),
  folder: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M3 7h5l2 2h11v8a2 2 0 0 1-2 2H3z"/><path d="M3 7V5a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2"/></svg>
  ),
  close: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M18 6L6 18M6 6l12 12"/></svg>
  ),
  play: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}><path d="M8 5v14l11-7z"/></svg>
  ),
  pause: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>
  ),
  edit: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M12 20h9"/><path d="M16.5 3.5l4 4L7 21l-4 1 1-4L16.5 3.5z"/></svg>
  ),
  alert: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M10.3 3.9l-8 13.9A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.2l-8-13.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="1"/></svg>
  ),
  sparkles: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z"/><path d="M19 3l.5 1.5L21 5l-1.5.5L19 7l-.5-1.5L17 5l1.5-.5L19 3z"/></svg>
  ),
  plus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  wand: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 4V2m0 2a10 10 0 1 1-20 0 10 10 0 0 1 20 0z"/><path d="M12 9v6m3-3H9"/>
    </svg>
  ),
  grid: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
};

const RECENT_FLOWS = [
  {
    id: "1",
    name: "Spreadsheet Update Trigger",
    description: "Sheet updated trigger",
    status: "Active",
  },
  {
    id: "2",
    name: "Always True Function",
    description: "All runs failed",
    status: "Active",
  },
  {
    id: "3",
    name: "Cron at 11:55",
    description: "Not triggered yet",
    status: "Active",
  },
  {
    id: "4",
    name: "Master Slide",
    description: "Linear summary of all flows",
    status: "Active",
  },
  {
    id: "5",
    name: "Flow by AI",
    description: "AI-generated workflow",
    status: "AI",
  },
];

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: "home" as const, active: true },
  { key: "flows", label: "Flows", icon: "flows" as const },
  { key: "search", label: "Search", icon: "search" as const, shortcut: "CTRL + K" },
  { key: "connections", label: "Connections", icon: "connections" as const },
  { key: "templates", label: "Templates", icon: "templates" as const },
  { key: "mcp", label: "MCP Server", icon: "link" as const },
  { key: "agent", label: "AI Agent", icon: "agent" as const },
];

const RECENT_WORKFLOWS = [
  { id: "1", name: "Lookup Tasks", status: "Paused", description: "Find tasks with Status = Pending and, if any are…", runs: 0 },
  { id: "2", name: "template_…", status: "Draft", description: "Executes a chosen AI action and returns the…", runs: 0 },
  { id: "3", name: "Automate…", status: "Draft", description: "Sends a welcome email and message, and…", runs: 0 },
  { id: "4", name: "Web Sear…", status: "Draft", description: "This workflow sends your message to an AI for…", runs: 0 },
];

const NavIcon = ({ name, className = "" }: { name: string; className?: string }) => {
  const common = { width: 16, height: 16, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className };
  switch (name) {
    case "home":
      return <svg viewBox="0 0 24 24" {...common}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/></svg>;
    case "flows":
      return <svg viewBox="0 0 24 24" {...common}><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="M6 9v3a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9"/></svg>;
    case "search":
      return <svg viewBox="0 0 24 24" {...common}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case "connections":
      return <svg viewBox="0 0 24 24" {...common}><path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8"/></svg>;
    case "templates":
      return <svg viewBox="0 0 24 24" {...common}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case "link":
      return <svg viewBox="0 0 24 24" {...common}><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 1 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 1 0 7 7l1.5-1.5"/></svg>;
    case "agent":
      return <svg viewBox="0 0 24 24" {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    default:
      return null;
  }
};

export default function WorkflowsControlCenter() {
  const router = useRouter();
  const [input, setInput] = useState("");

  const handleCreateFlow = () => {
    if (input.trim()) {
      router.push(`/ai?prompt=${encodeURIComponent(input)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
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

function OldWorkflowsControlCenter() {
  const router = useRouter();
  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Workflows</h1>
          <VersionSelector />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">CMD + K</Button>
          <Button>Create Flow</Button>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto">
        <Button variant="secondary" className="flex items-center gap-2"><Icon.folder/> All</Button>
        <Button variant="outline" className="flex items-center gap-2"><Icon.folder/> CrowdSourceTrials</Button>
        <Button variant="outline" className="flex items-center gap-2"><Icon.folder/> Customer Support</Button>
        <Button variant="outline" className="flex items-center gap-2"><Icon.folder/> Finance & Accounting</Button>
        <Button variant="outline" className="flex items-center gap-2"><Icon.folder/> Information Tech</Button>
        <Button variant="outline" className="flex items-center gap-2"><Icon.folder/> My-Space</Button>
        <Button variant="outline" className="flex items-center gap-2"><Icon.folder/> One_time</Button>
        <Button variant="outline" className="flex items-center gap-2"><Icon.folder/> Parakh Testing</Button>
      </div>

      <div className="grid grid-cols-5 gap-4 items-stretch">
        <Card className="col-span-1">
          <CardContent className="p-0 h-full">
            <div className="flex items-center h-full px-3 gap-2">
              <Icon.search />
              <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-md text-lg font-bold">
                <Icon.folder />
                <span>All</span>
                <button className="ml-1 text-muted-foreground"><Icon.close/></button>
              </div>
              <input className="flex-1 outline-none text-base" />
            </div>
          </CardContent>
        </Card>

        <Card><CardContent className="p-4 flex items-center gap-2"><Icon.alert/> 3 Errors</CardContent></Card>
        <Card><CardContent className="p-4">⏸ 40 Paused</CardContent></Card>
        <Card><CardContent className="p-4">🧪 120 Unused</CardContent></Card>
        <Card><CardContent className="p-4">✅ 125 Active</CardContent></Card>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        <Button variant="outline">Suyash Singh (531)</Button>
        <Button variant="outline">Naman Tamrakar (82)</Button>
        <Button variant="outline">swapnil soni (52)</Button>
        <Button variant="outline">Chirag Devlani (48)</Button>
        <Button variant="outline">ankita bhatt (42)</Button>
        <Button variant="outline">View All</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4">Name</th>
                <th>Status</th>
                <th>Health</th>
                <th>Runs</th>
                <th>Updated</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => router.push(`${APP_BASE}/flows/1`)}>
                <td className="p-4">
                  <div className="font-medium">Spreadsheet Update Trigger</div>
                  <div className="text-muted-foreground text-xs">Sheet updated trigger</div>
                </td>
                <td><Badge>Active</Badge></td>
                <td>100%</td>
                <td>10</td>
                <td>28m ago</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="icon"><Icon.play/></Button>
                    <Button size="icon"><Icon.pause/></Button>
                    <Button size="icon"><Icon.edit/></Button>
                  </div>
                </td>
              </tr>

              <tr className="border-b cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => router.push(`${APP_BASE}/flows/2`)}>
                <td className="p-4">
                  <div className="font-medium">Always True Function</div>
                  <div className="text-muted-foreground text-xs">All runs failed</div>
                </td>
                <td><Badge>Active</Badge></td>
                <td className="text-red-500">0%</td>
                <td>6</td>
                <td>3d ago</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="icon"><Icon.play/></Button>
                    <Button size="icon"><Icon.alert/></Button>
                    <Button size="icon"><Icon.edit/></Button>
                  </div>
                </td>
              </tr>

              <tr className="border-b cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => router.push(`${APP_BASE}/flows/3`)}>
                <td className="p-4">
                  <div className="font-medium">Cron at 11:55</div>
                  <div className="text-muted-foreground text-xs">Not triggered yet</div>
                </td>
                <td><Badge>Active</Badge></td>
                <td>—</td>
                <td>0</td>
                <td>1d ago</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="icon"><Icon.play/></Button>
                    <Button size="icon"><Icon.edit/></Button>
                  </div>
                </td>
              </tr>

              <tr className="border-b cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => router.push(`${APP_BASE}/master-slide`)}>
                <td className="p-4">
                  <div className="font-medium">Master Slide</div>
                  <div className="text-muted-foreground text-xs">Linear summary of all flows</div>
                </td>
                <td><Badge>Active</Badge></td>
                <td>—</td>
                <td>0</td>
                <td>just now</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="icon"><Icon.play/></Button>
                    <Button size="icon"><Icon.edit/></Button>
                  </div>
                </td>
              </tr>

              <tr className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => router.push(`${APP_BASE}/flow-by-ai`)}>
                <td className="p-4">
                  <div className="flex items-center gap-2 font-medium">
                    Flow by AI
                  </div>
                  <div className="text-muted-foreground text-xs">AI-generated workflow</div>
                </td>
                <td><Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">AI</Badge></td>
                <td>—</td>
                <td>0</td>
                <td>just now</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="icon"><Icon.sparkles/></Button>
                    <Button size="icon"><Icon.edit/></Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  );
}
