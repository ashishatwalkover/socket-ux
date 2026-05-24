import type {
  ExampleWorkflow,
  FlowStep,
  InputValue,
  JsonSchema,
  VariableRef,
} from "./flow-types";

// ---------- Local helpers (terse data construction) ----------

const lit = (value: unknown): InputValue => ({ kind: "literal", value });
const ref = (stepId: string, ...path: string[]): InputValue => ({
  kind: "ref",
  ref: { stepId, path },
});
const tmpl = (...parts: Array<string | VariableRef>): InputValue => ({
  kind: "template",
  parts,
});
const r = (stepId: string, ...path: string[]): VariableRef => ({ stepId, path });

const obj = (
  properties: Record<string, JsonSchema>,
  description?: string,
): JsonSchema => ({ type: "object", properties, ...(description ? { description } : {}) });
const str = (example?: string, description?: string): JsonSchema => ({
  type: "string",
  ...(example !== undefined ? { example } : {}),
  ...(description ? { description } : {}),
});
const num = (example?: number, description?: string): JsonSchema => ({
  type: "number",
  ...(example !== undefined ? { example } : {}),
  ...(description ? { description } : {}),
});
const bool = (example?: boolean): JsonSchema => ({
  type: "boolean",
  ...(example !== undefined ? { example } : {}),
});
const arr = (items: JsonSchema): JsonSchema => ({ type: "array", items });
const enumStr = (values: string[], example?: string): JsonSchema => ({
  type: "string",
  enum: values,
  ...(example !== undefined ? { example } : {}),
});

// Schema reused by every condition step's outputSchema.
const conditionOutputSchema: JsonSchema = obj({
  matched: bool(),
  branch: enumStr(["yes", "no"]),
});

// ============================================================
// Workflow 1 — Google Sheets → Slack
// ============================================================

const SHEETS_STEPS: FlowStep[] = [
  {
    id: "1",
    kind: "trigger",
    title: "New Row in Google Sheets",
    subtitle: "Spreadsheet updated",
    app: "sheets",
    operation: "new_row",
    inputSchema: obj({
      spreadsheetId: str("1AbCdEfGhIjKlMnOpQrStUvWxYz"),
      sheetName: str("Leads"),
      triggerColumn: str("A", "Column to watch for new entries"),
    }),
    inputs: {
      spreadsheetId: lit("1AbCdEfGhIjKlMnOpQrStUvWxYz"),
      sheetName: lit("Leads"),
      triggerColumn: lit("A"),
    },
    outputSchema: obj({
      rowId: str(),
      rowNumber: num(),
      values: obj({
        name: str(),
        email: str(),
        company: str(),
        message: str(),
      }),
      addedAt: str(),
    }),
    sampleOutput: {
      rowId: "row_8421",
      rowNumber: 142,
      values: {
        name: "Aarav Mehta",
        email: "aarav@bluehorizon.io",
        company: "Blue Horizon",
        message: "Interested in the enterprise plan",
      },
      addedAt: "2026-05-24T09:42:11Z",
    },
  },
  {
    id: "2",
    kind: "action",
    title: "Format notification message",
    subtitle: "Transform row data",
    app: "ai",
    operation: "format_text",
    inputSchema: obj({
      template: str(),
    }),
    inputs: {
      template: tmpl(
        "🆕 New lead: *",
        r("1", "values", "name"),
        "* (",
        r("1", "values", "company"),
        ") — ",
        r("1", "values", "message"),
      ),
    },
    outputSchema: obj({ text: str() }),
    sampleOutput: {
      text: "🆕 New lead: *Aarav Mehta* (Blue Horizon) — Interested in the enterprise plan",
    },
  },
  {
    id: "3",
    kind: "action",
    title: "Send Slack message",
    subtitle: "Post to #updates channel",
    app: "slack",
    operation: "send_message",
    inputSchema: obj({
      channel: str("#updates"),
      text: str(),
    }),
    inputs: {
      channel: lit("#updates"),
      text: ref("2", "text"),
    },
    outputSchema: obj({
      ok: bool(),
      ts: str(),
      channel: str(),
    }),
    sampleOutput: { ok: true, ts: "1716545672.001200", channel: "C0LAN2Q65" },
  },
];

// ============================================================
// Workflow 2 — Daily email summary in Notion
// ============================================================

const NOTION_STEPS: FlowStep[] = [
  {
    id: "n1",
    kind: "trigger",
    title: "Daily at 9:00 AM",
    subtitle: "Cron schedule trigger",
    app: "schedule",
    operation: "cron",
    inputSchema: obj({
      cron: str("0 9 * * *", "Cron expression"),
      timezone: str("Asia/Kolkata"),
    }),
    inputs: {
      cron: lit("0 9 * * *"),
      timezone: lit("Asia/Kolkata"),
    },
    outputSchema: obj({
      firedAt: str(),
      runId: str(),
    }),
    sampleOutput: {
      firedAt: "2026-05-24T09:00:00+05:30",
      runId: "run_d8b1f7",
    },
  },
  {
    id: "n2",
    kind: "action",
    title: "Fetch unread emails",
    subtitle: "Pull from inbox",
    app: "gmail",
    operation: "list_messages",
    inputSchema: obj({
      query: str("is:unread newer_than:1d"),
      maxResults: num(50),
    }),
    inputs: {
      query: lit("is:unread newer_than:1d"),
      maxResults: lit(50),
    },
    outputSchema: obj({
      count: num(),
      messages: arr(
        obj({
          id: str(),
          from: str(),
          subject: str(),
          snippet: str(),
          receivedAt: str(),
        }),
      ),
    }),
    sampleOutput: {
      count: 3,
      messages: [
        {
          id: "msg_001",
          from: "Priya <priya@vendor.com>",
          subject: "Q2 invoice attached",
          snippet: "Please find attached the Q2 invoice for review...",
          receivedAt: "2026-05-24T07:14:00Z",
        },
        {
          id: "msg_002",
          from: "GitHub <noreply@github.com>",
          subject: "[socket-ux] PR #42 ready for review",
          snippet: "The PR has 3 new commits since your last review...",
          receivedAt: "2026-05-24T08:01:00Z",
        },
        {
          id: "msg_003",
          from: "Notion <team@notion.so>",
          subject: "Weekly digest",
          snippet: "Here's what your team shipped this week...",
          receivedAt: "2026-05-24T08:30:00Z",
        },
      ],
    },
  },
  {
    id: "n3",
    kind: "action",
    title: "Summarize with AI",
    subtitle: "Generate daily digest",
    app: "ai",
    operation: "summarize",
    inputSchema: obj({
      input: arr(obj({ from: str(), subject: str(), snippet: str() })),
      style: enumStr(["bullets", "paragraph", "table"], "bullets"),
      maxWords: num(150),
    }),
    inputs: {
      input: ref("n2", "messages"),
      style: lit("bullets"),
      maxWords: lit(150),
    },
    outputSchema: obj({
      summary: str(),
      highlights: arr(str()),
    }),
    sampleOutput: {
      summary:
        "3 unread emails: a Q2 invoice from Priya needing review, a PR ready for review on socket-ux, and Notion's weekly digest.",
      highlights: [
        "Q2 invoice from Priya — review required",
        "PR #42 has 3 new commits",
        "Notion weekly digest available",
      ],
    },
  },
  {
    id: "n4",
    kind: "action",
    title: "Create Notion page",
    subtitle: "Save summary to workspace",
    app: "notion",
    operation: "create_page",
    inputSchema: obj({
      databaseId: str("a1b2c3d4e5"),
      title: str(),
      body: str(),
    }),
    inputs: {
      databaseId: lit("a1b2c3d4e5"),
      title: tmpl("Daily digest — ", r("n1", "firedAt")),
      body: ref("n3", "summary"),
    },
    outputSchema: obj({
      pageId: str(),
      url: str(),
    }),
    sampleOutput: {
      pageId: "p_77f1c2",
      url: "https://www.notion.so/Daily-digest-77f1c2",
    },
  },
];

// ============================================================
// Workflow 3 — Form → Airtable
// ============================================================

const AIRTABLE_STEPS: FlowStep[] = [
  {
    id: "a1",
    kind: "trigger",
    title: "Form submitted",
    subtitle: "New submission received",
    app: "forms",
    operation: "form_submit",
    inputSchema: obj({
      formId: str("contact-us-v3"),
    }),
    inputs: {
      formId: lit("contact-us-v3"),
    },
    outputSchema: obj({
      submissionId: str(),
      fields: obj({
        name: str(),
        email: str(),
        phone: str(),
        topic: str(),
        message: str(),
      }),
      submittedAt: str(),
    }),
    sampleOutput: {
      submissionId: "sub_55a91f",
      fields: {
        name: "Sneha Roy",
        email: "sneha@acme.com",
        phone: "+91-90xxxxxx12",
        topic: "Pricing",
        message: "Can we get a custom quote for 50 seats?",
      },
      submittedAt: "2026-05-24T10:11:30Z",
    },
  },
  {
    id: "a2",
    kind: "action",
    title: "Validate form data",
    subtitle: "Check required fields",
    app: "ai",
    operation: "validate",
    inputSchema: obj({
      data: obj({}),
      rules: arr(str()),
    }),
    inputs: {
      data: ref("a1", "fields"),
      rules: lit([
        "email must be a valid address",
        "phone must include country code",
        "message length >= 10",
      ]),
    },
    outputSchema: obj({
      valid: bool(),
      errors: arr(str()),
      cleaned: obj({
        name: str(),
        email: str(),
        phone: str(),
        topic: str(),
        message: str(),
      }),
    }),
    sampleOutput: {
      valid: true,
      errors: [],
      cleaned: {
        name: "Sneha Roy",
        email: "sneha@acme.com",
        phone: "+91-90xxxxxx12",
        topic: "Pricing",
        message: "Can we get a custom quote for 50 seats?",
      },
    },
  },
  {
    id: "a3",
    kind: "action",
    title: "Add row to Airtable",
    subtitle: "Insert validated record",
    app: "airtable",
    operation: "create_record",
    inputSchema: obj({
      baseId: str("appAbCdEfGh"),
      tableName: str("Inquiries"),
      fields: obj(
        {
          Name: str(),
          Email: str(),
          Phone: str(),
          Topic: str(),
          Message: str(),
        },
        "Maps directly from validated form data",
      ),
    }),
    inputs: {
      baseId: lit("appAbCdEfGh"),
      tableName: lit("Inquiries"),
      // Whole object passed via ref — variable picker can later split per-field.
      fields: ref("a2", "cleaned"),
    },
    outputSchema: obj({
      recordId: str(),
      createdAt: str(),
    }),
    sampleOutput: {
      recordId: "recXyz123",
      createdAt: "2026-05-24T10:11:32Z",
    },
  },
];

// ============================================================
// Workflow 4 — New Shopify Order (branching, 26 steps)
// ============================================================

// Trigger: a real, deeply-typed Shopify order shape.
const shopifyTrigger: FlowStep = {
  id: "s1",
  kind: "trigger",
  title: "New Shopify Order",
  subtitle: "Order created in Shopify",
  app: "shopify",
  operation: "new_order",
  depth: 0,
  inputSchema: obj({
    store: str("acme-store.myshopify.com"),
    financialStatus: enumStr(["paid", "pending", "refunded", "any"], "paid"),
    minOrderValue: num(0),
    tags: arr(str()),
  }),
  inputs: {
    store: lit("acme-store.myshopify.com"),
    financialStatus: lit("paid"),
    minOrderValue: lit(0),
    tags: lit([]),
  },
  outputSchema: obj({
    orderId: str(),
    orderNumber: str(),
    totalPrice: num(),
    currency: str(),
    financialStatus: str(),
    fraudScore: num(),
    customer: obj({
      id: str(),
      email: str(),
      firstName: str(),
      lastName: str(),
      phone: str(),
    }),
    lineItems: arr(
      obj({
        sku: str(),
        title: str(),
        quantity: num(),
        price: num(),
      }),
    ),
    shippingAddress: obj({
      city: str(),
      country: str(),
      zip: str(),
    }),
    createdAt: str(),
  }),
  sampleOutput: {
    orderId: "gid://shopify/Order/5821049012",
    orderNumber: "#1042",
    totalPrice: 129.5,
    currency: "USD",
    financialStatus: "paid",
    fraudScore: 0.12,
    customer: {
      id: "gid://shopify/Customer/7723",
      email: "priya.sharma@example.com",
      firstName: "Priya",
      lastName: "Sharma",
      phone: "+91-98xxxxxx21",
    },
    lineItems: [
      { sku: "TS-BLK-M", title: "Cotton Tee — Black, M", quantity: 2, price: 29.0 },
      { sku: "MUG-01", title: "Ceramic Mug", quantity: 1, price: 14.5 },
    ],
    shippingAddress: { city: "Bengaluru", country: "IN", zip: "560001" },
    createdAt: "2026-05-24T10:14:22Z",
  },
};

// Helper: action step factory to keep the long Shopify flow readable.
function action(
  partial: Pick<FlowStep, "id" | "title" | "subtitle"> &
    Partial<
      Pick<
        FlowStep,
        | "app"
        | "operation"
        | "inputSchema"
        | "inputs"
        | "outputSchema"
        | "sampleOutput"
        | "branch"
        | "depth"
      >
    >,
): FlowStep {
  return {
    kind: "action",
    app: partial.app,
    operation: partial.operation,
    inputSchema: partial.inputSchema ?? obj({}),
    inputs: partial.inputs ?? {},
    outputSchema: partial.outputSchema ?? obj({ ok: bool() }),
    sampleOutput: partial.sampleOutput ?? { ok: true },
    ...partial,
  };
}

const SHOPIFY_ORDER_STEPS: FlowStep[] = [
  shopifyTrigger,

  action({
    id: "s2",
    title: "Validate Payment",
    subtitle: "Verify payment status",
    app: "shopify",
    operation: "validate_payment",
    depth: 0,
    inputSchema: obj({ orderId: str() }),
    inputs: { orderId: ref("s1", "orderId") },
    outputSchema: obj({ valid: bool(), gateway: str(), authCode: str() }),
    sampleOutput: { valid: true, gateway: "stripe", authCode: "auth_3kF2" },
  }),

  // Root-level condition #1 — high-value order requires extra approval
  {
    id: "s2a",
    kind: "condition",
    title: "IF High-Value Order",
    subtitle: "Order total exceeds $500",
    depth: 0,
    inputSchema: obj({}),
    inputs: {},
    condition: {
      left: ref("s1", "totalPrice"),
      operator: "gt",
      right: lit(500),
    },
    outputSchema: conditionOutputSchema,
    sampleOutput: { matched: false, branch: "no" },
  },

  action({
    id: "s2b",
    title: "Require Manager Approval",
    subtitle: "Flag for manual review",
    app: "slack",
    operation: "send_message",
    depth: 1,
    branch: "yes",
    inputSchema: obj({ channel: str("#approvals"), text: str() }),
    inputs: {
      channel: lit("#approvals"),
      text: tmpl(
        "💰 High-value order ",
        r("s1", "orderNumber"),
        " (",
        r("s1", "currency"),
        " ",
        r("s1", "totalPrice"),
        ") needs approval",
      ),
    },
    outputSchema: obj({ ok: bool(), ts: str() }),
    sampleOutput: { ok: true, ts: "1716545680.000400" },
  }),

  action({
    id: "s2c",
    title: "Auto-approve Order",
    subtitle: "Standard order — no review needed",
    app: "shopify",
    operation: "approve_order",
    depth: 1,
    branch: "no",
    inputSchema: obj({ orderId: str() }),
    inputs: { orderId: ref("s1", "orderId") },
    outputSchema: obj({ approved: bool() }),
    sampleOutput: { approved: true },
  }),

  action({
    id: "s3",
    title: "Check Fraud Score (AI)",
    subtitle: "AI fraud risk analysis",
    app: "ai",
    operation: "fraud_score",
    depth: 0,
    inputSchema: obj({
      orderId: str(),
      customerEmail: str(),
      totalPrice: num(),
      shippingCountry: str(),
    }),
    inputs: {
      orderId: ref("s1", "orderId"),
      customerEmail: ref("s1", "customer", "email"),
      totalPrice: ref("s1", "totalPrice"),
      shippingCountry: ref("s1", "shippingAddress", "country"),
    },
    outputSchema: obj({ score: num(), reasons: arr(str()) }),
    sampleOutput: {
      score: 0.12,
      reasons: ["customer has 4 prior successful orders", "billing matches shipping"],
    },
  }),

  // Condition: fraud score > 0.7
  {
    id: "s4",
    kind: "condition",
    title: "IF Fraud Risk High",
    subtitle: "Evaluate fraud score threshold",
    depth: 0,
    inputSchema: obj({}),
    inputs: {},
    condition: {
      left: ref("s3", "score"),
      operator: "gt",
      right: lit(0.7),
    },
    outputSchema: conditionOutputSchema,
    sampleOutput: { matched: false, branch: "no" },
  },

  // YES branch — hold + notify
  action({
    id: "s5",
    title: "Hold Order",
    subtitle: "Pause order processing",
    app: "shopify",
    operation: "hold_order",
    depth: 1,
    branch: "yes",
    inputSchema: obj({ orderId: str(), reason: str() }),
    inputs: {
      orderId: ref("s1", "orderId"),
      reason: tmpl("High fraud score: ", r("s3", "score")),
    },
    outputSchema: obj({ held: bool(), holdId: str() }),
    sampleOutput: { held: true, holdId: "hold_91" },
  }),

  action({
    id: "s6",
    title: "Notify Admin",
    subtitle: "Alert admin of high-risk order",
    app: "slack",
    operation: "send_message",
    depth: 1,
    branch: "yes",
    inputSchema: obj({ channel: str("#alerts"), text: str() }),
    inputs: {
      channel: lit("#alerts"),
      text: tmpl(
        "🚨 Held order ",
        r("s1", "orderNumber"),
        " — fraud score ",
        r("s3", "score"),
      ),
    },
    outputSchema: obj({ ok: bool(), ts: str() }),
    sampleOutput: { ok: true, ts: "1716545700.000100" },
  }),

  // NO branch — proceed with fulfillment
  action({
    id: "s7",
    title: "Check Inventory",
    subtitle: "Verify stock levels",
    app: "shopify",
    operation: "check_inventory",
    depth: 1,
    branch: "no",
    inputSchema: obj({
      lineItems: arr(obj({ sku: str(), quantity: num() })),
    }),
    inputs: {
      lineItems: ref("s1", "lineItems"),
    },
    outputSchema: obj({
      allAvailable: bool(),
      totalAvailable: num(),
      shortfalls: arr(obj({ sku: str(), needed: num(), available: num() })),
    }),
    sampleOutput: { allAvailable: true, totalAvailable: 3, shortfalls: [] },
  }),

  // Condition: stock available?
  {
    id: "s8",
    kind: "condition",
    title: "IF Stock Available",
    subtitle: "Check if items are in stock",
    depth: 1,
    branch: "no",
    inputSchema: obj({}),
    inputs: {},
    condition: {
      left: ref("s7", "allAvailable"),
      operator: "eq",
      right: lit(true),
    },
    outputSchema: conditionOutputSchema,
    sampleOutput: { matched: true, branch: "yes" },
  },

  // YES branch — fulfill
  action({
    id: "s9",
    title: "Reserve Inventory",
    subtitle: "Lock stock for order",
    app: "shopify",
    operation: "reserve_inventory",
    depth: 2,
    branch: "yes",
    inputSchema: obj({
      orderId: str(),
      lineItems: arr(obj({ sku: str(), quantity: num() })),
    }),
    inputs: {
      orderId: ref("s1", "orderId"),
      lineItems: ref("s1", "lineItems"),
    },
    outputSchema: obj({ reserved: bool(), reservationId: str() }),
    sampleOutput: { reserved: true, reservationId: "res_77c4" },
  }),

  action({
    id: "s10",
    title: "Create Shipment",
    subtitle: "Generate shipping label",
    app: "shopify",
    operation: "create_shipment",
    depth: 2,
    branch: "yes",
    inputSchema: obj({
      orderId: str(),
      shippingAddress: obj({ city: str(), country: str(), zip: str() }),
    }),
    inputs: {
      orderId: ref("s1", "orderId"),
      shippingAddress: ref("s1", "shippingAddress"),
    },
    outputSchema: obj({
      shipmentId: str(),
      trackingNumber: str(),
      carrier: str(),
      labelUrl: str(),
    }),
    sampleOutput: {
      shipmentId: "ship_66a1",
      trackingNumber: "1Z999AA10123456784",
      carrier: "UPS",
      labelUrl: "https://labels.example.com/1Z999AA.pdf",
    },
  }),

  action({
    id: "s11",
    title: "Generate Invoice PDF",
    subtitle: "Create invoice document",
    app: "ai",
    operation: "generate_pdf",
    depth: 2,
    branch: "yes",
    inputSchema: obj({
      template: str("invoice-v2"),
      orderNumber: str(),
      total: num(),
      lineItems: arr(obj({ title: str(), quantity: num(), price: num() })),
    }),
    inputs: {
      template: lit("invoice-v2"),
      orderNumber: ref("s1", "orderNumber"),
      total: ref("s1", "totalPrice"),
      lineItems: ref("s1", "lineItems"),
    },
    outputSchema: obj({ pdfUrl: str(), bytes: num() }),
    sampleOutput: { pdfUrl: "https://files.example.com/inv-1042.pdf", bytes: 84210 },
  }),

  action({
    id: "s12",
    title: "Send Order Confirmation Email",
    subtitle: "Email customer confirmation",
    app: "gmail",
    operation: "send_email",
    depth: 2,
    branch: "yes",
    inputSchema: obj({
      to: str(),
      subject: str(),
      body: str(),
      attachments: arr(str()),
    }),
    inputs: {
      to: ref("s1", "customer", "email"),
      subject: tmpl("Your order ", r("s1", "orderNumber"), " is confirmed"),
      body: tmpl(
        "Hi ",
        r("s1", "customer", "firstName"),
        ", thanks for your order! Track it here: ",
        r("s10", "trackingNumber"),
      ),
      attachments: lit([]),
    },
    outputSchema: obj({ messageId: str(), accepted: bool() }),
    sampleOutput: { messageId: "msg_inv_1042", accepted: true },
  }),

  action({
    id: "s13",
    title: "Send SMS Update",
    subtitle: "SMS shipment notification",
    app: "twilio",
    operation: "send_sms",
    depth: 2,
    branch: "yes",
    inputSchema: obj({ to: str(), body: str() }),
    inputs: {
      to: ref("s1", "customer", "phone"),
      body: tmpl(
        "Order ",
        r("s1", "orderNumber"),
        " shipped via ",
        r("s10", "carrier"),
        ". Tracking: ",
        r("s10", "trackingNumber"),
      ),
    },
    outputSchema: obj({ sid: str(), status: str() }),
    sampleOutput: { sid: "SM3a7c", status: "queued" },
  }),

  action({
    id: "s14",
    title: "Send WhatsApp Tracking Message",
    subtitle: "WhatsApp delivery update",
    app: "whatsapp",
    operation: "send_template",
    depth: 2,
    branch: "yes",
    inputSchema: obj({
      to: str(),
      templateName: str("order_shipped"),
      variables: arr(str()),
    }),
    inputs: {
      to: ref("s1", "customer", "phone"),
      templateName: lit("order_shipped"),
      variables: lit([]),
    },
    outputSchema: obj({ messageId: str(), status: str() }),
    sampleOutput: { messageId: "wa_8821", status: "sent" },
  }),

  action({
    id: "s15",
    title: "Update CRM",
    subtitle: "Sync order to CRM",
    app: "crm",
    operation: "upsert_contact",
    depth: 2,
    branch: "yes",
    inputSchema: obj({
      email: str(),
      lastOrderId: str(),
      lastOrderTotal: num(),
    }),
    inputs: {
      email: ref("s1", "customer", "email"),
      lastOrderId: ref("s1", "orderId"),
      lastOrderTotal: ref("s1", "totalPrice"),
    },
    outputSchema: obj({ contactId: str(), updated: bool() }),
    sampleOutput: { contactId: "ct_4421", updated: true },
  }),

  action({
    id: "s16",
    title: "Add Loyalty Points",
    subtitle: "Credit customer rewards",
    app: "crm",
    operation: "add_points",
    depth: 2,
    branch: "yes",
    inputSchema: obj({
      customerId: str(),
      points: num(),
      reason: str(),
    }),
    inputs: {
      customerId: ref("s1", "customer", "id"),
      points: ref("s1", "totalPrice"),
      reason: tmpl("Order ", r("s1", "orderNumber")),
    },
    outputSchema: obj({ newBalance: num() }),
    sampleOutput: { newBalance: 1294 },
  }),

  action({
    id: "s17",
    title: "Notify Warehouse Team",
    subtitle: "Alert warehouse to pack",
    app: "slack",
    operation: "send_message",
    depth: 2,
    branch: "yes",
    inputSchema: obj({ channel: str("#warehouse"), text: str() }),
    inputs: {
      channel: lit("#warehouse"),
      text: tmpl("📦 Pack order ", r("s1", "orderNumber"), " — ship to ", r("s1", "shippingAddress", "city")),
    },
    outputSchema: obj({ ok: bool(), ts: str() }),
    sampleOutput: { ok: true, ts: "1716545710.000200" },
  }),

  action({
    id: "s18",
    title: "Track Delivery Status",
    subtitle: "Monitor shipment progress",
    app: "shopify",
    operation: "track_shipment",
    depth: 2,
    branch: "yes",
    inputSchema: obj({ trackingNumber: str(), carrier: str() }),
    inputs: {
      trackingNumber: ref("s10", "trackingNumber"),
      carrier: ref("s10", "carrier"),
    },
    outputSchema: obj({
      status: enumStr(["in_transit", "delivered", "delayed", "exception"]),
      etaDays: num(),
      lastUpdate: str(),
    }),
    sampleOutput: { status: "in_transit", etaDays: 3, lastUpdate: "2026-05-24T11:00:00Z" },
  }),

  // Condition: delivery delayed?
  {
    id: "s19",
    kind: "condition",
    title: "IF Delivery Delayed",
    subtitle: "Check if delivery is late",
    depth: 2,
    branch: "yes",
    inputSchema: obj({}),
    inputs: {},
    condition: {
      left: ref("s18", "status"),
      operator: "eq",
      right: lit("delayed"),
    },
    outputSchema: conditionOutputSchema,
    sampleOutput: { matched: false, branch: "no" },
  },

  action({
    id: "s20",
    title: "Notify Customer",
    subtitle: "Alert customer of delay",
    app: "gmail",
    operation: "send_email",
    depth: 3,
    branch: "yes",
    inputSchema: obj({ to: str(), subject: str(), body: str() }),
    inputs: {
      to: ref("s1", "customer", "email"),
      subject: tmpl("Update on order ", r("s1", "orderNumber")),
      body: tmpl(
        "Hi ",
        r("s1", "customer", "firstName"),
        ", your order is delayed. New ETA: ",
        r("s18", "etaDays"),
        " days.",
      ),
    },
    outputSchema: obj({ messageId: str(), accepted: bool() }),
    sampleOutput: { messageId: "msg_delay_1042", accepted: true },
  }),

  // NO branch (of s8 — stock NOT available)
  action({
    id: "s21",
    title: "Check Alternative Warehouse",
    subtitle: "Search other locations",
    app: "warehouse",
    operation: "find_alternates",
    depth: 2,
    branch: "no",
    inputSchema: obj({ shortfalls: arr(obj({ sku: str(), needed: num() })) }),
    inputs: { shortfalls: ref("s7", "shortfalls") },
    outputSchema: obj({
      alternates: arr(obj({ warehouseId: str(), sku: str(), available: num() })),
    }),
    sampleOutput: { alternates: [] },
  }),

  // Condition: available elsewhere?
  {
    id: "s22",
    kind: "condition",
    title: "IF Available Elsewhere",
    subtitle: "Check alternate warehouse stock",
    depth: 2,
    branch: "no",
    inputSchema: obj({}),
    inputs: {},
    condition: {
      left: ref("s21", "alternates"),
      operator: "exists",
      right: lit(true),
    },
    outputSchema: conditionOutputSchema,
    sampleOutput: { matched: false, branch: "no" },
  },

  action({
    id: "s23",
    title: "Split Shipment",
    subtitle: "Ship from multiple warehouses",
    app: "shopify",
    operation: "split_shipment",
    depth: 3,
    branch: "yes",
    inputSchema: obj({
      orderId: str(),
      alternates: arr(obj({ warehouseId: str(), sku: str() })),
    }),
    inputs: {
      orderId: ref("s1", "orderId"),
      alternates: ref("s21", "alternates"),
    },
    outputSchema: obj({ shipmentIds: arr(str()) }),
    sampleOutput: { shipmentIds: ["ship_a1", "ship_a2"] },
  }),

  action({
    id: "s24",
    title: "Send Out-of-Stock Email",
    subtitle: "Notify customer of stock issue",
    app: "gmail",
    operation: "send_email",
    depth: 3,
    branch: "no",
    inputSchema: obj({ to: str(), subject: str(), body: str() }),
    inputs: {
      to: ref("s1", "customer", "email"),
      subject: tmpl("Issue with order ", r("s1", "orderNumber")),
      body: lit("Some items in your order are temporarily out of stock. We'll be in touch with options."),
    },
    outputSchema: obj({ messageId: str(), accepted: bool() }),
    sampleOutput: { messageId: "msg_oos_1042", accepted: true },
  }),

  action({
    id: "s25",
    title: "Offer Refund OR Waitlist",
    subtitle: "Customer recovery options",
    app: "crm",
    operation: "create_case",
    depth: 3,
    branch: "no",
    inputSchema: obj({
      contactEmail: str(),
      orderId: str(),
      options: arr(str()),
    }),
    inputs: {
      contactEmail: ref("s1", "customer", "email"),
      orderId: ref("s1", "orderId"),
      options: lit(["refund", "waitlist"]),
    },
    outputSchema: obj({ caseId: str() }),
    sampleOutput: { caseId: "case_5599" },
  }),

  action({
    id: "s26",
    title: "Notify Procurement Team",
    subtitle: "Alert team to restock",
    app: "slack",
    operation: "send_message",
    depth: 3,
    branch: "no",
    inputSchema: obj({ channel: str("#procurement"), text: str() }),
    inputs: {
      channel: lit("#procurement"),
      text: tmpl(
        "🛑 Restock needed — shortfalls on order ",
        r("s1", "orderNumber"),
      ),
    },
    outputSchema: obj({ ok: bool(), ts: str() }),
    sampleOutput: { ok: true, ts: "1716545720.000300" },
  }),
];

// ============================================================
// Public registry
// ============================================================

export const EXAMPLE_WORKFLOWS: ExampleWorkflow[] = [
  {
    id: "sheets",
    label: "Google Sheets → Slack",
    prompt: "When a new row is added to Google Sheets, send a Slack notification",
    steps: SHEETS_STEPS,
  },
  {
    id: "notion",
    label: "Daily email summary in Notion",
    prompt: "Every morning at 9am, fetch unread emails and create a summary in Notion",
    steps: NOTION_STEPS,
  },
  {
    id: "airtable",
    label: "Form → Airtable",
    prompt: "When a form is submitted, validate the data and add it to Airtable",
    steps: AIRTABLE_STEPS,
  },
  {
    id: "shopify",
    label: "New Shopify Order",
    prompt:
      "When a new Shopify order arrives, validate payment, check fraud with AI, and fulfill or hold the order based on inventory",
    steps: SHOPIFY_ORDER_STEPS,
  },
];

export function resolveWorkflow(prompt: string): FlowStep[] {
  const match = EXAMPLE_WORKFLOWS.find((w) => w.prompt === prompt);
  return match?.steps ?? SHEETS_STEPS;
}

export function resolveFlowName(prompt: string): string {
  const match = EXAMPLE_WORKFLOWS.find((w) => w.prompt === prompt);
  return match?.label ?? prompt;
}

export const DEFAULT_STEPS = SHEETS_STEPS;
