import type { AppIntegration, FlowStep } from "./flow-types";

// Registry of supported apps. Keyed by FlowStep.app.
export const APPS: Record<string, AppIntegration> = {
  shopify: { id: "shopify", name: "Shopify", icon: "🛒" },
  slack: { id: "slack", name: "Slack", icon: "💬" },
  gmail: { id: "gmail", name: "Gmail", icon: "✉️" },
  sheets: { id: "sheets", name: "Google Sheets", icon: "📊" },
  notion: { id: "notion", name: "Notion", icon: "📝" },
  airtable: { id: "airtable", name: "Airtable", icon: "🗂️" },
  whatsapp: { id: "whatsapp", name: "WhatsApp", icon: "📱" },
  twilio: { id: "twilio", name: "Twilio SMS", icon: "📲" },
  crm: { id: "crm", name: "CRM", icon: "👥" },
  forms: { id: "forms", name: "Forms", icon: "📋" },
  schedule: { id: "schedule", name: "Schedule", icon: "⏰" },
  ai: { id: "ai", name: "AI", icon: "🤖" },
  warehouse: { id: "warehouse", name: "Warehouse", icon: "🏭" },
};

// Apps that are external integrations the user must connect (vs built-in primitives).
const CONNECTABLE_APPS = new Set([
  "shopify",
  "slack",
  "gmail",
  "sheets",
  "notion",
  "airtable",
  "whatsapp",
  "twilio",
  "crm",
]);

export function getStepIntegration(step: FlowStep): AppIntegration | null {
  if (!step.app) return null;
  if (!CONNECTABLE_APPS.has(step.app)) return null;
  return APPS[step.app] ?? null;
}

export function getRequiredIntegrations(steps: FlowStep[]): AppIntegration[] {
  const seen = new Map<string, AppIntegration>();
  for (const step of steps) {
    const app = getStepIntegration(step);
    if (app) seen.set(app.id, app);
  }
  return Array.from(seen.values());
}
