"use client";

import { useState } from "react";
import { Chip } from "@mui/material";
import { cn } from "@/lib/utils";

export interface FlowStep {
  id: string;
  number: number;
  icon: string;
  title: string;
  status: "proposed" | "configured" | "pending";
  description: string;
  details: string[];
  type: "trigger" | "action";
  config?: {
    [key: string]: string | number | boolean;
  };
}

interface FlowPlanVisualizationProps {
  title: string;
  subtitle?: string;
  estimatedTime?: string;
  stepCount?: number;
  detailsNeeded?: number;
  steps: FlowStep[];
  onStepClick?: (step: FlowStep) => void;
}

const iconColors: Record<string, { bg: string; text: string }> = {
  SC: { bg: "bg-blue-100", text: "text-blue-700" },
  TR: { bg: "bg-green-100", text: "text-green-700" },
  D: { bg: "bg-purple-100", text: "text-purple-700" },
  SX: { bg: "bg-orange-100", text: "text-orange-700" },
  GM: { bg: "bg-red-100", text: "text-red-700" },
  DB: { bg: "bg-indigo-100", text: "text-indigo-700" },
  AP: { bg: "bg-pink-100", text: "text-pink-700" },
};

export function FlowPlanVisualization({
  title,
  subtitle,
  estimatedTime = "8 minutes",
  stepCount,
  detailsNeeded,
  steps,
  onStepClick,
}: FlowPlanVisualizationProps) {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const handleStepClick = (step: FlowStep) => {
    setSelectedStep(selectedStep === step.id ? null : step.id);
    onStepClick?.(step);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "configured":
        return "success";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && (
          <p className="text-sm text-gray-600 mb-3">{subtitle}</p>
        )}
        <div className="flex gap-4 text-xs text-gray-500">
          {stepCount && <span>• {stepCount} steps</span>}
          {detailsNeeded && <span>• Roughly {detailsNeeded} details needed from you</span>}
          <span>• about {estimatedTime} to build</span>
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-3">
        {steps.map((step, index) => {
          const colors = iconColors[step.icon] || iconColors.AP;
          const isSelected = selectedStep === step.id;

          return (
            <div key={step.id} className="group">
              <div
                onClick={() => handleStepClick(step)}
                className={cn(
                  "p-4 cursor-pointer transition-all duration-200 rounded-lg border",
                  isSelected
                    ? "bg-blue-50 border-l-4 border-blue-500 border-gray-200 shadow-sm"
                    : "bg-white border-gray-200 hover:shadow-sm border-l-4"
                )}
              >
                <div className="flex gap-4 items-start">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold text-sm",
                      colors.bg,
                      colors.text
                    )}
                  >
                    {step.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-blue-600 flex-1">
                        {step.title}
                      </h3>
                      {step.status !== "pending" && (
                        <Chip
                          label={getStatusLabel(step.status)}
                          size="small"
                          color={getStatusColor(step.status)}
                          variant="outlined"
                          className="text-[11px]"
                        />
                      )}
                    </div>

                    <p className="text-xs text-gray-600 mb-2">{step.description}</p>

                    {/* Details */}
                    {step.details.length > 0 && (
                      <p className="text-xs text-gray-500">
                        Will need: <span className="text-gray-700 font-medium">{step.details.join(", ")}</span>
                      </p>
                    )}

                    {/* Expanded Details */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Configuration:</h4>
                        <div className="bg-gray-50 p-3 rounded text-xs text-gray-700 space-y-1.5 border border-gray-200">
                          {step.config ? (
                            Object.entries(step.config).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className="font-medium text-gray-600">{key}:</span>
                                <span className="text-gray-900 font-medium">{String(value)}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500">Click to configure this step</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step Number */}
                  <div className="text-xs font-semibold text-gray-500 flex-shrink-0">
                    STEP {step.number}
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="w-0.5 h-2 bg-gradient-to-b from-gray-300 to-transparent" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add More Steps Button */}
      <button
        className="text-xs font-medium text-gray-600 hover:text-gray-900 py-2 transition-colors"
      >
        + Add a step — a condition, a delay, another app
      </button>
    </div>
  );
}
