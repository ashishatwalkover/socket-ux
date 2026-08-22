import { Button, TextField } from "@mui/material";
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
      <Button
        variant="text"
        onClick={onBack}
        className="mb-6"
        sx={{ color: "text.secondary" }}
      >
        ← Back
      </Button>

      <div className="text-left">        
        {plan && (
          <p className="mt-1 text-2xl font-black text-slate-900">
            <span className="text-3xl font-extrabold text-slate-900">{plan.name}</span> at <span className="text-3xl font-extrabold text-slate-900 text-green-900 bg-green-200 px-2 py-0.5 rounded font-black shadow-sm">${plan.price}</span>/month
          </p>
     
        )}        
      </div>

      <div className="mt-6">
        <TextField
          type="text"
          placeholder="Card number"
          size="small"
          fullWidth
          className="mb-3"
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <TextField type="text" placeholder="MM / YY" size="small" fullWidth />
          <TextField type="text" placeholder="CVC" size="small" fullWidth />
        </div>

        <Button variant="contained" className="mt-6">
          Add payment method and lock discount
        </Button>

        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <LockIcon />
          <span>Secure payment. Card can be removed anytime.</span>
        </div>
      </div>
    </div>
  );
}
