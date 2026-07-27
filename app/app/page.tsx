"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HomeVersionSwitcher } from "@/components/home-version-switcher";

/* Brand logos (displayed directly; the icon-proxy is only needed for color sampling). */
const LOGO = {
  sheets: "https://stuff.thingsofbrand.com/google.com/images/img4_googlesheet.png",
  slack: "https://stuff.thingsofbrand.com/slack.com/images/img668216333e_slack.jpg",
  hubspot: "https://stuff.thingsofbrand.com/hubspot.com/images/img6_hubspot.jpg",
  gmail: "https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png",
  shopify: "https://stuff.thingsofbrand.com/shopify.com/images/img6_shopify.jpg",
  drive: "https://stuff.thingsofbrand.com/google.com/images/img6_googledrive.jpg",
};

type IconSpec =
  | { src: string }
  | { label: string; className: string };

type Template = {
  id: string;
  from: IconSpec;
  to: IconSpec;
  title: string;
  description: string;
  tag: string;
  tagClass: string;
};

const TEMPLATES: Template[] = [
  {
    id: "sheets-slack",
    from: { src: LOGO.sheets },
    to: { src: LOGO.slack },
    title: "New row in Google Sheets → Send to Slack",
    description: "Get notified on Slack whenever a new row is added.",
    tag: "Popular",
    tagClass: "bg-violet-50 text-violet-700",
  },
  {
    id: "typeform-hubspot",
    from: { label: "T", className: "bg-slate-900 text-white" },
    to: { src: LOGO.hubspot },
    title: "Typeform response → Add to HubSpot",
    description: "Capture leads from Typeform and add them to HubSpot.",
    tag: "Leads",
    tagClass: "bg-emerald-50 text-emerald-700",
  },
  {
    id: "gmail-sheets",
    from: { src: LOGO.gmail },
    to: { src: LOGO.sheets },
    title: "Gmail attachment → Save to Google Sheets",
    description: "Save email attachments details to a sheet.",
    tag: "Email",
    tagClass: "bg-blue-50 text-blue-700",
  },
  {
    id: "shopify-sheets",
    from: { src: LOGO.shopify },
    to: { src: LOGO.sheets },
    title: "New Shopify order → Log to Google Sheets",
    description: "Keep track of new orders in a sheet.",
    tag: "E-commerce",
    tagClass: "bg-amber-50 text-amber-700",
  },
  {
    id: "gmail-drive",
    from: { label: "PDF", className: "bg-red-500 text-white text-[9px]" },
    to: { src: LOGO.drive },
    title: "PDF in Gmail → Save to Drive",
    description: "Automatically save PDF attachments to Drive.",
    tag: "Documents",
    tagClass: "bg-orange-50 text-orange-700",
  },
];

function AppIcon({ icon }: { icon: IconSpec }) {
  return (
    <div className="size-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden shadow-sm">
      {"src" in icon ? (
        <img src={icon.src} alt="" className="size-6 object-contain" />
      ) : (
        <span className={`size-full flex items-center justify-center font-bold ${icon.className}`}>
          {icon.label}
        </span>
      )}
    </div>
  );
}

const Sparkle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M12 2l1.8 5.6L19.5 9l-5.7 1.4L12 16l-1.8-5.6L4.5 9l5.7-1.4L12 2z" />
  </svg>
);

export default function HomeV1() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Progressive reveal: templates/integrations appear only after the user
  // submits their goal via "Build it with AI" — first say what you want,
  // then we surface the integrations & templates you can use.
  const build = () => {
    if (input.trim()) setSubmitted(true);
  };

  const useTemplate = (t: Template) => {
    router.push(`/ai?prompt=${encodeURIComponent(t.title)}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HomeVersionSwitcher />

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-violet-600">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13l0-8z" />
            </svg>
          </span>
          <span className="text-lg font-bold text-slate-900">ViaSocket</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Need help?
          </button>
          <div className="flex items-center gap-1.5">
            <span className="size-8 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold flex items-center justify-center">AY</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 flex flex-col justify-center">
        {/* Step 1 hero + input — hidden once the user submits */}
        {!submitted && (
        <div className="w-full max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 relative inline-block">
            What would you like to automate?
            <Sparkle className="absolute -right-6 -top-2 text-violet-500" />
          </h1>
          <p className="mt-4 text-slate-500">
            Describe your goal in simple words. Our AI will build the workflow for you.
          </p>
        </div>

        {/* Input card */}
        <div className={`mt-10 rounded-2xl border bg-white transition-shadow ${focused ? "border-violet-400 shadow-[0_0_0_4px_rgba(139,92,246,0.08)]" : "border-slate-200 shadow-sm"}`}>
          <div className="p-5">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 500))}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && input.trim()) {
                  e.preventDefault();
                  build();
                }
              }}
              placeholder="E.g. When a new lead is added in Typeform, add to CRM and notify me on Slack"
              rows={2}
              className="w-full resize-none outline-none text-[15px] text-slate-900 placeholder:text-slate-400"
            />
            <div className="mt-3 flex items-center justify-between">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-violet-700 hover:bg-violet-50 transition-colors">
                <Sparkle width={14} height={14} />
                Enhance with AI
              </button>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400">{input.length}/500</span>
                <button
                  onClick={build}
                  disabled={!input.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  Build it with AI
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
        )}

        {/* Progressive step 2: templates & integrations — revealed after submit */}
        {submitted && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Big heading (replaces the step-1 hero) */}
            <h1 className="text-4xl font-bold text-slate-900 text-center relative inline-block w-full">
              We found some templates &amp; integrations for your use case
            </h1>
            <div className="mt-10" />
            {/* Template / integration suggestions */}
            <div className="grid grid-cols-3 gap-4">
              {TEMPLATES.slice(0, 3).map((t) => (
                <button
                  key={t.id}
                  onClick={() => useTemplate(t)}
                  className="text-left rounded-2xl border border-slate-200 p-4 hover:border-violet-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2">
                    <AppIcon icon={t.from} />
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    <AppIcon icon={t.to} />
                  </div>
                  <div className="mt-4 font-semibold text-sm text-slate-900 leading-snug">{t.title}</div>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">{t.description}</p>
                  <span className={`mt-4 inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${t.tagClass}`}>{t.tag}</span>
                </button>
              ))}
            </div>

            {/* OR divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400">OR</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Use case card */}
            <div className="rounded-2xl border border-slate-200 p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Your use case</div>
                <p className="mt-2 text-sm text-slate-800 leading-relaxed">{input}</p>
              </div>
              <button
                onClick={() => router.push(`/ai?prompt=${encodeURIComponent(input)}`)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
              >
                <Sparkle width={14} height={14} />
                Proceed with AI
              </button>
            </div>
          </div>
        )}

        {/* Chat / talk-to-us — visible by default, hidden after submit */}
        {!submitted && (
        <div className="mt-8 w-full max-w-xl mx-auto rounded-2xl bg-violet-50/70 px-6 py-5 flex items-center gap-4">
              <span className="size-9 rounded-full bg-white flex items-center justify-center text-violet-600 shadow-sm">
                <Sparkle width={18} height={18} />
              </span>
              <div className="flex-1">
                <div className="font-semibold text-sm text-slate-900">Not sure where to start?</div>
                <div className="text-sm text-slate-500">Talk to us and we'll help you figure out what to automate.</div>
              </div>
              <button
                onClick={() => router.push("/ai")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Talk to us
              </button>
            </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Your data is secure and private. <button className="text-violet-600 hover:underline">Learn more</button>
        </span>
      </footer>
    </div>
  );
}
