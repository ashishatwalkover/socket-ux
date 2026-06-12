"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, Button as MuiButton, Popover } from "@mui/material";

/* ─── Types ─── */
type TemplateApp = { name: string; color: string; letter: string };

type WorkflowStep = {
  label: string;
  app: string;
  iconKind?: "schedule" | "filter" | "ai" | "default";
};

type FlowPreviewIcon = "schedule" | "arrow" | "ai" | "filter";

type Template = {
  id: string;
  title: string;
  apps: TemplateApp[];
  installs: number;
  useCase: string;
  chips?: string[];
  description?: string;
  displayTitle?: string;
  workflowSteps?: WorkflowStep[];
  flowPreviewIcons?: FlowPreviewIcon[];
  product: "Flow" | "AI Agent" | "Table";
  featured?: boolean;
  recommended?: boolean;
};

/* ─── Icons ─── */
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15V4a2 2 0 0 1 2-2h9" />
  </svg>
);

const ShareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z" />
    <path d="M19 3l.5 1.5L21 5l-1.5.5L19 7l-.5-1.5L17 5l1.5-.5L19 3z" />
  </svg>
);

const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ScheduleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const AiIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M12 8V5" />
    <circle cx="9" cy="14" r="1" fill="currentColor" />
    <circle cx="15" cy="14" r="1" fill="currentColor" />
    <path d="M9 5h6" />
  </svg>
);

const BranchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

/* ─── Sample Data ─── */
const USE_CASES = ["All", "Sales", "Marketing", "Support", "Operations", "HR", "Finance", "IT"];
const APPS = ["All", "Shopify", "Gmail", "Slack", "HubSpot", "Google Sheets", "WhatsApp", "Airtable"];

const APP_IMAGES: Record<string, string> = {
  "Google Sheets": "https://stuff.thingsofbrand.com/google.com/images/img4_googlesheet.png",
  "Google Forms": "https://stuff.thingsofbrand.com/google.com/images/imgb_Google_Forms_Logo.png",
  "Gmail": "https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png",
  "Zoho": "https://stuff.thingsofbrand.com/zoho.com/images/imgb_ZohoCRM.jpeg",
  "LinkedIn": "https://stuff.thingsofbrand.com/linkedin.com/images/img60aec4bbba_linkedin.jpg",
  "Google Tasks": "https://stuff.thingsofbrand.com/google.com/images/img3_GoogleTasks.png",
  "Postmark": "https://stuff.thingsofbrand.com/postmarkapp.com/images/img637c367ffb_postmarkapp.jpg",
  "Telegram": "https://stuff.thingsofbrand.com/telegram.org/images/img6c1c10f144_telegram.jpg",
  "Getalai": "https://stuff.thingsofbrand.com/getalai.com/images/imga_getalai.png",
  "ViaSocket": "https://stuff.thingsofbrand.com/viasocket.com/images/img6b109ca44d_viasocket_plug.jpg",
  "Plumsail": "https://stuff.thingsofbrand.com/plumsail.com/images/imgc_plumsail-documents-logo-colorful.png",
  "Notion": "https://stuff.thingsofbrand.com/notion.so/images/img667018e3f8_notion.jpg",
  "Facebook": "https://stuff.thingsofbrand.com/facebook.com/images/img6f6ece6e88_facebook.jpg",
  "Instagram": "https://stuff.thingsofbrand.com/nstagram.com/images/img3_nstagram.png",
  "Edenai": "https://stuff.thingsofbrand.com/edenai.co/images/img6bf8d31dff_edenai.jpg",
  "Slack": "https://stuff.thingsofbrand.com/slack.com/images/img668216333e_slack.jpg",
  "HubSpot": "https://stuff.thingsofbrand.com/hubspot.com/images/img6_hubspot.jpg",
  "Airtable": "https://stuff.thingsofbrand.com/airtable.com/images/img6_airtable.jpg",
  "WhatsApp": "https://stuff.thingsofbrand.com/whatsapp.com/images/imga_whatsapp.png",
  "Shopify": "https://stuff.thingsofbrand.com/shopify.com/images/img6_shopify.jpg",
  "Google Drive": "https://stuff.thingsofbrand.com/google.com/images/img6_googledrive.jpg",
  "OpenAI": "https://stuff.thingsofbrand.com/openai.com/images/img6_openai.jpg",
  "Webhook": "https://stuff.thingsofbrand.com/viasocket.com/images/imge_Webhook-bg.svg",
};
const MORE_APPS = [
  "Notion", "Trello", "Asana", "Jira", "GitHub", "GitLab", "Bitbucket",
  "Salesforce", "Zendesk", "Intercom", "Mailchimp", "SendGrid", "Twilio",
  "Stripe", "PayPal", "Square", "QuickBooks", "Xero", "Zoom", "Microsoft Teams",
  "Discord", "Telegram", "Twitter", "LinkedIn", "Facebook", "Instagram",
  "Dropbox", "OneDrive", "Box", "Calendly", "Typeform", "SurveyMonkey",
  "Pipedrive", "Freshdesk", "ClickUp", "Monday.com", "Linear", "Figma",
];
const PRODUCTS = ["All", "Flow", "AI Agent", "Table"];

const ALL_TEMPLATES: Template[] = [
  {
    id: "t17",
    title: "Lead Scoring & Alert Automation",
    displayTitle: "Lead Scoring & Alert Automation",
    description:
      "Send lead details to an AI agent to score buying intent (1–100); classify leads as Hot/Warm/Cold and automatically notify team channels and email recipients with tailored messages and follow-up actions based on the score.",
    apps: [
      { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
      { name: "OpenAI", color: "bg-slate-800", letter: "A" },
      { name: "Slack", color: "bg-purple-600", letter: "S" },
      { name: "Gmail", color: "bg-red-500", letter: "M" },
    ],
    workflowSteps: [
      { label: "daily at 11 AM on monday ex...", app: "Schedule", iconKind: "schedule" },
      { label: "List Sheet Rows", app: "Google Sheets" },
      { label: "Filter", app: "Filter", iconKind: "filter" },
      { label: "AI Agent", app: "AI Agent", iconKind: "ai" },
      { label: "Send Message", app: "Slack" },
      { label: "Send Email", app: "Gmail" },
      { label: "Send Message 1", app: "Slack" },
      { label: "Send Email 1", app: "Gmail" },
      { label: "Return a 2-day delay in min...", app: "Schedule", iconKind: "schedule" },
      { label: "Send Email 2", app: "Gmail" },
      { label: "Send Message 2", app: "Slack" },
      { label: "Send Email 3", app: "Gmail" },
    ],
    flowPreviewIcons: ["schedule", "arrow", "ai", "filter"],
    installs: 890,
    useCase: "Sales",
    chips: ["Sales", "AI", "Lead Scoring"],
    product: "Flow",
    featured: true,
    recommended: true,
  },
  {
    id: "t1",
    title: "Automate Lead Capture to Google Sheets from a Webhook",
    apps: [
      { name: "Webhook", color: "bg-emerald-500", letter: "W" },
      { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
    ],
    installs: 1200,
    useCase: "Sales",
    chips: ["Sales", "Marketing", "Lead Gen"],
    product: "Flow",
    featured: true,
    recommended: true,
  },
  {
    id: "t2",
    title: "Email a Daily Work Summary from Google Sheets via Gmail",
    apps: [
      { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
      { name: "Gmail", color: "bg-red-500", letter: "M" },
      { name: "Google Drive", color: "bg-emerald-500", letter: "D" },
    ],
    installs: 13,
    useCase: "Marketing",
    product: "Flow",
    featured: true,
  },
  {
    id: "t3",
    title: "Auto-Send Gmail from New or Updated Google Sheets Rows",
    apps: [
      { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
      { name: "Gmail", color: "bg-red-500", letter: "M" },
    ],
    installs: 6,
    useCase: "Sales",
    product: "Flow",
    recommended: true,
  },
  {
    id: "t4",
    title: "Pull the latest rows from Google Sheets on demand (webhook)",
    apps: [
      { name: "Webhook", color: "bg-emerald-500", letter: "W" },
      { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
      { name: "Slack", color: "bg-purple-600", letter: "S" },
    ],
    installs: 5,
    useCase: "IT",
    product: "Flow",
  },
  {
    id: "t5",
    title: "Delay Webhook Events By 15 Minutes",
    apps: [
      { name: "Webhook", color: "bg-emerald-500", letter: "W" },
      { name: "Slack", color: "bg-purple-600", letter: "S" },
      { name: "Gmail", color: "bg-red-500", letter: "M" },
    ],
    installs: 4,
    useCase: "Operations",
    product: "Flow",
  },
  {
    id: "t6",
    title: "Turn '20 min' into a 20-minute wait",
    apps: [
      { name: "Slack", color: "bg-purple-600", letter: "S" },
      { name: "HubSpot", color: "bg-orange-500", letter: "H" },
      { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
    ],
    installs: 1,
    useCase: "Support",
    product: "Flow",
  },
  {
    id: "t7",
    title: "Forward Webhook to AI Agent (MCP) and Return the Response",
    apps: [
      { name: "Webhook", color: "bg-emerald-500", letter: "W" },
      { name: "OpenAI", color: "bg-slate-800", letter: "A" },
      { name: "Slack", color: "bg-purple-600", letter: "S" },
    ],
    installs: 30,
    useCase: "IT",
    product: "AI Agent",
    recommended: true,
    featured: true,
  },
  {
    id: "t8",
    title: "Automate Webhook Health Check Acknowledgment",
    apps: [
      { name: "Webhook", color: "bg-emerald-500", letter: "W" },
      { name: "Slack", color: "bg-purple-600", letter: "S" },
      { name: "Gmail", color: "bg-red-500", letter: "M" },
    ],
    installs: 24,
    useCase: "Operations",
    product: "Flow",
  },
  {
    id: "t9",
    title: "Automate On-Demand Airtable Table Export via Webhook",
    apps: [
      { name: "Webhook", color: "bg-emerald-500", letter: "W" },
      { name: "Airtable", color: "bg-blue-500", letter: "A" },
      { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
    ],
    installs: 14,
    useCase: "Operations",
    product: "Flow",
  },
  {
    id: "t10",
    title: "Automate User Input Collection for Processing",
    apps: [
      { name: "Google Forms", color: "bg-violet-500", letter: "F" },
      { name: "Slack", color: "bg-purple-600", letter: "S" },
      { name: "Airtable", color: "bg-blue-500", letter: "A" },
    ],
    installs: 9,
    useCase: "HR",
    product: "Flow",
  },
  {
    id: "t11",
    title: "Test Plugin Workflow",
    apps: [
      { name: "Shopify", color: "bg-emerald-600", letter: "S" },
      { name: "Slack", color: "bg-purple-600", letter: "S" },
      { name: "Gmail", color: "bg-red-500", letter: "M" },
    ],
    installs: 30,
    useCase: "Operations",
    product: "Flow",
  },
  {
    id: "t12",
    title: "Automate Date Formatting to DD-MM-YYYY",
    apps: [
      { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
      { name: "Slack", color: "bg-purple-600", letter: "S" },
      { name: "Gmail", color: "bg-red-500", letter: "M" },
    ],
    installs: 5,
    useCase: "Finance",
    product: "Flow",
  },
  {
    id: "t13",
    title: "Sync Shopify Orders to Google Sheets",
    apps: [
      { name: "Shopify", color: "bg-emerald-600", letter: "S" },
      { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
      { name: "Slack", color: "bg-purple-600", letter: "S" },
    ],
    installs: 18,
    useCase: "Sales",
    product: "Flow",
  },
  {
    id: "t14",
    title: "Send WhatsApp Message on New Airtable Record",
    apps: [
      { name: "Airtable", color: "bg-blue-500", letter: "A" },
      { name: "WhatsApp", color: "bg-green-500", letter: "W" },
      { name: "Slack", color: "bg-purple-600", letter: "S" },
    ],
    installs: 12,
    useCase: "Marketing",
    product: "Flow",
  },
  {
    id: "t15",
    title: "Create HubSpot Contact from Gmail Attachment",
    apps: [
      { name: "Gmail", color: "bg-red-500", letter: "M" },
      { name: "HubSpot", color: "bg-orange-500", letter: "H" },
      { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
    ],
    installs: 8,
    useCase: "Sales",
    product: "Flow",
  },
  {
    id: "t16",
    title: "Post Slack Message on Webhook Trigger",
    apps: [
      { name: "Webhook", color: "bg-emerald-500", letter: "W" },
      { name: "Slack", color: "bg-purple-600", letter: "S" },
      { name: "Gmail", color: "bg-red-500", letter: "M" },
    ],
    installs: 22,
    useCase: "IT",
    product: "Flow",
  },
];

const DEFAULT_FLOW_PREVIEW_ICONS: FlowPreviewIcon[] = ["schedule", "arrow", "ai", "filter"];

const CHIP_COLORS = [
  "border-blue-200 bg-blue-50 text-blue-700",
  "border-violet-200 bg-violet-50 text-violet-700",
  "border-emerald-200 bg-emerald-50 text-emerald-700",
  "border-amber-200 bg-amber-50 text-amber-700",
  "border-rose-200 bg-rose-50 text-rose-700",
  "border-cyan-200 bg-cyan-50 text-cyan-700",
  "border-orange-200 bg-orange-50 text-orange-700",
  "border-indigo-200 bg-indigo-50 text-indigo-700",
  "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  "border-teal-200 bg-teal-50 text-teal-700",
];

const CHIP_COLORS_SELECTED = [
  "border-blue-600 bg-blue-600 text-white",
  "border-violet-600 bg-violet-600 text-white",
  "border-emerald-600 bg-emerald-600 text-white",
  "border-amber-600 bg-amber-600 text-white",
  "border-rose-600 bg-rose-600 text-white",
  "border-cyan-600 bg-cyan-600 text-white",
  "border-orange-600 bg-orange-600 text-white",
  "border-indigo-600 bg-indigo-600 text-white",
  "border-fuchsia-600 bg-fuchsia-600 text-white",
  "border-teal-600 bg-teal-600 text-white",
];

function getChipColorIndex(label: string): number {
  for (const list of [USE_CASES, PRODUCTS]) {
    const index = list.indexOf(label);
    if (index >= 0) return index;
  }
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = (hash + label.charCodeAt(i) * (i + 1)) % CHIP_COLORS.length;
  }
  return hash;
}

function getChipColorClass(label: string) {
  return CHIP_COLORS[getChipColorIndex(label) % CHIP_COLORS.length];
}

function getFilterChipClass(label: string, isSelected: boolean) {
  const palette = isSelected ? CHIP_COLORS_SELECTED : CHIP_COLORS;
  return palette[getChipColorIndex(label) % palette.length];
}

function getAppFilterChipClass(isSelected: boolean) {
  return isSelected
    ? "border-foreground bg-foreground text-background"
    : "border-gray-200 bg-gray-100 text-gray-700";
}

function getWorkflowSteps(template: Template): WorkflowStep[] {
  if (template.workflowSteps?.length) return template.workflowSteps;
  const steps: WorkflowStep[] = [
    {
      label: `Trigger via ${template.apps[0]?.name ?? "Webhook"}`,
      app: template.apps[0]?.name ?? "Webhook",
      iconKind: "schedule",
    },
  ];
  template.apps.slice(1).forEach((app) => {
    steps.push({ label: app.name, app: app.name });
  });
  return steps;
}

function StepIcon({ app, iconKind }: { app: string; iconKind?: WorkflowStep["iconKind"] }) {
  const kind = iconKind ?? (app === "Filter" ? "filter" : app === "AI Agent" ? "ai" : app === "Schedule" ? "schedule" : "default");
  const imageUrl = APP_IMAGES[app];

  if (kind === "schedule") {
    return <ScheduleIcon className="size-4 shrink-0 text-muted-foreground" />;
  }
  if (kind === "filter") {
    return <FilterIcon className="size-4 shrink-0 text-blue-500" />;
  }
  if (kind === "ai") {
    return <AiIcon className="size-4 shrink-0 text-muted-foreground" />;
  }
  if (imageUrl) {
    return <img src={imageUrl} alt={app} className="size-4 shrink-0 object-contain" />;
  }
  return (
    <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm bg-muted text-[8px] font-bold text-muted-foreground">
      {app.charAt(0)}
    </span>
  );
}

function FlowPreviewIconBox({ kind }: { kind: FlowPreviewIcon }) {
  const iconClass = "size-5 text-muted-foreground";
  return (
    <span className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-background">
      {kind === "schedule" && <ScheduleIcon className={iconClass} />}
      {kind === "arrow" && <ArrowRightIcon className={iconClass} />}
      {kind === "ai" && <AiIcon className={iconClass} />}
      {kind === "filter" && <BranchIcon className={iconClass} />}
    </span>
  );
}

function ConfigureTimeline({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className="flex flex-col">
      {steps.map((step, index) => (
        <div key={`${step.label}-${index}`} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-muted-foreground/50" />
            {index < steps.length - 1 && <span className="w-px flex-1 bg-border" />}
          </div>
          <div className={cn("flex min-w-0 flex-1 items-center gap-2", index < steps.length - 1 ? "pb-3" : "pb-1")}>
            <StepIcon app={step.app} iconKind={step.iconKind} />
            <span className="truncate text-xs text-foreground">{step.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TemplateInstallDialog({
  template,
  open,
  onInstall,
  onCancel,
}: {
  template: Template;
  open: boolean;
  onInstall: () => void;
  onCancel: () => void;
}) {
  const steps = getWorkflowSteps(template);
  const previewIcons = template.flowPreviewIcons ?? DEFAULT_FLOW_PREVIEW_ICONS;
  const displayTitle = template.displayTitle ?? template.title;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth={false}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "8px",
          padding: 0,
          maxWidth: "920px",
          width: "100%",
          overflow: "hidden",
        },
      }}
    >
      <div className="flex min-h-[480px]">
        <aside className="flex w-[280px] shrink-0 flex-col border-r border-border bg-background">
          <h3 className="px-5 pt-5 pb-4 text-base font-semibold text-foreground">Configure</h3>
          <div className="flex-1 overflow-y-auto px-5 pb-5">
            <ConfigureTimeline steps={steps} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-background">
          <div className="flex flex-1 flex-col px-8 py-6">
            <h2 className="text-[1.75rem] font-semibold leading-tight text-foreground">{displayTitle}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {template.description ||
                `Use this template to quickly set up ${template.title.toLowerCase()} with ${template.apps.map((a) => a.name).join(", ")}.`}
            </p>
            <div className="mt-6 flex items-center gap-2">
              {previewIcons.map((icon, index) => (
                <FlowPreviewIconBox key={`${icon}-${index}`} kind={icon} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 px-8 pb-6">
            <MuiButton
              onClick={onInstall}
              variant="contained"
              disableElevation
              sx={{ textTransform: "uppercase", fontWeight: 600, paddingX: "24px" }}
            >
              Install
            </MuiButton>
            <MuiButton
              onClick={onCancel}
              variant="outlined"
              sx={{ textTransform: "uppercase", fontWeight: 600, paddingX: "24px" }}
            >
              Cancel
            </MuiButton>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

/* ─── Components ─── */
function AppBadge({ app, index }: { app: TemplateApp; index: number }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = APP_IMAGES[app.name];
  const showImage = Boolean(imageUrl) && !imgError;

  return (
    <span
      className={cn(
        "relative inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-gray-200 bg-white",
        index > 0 && "-ml-2.5"
      )}
      style={{ zIndex: index + 1 }}
      title={app.name}
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt={app.name}
          className="size-4 object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className={cn(
            "inline-flex size-full items-center justify-center text-[10px] font-bold text-white",
            app.color
          )}
        >
          {app.letter}
        </span>
      )}
    </span>
  );
}

function TemplateCard({ template, onCardClick }: { template: Template; onCardClick: (template: Template) => void }) {
  const chips = template.chips || [template.useCase];
  const displayChips = chips.slice(0, 2);
  const remainingChips = chips.slice(2);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  
  const formatInstalls = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const popoverOpen = Boolean(popoverAnchor);

  return (
    <div 
      className="group relative flex flex-col rounded-xl border border-border/70 bg-background p-4 transition-shadow hover:shadow-md cursor-pointer"
      onClick={() => onCardClick(template)}
    >
      {/* Header: app badges + featured */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {template.apps.map((app, index) => (
            <AppBadge key={app.name} app={app} index={index} />
          ))}
        </div>
        {template.featured && (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
            <StarIcon className="size-3" />
            Featured
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 mb-3">
        {template.title}
      </h3>

      {/* Footer: chips + installs */}
      <div className="mt-auto flex items-center justify-between pt-3">
        <div className="flex items-center gap-1.5">
          {displayChips.map((chip, index) => (
            <span
              key={index}
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                getChipColorClass(chip)
              )}
            >
              {chip}
            </span>
          ))}
          {remainingChips.length > 0 && (
            <span
              className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground cursor-pointer hover:bg-muted/80"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              +{remainingChips.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <DownloadIcon className="size-3.5" />
          <span className="font-medium text-foreground">{formatInstalls(template.installs)}</span>
          <span>installs</span>
        </div>
      </div>

      {/* Popover for remaining chips */}
      <Popover
        open={popoverOpen}
        anchorEl={popoverAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        disableRestoreFocus
        sx={{
          pointerEvents: 'none',
          '& .MuiPaper-root': {
            pointerEvents: 'auto',
            borderRadius: '8px',
            padding: '8px',
          },
        }}
        slotProps={{
          paper: {
            onMouseEnter: () => setPopoverAnchor(popoverAnchor),
            onMouseLeave: handlePopoverClose,
          },
        }}
      >
        <div className="flex flex-col gap-1">
          {remainingChips.map((chip, index) => (
            <span
              key={index}
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                getChipColorClass(chip)
              )}
            >
              {chip}
            </span>
          ))}
        </div>
      </Popover>
    </div>
  );
}

function FeaturedTemplate({ template, onClick }: { template: Template; onClick: () => void }) {
  return (
    <div
      className="relative flex items-start gap-5 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 p-6 cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-2">
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">
            <SparklesIcon className="size-3 mr-1" />
            Featured
          </Badge>
          <span className="text-xs text-muted-foreground">{template.useCase}</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground leading-snug mb-2">{template.title}</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {template.apps.map((app, index) => (
              <AppBadge key={app.name} app={app} index={index} />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{template.installs}</span> users
          </span>
        </div>
      </div>
      <Button
        size="sm"
        className="shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        Use Template
      </Button>
    </div>
  );
}

/* ─── Main Page ─── */
export default function TemplatesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [useCases, setUseCases] = useState<Set<string>>(new Set());
  const [apps, setApps] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"popularity" | "newest" |"name">("popularity");
  const [showMyTemplates, setShowMyTemplates] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<Set<"usecase" | "app" | "product">>(new Set(["usecase"]));
  const [showAppPopover, setShowAppPopover] = useState(false);
  const [appSearch, setAppSearch] = useState("");
  const [addedApps, setAddedApps] = useState<Set<string>>(new Set());
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const toggleExpanded = (key: "usecase" | "app" | "product") => {
    const next = new Set(expandedFilters);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setExpandedFilters(next);
  };

  const toggleUseCase = (uc: string) => {
    if (uc === "All") {
      setUseCases(new Set());
      return;
    }
    const next = new Set(useCases);
    if (next.has(uc)) next.delete(uc);
    else next.add(uc);
    setUseCases(next);
  };

  const toggleApp = (app: string) => {
    if (app === "All") {
      setApps(new Set());
      return;
    }
    const next = new Set(apps);
    if (next.has(app)) next.delete(app);
    else next.add(app);
    setApps(next);
  };

  const toggleProduct = (product: string) => {
    if (product === "All") {
      setProducts(new Set());
      return;
    }
    const next = new Set(products);
    if (next.has(product)) next.delete(product);
    else next.add(product);
    setProducts(next);
  };

  const handleOpenTemplate = (id: string) => {
    router.push(`/app/templates/${id}`);
  };

  const handleCardClick = (template: Template) => {
    setSelectedTemplate(template);
    setShowDialog(true);
  };

  const handleInstall = () => {
    if (selectedTemplate) {
      setShowDialog(false);
      handleOpenTemplate(selectedTemplate.id);
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setSelectedTemplate(null);
  };

  const filtered = useMemo(() => {
    let list = ALL_TEMPLATES;

    // Search: empty spaces allowed (simple substring match)
    const q = search.toLowerCase().replace(/\s+/g, " ").trim();
    if (q) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.useCase.toLowerCase().includes(q) ||
          t.apps.some((a) => a.name.toLowerCase().includes(q)) ||
          t.product.toLowerCase().includes(q)
      );
    }

    if (useCases.size > 0) {
      list = list.filter((t) => useCases.has(t.useCase));
    }
    if (apps.size > 0) {
      list = list.filter((t) => t.apps.some((a) => apps.has(a.name)));
    }
    if (products.size > 0) {
      list = list.filter((t) => products.has(t.product));
    }

    // Filter by my templates (mock: show only first 3 as "my templates")
    if (showMyTemplates) {
      list = list.filter((_, i) => i < 3);
    }

    // Sort
    if (sortBy === "popularity") {
      list = [...list].sort((a, b) => b.installs - a.installs);
    } else if (sortBy === "name") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list = [...list];
    }
    // Always bring featured templates to the top
    list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

    return list;
  }, [search, useCases, apps, products, sortBy, showMyTemplates]);

  const featured = useMemo(() => ALL_TEMPLATES.find((t) => t.featured), []);
  const recommended = useMemo(() => ALL_TEMPLATES.filter((t) => t.recommended), []);
  const myTemplatesCount = 0; // Mock: no templates for demo to show empty state

  return (
    <div className="min-h-full bg-background p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Templates</h1>          
        </div>
        
        <Button variant="default" size="sm" className="flex items-center gap-2">
          <PlusIcon className="size-4" />
          Create New Template
        </Button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="relative max-w-3xl">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates, apps, use cases..."
            className="h-12 pl-12 pr-4 text-base border-2 border-black focus-visible:border-black focus-visible:ring-2 focus-visible:ring-black/20"
          />
        </div>
      </div>      

      {/* Expanded Filter Options */}
      <div className="mb-10 space-y-3">
        {/* Use Cases Options */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-medium text-muted-foreground shrink-0">Use Case:</span>
          {USE_CASES.map((uc) => {
            const isSelected = uc === "All" ? useCases.size === 0 : useCases.has(uc);
            return (
            <button
              key={uc}
              onClick={() => toggleUseCase(uc)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                getFilterChipClass(uc, isSelected)
              )}
            >
              {uc}
            </button>
            );
          })}
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="shrink-0 text-xs font-medium text-blue-600 hover:underline ml-2"
          >
            {showMoreFilters ? "Less filters" : "More filters"}
          </button>
        </div>

        {/* Apps Options */}
        {showMoreFilters && (
          <div className="flex flex-wrap items-center gap-2 pb-1">
          <span className="text-xs font-medium text-muted-foreground shrink-0">Apps:</span>
          {APPS.map((app) => {
            const isSelected = app === "All" ? apps.size === 0 : apps.has(app);
            return (
                <button
                  key={app}
                  onClick={() => toggleApp(app)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    getAppFilterChipClass(isSelected)
                  )}
                >
                  {app}
                </button>
              );
          })}
              {/* Show added MORE_APPS as chips (persist even when deselected) */}
              {Array.from(addedApps).map((app) => (
                <button
                  key={app}
                  onClick={() => toggleApp(app)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    getAppFilterChipClass(apps.has(app))
                  )}
                >
                  {app}
                </button>
              ))}
              {/* Plus button + popover */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowAppPopover((v) => !v)}
                  className="flex items-center justify-center size-7 rounded-full border border-dashed border-border bg-background text-foreground hover:bg-muted transition-colors"
                  aria-label="Add more apps"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                {showAppPopover && (
                  <>
                    {/* Backdrop to close on outside click */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => {
                        setShowAppPopover(false);
                        setAppSearch("");
                      }}
                    />
                    <div className="absolute left-0 top-full mt-2 z-50 w-64 rounded-lg border border-border bg-background shadow-lg p-2">
                      <Input
                        autoFocus
                        value={appSearch}
                        onChange={(e) => setAppSearch(e.target.value)}
                        placeholder="Search apps..."
                        className="mb-2"
                      />
                      <div className="max-h-56 overflow-y-auto flex flex-col gap-1">
                        {MORE_APPS.filter((a) =>
                          a.toLowerCase().includes(appSearch.toLowerCase())
                        ).length === 0 ? (
                          <p className="text-xs text-muted-foreground px-2 py-3 text-center">
                            No apps found
                          </p>
                        ) : (
                          MORE_APPS.filter((a) =>
                            a.toLowerCase().includes(appSearch.toLowerCase())
                          ).map((app) => (
                            <button
                              key={app}
                              onClick={() => {
                                // Add to visible chips row
                                const nextAdded = new Set(addedApps);
                                nextAdded.add(app);
                                setAddedApps(nextAdded);
                                // Toggle selection for filtering
                                toggleApp(app);
                              }}
                              className={cn(
                                "flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-left transition-colors",
                                apps.has(app)
                                  ? "bg-muted text-foreground"
                                  : "hover:bg-muted text-foreground"
                              )}
                            >
                              <span>{app}</span>
                              {apps.has(app) && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Products Options */}
          {showMoreFilters && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-medium text-muted-foreground shrink-0">Product:</span>
            {PRODUCTS.map((p) => {
              const isSelected = p === "All" ? products.size === 0 : products.has(p);
              return (
              <button
                key={p}
                onClick={() => toggleProduct(p)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  getFilterChipClass(p, isSelected)
                )}
              >
                {p}
              </button>
              );
            })}
          </div>
          )}
        </div>

      {/* Grid */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          {/* Tabs */}
          <div className="flex items-center bg-muted rounded-md p-1">
            <button
              onClick={() => setShowMyTemplates(false)}
              className={cn(
                "px-2.5 py-1 text-sm font-medium rounded-sm transition-colors",
                !showMyTemplates
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              All Templates ({filtered.length})
            </button>
            <button
              onClick={() => setShowMyTemplates(true)}
              className={cn(
                "px-2.5 py-1 text-sm font-medium rounded-sm transition-colors",
                showMyTemplates
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              My Templates ({myTemplatesCount})
            </button>
          </div>
          <div className="relative flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Sort by: </span>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1 text-sm hover:text-foreground transition-colors"
            >
              {sortBy === "popularity" ? "Popularity" : sortBy === "newest" ? "Newest" : "Name"}
              <ChevronDown className="size-3" />
            </button>
            {showSortDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSortDropdown(false)}
                />
                <div className="absolute left-0 top-full mt-1 z-50 rounded-lg border border-border bg-background shadow-lg p-1 min-w-[120px]">
                  <button
                    onClick={() => { setSortBy("popularity"); setShowSortDropdown(false); }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors",
                      sortBy === "popularity" ? "bg-muted text-foreground" : "hover:bg-muted text-foreground"
                    )}
                  >
                    Popularity
                  </button>
                  <button
                    onClick={() => { setSortBy("newest"); setShowSortDropdown(false); }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors",
                      sortBy === "newest" ? "bg-muted text-foreground" : "hover:bg-muted text-foreground"
                    )}
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => { setSortBy("name"); setShowSortDropdown(false); }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors",
                      sortBy === "name" ? "bg-muted text-foreground" : "hover:bg-muted text-foreground"
                    )}
                  >
                    Name
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {showMyTemplates && myTemplatesCount === 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((t) => (
                <TemplateCard key={t.id} template={t} onCardClick={handleCardClick} />
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-border/70 bg-muted/30 p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">How to create your first template</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</div>
                  <p className="text-sm text-muted-foreground">Click "Create New Template" to start building your automation</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</div>
                  <p className="text-sm text-muted-foreground">Choose your trigger app and action</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</div>
                  <p className="text-sm text-muted-foreground">Add steps to define your workflow</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">4</div>
                  <p className="text-sm text-muted-foreground">Test and activate your template</p>
                </div>
              </div>
              <Button variant="default" size="sm" className="mt-6 flex items-center gap-2">
                <PlusIcon className="size-4" />
                Create New Template
              </Button>
            </div>
          </>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <SearchIcon className="size-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No templates match your search</p>
            <button
              onClick={() => {
                setSearch("");
                setUseCases(new Set());
                setApps(new Set());
                setProducts(new Set());
              }}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} onCardClick={handleCardClick} />
            ))}
          </div>
        )}
      </div>

      {/* Template Dialog */}
      {selectedTemplate && (
        <TemplateInstallDialog
          template={selectedTemplate}
          open={showDialog}
          onInstall={handleInstall}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
