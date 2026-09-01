"use client";

import { useState } from "react";
import { FlowPlanVisualization, type FlowStep } from "./flow-plan-visualization";

const MOCK_FLOW_STEPS: FlowStep[] = [
  {
    id: "schedule-trigger",
    number: 1,
    icon: "SC",
    title: "A schedule starts this",
    status: "configured",
    description: "You can hourly, 2:01 list on hourly schedule",
    details: [],
    type: "trigger",
    config: {
      frequency: "Hourly",
      time: "2:01 AM",
      timezone: "UTC",
    },
  },
  {
    id: "find-orgs",
    number: 2,
    icon: "TR",
    title: "Find organizations queued for deletion",
    status: "proposed",
    description: "Will search what date, daily field marks the queue, how many left",
    details: ["Search criteria", "Date field mapping", "Row limit"],
    type: "action",
  },
  {
    id: "delete-workspace",
    number: 3,
    icon: "D",
    title: "Delete each workspace",
    status: "proposed",
    description: "Will need: 'one your app's workspaces available, and unless to record the result",
    details: ["Workspace availability check", "Result logging"],
    type: "action",
  },
  {
    id: "email-owner",
    number: 4,
    icon: "SX",
    title: "Email the owner the result",
    status: "pending",
    description: "Will need: a Gmail connection",
    details: ["Gmail connection"],
    type: "action",
  },
];

interface FlowPlanPanelProps {
  flowName?: string;
  description?: string;
  selectedFlow?: string;
}

// Map of flow descriptions to their suggested plans
const FLOW_SUGGESTIONS: Record<string, { name: string; description: string; steps: FlowStep[] }> = {
  "send a reminder email to users who abandoned their cart 2 hours ago.": {
    name: "Abandoned cart recovery",
    description: "Send a reminder email to users who abandoned their cart 2 hours ago",
    steps: [
      {
        id: "schedule-abandoned",
        number: 1,
        icon: "SC",
        title: "A schedule starts this",
        status: "configured",
        description: "Check every 2 hours for abandoned carts",
        details: [],
        type: "trigger",
        config: { frequency: "Every 2 hours", timezone: "UTC" },
      },
      {
        id: "find-abandoned",
        number: 2,
        icon: "TR",
        title: "Find abandoned carts",
        status: "proposed",
        description: "Find carts abandoned more than 2 hours ago",
        details: ["Cart age threshold", "Customer filter", "Exclusion rules"],
        type: "action",
      },
      {
        id: "send-email",
        number: 3,
        icon: "SX",
        title: "Send reminder email",
        status: "proposed",
        description: "Send personalized reminder email with cart details",
        details: ["Email template", "Customer email field", "Cart details mapping"],
        type: "action",
      },
    ]
  },
  "if a customer spends above ₹50,000, notify the sales head on slack.": {
    name: "High-value order alert",
    description: "If a customer spends above ₹50,000, notify the sales head on Slack",
    steps: [
      {
        id: "order-trigger",
        number: 1,
        icon: "TR",
        title: "When an order is placed",
        status: "configured",
        description: "Triggered when a new order is created",
        details: [],
        type: "trigger",
        config: { event: "Order created", filter: "Amount > ₹50,000" },
      },
      {
        id: "check-amount",
        number: 2,
        icon: "D",
        title: "Check order amount",
        status: "proposed",
        description: "Verify order amount exceeds ₹50,000 threshold",
        details: ["Amount field", "Currency conversion", "Tax handling"],
        type: "action",
      },
      {
        id: "notify-slack",
        number: 3,
        icon: "SX",
        title: "Send Slack notification",
        status: "proposed",
        description: "Notify sales head on Slack with order details",
        details: ["Slack channel", "Message format", "Customer details"],
        type: "action",
      },
    ]
  },
  "whenever an invoice is unpaid for 3 days, send a whatsapp reminder.": {
    name: "Invoice reminder",
    description: "Whenever an invoice is unpaid for 3 days, send a WhatsApp reminder",
    steps: [
      {
        id: "invoice-check",
        number: 1,
        icon: "SC",
        title: "Check unpaid invoices daily",
        status: "configured",
        description: "Daily check for invoices unpaid for 3+ days",
        details: [],
        type: "trigger",
        config: { frequency: "Daily at 9 AM", timezone: "IST" },
      },
      {
        id: "find-unpaid",
        number: 2,
        icon: "TR",
        title: "Find overdue invoices",
        status: "proposed",
        description: "Find invoices unpaid for more than 3 days",
        details: ["Invoice status field", "Date calculation", "Customer list"],
        type: "action",
      },
      {
        id: "send-whatsapp",
        number: 3,
        icon: "SX",
        title: "Send WhatsApp reminder",
        status: "proposed",
        description: "Send WhatsApp reminder with invoice details and payment link",
        details: ["WhatsApp API", "Message template", "Payment gateway link"],
        type: "action",
      },
    ]
  },
  "when a stripe payment fails, alert finance and retry after 1 hour.": {
    name: "Failed payment retry",
    description: "When a Stripe payment fails, alert finance and retry after 1 hour",
    steps: [
      {
        id: "payment-fail",
        number: 1,
        icon: "TR",
        title: "Payment fails on Stripe",
        status: "configured",
        description: "Triggered when a Stripe payment fails",
        details: [],
        type: "trigger",
        config: { source: "Stripe webhook", failureTypes: "All" },
      },
      {
        id: "alert-finance",
        number: 2,
        icon: "SX",
        title: "Alert finance team",
        status: "proposed",
        description: "Send alert email to finance team with payment details",
        details: ["Finance email", "Alert template", "Payment reference"],
        type: "action",
      },
      {
        id: "schedule-retry",
        number: 3,
        icon: "SC",
        title: "Retry payment after 1 hour",
        status: "proposed",
        description: "Schedule automatic retry of failed payment",
        details: ["Retry logic", "Max retry count", "Fallback action"],
        type: "action",
      },
    ]
  }
};

export function FlowPlanPanel({
  flowName,
  description,
  selectedFlow
}: FlowPlanPanelProps) {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  // Get the flow suggestion based on selected flow description
  let flowData = FLOW_SUGGESTIONS[selectedFlow?.toLowerCase() || ""] || {
    name: flowName || "Hourly workspace deletion processor",
    description: description || "Every hour, delete the workspaces of organizations queued for deletion and email the owner",
    steps: MOCK_FLOW_STEPS
  };

  if (flowName && !selectedFlow) {
    flowData = {
      name: flowName,
      description: description || "",
      steps: MOCK_FLOW_STEPS
    };
  }

  const handleStepClick = (step: FlowStep) => {
    setSelectedStepId(step.id);
  };

  const totalDetails = flowData.steps.reduce((sum, step) => sum + step.details.length, 0);

  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* Draft Plan Section */}
      <div className="border-b border-gray-100 bg-white p-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-3">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="text-blue-600">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          DRAFT PLAN
        </div>
        <p className="text-xs text-gray-500 mb-2">{flowData.steps.length} steps • Roughly {totalDetails > 0 ? totalDetails : 6} details needed from you • about 8 minutes to build</p>
      </div>

      {/* Flow Plan Content */}
      <FlowPlanVisualization
        title={flowData.name}
        subtitle={flowData.description}
        estimatedTime="8 minutes"
        stepCount={flowData.steps.length}
        detailsNeeded={totalDetails > 0 ? totalDetails : 6}
        steps={flowData.steps}
        onStepClick={handleStepClick}
      />
    </div>
  );
}
