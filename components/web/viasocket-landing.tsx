"use client";

import { useState } from "react";

const NAV = ["Product", "Templates", "Integrations", "AI Agents", "Pricing", "Resources"];

const STATS = [
  { value: "30,000+", label: "Happy Users" },
  { value: "10,000+", label: "Active Workflows" },
  { value: "2,200+", label: "Integrations" },
  { value: "4.8/5", label: "from 600+ reviews", stars: true },
];

const INTEGRATIONS = [
  "WhatsApp", "Slack", "Sheets", "Gmail", "HubSpot", "Shopify",
  "Stripe", "Notion", "Salesforce", "Twilio", "Airtable", "Zoom",
];

const HELP_WAYS = [
  { title: "Live Chat", desc: "Instant answers from automation experts" },
  { title: "Book a Call", desc: "30-min free workflow consultation" },
  { title: "WhatsApp", desc: "Message us anytime, we reply fast" },
  { title: "Email", desc: "Detailed help for complex workflows" },
];

const EXPERTS = ["Sarah K.", "Mike R.", "Priya S.", "James L.", "Ana M.", "David T."];

const TEMPLATE_TABS = [
  "Lead Management",
  "WhatsApp",
  "Customer Support",
  "E-commerce",
  "Marketing",
  "Sales",
];

const TEMPLATES = [
  { title: "Facebook Lead Ads to Google Sheets", apps: ["FB", "Sheets"], uses: "2.4k uses" },
  { title: "WhatsApp Order Notifications", apps: ["Shopify", "WA"], uses: "1.8k uses" },
  { title: "Support Ticket to Slack", apps: ["Zendesk", "Slack"], uses: "1.2k uses" },
  { title: "New Lead to HubSpot CRM", apps: ["Forms", "HubSpot"], uses: "980 uses" },
  { title: "Invoice Payment Reminders", apps: ["Stripe", "Gmail"], uses: "760 uses" },
  { title: "Abandoned Cart Recovery", apps: ["Shopify", "WA"], uses: "650 uses" },
  { title: "Meeting Scheduler Sync", apps: ["Calendly", "Sheets"], uses: "540 uses" },
  { title: "Customer Feedback to Notion", apps: ["Typeform", "Notion"], uses: "420 uses" },
];

const COMPARE_ROWS = [
  { feature: "Human Support Included", vs: ["✓ Included", "✗ Paid add-on", "✗ Community only", "✗ Self-serve"] },
  { feature: "AI Workflow Builder", vs: ["✓ Built-in", "Limited", "Limited", "✓ Built-in"] },
  { feature: "Ease of Use", vs: ["Very Easy", "Moderate", "Complex", "Complex"] },
  { feature: "Avg. Support Response", vs: ["2 mins", "24+ hours", "Community", "Self-serve"] },
  { feature: "Free Expert Setup Help", vs: ["✓ Yes", "✗ No", "✗ No", "✗ No"] },
  { feature: "Starting Price", vs: ["Free", "$19.99/mo", "$9/mo", "Free (self-host)"] },
];

const TESTIMONIALS = [
  { quote: "viaSocket's team helped us automate our entire lead flow in one afternoon. Incredible support.", name: "Rahul Mehta", role: "CEO, TechStart India" },
  { quote: "We switched from Zapier and saved 40% while getting better support. The AI builder is a game changer.", name: "Emily Chen", role: "Ops Lead, ScaleUp Co" },
  { quote: "Built our WhatsApp order system without writing a single line of code. Their experts guided us step by step.", name: "Carlos Mendez", role: "Founder, ShopLocal" },
  { quote: "The comparison isn't even close. Real humans who actually understand automation. Highly recommend.", name: "Sarah Johnson", role: "Marketing Dir, GrowthLabs" },
];

const WORKFLOW_STEPS = [
  {
    name: "Shopify",
    action: "New Order",
    icon: (
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect width="32" height="32" rx="6" fill="#96bf48" />
        <path
          d="M21.5 10.2c-.1 0-1.9-.1-1.9-.1s-1.5-1.5-1.7-1.6c-.2-.2-.5-.1-.6-.1l-.8.2c-.9-.1-2.2-.4-3.6-.4-2.4 0-3.6 1.2-3.6 3.5 0 .3 0 .6.1.9-2.4.7-4.1 1.2-4.2 1.2-.6.2-.6.2-.7.8-.1.4-.9 7.2-.9 7.2l14.6 2.5 7.1-1.8s-3.3-12.8-3.4-12.9c-.1-.1-.3-.1-.5-.1h.6z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    action: "Send Message",
    icon: (
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect width="32" height="32" rx="6" fill="#25d366" />
        <path
          d="M16 7c-5 0-9 4-9 9 0 1.5.4 3 1.2 4.2L7 26l4.5-1.2c1.3.8 2.8 1.2 4.5 1.2 5 0 9-4 9-9s-4-9-9-9zm5 13.5c-.2.5-1.2 1-1.6 1.1-.5.1-1 .2-3.1-.6-2.5-1-4.2-3.5-4.3-3.7-.1-.2-1-1.2-1-2.3s.6-1.7.9-1.9c.2-.2.5-.3.8-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.1.1.3 0 .5-.1.2-.2.2-.4.4-.2.2-.4.3-.6.5-.2.2-.4.3-.2.6.2.3.9 1.5 2 2.4 1.5 1.3 2.6 1.6 3 1.8.4.2.6.1.8-.1.2-.2.9-1.1 1.1-1.5.2-.4.5-.3.8-.2.3.1 2 .9 2.3 1.1.3.1.5.2.6.3.1.2.1 1-.1 1.5z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    name: "Shiprocket",
    action: "Create Shipment",
    icon: (
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect width="32" height="32" rx="6" fill="#7c3aed" />
        <path d="M16 8l6 4v8l-6 3-6-3v-8l6-4z" fill="#fff" opacity="0.9" />
        <path d="M16 8v7m-6 1l6 3m6-3l-6 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "HubSpot",
    action: "Update Contact",
    icon: (
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect width="32" height="32" rx="6" fill="#ff7a59" />
        <circle cx="12" cy="12" r="2.5" fill="#fff" />
        <circle cx="20" cy="20" r="2.5" fill="#fff" />
        <path d="M14.5 13.5l5 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="16" r="1.5" fill="#fff" />
      </svg>
    ),
  },
];

function SparkleIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 text-amber-300" fill="currentColor" aria-hidden>
      <path d="M8 1l1.2 3.8L13 6l-3.8 1.2L8 11l-1.2-3.8L3 6l3.8-1.2L8 1z" />
      <path d="M13 10l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9z" opacity=".85" />
    </svg>
  );
}

function FloatingStar({ className, color }: { className?: string; color: "amber" | "violet" }) {
  const fill = color === "amber" ? "#FBBF24" : "#A78BFA";
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path
        d="M10 2l1.8 4.2L16 8l-4.2 1.8L10 14l-1.8-4.2L4 8l4.2-1.8L10 2z"
        fill={fill}
      />
    </svg>
  );
}

function HeroWorkflowCard() {
  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      {/* Floating decorative elements */}      

      <FloatingStar className="absolute -right-6 top-12 size-6 sm:right-0" color="amber" />
      <FloatingStar className="absolute -right-4 top-64 size-5 sm:right-2" color="violet" />

      {/* Main workflow card */}
      <div className="relative rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-gray-50/40 to-white p-8 shadow-2xl shadow-gray-300/20">
        {/* Header section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900">Automation Flow</h3>
          <p className="mt-1 text-sm text-gray-500">Real-time workflow execution</p>
        </div>

        {/* Workflow steps */}
        <div className="space-y-2">
          {[
            { icon: "🛍️", name: "Shopify", action: "Order Received", color: "from-green-400 to-emerald-500" },
            { icon: "💬", name: "WhatsApp", action: "Send Message", color: "from-green-400 to-teal-500" },
            { icon: "📦", name: "Shiprocket", action: "Create Shipment", color: "from-purple-400 to-indigo-500" },
            { icon: "👥", name: "HubSpot", action: "Update CRM", color: "from-orange-400 to-red-500" },
          ].map((step, index) => (
            <div key={step.name}>
              <div className="flex items-center gap-4 rounded-xl bg-white p-4 border border-gray-100 hover:border-gray-300 transition-colors">
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${step.color} text-xl shadow-md`}>
                  {step.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900 text-sm">{step.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{step.action}</div>
                </div>
                <div className="text-gray-300">
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              {index < 3 && (
                <div className="flex justify-center py-1">
                  <div className="w-px h-5 bg-gray-900"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Success indicator */}
        <div className="mt-6 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-sm text-emerald-900">Workflow Complete</div>
            <div className="text-xs text-emerald-700 mt-0.5">All steps executed successfully</div>
          </div>
        </div>
      </div>

      {/* Annotation */}
      <div className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2 hidden lg:block">
        <svg
          viewBox="0 0 120 80"
          className="absolute h-20 w-32 text-emerald-500"
          fill="none"
          aria-hidden
          style={{ transform: 'translateX(-120px) translateY(0)' }}
        >
          <path
            d="M110 50C90 40 70 30 20 25"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <p
          className="max-w-[8rem] text-[1.25rem] leading-snug text-emerald-600 font-semibold"
          style={{ fontFamily: "var(--font-caveat), cursive" }}
        >
          AI builds it.
          <br />
          We help you
          <br />
          perfect it.
        </p>
      </div>
    </div>
  );
}

export function ViaSocketLanding() {
  const [activeTab, setActiveTab] = useState(TEMPLATE_TABS[0]);

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
          <div className="text-xl font-bold text-[#0f3d32]">viaSocket</div>
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <button key={item} type="button" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                {item}
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" />
                </svg>
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button type="button" className="text-sm font-medium text-gray-700 hover:text-gray-900">Login</button>
            <a href="/web/v2" className="text-xs font-medium text-gray-500 hover:text-gray-700 px-2 py-1 rounded border border-gray-200">V2</a>
            <button type="button" className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">
              Start Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              World-class support · Real humans · Fast replies
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-[3.25rem]">
              Build Automations With AI.{" "}
              <span className="text-emerald-500">Get Real Humans To Help When You&apos;re Stuck.</span>
            </h1>
            {/* <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-600">
              Describe your workflow in plain English. Our AI builds it instantly — and if you get stuck,
              real automation experts are ready to help you design, debug, and optimize.
            </p> */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="button" className="rounded-md bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600">
                Start Free — No Credit Card
              </button>              
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
              {["Free 14-day trial", "No credit card required", "Cancel anytime"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <span className="text-emerald-500">✓</span> {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700">Talk to Automation Expert</h3>
                <div className="flex items-center -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
                  ].map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Automation expert ${index + 1}`}
                      className="size-10 rounded-full object-cover border-2 border-white hover:shadow-md transition-shadow cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <HeroWorkflowCard />
        </div>
      </section>

      {/* Stats + integrations */}
      <section className="border-y border-gray-100 bg-gray-50/80 py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="mt-1 flex items-center justify-center gap-1 text-sm text-gray-500">
                {s.stars && <span className="text-amber-400">★★★★★</span>}
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-8 flex max-w-7xl flex-wrap items-center justify-center gap-6 px-6 opacity-70">
          {INTEGRATIONS.map((name) => (
            <span key={name} className="text-sm font-semibold text-gray-500">{name}</span>
          ))}
        </div>
      </section>

      {/* Support — dark */}
      <section className="bg-[#0f3d32] py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-3">
          <div>
            <h2 className="text-2xl font-bold leading-snug sm:text-3xl">
              You&apos;ll never get stuck.{" "}
              <span className="text-emerald-400">We&apos;re here to help.</span>
            </h2>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { v: "2 mins", l: "avg response" },
                { v: "18 mins", l: "avg resolution" },
                { v: "98%", l: "satisfaction" },
              ].map((m) => (
                <div key={m.l} className="rounded-lg bg-white/10 px-2 py-3 text-center">
                  <div className="text-lg font-bold text-emerald-400">{m.v}</div>
                  <div className="text-[10px] text-white/70">{m.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold">Ways to get help</h3>
            <ul className="mt-4 space-y-4">
              {HELP_WAYS.map((w) => (
                <li key={w.title}>
                  <div className="font-medium">{w.title}</div>
                  <div className="text-sm text-white/60">{w.desc}</div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Real people. Real experts.</h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {EXPERTS.map((name) => (
                <div key={name} className="flex flex-col items-center gap-2">
                  <div className="size-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600" />
                  <span className="text-[11px] text-white/80">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stuck building */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-3">
          <div className="flex justify-center">
            <div className="relative h-48 w-48 rounded-2xl border border-dashed border-gray-200 bg-gray-50">
              <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">👩‍💻</div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Stuck building a workflow?</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Our automation experts will design and build your workflow for free. Tell us your use case
              and we&apos;ll handle the rest.
            </p>
            <ol className="mt-6 space-y-2 text-sm text-gray-700">
              {["Tell us your use case", "We design the workflow", "We build it for you", "We help you optimize"].map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900">Book a Free Automation Consultation</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>✓ 30-minute video call with an expert</li>
              <li>✓ Custom workflow design for your use case</li>
              <li>✓ No obligation, completely free</li>
            </ul>
            <button type="button" className="mt-6 w-full rounded-md bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600">
              Book Free Call →
            </button>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">What do you want to automate?</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {TEMPLATE_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "border-emerald-500 bg-white text-emerald-700 shadow-sm"
                    : "border-transparent bg-white/60 text-gray-600 hover:bg-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.map((t) => (
              <article key={t.title} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-2">
                  {t.apps.map((a) => (
                    <span key={a} className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">{a}</span>
                  ))}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-gray-900 leading-snug">{t.title}</h3>
                <p className="mt-2 text-xs text-gray-500">{t.uses}</p>
                <button type="button" className="mt-3 text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                  Try Template →
                </button>
              </article>
            ))}
          </div>
          <p className="mt-8 text-center">
            <button type="button" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
              View all 500+ templates →
            </button>
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Why teams switch to viaSocket</h2>
        <div className="mt-10 overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-4 font-medium text-gray-500">Feature</th>
                <th className="bg-emerald-50 p-4 font-bold text-emerald-800">viaSocket</th>
                <th className="p-4 font-medium text-gray-600">Zapier</th>
                <th className="p-4 font-medium text-gray-600">Make</th>
                <th className="p-4 font-medium text-gray-600">n8n</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.feature} className="border-b border-gray-100 last:border-0">
                  <td className="p-4 font-medium text-gray-800">{row.feature}</td>
                  {row.vs.map((cell, i) => (
                    <td
                      key={cell}
                      className={`p-4 ${i === 0 ? "bg-emerald-50/50 font-semibold text-emerald-800" : "text-gray-600"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900">Loved by businesses of all sizes</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TESTIMONIALS.map((t) => (
              <blockquote key={t.name} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-amber-400 text-sm">★★★★★</div>
                <p className="mt-3 text-sm italic text-gray-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-br from-emerald-300 to-teal-500" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0f3d32] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Ready to automate and scale your business?</h2>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="rounded-md bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600">
              Start Free
            </button>
            <button type="button" className="rounded-md border border-white/30 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              Talk to Expert
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a2a22] py-14 text-white/80">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="text-lg font-bold text-white">viaSocket</div>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              AI-powered automation with real human support. Build workflows faster, never get stuck.
            </p>
            <div className="mt-4 flex gap-3 text-sm text-white/50">
              {["X", "in", "YT", "GH"].map((s) => (
                <span key={s} className="cursor-pointer hover:text-white">{s}</span>
              ))}
            </div>
          </div>
          {[
            { title: "Product", links: ["Features", "Integrations", "AI Agents", "Pricing", "Changelog"] },
            { title: "Resources", links: ["Documentation", "Blog", "Templates", "Community", "Status"] },
            { title: "Company", links: ["About", "Careers", "Contact", "Partners"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security", "GDPR"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-white">{col.title}</h4>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link}>
                    <button type="button" className="hover:text-white">{link}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-white/10 px-6 pt-8 text-xs text-white/40 sm:flex-row">
          <span>© 2026 viaSocket. All rights reserved.</span>
          <span>Made with ♥ in India</span>
        </div>
      </footer>
    </div>
  );
}
