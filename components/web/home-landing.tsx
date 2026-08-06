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

function PlatformBadge({
  platform,
}: {
  platform: "capterra" | "linkedin" | "x" | "g2";
}) {
  if (platform === "linkedin") {
    return (
      <div className="flex items-center gap-1 text-[13px] font-bold text-[#0A66C2]">
        <svg viewBox="0 0 24 24" className="size-5" fill="#0A66C2" aria-hidden>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zM6.813 20.452H3.859V9h2.954v11.452z" />
        </svg>
        LinkedIn
      </div>
    );
  }
  if (platform === "x") {
    return (
      <svg viewBox="0 0 24 24" className="size-5 fill-neutral-900" aria-hidden>
        <path d="M18.244 2H21l-6.52 7.454L22 22h-6.844l-4.79-6.253L4.8 22H2l7-8.006L2 2h6.99l4.32 5.71L18.244 2Zm-1.2 18h1.88L7.03 4H5.03l12.014 16Z" />
      </svg>
    );
  }
  if (platform === "g2") {
    return (
      <div className="flex size-7 items-center justify-center rounded-full bg-[#FF492C] text-[11px] font-bold text-white">
        G2
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-[13px] font-semibold text-neutral-800">
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
        <path d="M12 2 22 22H2L12 2z" fill="#3AB0FF" />
        <path d="M12 2v20L2 22 12 2z" fill="#FF6B6B" />
      </svg>
      Capterra
    </div>
  );
}

function FloatingActivityCard({ item }: { item: (typeof ACTIVITY)[0] }) {
  const style = CATEGORY_STYLE[item.tag];
  const app = APP_BY_NAME[item.app];

  return (
    <div className="flex items-center gap-2.5 border border-neutral-200 bg-white px-3 py-2.5 shadow-lg shadow-neutral-900/[0.07]">
      {app ? (
        <img
          src={app.logo}
          alt=""
          className="size-9 shrink-0 border border-neutral-100 object-contain bg-white"
        />
      ) : (
        <div className="flex size-9 shrink-0 items-center justify-center bg-neutral-100 text-xs font-bold text-neutral-700">
          {item.app.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-xs font-semibold text-neutral-900">
            {item.app}
          </span>
          <span
            className={`shrink-0 px-1.5 py-0.5 text-[9px] font-semibold ${style.tagBg} ${style.tagText}`}
          >
            {item.tag}
          </span>
        </div>
        <div className="mt-0.5 text-[11px] leading-snug text-neutral-600">
          {item.action}
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
      {/* Top announcement bar */}
      <div className="sticky top-0 z-50 hidden border-b border-neutral-300 bg-neutral-200/80 backdrop-blur-xl lg:block">
        <div className="flex h-[30px] items-center justify-end">
          <div className="flex h-[30px] w-full cursor-pointer items-center justify-center gap-2 bg-[#3B62FF] text-sm text-white">
            <span className="tracking-[0.06em]">
              Relay.app is shutting down. We&apos;ll move your workflows to
              viaSocket for you, <strong>Free</strong>.
            </span>
            <a
              href="/app/v4"
              className="flex h-[20px] items-center gap-1 rounded-full border border-white bg-white px-3 text-xs text-black transition-colors hover:bg-neutral-100"
            >
              Import Flow →
            </a>
            <a
              href="/app/v4"
              className="flex h-[20px] items-center gap-1 rounded-full border border-white bg-white px-3 text-xs text-black transition-colors hover:bg-neutral-100"
            >
              Talk to us →
            </a>
          </div>
          <a
            href="/app/v4"
            className="flex h-[30px] w-fit shrink-0 items-center border-l border-neutral-300 px-[18.4px] text-[11px] font-medium uppercase tracking-wide text-neutral-800 hover:text-neutral-900"
          >
            Contact Sales
          </a>
          <a
            href="/app/v4"
            className="flex h-[30px] w-fit shrink-0 items-center border-l border-neutral-300 px-[18.4px] text-[11px] font-medium uppercase tracking-wide text-neutral-800 hover:text-neutral-900"
          >
            Let Us Build
          </a>
          <a
            href="/app/v4"
            className="flex h-[30px] w-fit shrink-0 items-center border-l border-neutral-300 px-[18.4px] text-[11px] font-medium uppercase tracking-wide text-[#3B62FF] hover:opacity-80"
          >
            Support ↗
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-[#faf8f5]/85 backdrop-blur lg:top-[30px]">
        <div className="flex h-[48px] items-center justify-between px-4">
          <a href="/" className="flex min-w-[120px] items-center">
            <span
              aria-hidden
              className="inline-block size-2.5"
              style={{ backgroundColor: BRAND }}
            />
            <span className="ml-2 text-lg font-semibold tracking-tight">
              viaSocket
            </span>
          </a>
          <div className="flex items-center">
            <div className="flex">
              <a
                href="/app/v4"
                className="hidden h-[54px] w-fit items-center justify-center border-l border-r border-neutral-300 px-6 text-xs uppercase text-neutral-800 hover:text-[#a8200c] lg:flex"
              >
                Usecases
              </a>
              <a
                href="/app/v4"
                className="hidden h-[54px] w-fit items-center justify-center border-r border-neutral-300 px-6 text-xs uppercase text-neutral-800 hover:text-[#a8200c] lg:flex"
              >
                Features
              </a>
              <a
                href="/app/v4"
                className="hidden h-[54px] w-fit items-center justify-center border-r border-neutral-300 px-6 text-xs uppercase text-neutral-800 hover:text-[#a8200c] lg:flex"
              >
                Explore Apps
              </a>
              <a
                href="/app/v4"
                className="hidden h-[54px] w-fit flex-col items-center justify-center border-r border-neutral-300 px-6 text-xs uppercase leading-tight text-neutral-800 hover:text-[#a8200c] lg:flex"
              >
                <span>Pricing</span>
                <span
                  className="text-[9px] font-normal normal-case"
                  style={{ color: BRAND }}
                >
                  free forever
                </span>
              </a>
            </div>
            <a
              href="/ai5"
              className="mx-4 flex h-[32px] items-center justify-center whitespace-nowrap rounded-full px-4 text-xs text-white transition-colors hover:bg-black lg:mr-0"
              style={{ backgroundColor: BRAND }}
            >
              Login/Sign Up
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

        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:min-h-[780px] lg:py-16">
          {/* Center headline block */}
          <div className="relative z-10 mx-auto max-w-3xl text-center">
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

            {/* Inline AI use-case generator (replacing CTA buttons) */}
            <div className="mt-10 flex flex-col items-center gap-5">
              {/* Search */}
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

              {/* App chips */}
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
          </div>

          {/* Workflow output — spans full width of hero */}
          {useCases.length > 0 && (
            <div className="relative z-10 mt-10 grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map((uc, idx) => (
                <div
                  key={uc.title}
                  className="flex flex-col border border-neutral-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                        Workflow {idx + 1}
                      </div>
                      <h3 className="mt-1 text-lg font-semibold leading-snug text-neutral-900">
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
                  <ol className="mt-4 flex-1 space-y-2.5">
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

          {/* Mobile: stacked cards */}
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
            {ACTIVITY.map((item) => (
              <FloatingActivityCard key={item.app + item.action} item={item} />
            ))}
          </div>

          {/* Desktop: scattered absolutely-positioned cards */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            {/* Left side */}
            <div className="pointer-events-auto absolute left-[50px] top-10 w-fit max-w-xs -rotate-3">
              <FloatingActivityCard item={ACTIVITY[0]} />
            </div>
            <div className="pointer-events-auto absolute left-0 top-[220px] w-fit max-w-xs rotate-2">
              <FloatingActivityCard item={ACTIVITY[2]} />
            </div>
            <div className="pointer-events-auto absolute left-[-4px] top-[400px] w-fit max-w-xs -rotate-1">
              <FloatingActivityCard item={ACTIVITY[4]} />
            </div>            
            {/* Right side */}
            <div className="pointer-events-auto absolute right-[100px] top-6 w-fit max-w-xs rotate-3">
              <FloatingActivityCard item={ACTIVITY[1]} />
            </div>
            <div className="pointer-events-auto absolute right-0 top-[250px] w-fit max-w-xs -rotate-2">
              <FloatingActivityCard item={ACTIVITY[3]} />
            </div>
            <div className="pointer-events-auto absolute right-[-6px] top-[460px] w-fit max-w-xs rotate-1">
              <FloatingActivityCard item={ACTIVITY[5]} />
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


      {/* Trusted by Thousands */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-14 flex flex-col items-center gap-4 text-center">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Trusted by Thousands.{" "}
              <span style={{ color: BRAND }}>Recognized</span> by the Best.
            </h2>
            <p className="max-w-2xl text-lg text-neutral-600">
              Recognized by leading review platforms and trusted by 10,000+
              businesses worldwide.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {[
              {
                href: "https://www.softwareadvice.com/workflow/#frontrunners",
                src: "https://brand-assets.softwareadvice.com/badge/92042d6a-aeba-4d59-ba4c-00401332bccf.svg",
                label: "Workflow Management",
              },
              {
                href: "https://www.capterra.com/workflow-management-software/shortlist",
                src: "https://brand-assets.capterra.com/badge/a6f0b1ea-b591-4919-9f40-827cd6d6753b.svg",
                label: "Workflow Management",
              },
              {
                href: "https://www.capterra.com/p/10020406/viaSocket/",
                src: "https://brand-assets.capterra.com/badge/0c624c79-b388-4438-bb92-6bdbe09c04ee.svg",
                label: "No Code Platform",
              },
              {
                href: "https://www.capterra.com/p/10020406/viaSocket/",
                src: "https://brand-assets.capterra.com/badge/3237aa22-913d-4d43-bd35-de61668cbc95.svg",
                label: "Low Code Development Platform",
              },
              {
                href: "https://www.capterra.com/p/10020406/viaSocket/",
                src: "https://brand-assets.capterra.com/badge/d7798002-d859-4ccd-8de5-d786d01f39e9.svg",
                label: "Low Code Development Platform",
              },
            ].map((b, i) => (
              <a
                key={i}
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-start gap-3 rounded-xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <img
                  src={b.src}
                  alt={b.label}
                  className="h-24 w-24 object-contain"
                />
                <p className="mt-2 text-center text-sm font-semibold text-neutral-900">
                  {b.label}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-neutral-200 bg-[#f9f6f1]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
          <div className="mb-12 flex flex-col items-center justify-between gap-8 md:flex-row">
            <h2 className="flex items-center gap-2 text-4xl font-semibold tracking-tight sm:text-5xl">
              <span>Reviews</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5 text-red-700"
                aria-hidden
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </h2>
            <div className="inline-flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {/* All */}
              <button
                type="button"
                aria-label="All"
                className="relative flex size-12 scale-105 items-center justify-center overflow-hidden rounded-full bg-white shadow-md ring-2 ring-offset-2 transition-all"
                style={{ boxShadow: `0 0 0 2px ${BRAND}` }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6 text-neutral-700"
                  aria-hidden
                >
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </button>
              {/* LinkedIn */}
              <button
                type="button"
                aria-label="LinkedIn"
                className="flex size-12 items-center justify-center rounded-full border border-neutral-200 bg-white transition-all hover:border-[color:var(--brand)] hover:shadow-sm"
                style={{ ["--brand" as string]: BRAND }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0A66C2"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6"
                  aria-hidden
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </button>
              {/* X */}
              <button
                type="button"
                aria-label="X"
                className="flex size-12 items-center justify-center rounded-full border border-neutral-200 bg-white transition-all hover:shadow-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-5 fill-neutral-900"
                  aria-hidden
                >
                  <path d="M18.244 2H21l-6.52 7.454L22 22h-6.844l-4.79-6.253L4.8 22H2l7-8.006L2 2h6.99l4.32 5.71L18.244 2Zm-1.2 18h1.88L7.03 4H5.03l12.014 16Z" />
                </svg>
              </button>
              {/* G2 */}
              <button
                type="button"
                aria-label="G2"
                className="flex size-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-sm font-bold text-[#FF492C] transition-all hover:shadow-sm"
              >
                G2
              </button>
              {/* Trustpilot / other */}
              <button
                type="button"
                aria-label="Trustpilot"
                className="flex size-12 items-center justify-center rounded-full border border-neutral-200 bg-white transition-all hover:shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0aa"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                  aria-hidden
                >
                  <path d="M22 2 11 13" />
                  <path d="M22 2 15 22l-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Ahmed D.",
                role: "CTO (Computer & Network Security)",
                quote:
                  "Easy to use platform with very powerful tools that replace both n8n and zapier and other tools as well.",
                date: "Aug 28, 2025",
                platform: "capterra" as const,
              },
              {
                name: "Dip Desai",
                role: "Sanchay CRM Partner",
                quote:
                  "Excited to share that we're using viaSocket for our automation workflows, and it's been working exceptionally well! It's making our processes smoother, faster, and more efficient — definitely a keeper.",
                date: "Aug 13, 2025",
                platform: "linkedin" as const,
              },
              {
                name: "Wesley B.",
                role: "\"Finally, a source of MCP services…\"",
                quote:
                  "The fact that had most of the apps I use and was really struggling to find MCP servers that contained a good mix of apps from my research. This one was the best.",
                date: "Oct 01, 2025",
                platform: "g2" as const,
              },
              {
                name: "Raid D.",
                role: "Consultant (Automotive)",
                quote:
                  "A promising platform that's going to change the automation landscape.",
                date: "Aug 28, 2025",
                platform: "capterra" as const,
              },
              {
                name: "Jatinder Grewal",
                role: "@JGrewalB2B",
                quote:
                  "1,877+ MCP servers and AI-powered workflow automation, @viaSocket is redefining what's possible with connected automation. From intelligent AI actions to seamless app integration.",
                date: "Jun 25, 2025",
                platform: "x" as const,
              },
              {
                name: "Aditya R.",
                role: "\"Reliable automation platform…\"",
                quote:
                  "viaSocket has been an amazing platform for automations and integrations. We started using it to connect several apps and reduce our manual work. Within a short time, we were able to automate.",
                date: "Dec 10, 2025",
                platform: "g2" as const,
              },
            ].map((r) => (
              <div
                key={r.name + r.date}
                className="flex flex-col rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">
                        {r.name}
                      </div>
                      <div className="max-w-[180px] truncate text-xs text-neutral-500">
                        {r.role}
                      </div>
                    </div>
                  </div>
                  <PlatformBadge platform={r.platform} />
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-700">
                  {r.quote}
                </p>
                <div className="mt-6 text-xs text-neutral-500">{r.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:py-24">
          <h2 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-12 divide-y divide-neutral-200 border border-neutral-200 bg-white">
            {[
              {
                q: "What is viaSocket?",
                a: "viaSocket is an AI workflow automation and app integration platform that helps you connect apps with no code. It lets businesses automate tasks, streamline operations, and scale without engineering overhead.",
              },
              {
                q: "How is AI workflow automation different from regular automation?",
                a: "Regular automation just runs fixed rules, while AI workflow automation can analyze data, make decisions, and choose smarter paths. This makes workflows adaptive and intelligent.",
              },
              {
                q: "Do I need coding skills to use viaSocket?",
                a: "Not at all. With viaSocket's no-code workflow integration software, you can build automations through a visual drag-and-drop interface. Developers can also extend workflows with custom code.",
              },
              {
                q: "What type of workflows can I build on viaSocket?",
                a: "You can automate sales, marketing, HR, finance, and support tasks with ease. From lead routing to invoice management or AI-driven chat support — viaSocket handles it.",
              },
              {
                q: "Is viaSocket suitable for enterprises?",
                a: "Yes. viaSocket is designed with enterprise-grade security, scalability, and monitoring. Whether you're a startup or a large enterprise, it ensures your workflows run reliably.",
              },
              {
                q: "How quickly can I get started with viaSocket?",
                a: "Very quickly. You can choose from ready-made templates or build your own workflow in minutes. A free plan is available so you can test and scale as you grow.",
              },
            ].map((item) => (
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-5 text-left text-base font-semibold text-neutral-900 hover:bg-neutral-50">
                  <span>{item.q}</span>
                  <span
                    aria-hidden
                    className="shrink-0 text-neutral-400 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm leading-relaxed text-neutral-600">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted / Security */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              viaSocket is the Trusted Choice for{" "}
              <span style={{ color: BRAND }}>Secure Automation</span>
            </h2>
            <p className="mt-5 text-lg text-neutral-600">
              Your data is safe with us — compliant, secure, and built with
              privacy in mind at every step, so you can run workflows with
              confidence.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "SOC 2 (Type II)",
                desc: "Your workflow's data is handled with the highest level of security, privacy, and confidentiality.",
              },
              {
                title: "ISO Certified",
                desc: "We consistently meet international standards to deliver reliable and secure solutions for your business.",
              },
              {
                title: "GDPR & CCPA Compliance",
                desc: "Your data remains private and entirely under your control, at all times.",
              },
              {
                title: "End-to-End Observability",
                desc: "Gain full visibility into your data's journey with detailed audit logs, real-time analytics, and proactive alerts.",
              },
              {
                title: "99.99% Uptime & Enterprise SLA",
                desc: "Stay worry-free with 99.99% uptime and fast, reliable support when you need it most.",
              },
              {
                title: "Error Handling & Recovery",
                desc: "Stay ahead of issues with smart alerts and AI-powered troubleshooting, keeping your workflows running smoothly.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-block size-2.5"
                    style={{ backgroundColor: BRAND }}
                  />
                  <h3 className="text-base font-semibold text-neutral-900">
                    {f.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {f.desc}
                </p>
              </div>
            ))}
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
        <div className="mx-auto max-w-7xl px-6 py-14">
          {/* Brand row */}
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-2.5"
              style={{ backgroundColor: BRAND }}
            />
            <span className="text-lg font-semibold tracking-tight">
              viaSocket
            </span>
          </div>

          {/* Columns */}
          <div className="mt-10 grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {[
              {
                title: "For SaaS",
                links: [
                  "List Your App",
                  "Build Your Own Plug",
                  "Embed",
                  "Whitelabel MCP Server",
                  "Become a Billing Partner",
                  "Showcase Popular Workflows",
                ],
              },
              {
                title: "For AI Agent Builders",
                links: ["viaSocket Embed", "MCP Marketplace"],
              },
              {
                title: "Support",
                links: [
                  "Book a Demo",
                  "Contact Support Team",
                  "Request a Feature",
                  "Knowledge Base",
                  "Community",
                  "Blog",
                  "Download Mobile App",
                  "Request an Integration",
                ],
              },
              {
                title: "Automation Experts",
                links: [
                  "Hire an Expert",
                  "Become a Partner",
                  "Partner Program",
                  "Agency Partner Program",
                ],
              },
              {
                title: "MCP",
                links: [
                  "MCP Marketplace",
                  "MCP for AI Agents",
                  "MCP for SaaS Players",
                ],
              },
              {
                title: "Compare",
                links: [
                  "viaSocket vs Zapier",
                  "viaSocket vs Make",
                  "viaSocket vs Pabbly",
                ],
              },
              {
                title: "Company",
                links: [
                  "About",
                  "We are Hiring",
                  "Culture We Foster",
                  "Roadmap",
                  "AI Transparency",
                ],
              },
              {
                title: "Plans, Pricing and Offer",
                links: [
                  "Pricing",
                  "Startups plan",
                  "Discount for Developing Nations",
                  "Free Access Programs",
                ],
              },
              {
                title: "AI & Automation",
                links: [
                  "Apps Integrations",
                  "Features",
                  "List Your App",
                  "Automations",
                  "Discover Top Apps",
                  "Embed",
                  "Workflow Automation Guide",
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <div className="text-sm font-semibold text-neutral-900">
                  {col.title}
                </div>
                <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                  {col.links.map((l) => (
                    <li key={l}>
                      <button
                        type="button"
                        className="text-left hover:text-neutral-900"
                      >
                        {l}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Explore with AI */}
          <div className="mt-14 border-t border-neutral-200 pt-8">
            <div className="text-sm font-semibold text-neutral-900">
              Explore with AI
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-neutral-600">
              {["ChatGPT", "Claude AI", "Perplexity AI", "xAI (Grok)"].map(
                (a) => (
                  <button
                    key={a}
                    type="button"
                    className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 hover:border-neutral-300 hover:text-neutral-900"
                  >
                    {a}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs text-neutral-500">
            <span>
              © 2026 viaSocket |{" "}
              <button type="button" className="hover:text-neutral-900">
                Privacy
              </button>
              ,{" "}
              <button type="button" className="hover:text-neutral-900">
                Terms
              </button>{" "}
              and{" "}
              <button type="button" className="hover:text-neutral-900">
                Data Retention &amp; Deletion Policy
              </button>
            </span>
            <span>
              Walkover Web Solutions Pvt Ltd. | All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
