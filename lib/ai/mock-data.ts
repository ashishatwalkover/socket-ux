/**
 * Mock data + scripted conversation for the FlowMind AI prototype.
 * The chat advances through a deterministic sequence on every user send,
 * so the UI can be demoed without a real LLM/backend.
 */

export type Suggestion = { title: string; prompt: string };

export const STARTER_SUGGESTIONS: Suggestion[] = [
  {
    title: "Recover abandoned carts",
    prompt:
      "Send a reminder email to users who abandoned their cart 2 hours ago.",
  },
  {
    title: "High-value order alert",
    prompt:
      "If a customer spends above ₹50,000, notify the sales head on Slack.",
  },
  {
    title: "Invoice reminder",
    prompt:
      "Whenever an invoice is unpaid for 3 days, send a WhatsApp reminder.",
  },
  {
    title: "Failed payment retry",
    prompt:
      "When a Stripe payment fails, alert finance and retry after 1 hour.",
  },
];

export type Conversation = {
  id: string;
  title: string;
  status: "running" | "draft" | "paused" | "failed";
  updated: string;
  description?: string;
  subheading?: string;
};

export const PAST_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    title: "Notify team for high-value orders",
    status: "running",
    updated: "2h ago",
  },
  {
    id: "c2",
    title: "Daily invoice reminder",
    status: "running",
    updated: "Yesterday",
  },
  {
    id: "c3",
    title: "Sync new leads to HubSpot",
    status: "paused",
    updated: "3 days ago",
  },
  {
    id: "c4",
    title: "Retry failed Twilio messages",
    status: "failed",
    updated: "Last week",
  },
  {
    id: "c5",
    title: "Abandoned cart recovery",
    status: "draft",
    updated: "5 min ago",
    subheading: "E-commerce automation",
    description: "Send reminder emails to users who abandoned their cart 2 hours ago, with follow-up sequence.",
  },
  {
    id: "c6",
    title: "Welcome email sequence",
    status: "draft",
    updated: "1 hour ago",
    subheading: "Customer onboarding",
    description: "Automated onboarding flow for new signups with 3-part email series over 7 days.",
  },
];

// ---------- Scripted assistant turns ----------

export type AssistantBlock =
  | { kind: "text"; text: string }
  | {
      kind: "clarify";
      question: string;
      options: string[];
    }
  | {
      kind: "template";
      question: string;
      options: { title: string; description: string; apps?: { name: string; color: string; letter: string }[]; chips?: string[]; installs?: number }[];
    }
  | {
      kind: "plan";
      title: string;
      summary: string;
      steps: string[];
      estimate: string;
    }
  | {
      kind: "credentials";
      service: string;
      description: string;
    }
  | {
      kind: "deployed";
      name: string;
      logs: { time: string; text: string; status: "ok" | "warn" | "err" }[];
    }
  | {
      kind: "flowPlan";
      title: string;
      description: string;
      primaryActionLabel?: string;
      steps: Array<{
        id: string;
        number: number;
        icon: string;
        title: string;
        status: "proposed" | "configured" | "pending";
        description: string;
        details: string[];
        type: "trigger" | "action";
        config?: Record<string, string | number | boolean>;
      }>;
    }
  | {
      kind: "suggestion";
      title: string;
      body: string;
    }
  | {
      kind: "stepperConfig";
      title: string;
      description: string;
      webhookUrl?: string;
      steps: Array<{
        id: string;
        number: number;
        icon: string;
        title: string;
        status: "proposed" | "configured" | "pending";
        description: string;
        details: string[];
        type: "trigger" | "action";
        config?: Record<string, string | number | boolean>;
      }>;
    };

export type AssistantTurn = {
  blocks: AssistantBlock[];
  /** Optional auto-advance: synthetic next user message when an inline action is clicked. */
  actionAdvances?: boolean;
};

/**
 * Deterministic script. Index N is the assistant turn shown after the user's
 * Nth message. Anything past the end loops back to a closing turn.
 */
export const ASSISTANT_SCRIPT: AssistantTurn[] = [
  {
    blocks: [
      {
        kind: "text",
        text: "Got it. Let me help you get started with a template.",
      },
      {
        kind: "template",
        question: "Found some templates that match your use case.:",
        options: [
          { 
            title: "Abandoned Cart Recovery", 
            description: "Recover lost sales by sending automated reminders",
            apps: [{ name: "Shopify", color: "bg-emerald-600", letter: "S" }, { name: "Gmail", color: "bg-red-500", letter: "G" }],
            chips: ["Sales", "E-commerce"],
            installs: 1200
          },
          { 
            title: "Welcome Email Sequence", 
            description: "Onboard new customers with automated emails",
            apps: [{ name: "HubSpot", color: "bg-orange-500", letter: "H" }, { name: "Gmail", color: "bg-red-500", letter: "G" }],
            chips: ["Marketing", "Onboarding"],
            installs: 890
          },
          { 
            title: "Invoice Reminder", 
            description: "Automate payment reminders for unpaid invoices",
            apps: [{ name: "Stripe", color: "bg-indigo-600", letter: "S" }, { name: "Slack", color: "bg-purple-600", letter: "S" }],
            chips: ["Finance", "Operations"],
            installs: 650
          },
        ],
      },
    ],
  },
  {
    blocks: [
      {
        kind: "text",
        text: "Got it. Let's set up the first step:",
      },
      {
        kind: "flowPlan",
        title: "Invoice reminder - Step 1",
        description: "Configure how we'll check for unpaid invoices",
        primaryActionLabel: "Next",
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
        ],
      },
    ],
    actionAdvances: true,
  },
  {
    blocks: [
      {
        kind: "text",
        text: "All set — your automation is live.",
      },
    ],
  },
];
