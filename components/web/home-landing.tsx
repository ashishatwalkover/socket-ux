"use client";

import { useEffect, useMemo, useState } from "react";

const BRAND = "#a8200c";

const NAV = ["Product", "Integrations", "Pricing", "Docs"];

type App = { name: string; logo: string };

const APP_ICON = "https://stuff.thingsofbrand.com";

const ALL_APPS: App[] = [
  { name: "Gmail", logo: `${APP_ICON}/gmail.com/images/imge_idrA5FDGTH_1763454052978.svg` },
  { name: "HubSpot", logo: `${APP_ICON}/hubspot.com/images/img61728fea98_hubspot.jpg` },
  { name: "Salesforce", logo: `${APP_ICON}/salesforce.com/images/img1_salesforce.png` },
  { name: "Stripe", logo: `${APP_ICON}/stripe.com/images/img67eab239fe_stripe.jpg` },
  { name: "Google Drive", logo: `${APP_ICON}/google.com/images/img9_googledrive.png` },
  { name: "QuickBooks", logo: `${APP_ICON}/quickbooks.intuit.com/images/imgf_Screenshot-2025-03-20-141203.png` },
  { name: "Outlook", logo: `${APP_ICON}/microsoft.com/images/img9_Microsoft_Office_Outlook.png` },
  { name: "Google Sheets", logo: `${APP_ICON}/google.com/images/img4_googlesheet.png` },
  { name: "Slack", logo: `${APP_ICON}/slack.com/images/img668216333e_slack.jpg` },
  { name: "Notion", logo: `${APP_ICON}/notion.so/images/img667018e3f8_notion.jpg` },
  { name: "Airtable", logo: `${APP_ICON}/airtable.com/images/img6da0d45803_airtable.jpg` },
  { name: "Shopify", logo: `${APP_ICON}/shopify.com/images/img6fb21a1332_shopify.jpg` },
  { name: "Zoom", logo: `${APP_ICON}/zoom.us/images/img688a247e14_zoom.jpg` },
  { name: "Trello", logo: `${APP_ICON}/trello.com/images/img6e60f5aa10_trello.jpg` },
  { name: "Asana", logo: `${APP_ICON}/asana.com/images/img658df77d87_asana.jpg` },
  { name: "GitHub", logo: `${APP_ICON}/github.com/images/img65d45fd9b8_github.jpg` },
  { name: "Intercom", logo: `${APP_ICON}/intercom.com/images/img64da81ea37_intercom.jpg` },
  { name: "Mailchimp", logo: `${APP_ICON}/mailchimp.com/images/img673876726d_mailchimp.jpg` },
  { name: "Twilio", logo: `${APP_ICON}/twilio.com/images/img6d4d5ca53c_twilio.jpg` },
  { name: "Calendly", logo: `${APP_ICON}/calendly.com/images/img666fed0cf4_calendly.jpg` },
  { name: "Dropbox", logo: `${APP_ICON}/dropbox.com/images/img688fa9abff_dropbox.jpg` },
  { name: "Monday", logo: `${APP_ICON}/monday.com/images/img66ceb3d8d5_monday.jpg` },
  { name: "ClickUp", logo: `${APP_ICON}/clickup.com/images/img68198d062e_clickup.jpg` },
  { name: "Discord", logo: `${APP_ICON}/discord.com/images/img6dd59dde35_discord.jpg` },
  { name: "Typeform", logo: `${APP_ICON}/typeform.com/images/img6df5b471b3_typeform.jpg` },
  { name: "Webflow", logo: `${APP_ICON}/webflow.com/images/img6a94303e49_webflow.jpg` },
  { name: "Pipedrive", logo: `${APP_ICON}/pipedrive.com/images/img615f7335ac_pipedrive.jpg` },
  { name: "Freshdesk", logo: `${APP_ICON}/freshdesk.com/images/imgf_freshdesk.png` },
  { name: "Telegram", logo: `${APP_ICON}/telegram.org/images/img6c1c10f144_telegram.jpg` },
  { name: "LinkedIn", logo: `${APP_ICON}/linkedin.com/images/img60aec4bbba_linkedin.jpg` },
  { name: "Google Ads", logo: `${APP_ICON}/google.com/images/img5_google-ads.png` },
  { name: "Klaviyo", logo: `${APP_ICON}/klaviyo.com/images/img6fad3f3bf3_klaviyo.jpg` },
  { name: "Docusign", logo: `${APP_ICON}/docusign.com/images/img6bbfea5060_docusign.jpg` },
  { name: "Zoho CRM", logo: `${APP_ICON}/zoho.com/images/imgb_ZohoCRM.jpeg` },
  { name: "Google Calendar", logo: `${APP_ICON}/google.com/images/img7_Google-Calendar.png` },
  { name: "Microsoft Teams", logo: `${APP_ICON}/microsoft.com/images/img9_Microsoft-Teams-Logo.png` },
];

const APP_BY_NAME = Object.fromEntries(ALL_APPS.map((a) => [a.name, a] as const));

type Category =
  | "Marketing"
  | "Sales"
  | "Lead Gen"
  | "Outbound"
  | "Support"
  | "Finance"
  | "Ops"
  | "Recruiting"
  | "Success"
  | "Analytics"
  | "Product"
  | "Legal";

const CATEGORY_STYLE: Record<Category, { icon: string; bg: string; ring: string; tagBg: string; tagText: string }> = {
  Marketing: { icon: "📣", bg: "bg-pink-100", ring: "ring-pink-200", tagBg: "bg-pink-500", tagText: "text-white" },
  Sales: { icon: "📈", bg: "bg-emerald-100", ring: "ring-emerald-200", tagBg: "bg-emerald-500", tagText: "text-white" },
  "Lead Gen": { icon: "🔍", bg: "bg-sky-100", ring: "ring-sky-200", tagBg: "bg-sky-500", tagText: "text-white" },
  Outbound: { icon: "📨", bg: "bg-violet-100", ring: "ring-violet-200", tagBg: "bg-violet-500", tagText: "text-white" },
  Support: { icon: "💬", bg: "bg-cyan-100", ring: "ring-cyan-200", tagBg: "bg-cyan-500", tagText: "text-white" },
  Finance: { icon: "💳", bg: "bg-amber-100", ring: "ring-amber-200", tagBg: "bg-amber-500", tagText: "text-white" },
  Ops: { icon: "⚙️", bg: "bg-slate-100", ring: "ring-slate-200", tagBg: "bg-slate-600", tagText: "text-white" },
  Recruiting: { icon: "🧑‍💼", bg: "bg-indigo-100", ring: "ring-indigo-200", tagBg: "bg-indigo-500", tagText: "text-white" },
  Success: { icon: "🌟", bg: "bg-orange-100", ring: "ring-orange-200", tagBg: "bg-orange-500", tagText: "text-white" },
  Analytics: { icon: "📊", bg: "bg-teal-100", ring: "ring-teal-200", tagBg: "bg-teal-500", tagText: "text-white" },
  Product: { icon: "🛠️", bg: "bg-fuchsia-100", ring: "ring-fuchsia-200", tagBg: "bg-fuchsia-500", tagText: "text-white" },
  Legal: { icon: "📄", bg: "bg-yellow-100", ring: "ring-yellow-200", tagBg: "bg-yellow-500", tagText: "text-white" },
};

type Task = { category: Category; time: string; message: string; preview: "chart" | "list" | "email" | "doc" };

const HERO_TASKS: Task[] = [
  { category: "Marketing", time: "9:32 AM", message: "I drafted the spring campaign and scheduled it for Monday.", preview: "doc" },
  { category: "Sales", time: "2:57 PM", message: "I followed up with every open lead and sales are climbing.", preview: "chart" },
  { category: "Lead Gen", time: "1:26 PM", message: "I found 30 new leads that look like your best customers.", preview: "list" },
  { category: "Outbound", time: "11:08 AM", message: "I wrote and sent 48 personal follow-ups this morning.", preview: "email" },
  { category: "Support", time: "10:14 AM", message: "I answered 24 tickets and flagged 3 that need a human.", preview: "email" },
  { category: "Finance", time: "8:45 AM", message: "I reconciled 38 Stripe payouts with QuickBooks.", preview: "list" },
  { category: "Recruiting", time: "12:41 PM", message: "I screened 62 applicants for the AE role and shortlisted 9.", preview: "list" },
  { category: "Ops", time: "3:22 PM", message: "I filed every Q3 contract in Drive and named them cleanly.", preview: "doc" },
];

const ACTIVITY = [
  { app: "HubSpot", action: "New lead captured — Priya Shah", tag: "Sales" as Category, time: "just now" },
  { app: "Gmail", action: "Drafted follow-up to 12 prospects", tag: "Outbound" as Category, time: "1m ago" },
  { app: "Stripe", action: "Invoice #4821 marked paid — $2,450", tag: "Finance" as Category, time: "3m ago" },
  { app: "Google Drive", action: "Filed Q3 contracts in /Legal/2026", tag: "Ops" as Category, time: "6m ago" },
  { app: "Salesforce", action: "Updated pipeline — 4 deals moved to negotiation", tag: "Sales" as Category, time: "9m ago" },
  { app: "QuickBooks", action: "Reconciled 38 transactions from Stripe", tag: "Finance" as Category, time: "14m ago" },
  { app: "Outlook", action: "Scheduled 3 discovery calls for Thursday", tag: "Sales" as Category, time: "22m ago" },
  { app: "Google Ads", action: "Pulled ad spend report — CAC down 18%", tag: "Analytics" as Category, time: "31m ago" },
  { app: "Gmail", action: "Auto-replied to 24 support tickets", tag: "Support" as Category, time: "42m ago" },
  { app: "HubSpot", action: "Enriched 118 new contacts from LinkedIn", tag: "Lead Gen" as Category, time: "1h ago" },
];

const PICKER_APP_NAMES = [
  "Gmail", "HubSpot", "Slack", "Stripe", "Salesforce", "Google Sheets",
  "Shopify", "Notion", "Airtable", "QuickBooks", "Calendly", "Zoom",
] as const;

type UseCase = { title: string; steps: string[]; saves: string };

const SINGLE_APP_CASES: Record<string, UseCase[]> = {
  Gmail: [
    {
      title: "Auto-draft replies from your Gmail inbox",
      steps: [
        "Watch for new inbound emails",
        "Classify intent — question, meeting request, complaint",
        "Draft a reply in your voice, ready for one-click send",
      ],
      saves: "~5 hrs/week",
    },
    {
      title: "Sort Gmail by intent and label automatically",
      steps: [
        "Read every new message with AI",
        "Assign a label — Lead, Support, Vendor, Personal",
        "Archive the noise, keep your inbox focused",
      ],
      saves: "cleaner inbox",
    },
  ],
  Slack: [
    {
      title: "Post a daily standup summary at 9am",
      steps: [
        "Collect updates from yesterday's channels",
        "Summarize what shipped, what's blocked, what's next",
        "Post it in #standup so the whole team is on the same page",
      ],
      saves: "~30 min/day",
    },
  ],
  Stripe: [
    {
      title: "Weekly revenue digest, in your inbox",
      steps: [
        "Pull last 7 days of Stripe activity every Monday",
        "Break out MRR, churn, new customers, top plans",
        "Email a clean summary to founders and finance",
      ],
      saves: "~2 hrs/week",
    },
    {
      title: "Auto-recover failed Stripe charges",
      steps: [
        "Trigger when a charge fails",
        "Retry with the right dunning cadence",
        "Ping the customer with a friendly link to update card",
      ],
      saves: "~7% recovered revenue",
    },
  ],
  Shopify: [
    {
      title: "Low-stock alerts before you sell out",
      steps: [
        "Check inventory levels every hour",
        "Flag SKUs below your reorder threshold",
        "Slack + email your ops lead with reorder qty",
      ],
      saves: "no more stockouts",
    },
  ],
  HubSpot: [
    {
      title: "Enrich and tag every new HubSpot contact",
      steps: [
        "Trigger when a contact is created",
        "Enrich with company size, industry, tech stack",
        "Assign to the right rep with a lead score",
      ],
      saves: "~4 hrs/week",
    },
  ],
  Salesforce: [
    {
      title: "Salesforce hygiene, on autopilot",
      steps: [
        "Scan opportunities and contacts every night",
        "Flag missing fields, stale stages, orphan records",
        "DM the owner with a one-tap fix list",
      ],
      saves: "cleaner pipeline",
    },
  ],
  Notion: [
    {
      title: "Turn meetings into Notion pages automatically",
      steps: [
        "Grab the transcript from your video call",
        "Structure it — decisions, action items, owners",
        "File it in the right Notion database",
      ],
      saves: "~3 hrs/week",
    },
  ],
  Airtable: [
    {
      title: "Keep your Airtable base clean with AI",
      steps: [
        "Watch new rows across your bases",
        "Normalize company names, emails, phone numbers",
        "Flag duplicates for merge",
      ],
      saves: "cleaner base",
    },
  ],
  "Google Sheets": [
    {
      title: "Weekly digest from your Google Sheet",
      steps: [
        "Read the numbers every Friday",
        "AI writes a plain-English summary of trends",
        "Email it to your team, no dashboard tour required",
      ],
      saves: "~1 hr/week",
    },
  ],
  Calendly: [
    {
      title: "Prep sheet for every Calendly booking",
      steps: [
        "Trigger when a meeting is booked",
        "Enrich the guest — role, company, recent activity",
        "Drop a briefing doc in your calendar 15 min before",
      ],
      saves: "~2 hrs/week",
    },
  ],
  Zoom: [
    {
      title: "Zoom recap sent 5 minutes after the call",
      steps: [
        "Pull the recording and transcript",
        "Summarize decisions, action items, and owners",
        "Email everyone on the invite",
      ],
      saves: "~4 hrs/week",
    },
  ],
  QuickBooks: [
    {
      title: "Month-end close checklist, half done for you",
      steps: [
        "Pull unreconciled transactions from QuickBooks",
        "Match against Stripe, banks, and expense tools",
        "Leave only the true exceptions for a human",
      ],
      saves: "~1 day/month",
    },
  ],
};

function generateUseCases(apps: string[]): UseCase[] {
  if (apps.length === 0) return [];
  const [a, b, c] = apps;
  const has = (name: string) => apps.includes(name);

  const cases: UseCase[] = [];

  if (has("Gmail") && has("HubSpot")) {
    cases.push({
      title: "Auto-log inbound leads from Gmail into HubSpot",
      steps: [
        "Watch Gmail for replies to outbound sequences",
        "Extract company, role, and intent with AI",
        "Create or update the contact in HubSpot with a Hot Lead tag",
      ],
      saves: "~6 hrs/week",
    });
  }
  if (has("Stripe") && has("Slack")) {
    cases.push({
      title: "Announce every paid invoice in Slack",
      steps: [
        "Trigger when Stripe marks an invoice paid",
        "Post amount, customer, and MRR delta into #revenue",
        "Add a 🎉 reaction so the team can react in one tap",
      ],
      saves: "instant visibility",
    });
  }
  if (has("Salesforce") && has("Slack")) {
    cases.push({
      title: "Nudge reps when Salesforce deals go stale",
      steps: [
        "Every morning, scan open Salesforce opportunities",
        "Flag deals with no activity in 5+ days",
        "DM the owner in Slack with the next best action",
      ],
      saves: "~3 deals recovered/mo",
    });
  }
  if (has("Shopify") && has("HubSpot")) {
    cases.push({
      title: "Sync Shopify buyers into HubSpot with LTV",
      steps: [
        "Listen for new Shopify orders",
        "Compute lifetime value and product affinity",
        "Update the HubSpot contact and enroll them in a nurture flow",
      ],
      saves: "~9 hrs/week",
    });
  }
  if (has("QuickBooks") && has("Stripe")) {
    cases.push({
      title: "Reconcile Stripe payouts inside QuickBooks",
      steps: [
        "Pull each Stripe payout and its underlying charges",
        "Match to invoices and fees in QuickBooks",
        "Flag mismatches for review — everything else posts clean",
      ],
      saves: "~12 hrs/month",
    });
  }
  if (has("Calendly") && has("Salesforce")) {
    cases.push({
      title: "Book demos straight into Salesforce",
      steps: [
        "Trigger when a prospect books via Calendly",
        "Create the lead + opportunity in Salesforce",
        "Notify the assigned rep with the meeting brief",
      ],
      saves: "~4 hrs/week",
    });
  }
  if (has("Google Sheets") && has("Airtable")) {
    cases.push({
      title: "Keep Sheets and Airtable in lockstep",
      steps: [
        "Watch changes in either source",
        "Reconcile fields with AI so schemas stay clean",
        "Two-way sync with conflict resolution",
      ],
      saves: "no more copy-paste",
    });
  }
  if (has("Notion") && has("HubSpot")) {
    cases.push({
      title: "Build a Notion CRM view backed by HubSpot",
      steps: [
        "Mirror HubSpot contacts and deals into Notion",
        "Auto-generate meeting notes and call summaries",
        "Sync edits back to HubSpot on save",
      ],
      saves: "~5 hrs/week",
    });
  }
  if (has("Zoom") && has("HubSpot")) {
    cases.push({
      title: "Turn Zoom calls into HubSpot deal notes",
      steps: [
        "Grab Zoom recording + transcript after each call",
        "Summarize with AI — pain points, objections, next steps",
        "Append to the HubSpot deal and update the stage",
      ],
      saves: "~7 hrs/week",
    });
  }

  if (cases.length === 0) {
    for (const name of apps) {
      const single = SINGLE_APP_CASES[name];
      if (single) cases.push(...single);
    }
  }

  if (cases.length === 0 && a) {
    if (b) {
      cases.push({
        title: `Connect ${a} → ${b}${c ? ` → ${c}` : ""}`,
        steps: [
          `Trigger on new activity in ${a}`,
          `Enrich with AI and route the right record to ${b}`,
          c ? `Loop ${c} in so nothing falls between the cracks` : `Notify the owner so nothing falls between the cracks`,
        ],
        saves: "custom flow",
      });
    } else {
      cases.push({
        title: `Automate your ${a} busywork`,
        steps: [
          `Watch ${a} for the events that matter`,
          `AI classifies, drafts, or routes automatically`,
          `You approve the exceptions — the rest just happens`,
        ],
        saves: "hours back",
      });
    }
  }

  return cases.slice(0, 3);
}

function ActivityTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ACTIVITY.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const row = ACTIVITY[index];
  const style = CATEGORY_STYLE[row.tag];
  const app = APP_BY_NAME[row.app];

  return (
    <div className="relative mx-auto h-16 w-full max-w-md overflow-hidden ">
      <div
        key={index}
        className="animate-[tickerSlide_500ms_cubic-bezier(0.22,1,0.36,1)] absolute inset-0 flex items-center gap-3 border border-neutral-200 bg-white px-3 py-2 text-left shadow-sm"
      >
        {app ? (
          <img
            src={app.logo}
            alt=""
            className="size-10 shrink-0 border border-neutral-100 object-contain bg-white"
          />
        ) : (
          <div className="flex size-10 shrink-0 items-center justify-center bg-neutral-100 text-xs font-bold text-neutral-700">
            {row.app.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-neutral-900">
              {row.app}
            </span>
            <span
              className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold ${style.tagBg} ${style.tagText}`}
            >
              {row.tag}
            </span>
          </div>
          <div className="truncate text-xs text-neutral-600">{row.action}</div>
        </div>
        <div className="shrink-0 whitespace-nowrap text-[11px] text-neutral-400">
          {row.time}
        </div>
      </div>
    </div>
  );
}

function PreviewGraphic({ kind, category }: { kind: Task["preview"]; category: Category }) {
  const style = CATEGORY_STYLE[category];
  return (
    <div className="relative overflow-hidden border border-neutral-200 bg-neutral-50 p-3">
      {kind === "chart" && (
        <div className="flex h-12 items-end gap-1.5">
          {[35, 55, 45, 70, 60, 82, 75, 92].map((h, i) => (
            <div
              key={i}
              className={`w-2 ${style.tagBg} opacity-80`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      )}
      {kind === "list" && (
        <div className="space-y-1.5">
          {[0.9, 0.7, 0.55].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="size-3 bg-neutral-200" />
              <div className="h-1.5 bg-neutral-200" style={{ width: `${w * 100}%` }} />
            </div>
          ))}
        </div>
      )}
      {kind === "email" && (
        <div className="space-y-1.5">
          <div className="h-2 w-1/2 bg-neutral-200" />
          <div className="h-1.5 bg-neutral-200/70" />
          <div className="h-1.5 w-4/5 bg-neutral-200/70" />
          <div className="h-1.5 w-3/5 bg-neutral-200/70" />
        </div>
      )}
      {kind === "doc" && (
        <div className="flex items-start gap-2">
          <div className="size-8 shrink-0 bg-neutral-200" />
          <div className="flex-1 space-y-1.5 pt-1">
            <div className="h-1.5 bg-neutral-200" />
            <div className="h-1.5 w-3/4 bg-neutral-200/70" />
            <div className="h-1.5 w-2/3 bg-neutral-200/70" />
          </div>
        </div>
      )}
      <span
        className={`absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-semibold shadow-sm ${style.tagBg} ${style.tagText}`}
      >
        {category}
      </span>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const style = CATEGORY_STYLE[task.category];
  return (
    <div className="border border-neutral-200 bg-white p-3 shadow-lg shadow-neutral-900/[0.06]">
      <div className="flex items-center gap-2">
        <span
          className={`flex size-7 shrink-0 items-center justify-center text-xs ${style.bg} ring-1 ring-inset ${style.ring}`}
        >
          {style.icon}
        </span>
        <span className="text-sm font-semibold text-neutral-900">{task.category}</span>
        <span className="text-xs text-neutral-500">{task.time}</span>
      </div>
      <p className="mt-2 text-sm leading-snug text-neutral-700">{task.message}</p>
      <div className="mt-3">
        <PreviewGraphic kind={task.preview} category={task.category} />
      </div>
    </div>
  );
}

const SEARCH_HINTS = ["slack", "stripe", "shopify", "notion", "hubspot", "gmail", "airtable"];

export function HomeLanding() {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [hintIdx, setHintIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHintIdx((i) => (i + 1) % SEARCH_HINTS.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const useCases = useMemo(() => generateUseCases(selected), [selected]);

  const visibleApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return PICKER_APP_NAMES.map((name) => APP_BY_NAME[name]).filter(Boolean);
    }
    return ALL_APPS.filter((a) => a.name.toLowerCase().includes(q));
  }, [query]);

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-neutral-900 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-[#faf8f5]/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-2.5 "
              style={{ backgroundColor: BRAND }}
            />
            <span className="text-lg font-semibold tracking-tight">viaSocket</span>
          </div>
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <button
                key={item}
                type="button"
                className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="/app/v4"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Log in
            </a>
            <a
              href="/app/v4"
              className="rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BRAND }}
            >
              Get started →
            </a>
          </div>
        </div>
      </header>

      {/* Hero — floating task cards around a centered headline */}
      <section className="relative overflow-hidden">
        {/* Dotted background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        {/* Brand glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-10%] size-[520px] opacity-[0.08] blur-3xl"
          style={{ backgroundColor: BRAND }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:min-h-[820px] lg:py-24">
          {/* Center headline block */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
              <span
                aria-hidden
                className="inline-block size-1.5 "
                style={{ backgroundColor: BRAND }}
              />
              Chosen by 30,000+ teams
            </div>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              AI workers that run
              <br />
              all your apps in one place.
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-neutral-600">
              ViaSocket&apos;s AI workers plug into the tools your team already
              uses. Hire them once — they handle the busywork across every app,
              around the clock.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BRAND }}
              >
                Start free →
              </button>
              <button
                type="button"
                className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
              >
                See it in action
              </button>
            </div>

            {/* In-hero live activity ticker */}
            <div className="mt-8">
              <div className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex size-2 bg-emerald-500" />
                </span>
                Live — your AI team, right now
              </div>
              <div className="mt-3">
                <ActivityTicker />
              </div>
            </div>
          </div>

          {/* Floating task cards — absolutely placed on lg, grid on smaller */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
            {HERO_TASKS.map((task) => (
              <TaskCard key={task.category} task={task} />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            <div className="pointer-events-auto absolute left-4 top-16 w-60 -rotate-3">
              <TaskCard task={HERO_TASKS[0]} />
            </div>
            <div className="pointer-events-auto absolute left-[-8px] top-[380px] w-60 rotate-2">
              <TaskCard task={HERO_TASKS[2]} />
            </div>
            <div className="pointer-events-auto absolute left-16 bottom-6 w-60 -rotate-2 xl:left-24">
              <TaskCard task={HERO_TASKS[4]} />
            </div>
            <div className="pointer-events-auto absolute right-4 top-16 w-60 rotate-3">
              <TaskCard task={HERO_TASKS[1]} />
            </div>
            <div className="pointer-events-auto absolute right-[-8px] top-[380px] w-60 -rotate-2">
              <TaskCard task={HERO_TASKS[3]} />
            </div>
            <div className="pointer-events-auto absolute right-16 bottom-6 w-60 rotate-2 xl:right-24">
              <TaskCard task={HERO_TASKS[5]} />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes tickerSlide {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* AI Use-case generator */}
      <section className="border-y border-neutral-200 bg-neutral-100">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: `${BRAND}12`, color: "#7a1808" }}
            >
              <span
                aria-hidden
                className="inline-block size-1.5"
                style={{ backgroundColor: BRAND }}
              />
              AI use-case generator
            </div>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Pick your apps.
              <br />
              Watch AI design your workflow.
            </h2>
            <p className="mt-5 text-lg text-neutral-600">
              Tap the tools your team already uses. Our AI proposes concrete
              automations you can turn on in one click.
            </p>
          </div>

          {/* App picker — centered, first */}
          <div className="mt-12 flex flex-col items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold text-neutral-900">
                Your stack
              </div>
              <div className="text-xs text-neutral-500">
                {selected.length} selected
              </div>
            </div>

            {/* Bigger, centered search */}
            <div className="flex w-full max-w-xl items-center gap-3 border border-neutral-300 bg-white px-4 py-3.5 shadow-sm focus-within:border-neutral-500">
              <svg
                className="size-5 shrink-0 text-neutral-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Try ${SEARCH_HINTS[hintIdx]}…`}
                className="w-full bg-transparent text-base text-neutral-900 placeholder:text-neutral-400 outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-sm text-neutral-500 hover:text-neutral-900"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {visibleApps.map((app) => {
                const active = selected.includes(app.name);
                return (
                  <button
                    key={app.name}
                    type="button"
                    onClick={() => toggle(app.name)}
                    className={`group flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-all ${
                      active
                        ? "border-neutral-300 bg-neutral-200 text-neutral-900 shadow-sm"
                        : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    <img
                      src={app.logo}
                      alt=""
                      className="size-5 object-contain"
                    />
                    {app.name}
                    {active && (
                      <span className="ml-1 text-xs text-neutral-600">✓</span>
                    )}
                  </button>
                );
              })}
              {visibleApps.length === 0 && (
                <div className="w-full max-w-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 text-center text-sm text-neutral-500">
                  No apps match &ldquo;{query}&rdquo;. Try another name.
                </div>
              )}
            </div>
          </div>

          {/* AI-generated workflows — grid of white cards */}
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block size-2"
                  style={{ backgroundColor: BRAND }}
                />
                <span className="text-sm font-semibold">
                  AI-generated workflows
                </span>
              </div>
              <span className="text-xs text-neutral-500">
                Updates as you pick
              </span>
            </div>

            {useCases.length === 0 ? (
              <div className="relative mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="border border-neutral-200 bg-white p-5 shadow-sm opacity-70"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="h-2 w-16 bg-neutral-200" />
                        <div className="mt-3 h-3.5 w-3/4 bg-neutral-200" />
                        <div className="mt-2 h-3.5 w-1/2 bg-neutral-200" />
                      </div>
                      <div className="h-5 w-16 bg-neutral-100" />
                    </div>
                    <div className="mt-5 space-y-3">
                      {[0, 1, 2].map((j) => (
                        <div key={j} className="flex items-center gap-3">
                          <div className="size-5 shrink-0 bg-neutral-200" />
                          <div
                            className="h-2 bg-neutral-100"
                            style={{ width: `${75 - j * 12}%` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-7 w-16 bg-neutral-100" />
                      <div className="h-7 w-20 border border-neutral-200 bg-white" />
                    </div>
                  </div>
                ))}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/30 via-white/70 to-white/95">
                  <div className="border border-neutral-200 bg-white px-6 py-4 text-center shadow-md">
                    <div className="text-sm font-semibold text-neutral-900">
                      Pick an app to start
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">
                      AI will suggest workflows in seconds.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {useCases.map((uc, idx) => (
                  <div
                    key={uc.title}
                    className="flex flex-col border border-neutral-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                          Workflow {idx + 1}
                        </div>
                        <h3 className="mt-1 text-base font-semibold leading-snug text-neutral-900">
                          {uc.title}
                        </h3>
                      </div>
                      <span
                        className="shrink-0 whitespace-nowrap px-2 py-0.5 text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${BRAND}12`,
                          color: "#7a1808",
                        }}
                      >
                        {uc.saves}
                      </span>
                    </div>
                    <ol className="mt-4 flex-1 space-y-2">
                      {uc.steps.map((step, i) => (
                        <li
                          key={step}
                          className="flex items-start gap-3 text-sm text-neutral-700"
                        >
                          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center bg-neutral-100 text-[11px] font-bold text-neutral-700">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-5 flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-full px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: BRAND }}
                      >
                        Turn on
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                      >
                        Customize
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden" style={{ backgroundColor: BRAND }}>
        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 size-96 bg-white/10 blur-3xl"
          />
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Start saving your team&apos;s time.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Connect your apps and let AI handle the busywork — from lead capture to
            reconciliation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              Get started free
            </button>
            <button
              type="button"
              className="rounded-full border border-white/30 bg-transparent px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Talk to sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block size-2.5 "
                style={{ backgroundColor: BRAND }}
              />
              <span className="text-lg font-semibold tracking-tight">viaSocket</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-neutral-600">
              Run all your apps in one place. AI-powered automation for teams that
              already have their stack.
            </p>
          </div>
          {[
            { title: "Product", links: ["Integrations", "AI Agents", "Templates", "Pricing"] },
            { title: "Company", links: ["About", "Careers", "Contact", "Blog"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security"] },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-sm font-semibold text-neutral-900">{col.title}</div>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                {col.links.map((l) => (
                  <li key={l}>
                    <button type="button" className="hover:text-neutral-900">
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-neutral-200">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-xs text-neutral-500">
            <span>© 2026 viaSocket. All rights reserved.</span>
            <span>Made with care</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
