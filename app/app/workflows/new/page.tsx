"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { APP_BASE } from "@/lib/app-routes";

const Icon = {
  save: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
  ),
  play: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}><path d="M8 5v14l11-7z"/></svg>
  ),
  pause: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>
  ),
  trash: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  more: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <circle cx="12" cy="5" r="1.5"/>
      <circle cx="12" cy="12" r="1.5"/>
      <circle cx="12" cy="19" r="1.5"/>
    </svg>
  ),
  plus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  chevronRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  clock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  web: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  zap: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  message: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  database: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  ),
};

const TRIGGERS = [
  { id: "webhook", name: "Webhook", icon: "web", description: "Triggered by HTTP request" },
  { id: "schedule", name: "Schedule", icon: "clock", description: "Run on a schedule" },
  { id: "manual", name: "Manual", icon: "zap", description: "Triggered manually" },
];

const ACTIONS = [
  { id: "send-message", name: "Send Message", icon: "message", description: "Send to Slack, WhatsApp, etc." },
  { id: "database", name: "Database", icon: "database", description: "CRUD operations" },
  { id: "web-request", name: "Web Request", icon: "web", description: "HTTP GET/POST/PUT/DELETE" },
  { id: "transform", name: "Transform", icon: "zap", description: "Transform data" },
];

export default function FlowBuilderPage() {
  const router = useRouter();
  const [flowName, setFlowName] = useState("Untitled Flow");
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);

  const TriggerIcon = ({ name, className = "" }: { name: string; className?: string }) => {
    const iconProps = { width: 18, height: 18, className };
    switch (name) {
      case "web": return <Icon.web {...iconProps} />;
      case "clock": return <Icon.clock {...iconProps} />;
      case "zap": return <Icon.zap {...iconProps} />;
      case "message": return <Icon.message {...iconProps} />;
      case "database": return <Icon.database {...iconProps} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push(`${APP_BASE}/workflows`)}
            className="text-slate-500 hover:text-slate-700"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <input
            type="text"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="text-[15px] font-semibold text-slate-900 bg-transparent border-none focus:outline-none focus:border-b-2 focus:border-blue-500 px-1"
          />
          <span className="text-[11px] text-slate-400">Draft</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-[12px] font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded hover:bg-slate-100 transition-colors">
            <Icon.save className="size-3.5" />
            Save
          </button>
          <button className="flex items-center gap-1.5 text-[12px] font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded hover:bg-slate-100 transition-colors">
            <Icon.play className="size-3.5" />
            Run
          </button>
          <button className="flex items-center gap-1.5 text-[12px] font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded hover:bg-slate-100 transition-colors">
            <Icon.pause className="size-3.5" />
            Pause
          </button>
          <button className="flex items-center gap-1.5 text-[12px] font-medium text-red-600 hover:text-red-700 px-3 py-2 rounded hover:bg-red-50 transition-colors">
            <Icon.trash className="size-3.5" />
            Delete
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1" />
          <button className="text-slate-400 hover:text-slate-600 p-2">
            <Icon.more />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <main className="flex-1 bg-slate-100 overflow-auto relative">
          {/* Dotted Grid background */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `radial-gradient(circle, #cbd5e1 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Canvas content */}
          <div className="relative min-h-full flex flex-col items-center justify-center p-10">
            <div className="text-center space-y-6 max-w-2xl">
              <h2 className="text-[18px] font-semibold text-slate-900">
                Set the starting point for your automation
              </h2>
              
              <button className="bg-white rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 px-6 py-4 inline-flex flex-col items-center justify-center gap-2 transition-colors">
                <span className="text-[13px] font-medium text-slate-600 hover:text-blue-600 transition-colors">
                  Add "Trigger"
                </span>
                <span className="text-[11px] text-slate-400">Choose what starts this automation</span>
              </button>

              <div className="text-[12px] text-slate-600">
                or let AI do it for you.
              </div>

              <div className="relative bg-white rounded-xl border-2 border-blue-400 shadow-sm">
                <div className="absolute top-3.5 left-4 text-blue-500">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z"/><path d="M19 3l.5 1.5L21 5l-1.5.5L19 7l-.5-1.5L17 5l1.5-.5L19 3z"/></svg>
                </div>
                <input
                  type="text"
                  placeholder="Describe what you want to automate..."
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white focus:outline-none text-[13px] placeholder:text-slate-400"
                />
                <button className="absolute bottom-3 right-3 text-slate-400 hover:text-blue-600 transition-colors">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5"/>
                    <polyline points="5 12 12 5 19 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-64 bg-white border-l border-slate-200 flex flex-col">
          <div className="p-3 border-b border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Triggers</div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {TRIGGERS.map((trigger) => (
              <button
                key={trigger.id}
                onClick={() => setSelectedTrigger(trigger.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  selectedTrigger === trigger.id 
                    ? "bg-blue-50 border border-blue-200" 
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className={`size-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                  selectedTrigger === trigger.id ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  <TriggerIcon name={trigger.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[12px] font-medium ${
                    selectedTrigger === trigger.id ? "text-blue-700" : "text-slate-900"
                  }`}>
                    {trigger.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">{trigger.description}</div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-3 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Actions</div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {ACTIONS.map((action) => (
              <button
                key={action.id}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-slate-50 border border-transparent transition-colors"
              >
                <div className="size-8 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                  <TriggerIcon name={action.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-slate-900">{action.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">{action.description}</div>
                </div>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
