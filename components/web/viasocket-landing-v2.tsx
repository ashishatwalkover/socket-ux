"use client";

import { useState } from "react";

const NAV = ["Product", "Templates", "Integrations", "AI Agents", "Pricing", "Resources"];

const SUPPORT_STATS = [
  { value: "2 mins", label: "Avg Response Time", highlight: true },
  { value: "98%", label: "Customer Satisfaction", highlight: true },
  { value: "24/7", label: "Expert Support Available" },
  { value: "30k+", label: "Happy Users Supported" },
];

const SUPPORT_CHANNELS = [
  { 
    icon: "💬", 
    title: "Live Chat", 
    desc: "Instant answers from automation experts",
    time: "2 min avg response"
  },
  { 
    icon: "📞", 
    title: "Priority Phone Support", 
    desc: "Talk directly to our team",
    time: "Available 24/7"
  },
  { 
    icon: "📅", 
    title: "Expert Consultations", 
    desc: "30-min free workflow design sessions",
    time: "Book anytime"
  },
  { 
    icon: "💡", 
    title: "Dedicated Success Manager", 
    desc: "Personal guide for your automation journey",
    time: "For paid plans"
  },
];

const SUPPORT_FEATURES = [
  {
    title: "Never Get Stuck",
    desc: "Real automation experts available whenever you need help",
    icon: "🎯"
  },
  {
    title: "Proactive Monitoring",
    desc: "We watch your workflows and alert you before issues happen",
    icon: "👁️"
  },
  {
    title: "Custom Training",
    desc: "Personalized onboarding and training for your team",
    icon: "🎓"
  },
  {
    title: "Priority Bug Fixes",
    desc: "Your issues get fixed first, guaranteed",
    icon: "⚡"
  },
];

const SUCCESS_STORIES = [
  {
    company: "TechStart India",
    quote: "viaSocket's support team helped us automate our entire lead flow in one afternoon. They didn't just build it—they explained everything so we could maintain it ourselves.",
    person: "Rahul Mehta",
    role: "CEO",
    result: "Saved 20 hours/week"
  },
  {
    company: "ScaleUp Co",
    quote: "We switched from Zapier. The support is incomparable. When we had questions, real humans answered within minutes. Game changer.",
    person: "Emily Chen",
    role: "Operations Lead",
    result: "40% cost savings"
  },
  {
    company: "ShopLocal",
    quote: "Built our WhatsApp order system without coding. Their experts guided us step by step. Best decision we made.",
    person: "Carlos Mendez",
    role: "Founder",
    result: "2x order volume"
  },
  {
    company: "GrowthLabs",
    quote: "The difference is night and day. Real humans who understand automation. They proactively help us optimize workflows.",
    person: "Sarah Johnson",
    role: "Marketing Director",
    result: "50% faster setup"
  },
];

const INTEGRATIONS = [
  "WhatsApp", "Slack", "Sheets", "Gmail", "HubSpot", "Shopify",
  "Stripe", "Notion", "Salesforce", "Twilio", "Airtable", "Zoom",
];

const COMPARE_ROWS = [
  { feature: "Human Support Included", vs: ["✓ 24/7", "✗ Paid add-on", "✗ Community", "✗ Self-serve"] },
  { feature: "Avg Support Response", vs: ["2 mins", "24+ hours", "Days", "N/A"] },
  { feature: "Free Expert Setup Help", vs: ["✓ Yes", "✗ No", "✗ No", "✗ No"] },
  { feature: "Dedicated Success Manager", vs: ["✓ Available", "✗ No", "✗ No", "✗ No"] },
  { feature: "Proactive Workflow Monitoring", vs: ["✓ Yes", "✗ No", "✗ No", "✗ No"] },
  { feature: "Custom Training Included", vs: ["✓ Yes", "✗ No", "✗ No", "✗ No"] },
];

export function ViaSocketLandingV2() {
  const [activeTab, setActiveTab] = useState("Support");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white antialiased overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 blur-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
          <div className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">viaSocket</div>
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <button key={item} type="button" className="text-sm text-gray-300 hover:text-white transition-colors relative group">
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button type="button" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Login</button>
            <a href="/web" className="text-xs font-medium text-gray-400 hover:text-gray-200 px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all">V1</a>
            <button type="button" className="rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300">
              Start Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Support Focused */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24 relative">
        <div className="space-y-12">
          {/* Top tagline */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-emerald-400">⭐</span>
            <span className="text-sm font-semibold text-emerald-300">World-class support. Real humans. Fast replies.</span>
          </div>

          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div className="space-y-3">
                <h1 className="text-5xl sm:text-6xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
                  <span className="block">Build Automations</span>
                  <span className="block">With AI.</span>
                  <span className="block text-emerald-400">Get Real Humans To</span>
                  <span className="block text-emerald-400">Help When You're Stuck.</span>
                </h1>
              </div>

              <p className="text-base sm:text-lg text-gray-300 max-w-lg leading-relaxed">
                Create powerful workflows in minutes using AI. Our automation experts help you build, debug and optimize them – so you get results, not roadblocks.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="button" className="group rounded-lg bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-base font-semibold text-white transition-all duration-300">
                  Start Free – No Credit Card
                </button>
                <button type="button" className="group flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-all duration-300">
                  <span>👥</span>
                  Talk to Automation Expert
                </button>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                {["Free 14-day trial", "No credit card required", "Cancel anytime"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-gray-300">
                    <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Automation Flow Visualization */}
            <div className="relative lg:h-full flex items-center justify-center">
            <div className="w-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-xl shadow-2xl">
              <div className="space-y-4">
                {[
                  { icon: "🛍️", app: "Shopify", action: "New Order", color: "from-green-400 to-emerald-500" },
                  { icon: "�", app: "WhatsApp", action: "Send Message", color: "from-green-400 to-teal-500" },
                  { icon: "📦", app: "Shiprocket", action: "Create Shipment", color: "from-purple-400 to-indigo-500" },
                  { icon: "�", app: "HubSpot", action: "Update CRM", color: "from-orange-400 to-red-500" },
                ].map((step, index) => (
                  <div key={step.app}>
                    <div className="flex items-center gap-4 rounded-xl bg-white/5 border border-white/10 p-4 hover:border-emerald-400/50 hover:bg-white/10 transition-all duration-300 group">
                      <div className={`flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${step.color} text-xl shadow-lg`}>
                        {step.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-white text-sm">{step.app}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{step.action}</div>
                      </div>
                      <div className="text-gray-400 group-hover:text-emerald-400 transition-colors">
                        <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    {index < 3 && (
                      <div className="flex justify-center py-2">
                        <div className="w-px h-6 bg-gradient-to-b from-emerald-400/50 to-transparent" />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Success indicator */}
                <div className="mt-4 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 p-4 flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/30">
                    <svg className="size-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-emerald-300">Workflow Complete</div>
                    <div className="text-xs text-emerald-200/70 mt-0.5">All steps executed successfully</div>
                  </div>
                </div>

                {/* Support Card */}
                <div className="mt-6 rounded-xl bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 p-4">
                  <div className="text-xs text-gray-400 mb-3">Need help optimizing this workflow?</div>
                  <div className="flex items-center justify-between gap-4">
                    <button type="button" className="flex-1 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-rose-500/50 transition-all duration-300">
                      Connect with Expert
                    </button>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[
                          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
                        ].map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Expert ${idx + 1}`}
                            className="size-8 rounded-full border-2 border-slate-900 object-cover"
                          />
                        ))}
                      </div>
                      <div className="text-xs text-gray-300">
                        <div className="font-semibold">Real humans.</div>
                        <div className="text-gray-400">Real help.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Stats */}
      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold mb-12">Trusted by Industry Leaders</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: "2 mins", label: "Avg Response", highlight: true },
              { value: "98%", label: "Satisfaction", highlight: true },
              { value: "24/7", label: "Support", highlight: false },
              { value: "30k+", label: "Happy Users", highlight: false },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl border p-6 text-center transition-all duration-300 hover:border-emerald-400/50 ${s.highlight ? "border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                <div className={`text-3xl font-bold ${s.highlight ? "text-emerald-400" : "text-white"}`}>{s.value}</div>
                <div className="mt-2 text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Multiple Ways to Get Help</h2>
          <p className="text-gray-400 text-lg">Choose how you want to connect with our experts</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "💬", title: "Live Chat", desc: "Instant answers from experts", time: "2 min avg" },
            { icon: "📞", title: "Phone Support", desc: "Talk directly to our team", time: "24/7" },
            { icon: "📅", title: "Consultations", desc: "30-min free design sessions", time: "Book now" },
            { icon: "💡", title: "Success Manager", desc: "Personal guide for your journey", time: "Premium" },
          ].map((channel) => (
            <div key={channel.title} className="group rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 hover:border-emerald-400/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{channel.icon}</div>
              <h3 className="font-semibold text-white text-lg mb-2">{channel.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{channel.desc}</p>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {channel.time}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Support Features */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-cyan-500/5 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Makes Our Support Different</h2>
            <p className="text-gray-400 text-lg">We don't just fix problems. We help you succeed.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { icon: "🎯", title: "Never Get Stuck", desc: "Real experts available whenever you need help" },
              { icon: "👁️", title: "Proactive Monitoring", desc: "We watch your workflows and alert you before issues" },
              { icon: "🎓", title: "Custom Training", desc: "Personalized onboarding for your entire team" },
              { icon: "⚡", title: "Priority Bug Fixes", desc: "Your issues get fixed first, guaranteed" },
            ].map((feature, idx) => (
              <div key={feature.title} className="group rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 hover:border-emerald-400/50 hover:bg-white/15 transition-all duration-300 backdrop-blur-sm" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Real Results from Real Users</h2>
          <p className="text-gray-400 text-lg">See how our support helped teams automate faster</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SUCCESS_STORIES.map((story, idx) => (
            <div key={story.company} className="group rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 hover:border-emerald-400/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white text-sm">{story.company}</h3>
                  <p className="text-xs text-gray-400 mt-1">{story.role} • {story.person}</p>
                </div>
                <div className="text-xl">⭐</div>
              </div>
              <p className="text-sm text-gray-300 italic leading-relaxed mb-4">"{story.quote}"</p>
              <div className="rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 px-3 py-2">
                <p className="text-xs font-semibold text-emerald-300">📈 {story.result}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison - Support as USP */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Teams Switch to viaSocket</h2>
            <p className="text-gray-400 text-lg">The difference is in the support</p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 font-medium text-gray-400">Feature</th>
                  <th className="bg-gradient-to-b from-emerald-500/20 to-emerald-500/10 p-4 font-bold text-emerald-300">viaSocket</th>
                  <th className="p-4 font-medium text-gray-400">Zapier</th>
                  <th className="p-4 font-medium text-gray-400">Make</th>
                  <th className="p-4 font-medium text-gray-400">n8n</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.feature} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium text-white">{row.feature}</td>
                    {row.vs.map((cell, i) => (
                      <td
                        key={cell}
                        className={`p-4 ${i === 0 ? "bg-emerald-500/10 font-semibold text-emerald-300" : "text-gray-400"}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold mb-10">Works With 2,200+ Apps</h2>
        <div className="flex flex-wrap items-center justify-center gap-6 opacity-60">
          {INTEGRATIONS.map((name) => (
            <span key={name} className="text-sm font-semibold text-gray-400">{name}</span>
          ))}
        </div>
      </section>

      {/* Expert Consultation CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 p-12 backdrop-blur-sm">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-4xl font-bold mb-4">Need Help Getting Started?</h2>
              <p className="text-gray-300 text-lg mb-6">Book a free 30-minute consultation with one of our automation experts. We'll design a custom workflow for your use case.</p>
              <ul className="space-y-3 text-base text-gray-300">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Custom workflow design
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No obligation, completely free
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  30-minute video call
                </li>
              </ul>
            </div>
            <div className="flex justify-center lg:justify-end">
              <button type="button" className="group rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-10 py-5 text-lg font-semibold text-white hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300">
                <span className="flex items-center gap-2">
                  Book Free Consultation
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 blur-3xl" />
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 sm:flex-row relative z-10">
          <div>
            <h2 className="text-3xl font-bold">Ready to automate with confidence?</h2>
            <p className="mt-2 text-gray-400 text-lg">Join 30,000+ users who trust viaSocket</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button type="button" className="group rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3 text-base font-semibold text-white hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300">
              <span className="flex items-center gap-2">
                Start Free Trial
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button type="button" className="rounded-lg border border-white/20 px-8 py-3 text-base font-semibold text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm">
              Talk to Expert
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 text-white/80">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">viaSocket</div>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              AI-powered automation with world-class human support. Never get stuck again.
            </p>
            <div className="mt-6 flex gap-4 text-sm">
              {["X", "in", "YT", "GH"].map((s) => (
                <button key={s} type="button" className="text-gray-400 hover:text-emerald-400 transition-colors">{s}</button>
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
              <ul className="mt-4 space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link}>
                    <button type="button" className="text-gray-400 hover:text-white transition-colors">{link}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 px-6 pt-8 text-xs text-gray-500 sm:flex-row">
          <span>© 2026 viaSocket. All rights reserved.</span>
          <span>Made with ♥ in India</span>
        </div>
      </footer>
    </div>
  );
}
