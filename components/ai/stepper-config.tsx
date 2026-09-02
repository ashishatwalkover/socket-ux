"use client";

import { useState } from "react";
import { Button, Chip } from "@mui/material";
import { cn } from "@/lib/utils";

type StepperStep = {
  id: string;
  icon: string;
  title: string;
  description: string;
  details: string[];
  type: "trigger" | "action";
};

type Props = {
  title: string;
  description: string;
  steps: StepperStep[];
  webhookUrl?: string;
  onFinish?: () => void;
};

const ICON_COLORS: Record<string, string> = {
  SC: "bg-blue-100 text-blue-700",
  TR: "bg-green-100 text-green-700",
  D: "bg-purple-100 text-purple-700",
  SX: "bg-orange-100 text-orange-700",
  GM: "bg-red-100 text-red-700",
};

function iconClass(icon: string) {
  return ICON_COLORS[icon] ?? "bg-gray-100 text-gray-700";
}

export function StepperConfig({ title, description, steps, webhookUrl, onFinish }: Props) {
  const [active, setActive] = useState(0);
  const current = steps[active];
  const isLast = active === steps.length - 1;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 mb-4 text-sm text-gray-600">{description}</p>

      <div className="mb-3 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        <span className="flex-1 text-[13px] text-gray-700">
          <span className="font-semibold text-gray-900">
            Step {active + 1} of {steps.length}
          </span>{" "}
          — {current?.title}
        </span>
        <span className="flex gap-1">
          {steps.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "block h-[5px] w-[26px] rounded-full",
                i < active ? "bg-green-500" : i === active ? "bg-blue-500" : "bg-gray-300"
              )}
            />
          ))}
        </span>
        <button
          disabled={isLast}
          onClick={() => setActive((i) => Math.min(steps.length - 1, i + 1))}
          className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          Jump to next ↓
        </button>
      </div>

      {current && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-md text-[11px] font-extrabold",
                iconClass(current.icon)
              )}
            >
              {current.icon}
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold tracking-[0.09em] text-gray-500">
                {current.type === "trigger" ? "TRIGGER" : `STEP ${active + 1}`}
              </span>
              <span className="text-[15px] font-semibold text-gray-900">{current.title}</span>
            </div>
          </div>

          <p className="mt-3 text-[13px] leading-relaxed text-gray-700">
            {current.description}
          </p>

          {current.details.length > 0 ? (
            <div className="mt-4 flex flex-col gap-3">
              {current.details.map((d) => (
                <div key={d} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-gray-900">{d}</span>
                    <Chip
                      label="required"
                      size="small"
                      sx={{
                        height: 19,
                        fontSize: 11,
                        fontWeight: 600,
                        bgcolor: "#fef3c7",
                        color: "#b45309",
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2.5">
                    <span className="truncate text-[13px] text-gray-500">
                      Choose {d.toLowerCase()}
                    </span>
                    <span className="flex-1" />
                    <span className="text-[11px] text-gray-500">▾</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-xs text-gray-500">
              No fields to fill — this step is ready to go.
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
        <Button
          size="small"
          variant="text"
          disabled={active === 0}
          onClick={() => setActive((i) => Math.max(0, i - 1))}
          sx={{ color: "text.secondary" }}
        >
          Back
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            if (isLast) onFinish?.();
            else setActive((i) => i + 1);
          }}
          sx={{ bgcolor: "#2563eb", color: "#fff", "&:hover": { bgcolor: "#1d4ed8" } }}
        >
          {isLast ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}
