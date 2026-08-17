"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/* ─── Icons ─── */

function TagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
      <circle cx="7" cy="7" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  );
}

function RepeatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m5 12 5 5L20 6" />
    </svg>
  );
}

function CheckCircleFilledIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.1 14.2-4-4 1.4-1.4 2.6 2.6 5.4-5.4 1.4 1.4-6.8 6.8Z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ─── Data ─── */

type PlanId = "basic" | "premium";
type BillingPeriod = "monthly" | "annual";

/** Result of the user pressing "Apply". */
type ApplyResult = "none" | "applied" | "invalid";

type Plan = {
  id: PlanId;
  name: string;
  /** Base price before any coupon. */
  price: Record<BillingPeriod, number>;
  features: string[];
  featured?: boolean;
  badge?: string;
};

const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: { monthly: 0, annual: 0 },
    features: [
      "10,000 tasks/month",
      "500 AI credits/month",
      "Works with GPT, Claude & Gemini",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: { monthly: 99, annual: 66 },
    features: [
      "25,000 tasks/month, then $0.0004/task after that",
      "10,000 AI credits/month, then $0.0018/credit after that",
      "SSO & advanced permissions",
      "Pay as you scale, with flexible limits",
      "Works with GPT, Claude & Gemini",
    ],
    featured: true,
    badge: "BEST VALUE",
  },
];

/** The coupon we recognise in this demo. */
const DEMO_COUPON = {
  code: "GEN-ONEUSER",
  amountOff: 20,
  appliesTo: "premium" as PlanId,
};

/* ─── Component ─── */

type ApplyCouponProps = {
  className?: string;
  onClose?: () => void;
};

export function ApplyCoupon({ className, onClose }: ApplyCouponProps) {
  const [showCoupon, setShowCoupon] = useState(true);
  const [code, setCode] = useState(DEMO_COUPON.code);
  const [result, setResult] = useState<ApplyResult>("applied");
  const [period, setPeriod] = useState<BillingPeriod>("annual");
  const [currentPlan, setCurrentPlan] = useState<PlanId>("premium");

  const trimmed = code.trim().toUpperCase();

  // A valid coupon that the user pressed Apply on.
  const hasCoupon = result === "applied";
  // Reasons the coupon can't reduce the price right now.
  const planBlocked = hasCoupon && currentPlan !== DEMO_COUPON.appliesTo;
  const periodBlocked = hasCoupon && period !== "annual";
  // Valid AND all conditions met → the discount is actually reducing the price.
  const isActive = hasCoupon && !planBlocked && !periodBlocked;
  // Valid but something blocks it → added, but not doing anything.
  const isPending = hasCoupon && !isActive;

  function handleApply() {
    setResult(trimmed === DEMO_COUPON.code ? "applied" : "invalid");
  }

  function handleRemove() {
    setResult("none");
    setCode("");
  }

  return (
    <div className={cn("mx-auto w-full max-w-3xl px-5 py-8", className)}>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Apply Coupon</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter a coupon code to unlock a discount on your order.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-3.5 py-1.5 text-sm font-medium uppercase tracking-wide text-blue-600 transition-colors hover:bg-gray-50"
        >
          Close
        </button>
      </div>

      {/* Coupon panel */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TagIcon className="size-5 text-blue-600" />
            <span className="text-base font-medium text-gray-900">Apply Coupon</span>
          </div>
          <button
            type="button"
            onClick={() => setShowCoupon((v) => !v)}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            {showCoupon ? "Hide" : "Show"}
          </button>
        </div>

        {showCoupon && (
          <div className="mt-4 space-y-4">
            {/* Input + verify — hidden once a valid coupon is applied */}
            {!hasCoupon && (
              <div className="flex items-stretch gap-3">
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    if (result === "invalid") setResult("none");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                  placeholder="Enter coupon code"
                  spellCheck={false}
                  className={cn(
                    "h-11 flex-1 rounded-lg border bg-white px-3.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:ring-2",
                    result === "invalid"
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-blue-400 focus:ring-blue-100"
                  )}
                />
                <button
                  type="button"
                  onClick={handleApply}
                  className="rounded-lg bg-blue-600 px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-blue-700"
                >
                  Verify
                </button>
              </div>
            )}

            {/* Invalid state (A) */}
            {result === "invalid" && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                <XCircleIcon className="size-4 shrink-0" />
                <span>
                  <span className="font-semibold">Invalid code.</span> We couldn&apos;t find a
                  coupon matching “{trimmed || "—"}”. Check the code and try again.
                </span>
              </div>
            )}

            {/* Applied coupon detail card (A + B) */}
            {hasCoupon && (
              <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50/40 p-5">
                {/* Top row: discount + status pill — this card reflects the coupon's
                    validity (always green when valid); applicability is shown on the plan chip. */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-emerald-600">
                      ${DEMO_COUPON.amountOff} off
                    </span>
                    <span className="text-sm font-medium uppercase tracking-wide text-gray-400">
                      {DEMO_COUPON.code}
                    </span>
                  </div>
                  <StatusPill active />
                </div>

                {/* Coupon terms (secondary) */}
                <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="size-3.5 text-gray-400" />
                    Applies to: {DEMO_COUPON.appliesTo}
                  </li>
                  <li className="flex items-center gap-2">
                    <CalendarIcon className="size-3.5 text-gray-400" />
                    No expiry
                  </li>
                  <li className="flex items-center gap-2">
                    <RepeatIcon className="size-3.5 text-gray-400" />
                    Forever
                  </li>
                  <li className="flex items-center gap-2 text-orange-500">
                    <InfoIcon className="size-3.5" />
                    One-time use
                  </li>
                </ul>

                {/* Actions (B) */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {isPending && planBlocked && (
                    <button
                      type="button"
                      onClick={() => setCurrentPlan("premium")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      Upgrade to Premium to use it
                      <ArrowRightIcon className="size-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="text-sm font-medium text-gray-500 underline underline-offset-2 hover:text-gray-700"
                  >
                    Remove coupon
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Billing toggle */}
      <div className="my-8 flex items-center justify-center gap-6">
        <PeriodOption
          label="Monthly"
          selected={period === "monthly"}
          onSelect={() => setPeriod("monthly")}
        />
        <div className="flex items-center gap-2">
          <PeriodOption
            label="Annual"
            selected={period === "annual"}
            onSelect={() => setPeriod("annual")}
          />
          <span className="rounded-full border border-green-300 px-2.5 py-0.5 text-xs font-medium text-green-600">
            Save 33%
          </span>
        </div>
      </div>

      {/* Plans */}
      <div className="grid gap-5 sm:grid-cols-2">
        {PLANS.map((plan) => {
          const couponOnThisPlan = hasCoupon && plan.id === DEMO_COUPON.appliesTo;
          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              period={period}
              isCurrent={plan.id === currentPlan}
              couponApplies={couponOnThisPlan}
              couponActive={couponOnThisPlan && isActive}
              couponAmount={DEMO_COUPON.amountOff}
              couponCode={DEMO_COUPON.code}
              onRemoveCoupon={handleRemove}
              onUpgrade={() => setCurrentPlan(plan.id)}
            />
          );
        })}
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Need help?{" "}
        <a href="#" className="font-medium text-blue-600 hover:underline">
          Contact Support
        </a>
      </p>
    </div>
  );
}

/* ─── Sub-components ─── */

function StatusPill({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
        <CheckCircleFilledIcon className="size-3.5" />
        Valid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
      <ClockIcon className="size-3.5" />
      Added · not active yet
    </span>
  );
}

function PeriodOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex items-center gap-2 text-base font-medium text-gray-900"
    >
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-full border-2 transition-colors",
          selected ? "border-blue-600" : "border-gray-300"
        )}
      >
        {selected && <span className="size-2.5 rounded-full bg-blue-600" />}
      </span>
      {label}
    </button>
  );
}

function PlanCard({
  plan,
  period,
  isCurrent,
  couponApplies,
  couponActive,
  couponAmount,
  couponCode,
  onRemoveCoupon,
  onUpgrade,
}: {
  plan: Plan;
  period: BillingPeriod;
  isCurrent: boolean;
  couponApplies: boolean;
  couponActive: boolean;
  couponAmount: number;
  couponCode: string;
  onRemoveCoupon: () => void;
  onUpgrade: () => void;
}) {
  const base = plan.price[period];
  // Show the discounted price on the card only once the coupon is actually active here.
  const showDiscount = couponActive && base > 0;
  const displayPrice = showDiscount ? Math.max(0, base - couponAmount) : base;

  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-white p-6",
        plan.featured ? "border-gray-200 shadow-md" : "border-gray-200"
      )}
    >
      {plan.badge && !couponApplies && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          <span aria-hidden>✦</span> {plan.badge}
        </span>
      )}

      <h2 className="text-xl font-semibold text-gray-900">{plan.name}</h2>

      <div className="mt-3 flex items-baseline gap-2">
        {showDiscount && (
          <span className="text-xl font-medium text-gray-400 line-through">${base}</span>
        )}
        <span className="text-5xl font-bold tracking-tight text-gray-900">${displayPrice}</span>
        <span className="text-sm text-gray-400">/mo</span>
      </div>

      {/* Coupon chip (D) — sits below the price */}
      {couponApplies && (
        <div
          className={cn(
            "mt-4 flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs font-semibold",
            couponActive
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          )}
        >
          <span className="flex items-center gap-1.5">
            <TagIcon className="size-3.5" />
            <span className="uppercase tracking-wide">{couponCode}</span>
            <span className="font-normal opacity-90">
              {couponActive ? `· $${couponAmount} off ${plan.name}` : "· NOT APPLICABLE"}
            </span>
          </span>
          <button
            type="button"
            onClick={onRemoveCoupon}
            aria-label="Remove coupon"
            className={cn(
              "rounded p-0.5 transition-colors",
              couponActive ? "hover:bg-emerald-100" : "hover:bg-amber-100"
            )}
          >
            <XIcon className="size-3.5" />
          </button>
        </div>
      )}

      <div className="my-5 border-t border-gray-100" />

      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        What&apos;s included
      </p>
      <ul className="space-y-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2.5 text-sm text-gray-700">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-green-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {isCurrent ? (
          <div className="w-full rounded-lg border border-gray-200 py-2.5 text-center text-sm font-medium uppercase tracking-wide text-gray-400">
            Current Plan
          </div>
        ) : (
          <button
            type="button"
            onClick={onUpgrade}
            className={cn(
              "w-full rounded-lg py-2.5 text-center text-sm font-semibold uppercase tracking-wide transition-colors",
              plan.featured
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            Upgrade
          </button>
        )}
      </div>
    </div>
  );
}
