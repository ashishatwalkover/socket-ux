import { cn } from "@/lib/utils";

type MoneyBackGuaranteeSealProps = {
  className?: string;
};

export function MoneyBackGuaranteeSeal({ className }: MoneyBackGuaranteeSealProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -right-2 -top-2 z-20 sm:right-8 sm:top-8",
        className
      )}
      aria-label="30-day money-back guarantee"
    >
      <div className="relative flex size-[104px] flex-col items-center justify-center rounded-full bg-emerald-700 text-white ring-4 ring-white shadow-[0_8px_24px_rgba(4,120,87,0.45)] sm:size-[116px]">
        <div
          className="pointer-events-none absolute inset-[6px] rounded-full border-2 border-emerald-400/50"
          aria-hidden
        />

        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
          30-Day
        </span>
        <span className="mt-0.5 text-center text-[12px] font-bold leading-tight tracking-wide text-white sm:text-[13px]">
          Money Back
        </span>
        <span className="mt-1.5 h-px w-11 bg-emerald-400/80" aria-hidden />
        <span className="mt-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-emerald-100 sm:text-[9px]">
          Guarantee
        </span>
      </div>
    </div>
  );
}
