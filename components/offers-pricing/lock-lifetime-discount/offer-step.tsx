import { CheckIcon } from "./icons";

const BENEFITS = [
  { label: "25% off every bill, forever", highlight: true },
  { label: "30-day guarantee", highlight: false },
  { label: "Cancel anytime", highlight: false },
] as const;

type OfferStepProps = {
  onNext: () => void;
  onDecline?: () => void;
};

export function OfferStep({ onNext, onDecline }: OfferStepProps) {
  return (
    <div>
      <div className="pr-20 pt-1 text-left sm:pr-28 sm:pt-0">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          Lifetime discount offer
        </span>

        <h1 className="mt-4 text-[50px] font-black leading-tight tracking-tight text-slate-900 sm:text-[50px]">          
          Lock in <span className="text-green-900 bg-green-200 px-2 py-0.5 rounded font-black shadow-sm">25% OFF</span> <span className="font-black">on all plans for life</span>
        </h1>
   
   
        
      </div>

      <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-4 sm:px-5">
        <p className="text-sm font-semibold text-emerald-900">You won&apos;t be charged today</p>
        <p className="mt-1 text-sm leading-relaxed text-emerald-800/80">
          Your card only locks in the discount. Billing starts after 30 days and you can remove your card at any time.
        </p>
      </div>

      <ul className="mt-6 space-y-3">
        {BENEFITS.map((benefit) => (
          <li key={benefit.label} className="flex items-start gap-2.5 text-sm text-slate-600">
            <span className="mt-0.5 shrink-0 text-emerald-600">
              <CheckIcon />
            </span>
            <span className={benefit.highlight ? "font-medium text-slate-800" : undefined}>
              {benefit.label}
            </span>
          </li>
        ))}
      </ul>      

      <div className="mt-8">
        <button
          type="button"
          onClick={onNext}
          className="h-12 w-auto rounded-lg bg-slate-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          <span className="font-black leading-tight tracking-tight">
            Claim 25% discount
          </span>
     
        </button>
        <p className="mt-2 text-xs text-slate-400">Takes less than 2 minutes.</p>
      </div>

      <div className="mt-5 text-left">
        <button
          type="button"
          onClick={onDecline}
          className="text-sm text-slate-400 underline-offset-4 transition-colors hover:text-slate-600 hover:underline"
        >
          Continue without the discount
        </button>
      </div>
    </div>
  );
}
