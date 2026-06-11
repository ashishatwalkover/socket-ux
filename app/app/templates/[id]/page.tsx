"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

/* ─── Icons ─── */
const ArrowLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

const SaveIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const NextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* ─── Sample Template Detail Data ─── */
const TEMPLATE_DETAIL = {
  id: "t1",
  title: "Automate Lead Capture to Google Sheets from a Webhook",
  description: "When a new lead arrives via webhook, automatically capture and store it in a Google Sheet for easy tracking and follow-up.",
  apps: [
    { name: "Webhook", color: "bg-emerald-500", letter: "W" },
    { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
  ],
  installs: 46,
  useCase: "Sales",
  steps: [
    {
      id: "s1",
      title: "Trigger: Webhook on new lead",
      app: { name: "Webhook", color: "bg-emerald-500", letter: "W" },
      fields: [
        { label: "Webhook URL", value: "https://hooks.msg91.com/...", type: "text" },
        { label: "Method", value: "POST", type: "select" },
      ],
      configured: true,
    },
    {
      id: "s2",
      title: "Action: Add row to Google Sheets",
      app: { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
      fields: [
        { label: "Spreadsheet", value: "", type: "text", placeholder: "Select a spreadsheet..." },
        { label: "Worksheet", value: "", type: "text", placeholder: "Select a worksheet..." },
        { label: "Row Data", value: "", type: "textarea", placeholder: "Map webhook payload fields..." },
      ],
      configured: false,
    },
    {
      id: "s3",
      title: "Action: Send Slack notification",
      app: { name: "Slack", color: "bg-purple-600", letter: "S" },
      fields: [
        { label: "Channel", value: "", type: "text", placeholder: "#sales or @user" },
        { label: "Message", value: "", type: "textarea", placeholder: "New lead captured!" },
      ],
      configured: false,
    },
  ],
};

/* ─── Components ─── */
function AppBadge({ app }: { app: { name: string; color: string; letter: string } }) {
  return (
    <span
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white",
        app.color
      )}
      title={app.name}
    >
      {app.letter}
    </span>
  );
}

function StepCard({
  step,
  index,
  isActive,
  onClick,
}: {
  step: (typeof TEMPLATE_DETAIL.steps)[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all",
        isActive
          ? "border-violet-300 bg-violet-50/50 shadow-sm"
          : "border-border/70 bg-background hover:bg-muted/40"
      )}
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
          step.configured
            ? "bg-emerald-100 text-emerald-700"
            : isActive
            ? "bg-violet-100 text-violet-700"
            : "bg-muted text-muted-foreground"
        )}
      >
        {step.configured ? "✓" : index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground truncate">{step.title}</span>
      </div>
      <AppBadge app={step.app} />
    </button>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: { label: string; type: string; placeholder?: string; value?: string };
  value: string;
  onChange: (v: string) => void;
}) {
  if (field.type === "textarea") {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">{field.label}</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-y"
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">{field.label}</label>
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-8 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option>POST</option>
            <option>GET</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-foreground">{field.label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
      />
    </div>
  );
}

/* ─── Main Page ─── */
export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [savedSteps, setSavedSteps] = useState<Set<string>>(new Set());
  const [showGoLiveConfirm, setShowGoLiveConfirm] = useState(false);

  const detail = TEMPLATE_DETAIL; // In real app: fetch by id
  const step = detail.steps[activeStep];

  const handleSaveStep = () => {
    setSavedSteps((prev) => new Set(prev).add(step.id));
  };

  const handleNext = () => {
    if (activeStep < detail.steps.length - 1) {
      setActiveStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep((s) => s - 1);
    }
  };

  const allConfigured = detail.steps.every((s) => savedSteps.has(s.id) || s.configured);

  return (
    <div className="min-h-full bg-background">
      {/* ── Sticky Top Bar ── */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => router.push("/app/templates")}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-foreground truncate">{detail.title}</h1>
                {/* Draft chip — ALWAYS visible */}
                <Badge variant="secondary" className="shrink-0 text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                  Draft
                </Badge>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  {detail.apps.map((a) => (
                    <AppBadge key={a.name} app={a} />
                  ))}
                </span>
                <span>•</span>
                <span>{detail.useCase}</span>
                <span>•</span>
                <span>{detail.installs} uses</span>
              </div>
            </div>
          </div>

          {/* Go Live button — always visible, properly placed */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/app/templates")}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!allConfigured}
              onClick={() => setShowGoLiveConfirm(true)}
              className={cn(
                "gap-1.5",
                allConfigured ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
              )}
            >
              <PlayIcon className="size-3.5" />
              Go Live
            </Button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex">
        {/* Left: Step List */}
        <aside className="w-72 shrink-0 border-r border-border p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-120px)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Configure Steps
          </p>
          {detail.steps.map((s, i) => (
            <StepCard
              key={s.id}
              step={s}
              index={i}
              isActive={i === activeStep}
              onClick={() => setActiveStep(i)}
            />
          ))}
        </aside>

        {/* Right: Step Editor */}
        <main className="flex-1 p-6 max-w-3xl">
          {step && (
            <div className="space-y-6">
              {/* Step header */}
              <div className="flex items-center gap-3">
                <AppBadge app={step.app} />
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{step.title}</h2>
                  <p className="text-xs text-muted-foreground">
                    Step {activeStep + 1} of {detail.steps.length}
                  </p>
                </div>
                {savedSteps.has(step.id) && (
                  <Badge variant="secondary" className="ml-auto text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                    Saved
                  </Badge>
                )}
              </div>

              {/* Fields */}
              <div className="space-y-4">
                {step.fields.map((field) => (
                  <FieldEditor
                    key={field.label}
                    field={field}
                    value={fieldValues[`${step.id}-${field.label}`] ?? field.value ?? ""}
                    onChange={(v) =>
                      setFieldValues((prev) => ({
                        ...prev,
                        [`${step.id}-${field.label}`]: v,
                      }))
                    }
                  />
                ))}
              </div>

              {/* Action bar: Save + Next — SEPARATE buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Button variant="outline" size="sm" onClick={handleSaveStep} className="gap-1.5">
                  <SaveIcon className="size-3.5" />
                  Save Step
                </Button>
                <Button
                  size="sm"
                  onClick={handleNext}
                  disabled={activeStep >= detail.steps.length - 1}
                  className="gap-1.5"
                >
                  Next Step
                  <NextIcon className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrev}
                  disabled={activeStep === 0}
                >
                  Previous
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Go Live confirmation modal */}
      {showGoLiveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-background border border-border p-6 shadow-lg">
            <h3 className="text-base font-semibold text-foreground mb-2">Go Live?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              This will activate the workflow and start processing events. All steps have been configured.
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowGoLiveConfirm(false)}>
                Keep Editing
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setShowGoLiveConfirm(false);
                  router.push("/app/templates");
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Yes, Go Live
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
