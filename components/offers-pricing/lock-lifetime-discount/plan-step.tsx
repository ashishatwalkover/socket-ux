"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PLANS, type BillingPeriod, type Plan, type PlanId } from "./plan-data";

function FeatureCheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="7" fill="#22c55e" />
      <path
        d="M5 8l2 2 4-4.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureXIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="7" fill="#e2e8f0" />
      <path
        d="M6 6l4 4M10 6l-4 4"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BillingToggle({
  value,
  onChange,
}: {
  value: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
      {(["monthly", "annually"] as const).map((period) => (
        <button
          key={period}
          type="button"
          onClick={() => onChange(period)}
          className={cn(
            "rounded-full px-5 py-1.5 text-sm font-medium capitalize transition-colors",
            value === period
              ? "bg-blue-600 text-white"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          {period}
        </button>
      ))}
    </div>
  );
}

function PlanCard({
  plan,
  billing,
  onSelect,
}: {
  plan: Plan;
  billing: BillingPeriod;
  onSelect: (planId: PlanId) => void;
}) {
  const suffix = billing === "monthly" ? "/month" : "/year";
  const price = billing === "monthly" ? plan.price : Math.round(plan.price * 12 * 0.85);
  const originalPrice =
    billing === "monthly" ? plan.originalPrice : Math.round(plan.originalPrice * 12 * 0.85);

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-xl border bg-white p-5 shadow-sm",
        plan.featured ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-200"
      )}
    >
      <span className="absolute right-4 top-4 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
        25% off
      </span>

      <h3 className="pr-16 text-sm font-bold uppercase tracking-wide text-slate-900">
        {plan.name}
      </h3>

      <div className="mt-4 flex items-end gap-2">
        <span className="text-lg text-slate-400 line-through">${originalPrice}</span>
        <span className="text-4xl font-bold leading-none text-slate-900">${price}</span>
        <span className="pb-1 text-sm text-slate-500">{suffix}</span>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature.label}
            className={cn(
              "flex items-start gap-2.5 text-sm",
              feature.included ? "text-slate-700" : "text-slate-400"
            )}
          >
            <span className="mt-0.5 shrink-0">
              {feature.included ? <FeatureCheckIcon /> : <FeatureXIcon />}
            </span>
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Support</p>
        <div className="mt-2 flex items-start gap-2.5 text-sm text-slate-700">
          <span className="mt-0.5 shrink-0">
            <FeatureCheckIcon />
          </span>
          <span>{plan.support}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSelect(plan.id)}
        className={cn(
          "mt-5 w-full rounded-lg py-3 text-sm font-bold uppercase tracking-wide transition-colors",
          plan.featured
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "border border-blue-600 bg-white text-blue-600 hover:bg-blue-50"
        )}
      >
        {plan.cta}
      </button>

      <p className="mt-3 text-center text-xs text-slate-400">30-day money-back guarantee</p>
    </article>
  );
}

type PlanStepProps = {
  onSelectPlan: (planId: PlanId) => void;
  onBack: () => void;
};

export function PlanStep({ onSelectPlan, onBack }: PlanStepProps) {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
      >
        ← Back
      </button>

      <div className="mb-8 flex justify-center">
        <BillingToggle value={billing} onChange={setBilling} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billing={billing}
            onSelect={onSelectPlan}
          />
        ))}
      </div>
    </div>
  );
}
