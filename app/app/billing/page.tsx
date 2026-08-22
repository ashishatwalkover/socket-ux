"use client";

import { useState } from "react";
import { Button, Paper, TextField } from "@mui/material";
import {
  CheckCircleRounded,
  CancelRounded,
  BoltRounded,
  RocketLaunchRounded,
  StarRounded,
  WorkspacePremiumRounded,
  HistoryRounded,
  ReceiptLongRounded,
  CreditCardRounded,
  AddRounded,
  LocalOfferRounded,
  TrendingUpRounded,
  InfoOutlined,
  DownloadRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";

type Plan = {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnually: number;
  tagline: string;
  icon: React.ReactNode;
  highlight?: boolean;
  features: { label: string; included: boolean }[];
};

const PLANS: Plan[] = [
  {
    id: "solo",
    name: "Solo",
    priceMonthly: 39,
    priceAnnually: 32,
    tagline: "For individuals shipping side projects",
    icon: <BoltRounded className="text-blue-600" />,
    features: [
      { label: "2,000 credits / month", included: true },
      { label: "5,000 tasks / month", included: true },
      { label: "1,500+ app connections", included: true },
      { label: "All basic built-in tools", included: true },
      { label: "AI tools", included: false },
      { label: "Team members", included: false },
    ],
  },
  {
    id: "team",
    name: "Team",
    priceMonthly: 79,
    priceAnnually: 65,
    tagline: "For growing teams that need collaboration",
    icon: <RocketLaunchRounded className="text-purple-600" />,
    highlight: true,
    features: [
      { label: "5,000 credits / month", included: true },
      { label: "15,000 tasks / month", included: true },
      { label: "Unlimited team members", included: true },
      { label: "All basic built-in tools", included: true },
      { label: "Advanced AI models", included: true },
      { label: "5-min polling interval", included: true },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    priceMonthly: 99,
    priceAnnually: 82,
    tagline: "For teams that need real-time & priority",
    icon: <WorkspacePremiumRounded className="text-amber-600" />,
    features: [
      { label: "10,000 credits / month", included: true },
      { label: "25,000 tasks / month", included: true },
      { label: "Unlimited team members", included: true },
      { label: "All basic built-in tools", included: true },
      { label: "Advanced AI models", included: true },
      { label: "1-min polling (real-time)", included: true },
      { label: "Top priority queue", included: true },
    ],
  },
];

const INVOICES = [
  { id: "INV-2026-07", date: "Jul 01, 2026", amount: "$0.00", status: "Paid", plan: "Basic" },
  { id: "INV-2026-06", date: "Jun 01, 2026", amount: "$79.00", status: "Paid", plan: "Team" },
  { id: "INV-2026-05", date: "May 01, 2026", amount: "$79.00", status: "Paid", plan: "Team" },
];

function UsageStat({
  label,
  used,
  total,
  color,
  icon,
  trend,
}: {
  label: string;
  used: number;
  total: number;
  color: string;
  icon: React.ReactNode;
  trend?: string;
}) {
  const pct = Math.min(100, Math.round((used / total) * 100));
  const remaining = Math.max(0, total - used);
  const isOver = used > total;

  return (
    <Paper variant="outlined" className="!bg-white">
      <div className="px-5 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
              {icon}
            </span>
            <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
          </div>
          {trend && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <TrendingUpRounded style={{ fontSize: 14 }} />
              {trend}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-gray-900 tabular-nums">
            {used.toLocaleString()}
          </span>
          <span className="text-sm text-gray-400">/ {total.toLocaleString()}</span>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isOver ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-emerald-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>{pct}% used</span>
          <span className="tabular-nums">{remaining.toLocaleString()} remaining</span>
        </div>
      </div>
    </Paper>
  );
}

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const resetDays = 29;
  const resetDate = "Jul 31, 2026";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Billing & Subscription</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your plan, credits, usage, and payment methods.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-500">Next billing cycle</p>
              <p className="text-sm font-medium text-gray-900">
                {resetDate} · <span className="text-blue-600">{resetDays} days</span>
              </p>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <HistoryRounded style={{ fontSize: 16 }} />
              Usage history
            </button>
          </div>
        </header>

        {/* Current plan banner + usage in one section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <UsageStat
            label="Credits"
            used={0}
            total={500}
            color="bg-blue-50 text-blue-600"
            icon={<BoltRounded style={{ fontSize: 18 }} />}
          />
          <UsageStat
            label="Tasks"
            used={12689}
            total={2000}
            color="bg-emerald-50 text-emerald-600"
            icon={<CheckCircleRounded style={{ fontSize: 18 }} />}
            trend="+12% vs last month"
          />
          <Paper variant="outlined" className="!bg-gradient-to-br !from-blue-600 !to-indigo-700 !text-white !ring-0">
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 text-white/80">
                <StarRounded style={{ fontSize: 18 }} />
                <span className="text-xs font-medium uppercase tracking-wide">Current plan</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-semibold">Basic</span>
                <span className="inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                  Active
                </span>
              </div>
              <p className="mt-1 text-sm text-white/70">$0 / month · 500 credits · 2,000 tasks</p>
              <Button
                variant="text"
                className="mt-4"
                endIcon={<ArrowForwardRounded style={{ fontSize: 16 }} />}
                sx={{ color: "#fff", px: 0, minWidth: 0 }}
              >
                Compare plans
              </Button>
            </div>
          </Paper>
        </section>

        {/* Upgrade section */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Upgrade your plan</h2>
              <p className="text-sm text-gray-500">Save up to 20% with annual billing.</p>
            </div>

            {/* Billing cycle toggle */}
            <div className="inline-flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-gray-200 shadow-sm">
              {(["monthly", "annually"] as const).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`relative px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    billingCycle === cycle
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {cycle === "monthly" ? "Monthly" : "Annually"}
                  {cycle === "annually" && (
                    <span className="ml-1.5 inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-1.5 py-0.5 text-[10px] font-semibold">
                      -20%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const price =
                billingCycle === "monthly" ? plan.priceMonthly : plan.priceAnnually;
              const isSelected = selectedPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-xl bg-white p-5 transition-all ${
                    plan.highlight
                      ? "ring-2 ring-purple-500 shadow-lg"
                      : "ring-1 ring-gray-200 hover:ring-gray-300 hover:shadow-md"
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-purple-600 text-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wider shadow">
                      <StarRounded style={{ fontSize: 12 }} />
                      Most popular
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                      {plan.icon}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{plan.name}</h3>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-gray-500 min-h-[2.5rem]">{plan.tagline}</p>

                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-semibold text-gray-900">${price}</span>
                    <span className="text-sm text-gray-500">/mo</span>
                    {billingCycle === "annually" && (
                      <span className="ml-1 text-xs text-gray-400 line-through">
                        ${plan.priceMonthly}
                      </span>
                    )}
                  </div>
                  {billingCycle === "annually" && (
                    <p className="text-xs text-emerald-600 font-medium">
                      Billed ${price * 12}/year
                    </p>
                  )}

                  <div className="my-4 border-t border-gray-100" />

                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f.label}
                        className={`flex items-start gap-2 text-sm ${
                          f.included ? "text-gray-700" : "text-gray-400 line-through"
                        }`}
                      >
                        {f.included ? (
                          <CheckCircleRounded
                            className="text-emerald-500 flex-shrink-0 mt-0.5"
                            style={{ fontSize: 18 }}
                          />
                        ) : (
                          <CancelRounded
                            className="text-gray-300 flex-shrink-0 mt-0.5"
                            style={{ fontSize: 18 }}
                          />
                        )}
                        <span>{f.label}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                      plan.highlight
                        ? "bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
                        : isSelected
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {isSelected ? "Selected" : `Choose ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Coupon + Payment method */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Paper variant="outlined" className="!bg-white">
            <div className="p-5">
              <div className="flex items-center gap-2">
                <LocalOfferRounded className="text-blue-600" style={{ fontSize: 20 }} />
                <h3 className="text-base font-medium">Have a coupon?</h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Apply a discount code before you upgrade.</p>
              <div className="mt-4 flex gap-2">
                <TextField
                  type="text"
                  size="small"
                  fullWidth
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                />
                <Button
                  variant="contained"
                  disabled={!coupon}
                  onClick={() => setCouponApplied(true)}
                >
                  Apply
                </Button>
              </div>
              {couponApplied && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 text-emerald-700 px-3 py-2 text-sm">
                  <CheckCircleRounded style={{ fontSize: 16 }} />
                  Coupon <strong>{coupon}</strong> applied · 15% off next invoice
                </div>
              )}
            </div>
          </Paper>

          <Paper variant="outlined" className="!bg-white">
            <div className="p-5">
              <div className="flex items-center gap-2">
                <CreditCardRounded className="text-blue-600" style={{ fontSize: 20 }} />
                <h3 className="text-base font-medium">Payment method</h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Cards used for billing your subscription.</p>
              <div className="mt-4 rounded-lg border border-dashed border-gray-200 bg-gray-50/50 p-6 flex flex-col items-center justify-center text-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-gray-200 mb-2">
                  <CreditCardRounded className="text-gray-400" style={{ fontSize: 20 }} />
                </div>
                <p className="text-sm text-gray-600">No payment method on file</p>
                <Button
                  variant="contained"
                  size="small"
                  className="mt-3"
                  startIcon={<AddRounded style={{ fontSize: 16 }} />}
                  sx={{ bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" } }}
                >
                  Add payment method
                </Button>
              </div>
            </div>
          </Paper>
        </section>

        {/* Invoice history */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ReceiptLongRounded style={{ fontSize: 20 }} className="text-gray-500" />
                Billing history
              </h2>
              <p className="text-sm text-gray-500">Download past invoices and receipts.</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-medium uppercase text-gray-500">
                <tr>
                  <th className="text-left px-5 py-3">Invoice</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Plan</th>
                  <th className="text-left px-5 py-3">Amount</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-right px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {INVOICES.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-gray-700">{inv.id}</td>
                    <td className="px-5 py-3 text-gray-700">{inv.date}</td>
                    <td className="px-5 py-3 text-gray-700">{inv.plan}</td>
                    <td className="px-5 py-3 font-medium text-gray-900 tabular-nums">
                      {inv.amount}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs font-medium">
                        <CheckCircleRounded style={{ fontSize: 12 }} />
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="inline-flex items-center gap-1 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 text-xs font-medium transition-colors">
                        <DownloadRounded style={{ fontSize: 14 }} />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Info footer */}
        <div className="flex items-start gap-2 rounded-lg bg-blue-50/60 border border-blue-100 p-3 text-sm text-blue-900">
          <InfoOutlined style={{ fontSize: 18 }} className="text-blue-500 mt-0.5" />
          <p>
            Plans renew automatically. Cancel or change your plan anytime before the next
            billing cycle — no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
