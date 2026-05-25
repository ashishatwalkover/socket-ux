import { AI_BASE, APP_BASE } from "./app-routes";

export type CommandKind = "action" | "navigation" | "flow" | "collection" | "log" | "help";

export type CommandItem = {
  id: string;
  kind: CommandKind;
  name: string;
  href?: string;
  // action fields
  shortcut?: string;
  // flow fields
  status?: "Active" | "Paused" | "Error";
  updated?: string;
  collection?: string;
  // log fields
  time?: string;
  // help/action fields
  description?: string;
  // collection fields
  flowCount?: number;
};

export const collectionItems: CommandItem[] = [
  { id: "c1", kind: "collection", name: "MSG91 High Priority", flowCount: 12, href: "/collections/msg91-high-priority" },
  { id: "c2", kind: "collection", name: "MSG91 Developers", flowCount: 8, href: "/collections/msg91-developers" },
  { id: "c3", kind: "collection", name: "Partners Team", flowCount: 15, href: "/collections/partners-team" },
  { id: "c4", kind: "collection", name: "Customer Support", flowCount: 6, href: "/collections/customer-support" },
  { id: "c5", kind: "collection", name: "Finance & Accounting", flowCount: 4, href: "/collections/finance-accounting" },
  { id: "c6", kind: "collection", name: "Information Tech", flowCount: 9, href: "/collections/information-tech" },
  { id: "c7", kind: "collection", name: "OpenAI prompts", flowCount: 3, href: "/collections/openai-prompts" },
  { id: "c8", kind: "collection", name: "CrowdSourceTrials", flowCount: 2, href: "/collections/crowdsource-trials" },
];

export const actionItems: CommandItem[] = [
  {
    id: "act-create-flow",
    kind: "action",
    name: "Create New Flow",
    description: "Start building a new workflow from scratch",
    href: `${APP_BASE}?new=1`,
    shortcut: "C",
  },
];

export const navigationItems: CommandItem[] = [
  { id: "nav-home", kind: "navigation", name: "Home", href: APP_BASE },
  { id: "nav-ai", kind: "navigation", name: "AI", href: AI_BASE },
  { id: "nav-metrics", kind: "navigation", name: "Metrics", href: "/metrics" },
  { id: "nav-templates", kind: "navigation", name: "Templates", href: "/templates" },
  { id: "nav-connections", kind: "navigation", name: "Connections", href: "/connections" },
  { id: "nav-mcp", kind: "navigation", name: "MCP Server", href: "/mcp-server" },
  { id: "nav-ai-agents", kind: "navigation", name: "AI Agents", href: "/ai-agents" },
  { id: "nav-memory", kind: "navigation", name: "Memory", href: "/memory" },
];

export const flowItems: CommandItem[] = [
  { id: "f1", kind: "flow", name: "Incomplete Signup Notifications", status: "Active", updated: "08/05/2026", collection: "MSG91 High Priority" },
  { id: "f2", kind: "flow", name: "KB activation", status: "Active", updated: "09/10/2024", collection: "MSG91 Developers" },
  { id: "f3", kind: "flow", name: "MSG91 Signup", status: "Active", updated: "08/05/2026", collection: "MSG91 High Priority" },
  { id: "f4", kind: "flow", name: "New SignUp SignIn Logs", status: "Active", updated: "09/10/2024", collection: "MSG91 Developers" },
  { id: "f5", kind: "flow", name: "Pipedrive Signup Logs", status: "Active", updated: "09/10/2024", collection: "Partners Team" },
  { id: "f6", kind: "flow", name: "WooCommerce Plugin - New User Signup Alert", status: "Active", updated: "04/03/2025", collection: "Partners Team" },
  { id: "f7", kind: "flow", name: "Zoho Plugin Signup Logs", status: "Active", updated: "03/03/2026", collection: "Partners Team" },
];

export const logItems: CommandItem[] = [
  { id: "l1", kind: "log", name: "MSG91 Public domain user flow", time: "08/05/2026, 13:27:42" },
  { id: "l2", kind: "log", name: "Collect MSG91 user data", time: "08/05/2026, 13:26:57" },
  { id: "l3", kind: "log", name: "Run JS code", time: "08/05/2026, 13:25:57", collection: "OpenAI prompts" },
  { id: "l4", kind: "log", name: "Run JS code", time: "08/05/2026, 13:25:10", collection: "OpenAI prompts" },
  { id: "l5", kind: "log", name: "Collect MSG91 user data", time: "08/05/2026, 13:24:52" },
  { id: "l6", kind: "log", name: "MSG91 Public domain user flow", time: "08/05/2026, 13:24:43" },
  { id: "l7", kind: "log", name: "MSG91 Public domain user flow", time: "08/05/2026, 13:22:17" },
  { id: "l8", kind: "log", name: "Collect MSG91 user data", time: "08/05/2026, 13:21:52" },
  { id: "l9", kind: "log", name: "MSG91 Public domain user flow", time: "08/05/2026, 13:18:50" },
  { id: "l10", kind: "log", name: "Collect MSG91 user data", time: "08/05/2026, 13:18:28" },
];

export const helpItems: CommandItem[] = [
  { id: "h1", kind: "help", name: "Getting started with Workflows", description: "Learn the basics of creating your first flow", href: "https://docs.msg91.com/workflows" },
  { id: "h2", kind: "help", name: "How to use MCP Server", description: "Connect external tools via MCP", href: "https://docs.msg91.com/mcp" },
  { id: "h3", kind: "help", name: "Keyboard shortcuts", description: "All keyboard shortcuts in MSG91", href: "https://docs.msg91.com/shortcuts" },
];

export const allCommandItems: CommandItem[] = [
  ...navigationItems,
  ...flowItems,
  ...logItems,
  ...helpItems,
];
