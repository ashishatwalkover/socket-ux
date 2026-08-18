/**
 * Mock data for the Connections page (`/app/connections`).
 *
 * The shape deliberately foregrounds `usedInFlows` / `flowNames`, because the
 * core UX problem this page solves is that users treat a connection as the
 * finished product. A connection that powers zero flows is an *unfinished*
 * step, and the data model makes that first-class rather than incidental.
 */

export type ConnectionStatus = "active" | "expired";

export type BrandIcon = {
  /** Emoji fallback, used when no letter/color avatar is supplied. */
  emoji?: string;
  /** Single letter avatar (e.g. Google apps). */
  letter?: string;
  /** Background color for the letter avatar. */
  color?: string;
};

export type Connection = {
  id: string;
  app: string;
  brand: BrandIcon;
  /** User-given nickname for the connection; null when never titled. */
  title: string | null;
  /** The account / scope the credential is bound to. */
  account: string;
  connectedBy: string;
  connectedOn: string;
  status: ConnectionStatus;
  /** Flows that actually run on this credential. 0 == idle. */
  usedInFlows: number;
  flowNames: string[];
  /** Social-proof signal shown at the connect step to reduce hesitation. */
  usedByTeams: string;
};

export const SAMPLE_CONNECTIONS: Connection[] = [
  {
    id: "airtable-1",
    app: "Airtable",
    brand: { emoji: "🗂️" },
    title: null,
    account: "ashish@walkover.in",
    connectedBy: "Ashish Yadav",
    connectedOn: "2026-07-20",
    status: "active",
    usedInFlows: 3,
    flowNames: ["Lead Router", "Weekly Digest", "Inventory Sync"],
    usedByTeams: "18,000+ teams",
  },
  {
    id: "gmail-1",
    app: "Gmail",
    brand: { emoji: "✉️" },
    title: "Support inbox",
    account: "ashish@walkover.in",
    connectedBy: "Ashish Yadav",
    connectedOn: "2026-06-04",
    status: "active",
    usedInFlows: 5,
    flowNames: [
      "Signup Notifications",
      "Support Ticket to Slack",
      "Weekly Digest",
      "Abandoned Cart Recovery",
      "Invoice Reminders",
    ],
    usedByTeams: "40,000+ teams",
  },
  {
    id: "gcal-1",
    app: "Google Calendar",
    brand: { letter: "C", color: "#2563eb" },
    title: null,
    account: "ashish@walkover.in",
    connectedBy: "Ashish Yadav",
    connectedOn: "2026-04-27",
    status: "active",
    usedInFlows: 1,
    flowNames: ["Daily Standup Reminder"],
    usedByTeams: "22,000+ teams",
  },
  {
    id: "gsheets-1",
    app: "Google Sheets",
    brand: { letter: "S", color: "#16a34a" },
    title: "Production sheet",
    account: "ashish@walkover.in",
    connectedBy: "Ashish Yadav",
    connectedOn: "2026-04-27",
    status: "active",
    usedInFlows: 4,
    flowNames: ["Product Sync", "Analytics Dashboard", "Inventory Update", "Data Warehouse Sync"],
    usedByTeams: "50,000+ teams",
  },
  {
    id: "gdocs-1",
    app: "Google Docs",
    brand: { letter: "D", color: "#2563eb" },
    title: null,
    account: "ashish@walkover.in",
    connectedBy: "Ashish Yadav",
    connectedOn: "2026-04-28",
    status: "active",
    usedInFlows: 0,
    flowNames: [],
    usedByTeams: "12,000+ teams",
  },
  {
    id: "gdrive-1",
    app: "Google Drive",
    brand: { letter: "D", color: "#16a34a" },
    title: null,
    account: "ashish@walkover.in",
    connectedBy: "Ashish Yadav",
    connectedOn: "2026-04-28",
    status: "active",
    usedInFlows: 0,
    flowNames: [],
    usedByTeams: "35,000+ teams",
  },
  {
    id: "gforms-1",
    app: "Google Forms",
    brand: { letter: "F", color: "#7c3aed" },
    title: null,
    account: "ashish@walkover.in",
    connectedBy: "Ashish Yadav",
    connectedOn: "2026-04-28",
    status: "active",
    usedInFlows: 0,
    flowNames: [],
    usedByTeams: "9,000+ teams",
  },
  {
    id: "slack-1",
    app: "Slack",
    brand: { emoji: "💬" },
    title: null,
    account: "ashish@acme-corp.slack.com",
    connectedBy: "Ashish Yadav",
    connectedOn: "2026-06-26",
    status: "active",
    usedInFlows: 2,
    flowNames: ["Support Ticket to Slack", "Daily Standup Reminder"],
    usedByTeams: "60,000+ teams",
  },
  {
    id: "shopify-1",
    app: "Shopify",
    brand: { emoji: "🛒" },
    title: null,
    account: "store@acme-corp.com",
    connectedBy: "Ashish Yadav",
    connectedOn: "2026-05-12",
    status: "expired",
    usedInFlows: 2,
    flowNames: ["New Order Webhook", "Abandoned Cart Recovery"],
    usedByTeams: "28,000+ teams",
  },
  {
    id: "hubspot-1",
    app: "HubSpot",
    brand: { emoji: "👥" },
    title: null,
    account: "ashish@walkover.in",
    connectedBy: "Ashish Yadav",
    connectedOn: "2026-06-01",
    status: "expired",
    usedInFlows: 1,
    flowNames: ["New Lead to HubSpot CRM"],
    usedByTeams: "24,000+ teams",
  },
  {
    id: "notion-1",
    app: "Notion",
    brand: { emoji: "📝" },
    title: null,
    account: "ashish@acme-corp.com",
    connectedBy: "Ashish Yadav",
    connectedOn: "2026-08-18",
    status: "active",
    usedInFlows: 0,
    flowNames: [],
    usedByTeams: "31,000+ teams",
  },
];

/** Apps offered in the connect picker (empty state + "connect new app"). */
export const POPULAR_APPS: { app: string; brand: BrandIcon; usedByTeams: string }[] = [
  { app: "Gmail", brand: { emoji: "✉️" }, usedByTeams: "40,000+ teams" },
  { app: "Slack", brand: { emoji: "💬" }, usedByTeams: "60,000+ teams" },
  { app: "Google Sheets", brand: { letter: "S", color: "#16a34a" }, usedByTeams: "50,000+ teams" },
  { app: "Shopify", brand: { emoji: "🛒" }, usedByTeams: "28,000+ teams" },
  { app: "Notion", brand: { emoji: "📝" }, usedByTeams: "31,000+ teams" },
  { app: "Airtable", brand: { emoji: "🗂️" }, usedByTeams: "18,000+ teams" },
  { app: "HubSpot", brand: { emoji: "👥" }, usedByTeams: "24,000+ teams" },
  { app: "WhatsApp", brand: { emoji: "📱" }, usedByTeams: "45,000+ teams" },
];

export type TrustIcon = "key" | "unplug" | "eye" | "lock";

/** Trust signals surfaced at the connect step (fixes the "stall / bounce" problem). */
export const TRUST_SIGNALS: { icon: TrustIcon; title: string; detail: string }[] = [
  { icon: "key", title: "We never see your password", detail: "Sign-in happens on the app's own site via OAuth." },
  { icon: "unplug", title: "Revoke anytime", detail: "Disconnect in one click — no email, no support ticket." },
  { icon: "eye", title: "Only what your flow needs", detail: "We request the minimum scopes, read-only where possible." },
  { icon: "lock", title: "Encrypted & SOC 2", detail: "Tokens are encrypted at rest and never shared." },
];
