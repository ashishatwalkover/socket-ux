/**
 * Catalog of services available to an embed, with their categories and the
 * triggers / actions each one exposes. Used by the "Filter Available Apps"
 * screen so the embed owner can curate what their users can connect.
 */
export type EmbedService = {
  id: string;
  name: string;
  icon: string; // emoji fallback when no real logo is available yet
  iconUrl?: string; // real brand logo (from the project's shared icon set)
  categories: string[];
  triggers: string[];
  actions: string[];
};

export const EMBED_SERVICES: EmbedService[] = [
  {
    id: "sheets",
    name: "Google Sheets",
    icon: "📊",
    iconUrl: "https://stuff.thingsofbrand.com/google.com/images/img4_googlesheet.png",
    categories: ["Spreadsheets", "Productivity", "Databases", "Content and Files"],
    triggers: ["New Sheet Created", "New Spreadsheet", "Row Added Or Updated"],
    actions: [
      "Add Conditional Formatting Rule",
      "Add Multiple Rows",
      "Add New Row to Sheet",
      "Batch Update Cell Values",
      "Clear Spreadsheet Row",
      "Copy Sheet To Spreadsheet",
      "Create a Spreadsheet",
      "Create Sheet Column",
      "Create Spreadsheet From Template",
      "Create Subsheet",
      "Delete Rows",
      "Find Subsheet",
      "Format Spreadsheet Row",
      "Get Row Details",
    ],
  },
  {
    id: "gmail",
    name: "Gmail",
    icon: "✉️",
    iconUrl: "https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png",
    categories: ["Email", "Communication", "Productivity"],
    triggers: ["New Email", "New Labeled Email", "New Attachment"],
    actions: ["Send Email", "Create Draft", "Add Label", "Reply to Email"],
  },
  {
    id: "slack",
    name: "Slack",
    icon: "💬",
    iconUrl: "https://stuff.thingsofbrand.com/slack.com/images/img668216333e_slack.jpg",
    categories: ["Communication"],
    triggers: ["New Message in Channels", "New Mention", "Reaction Added"],
    actions: ["Send Channel Message", "Send Direct Message", "Add Reminder", "Invite Users to Channel"],
  },
  {
    id: "gcal",
    name: "Google Calendar",
    icon: "📅",
    iconUrl: "https://stuff.thingsofbrand.com/google.com/images/img7_Google-Calendar.png",
    categories: ["Calendar", "Productivity"],
    triggers: ["New Event", "Event Started", "Event Cancelled"],
    actions: ["Create Event", "Update Event", "Delete Event", "Find Event"],
  },
  {
    id: "gdrive",
    name: "Google Drive",
    icon: "📁",
    iconUrl: "https://stuff.thingsofbrand.com/google.com/images/img9_googledrive.png",
    categories: ["Content and Files", "Productivity"],
    triggers: ["New File", "New Folder", "File Updated"],
    actions: ["Upload File", "Create Folder", "Move File", "Share File"],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    icon: "🧲",
    iconUrl: "https://stuff.thingsofbrand.com/hubspot.com/images/img3_hubspot.png",
    categories: ["CRM", "Marketing"],
    triggers: ["New Contact", "New Deal", "Deal Stage Changed"],
    actions: ["Create Contact", "Update Contact", "Create Deal", "Add Note"],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    icon: "☁️",
    iconUrl: "https://stuff.thingsofbrand.com/salesforce.com/images/img1_salesforce.png",
    categories: ["CRM"],
    triggers: ["New Lead", "New Opportunity", "Record Updated"],
    actions: ["Create Record", "Update Record", "Add Lead", "Run Report"],
  },
  {
    id: "shopify",
    name: "Shopify",
    icon: "🛒",
    iconUrl: "https://stuff.thingsofbrand.com/shopify.com/images/img6fb21a1332_shopify.jpg",
    categories: ["Commerce"],
    triggers: ["New Order", "New Customer", "Product Updated"],
    actions: ["Create Product", "Update Inventory", "Fulfill Order", "Add Customer"],
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    icon: "👥",
    iconUrl: "https://stuff.thingsofbrand.com/microsoft.com/images/img9_Microsoft-Teams-Logo.png",
    categories: ["Communication", "Video"],
    triggers: ["New Channel Message", "New Team Member"],
    actions: ["Send Channel Message", "Create Meeting", "Add Member"],
  },
  {
    id: "mailchimp",
    name: "MailChimp",
    icon: "🐵",
    iconUrl: "https://stuff.thingsofbrand.com/mailchimp.com/images/img673876726d_mailchimp.jpg",
    categories: ["Marketing", "Email"],
    triggers: ["New Subscriber", "Campaign Sent"],
    actions: ["Add Subscriber", "Update Subscriber", "Send Campaign", "Add Tag"],
  },
  {
    id: "airtable",
    name: "Airtable",
    icon: "🗂️",
    iconUrl: "https://stuff.thingsofbrand.com/airtable.com/images/img6da0d45803_airtable.jpg",
    categories: ["Databases", "Productivity"],
    triggers: ["New Record", "Record Updated"],
    actions: ["Create Record", "Update Record", "Find Record", "Delete Record"],
  },
  {
    id: "notion",
    name: "Notion",
    icon: "📝",
    iconUrl: "https://stuff.thingsofbrand.com/notion.so/images/img667018e3f8_notion.jpg",
    categories: ["Productivity", "Content and Files"],
    triggers: ["New Database Item", "Page Updated"],
    actions: ["Create Page", "Update Page", "Append Block", "Find Page"],
  },
  {
    id: "stripe",
    name: "Stripe",
    icon: "💳",
    iconUrl: "https://stuff.thingsofbrand.com/stripe.com/images/img67eab239fe_stripe.jpg",
    categories: ["Commerce", "Accounting"],
    triggers: ["New Payment", "New Subscription", "Refund Created"],
    actions: ["Create Charge", "Create Customer", "Issue Refund", "Create Invoice"],
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    icon: "📒",
    iconUrl: "https://stuff.thingsofbrand.com/quickbooks.intuit.com/images/imgf_Screenshot-2025-03-20-141203.png",
    categories: ["Accounting"],
    triggers: ["New Invoice", "New Payment"],
    actions: ["Create Invoice", "Create Customer", "Record Expense"],
  },
  {
    id: "zoom",
    name: "Zoom",
    icon: "🎥",
    iconUrl: "https://stuff.thingsofbrand.com/zoom.us/images/img688a247e14_zoom.jpg",
    categories: ["Video", "Communication"],
    triggers: ["Meeting Started", "Meeting Ended", "New Recording"],
    actions: ["Create Meeting", "Update Meeting", "Add Registrant"],
  },
  {
    id: "openai",
    name: "OpenAI",
    icon: "🤖",
    iconUrl: "https://stuff.thingsofbrand.com/openai.com/images/img6299ba7193_openai.jpg",
    categories: ["AI Tools", "Developer Tools"],
    triggers: [],
    actions: ["Generate Text", "Generate Image", "Summarize", "Classify"],
  },
];

/** All categories that actually have at least one service, sorted. */
export const EMBED_CATEGORIES: string[] = Array.from(
  new Set(EMBED_SERVICES.flatMap((s) => s.categories))
).sort((a, b) => a.localeCompare(b));
