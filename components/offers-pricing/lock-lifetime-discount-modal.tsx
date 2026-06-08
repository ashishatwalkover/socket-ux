"use client";

import { useState } from "react";
import { MoneyBackGuaranteeSeal } from "@/components/offers-pricing/money-back-guarantee-seal";
import { OfferStep } from "@/components/offers-pricing/lock-lifetime-discount/offer-step";
import { PaymentStep } from "@/components/offers-pricing/lock-lifetime-discount/payment-step";
import { PlanStep } from "@/components/offers-pricing/lock-lifetime-discount/plan-step";
import type { PlanId } from "@/components/offers-pricing/lock-lifetime-discount/plan-data";
import type { DiscountStep } from "@/components/offers-pricing/lock-lifetime-discount/types";
import { cn } from "@/lib/utils";

type LockLifetimeDiscountModalProps = {
  className?: string;
  onContinueFree?: () => void;
};

export function LockLifetimeDiscountModal({
  className,
  onContinueFree,
}: LockLifetimeDiscountModalProps) {
  const [step, setStep] = useState<DiscountStep>(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

  function handleSelectPlan(planId: PlanId) {
    setSelectedPlan(planId);
    setStep(3);
  }

  return (
    <div
      className={cn(
        "flex min-h-full items-center justify-center bg-slate-900/95 p-4 sm:p-6",
        className
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-visible rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.18)]",
          step === 2 ? "max-w-[1080px] p-5 sm:p-8" : "max-w-[720px] p-6 sm:p-10 sm:pr-14"
        )}
      >
        {step === 1 && <MoneyBackGuaranteeSeal />}

        {step === 1 && (
          <OfferStep onNext={() => setStep(2)} onDecline={onContinueFree} />
        )}

        {step === 2 && (
          <PlanStep
            onBack={() => setStep(1)}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {step === 3 && (
          <PaymentStep
            onBack={() => setStep(2)}
            selectedPlan={selectedPlan}
          />
        )}
      </div>
    </div>
  );
}
