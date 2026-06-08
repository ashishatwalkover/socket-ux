import { Input } from "@/components/ui/input";
import { PLANS, type PlanId } from "./plan-data";
import { LockIcon } from "./icons";

type PaymentStepProps = {
  onBack: () => void;
  selectedPlan?: PlanId | null;
};

export function PaymentStep({ onBack, selectedPlan }: PaymentStepProps) {
  const plan = PLANS.find((p) => p.id === selectedPlan);

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
      >
        ← Back
      </button>

      <div className="text-left">        
        {plan && (
          <p className="mt-1 text-2xl font-black text-slate-900">
            <span className="text-3xl font-extrabold text-slate-900">{plan.name}</span> at <span className="text-3xl font-extrabold text-slate-900 text-green-900 bg-green-200 px-2 py-0.5 rounded font-black shadow-sm">${plan.price}</span>/month
          </p>
     
        )}        
      </div>

      <div className="mt-6">
        <Input
          type="text"
          placeholder="Card number"
          className="mb-3 h-12 rounded-lg px-4 text-sm"
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Input type="text" placeholder="MM / YY" className="h-12 rounded-lg px-4 text-sm" />
          <Input type="text" placeholder="CVC" className="h-12 rounded-lg px-4 text-sm" />
        </div>

        <button
          type="button"
          className="mt-6 h-12 w-auto rounded-lg bg-slate-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Add payment method and lock discount
        </button>

        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <LockIcon />
          <span>Secure payment. Card can be removed anytime.</span>
        </div>
      </div>
    </div>
  );
}
