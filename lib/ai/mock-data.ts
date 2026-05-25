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
      kind: "suggestion";
      title: string;
      body: string;
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
        text: "Got it. A couple quick questions before I set this up:",
      },
      {
        kind: "clarify",
        question: "Which platform should I monitor for this?",
        options: ["Shopify", "WooCommerce", "Stripe"],
      },
    ],
  },
  {
    blocks: [
      {
        kind: "text",
        text: "Perfect. Here's what I'll build for you — review and deploy when you're ready.",
      },
      {
        kind: "plan",
        title: "Abandoned cart recovery",
        summary:
          "Watch for abandoned carts on Shopify, wait 2 hours, then send a reminder email. Retry once on failure.",
        steps: [
          "Trigger: Shopify cart abandoned",
          "Wait 2 hours",
          "Check if order was completed — if yes, stop",
          "Send reminder email via Gmail",
          "Retry once if email fails",
          "Log outcome",
        ],
        estimate: "~2,400 tasks / month",
      },
    ],
    actionAdvances: true,
  },
  {
    blocks: [
      {
        kind: "text",
        text: "I need access to a couple of your tools to make this work.",
      },
      {
        kind: "credentials",
        service: "Shopify",
        description:
          "Read-only access to orders and abandoned checkouts. You can revoke this anytime.",
      },
    ],
    actionAdvances: true,
  },
  {
    blocks: [
      {
        kind: "text",
        text: "All set — your automation is live. Here's a sample run from the last hour:",
      },
      {
        kind: "deployed",
        name: "Abandoned cart recovery",
        logs: [
          { time: "10:42 AM", text: "Cart abandoned by priya@example.com", status: "ok" },
          { time: "12:42 PM", text: "Reminder email sent", status: "ok" },
          { time: "12:43 PM", text: "Email delivered", status: "ok" },
          { time: "12:51 PM", text: "Customer reopened cart", status: "warn" },
        ],
      },
      {
        kind: "suggestion",
        title: "Want to extend this?",
        body: "If a customer still hasn't checked out 24 hours after the email, send a WhatsApp follow-up. I can add that in one click.",
      },
    ],
  },
  {
    blocks: [
      {
        kind: "text",
        text: "Done — WhatsApp follow-up added at the 24h mark. I'll keep an eye on delivery rates and let you know if something looks off.",
      },
    ],
  },
];
