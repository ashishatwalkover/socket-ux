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

export default function WorkflowsControlCenter() {
  const router = useRouter();
  const [input, setInput] = useState("");

  const handleCreateFlow = () => {
    if (input.trim()) {
      router.push(`/ai?prompt=${encodeURIComponent(input)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl -z-10" />
      
      <div className="w-full max-w-2xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100/60 border border-violet-200/50">
            <Icon.sparkles className="size-3.5 text-violet-600" />
            <span className="text-xs font-medium text-violet-700">AI-Powered Automation</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-violet-900 to-indigo-900 bg-clip-text text-transparent">
            Build Workflows with AI
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Describe what you want to automate in plain language. Our AI will design and build the workflow for you instantly.
          </p>
        </div>

        {/* Chat Input */}
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/40 to-indigo-500/40 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-75 group-hover:opacity-100" />
            <div className="relative bg-white rounded-3xl border-2 border-violet-300/60 shadow-xl shadow-violet-500/15 flex items-center group-hover:border-violet-400 transition-colors">
              <div className="pl-6 text-violet-500 flex-shrink-0">
                <Icon.sparkles className="size-5" />
              </div>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && input.trim()) {
                    handleCreateFlow();
                  }
                }}
                placeholder="Tell me what you want to automate..."
                className="w-full px-5 py-4 rounded-3xl bg-white focus:outline-none text-base placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>Press</span>
            <kbd className="px-2 py-1 rounded bg-slate-100 border border-slate-200 font-mono text-slate-700">Enter</kbd>
            <span>to create • Or</span>
            <button
              onClick={() => router.push(`${APP_BASE}`)}
              className="text-violet-600 hover:text-violet-700 font-medium transition-colors cursor-pointer"
            >
              build manually
            </button>
          </div>
        </div>

        {/* Flow Type Cards */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          {/* AI Flows Card */}
          <div className="relative rounded-2xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50/60 via-emerald-50/30 to-teal-50/20 p-5 shadow-sm shadow-emerald-500/5">
            <div className="relative space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-slate-900">AI Flows</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">
                    Chat with AI to build your automation instantly
                  </p>
                </div>
                <div className="inline-flex items-center justify-center size-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex-shrink-0 shadow-md shadow-emerald-500/30">
                  <Icon.sparkles className="size-5" />
                </div>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 text-sm">✓</span>
                  <span className="text-xs text-slate-700">No drag-drop needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 text-sm">✓</span>
                  <span className="text-xs text-slate-700">Fastest setup</span>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Flows Card */}
          <div className="relative rounded-2xl border border-indigo-200/50 bg-gradient-to-br from-indigo-50/60 via-indigo-50/30 to-blue-50/20 p-5 shadow-sm shadow-indigo-500/5">
            <div className="relative space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-slate-900">Basic Flows</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">
                    Visual canvas with full control & flexibility
                  </p>
                </div>
                <div className="inline-flex items-center justify-center size-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex-shrink-0 shadow-md shadow-indigo-500/30">
                  <Icon.grid className="size-5" />
                </div>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600 text-sm">✓</span>
                  <span className="text-xs text-slate-700">Drag-drop editor</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600 text-sm">✓</span>
                  <span className="text-xs text-slate-700">If/else conditions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
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
