"use client";

import { useState } from "react";

/* Configuration mini-app rendered in Version 4's right panel.
   Four tabs: Home (overview), Destinations, Notification Content, Airtable Logging. */

const LOGO = {
  sheets: "https://stuff.thingsofbrand.com/google.com/images/img4_googlesheet.png",
  slack: "https://stuff.thingsofbrand.com/slack.com/images/img668216333e_slack.jpg",
  gmail: "https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png",
  airtable:
    "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%3E%3Crect%20x='3'%20y='3'%20width='8'%20height='8'%20rx='1.5'%20fill='%23FCB400'/%3E%3Crect%20x='13'%20y='3'%20width='8'%20height='8'%20rx='1.5'%20fill='%2318BFFF'/%3E%3Crect%20x='3'%20y='13'%20width='18'%20height='8'%20rx='1.5'%20fill='%23F82B60'/%3E%3C/svg%3E",
};

type Tab = "home" | "destinations" | "destinations2" | "content1" | "content2" | "airtable" | "tablerows";

const TABS: { id: Tab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "destinations", label: "Destinations" },
  { id: "destinations2", label: "Destinations 2" },
  { id: "content1", label: "Notification Content 1" },
  { id: "content2", label: "Notification Content 2" },
  { id: "airtable", label: "Airtable Logging" },
  { id: "tablerows", label: "Get Table Rows" },
];

function Logo({ src }: { src: string }) {
  return <img src={src} alt="" className="size-5 shrink-0 object-contain" />;
}

const DragHandle = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-slate-400 shrink-0">
    <line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="16" x2="20" y2="16" />
  </svg>
);

const Pencil = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);
const CheckMark = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6L9 17l-5-5" /></svg>
);
const XMark = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6L6 18M6 6l12 12" /></svg>
);

/* A value that reveals a pencil on row hover and turns into an editable
   input (single-line) or textarea (multiline). Clicking the pencil OR the
   value text enters edit mode. `truncate` keeps the display to one line. */
function EditableValue({ initial, multiline = false, truncate = false }: { initial: string; multiline?: boolean; truncate?: boolean }) {
  const [value, setValue] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initial);

  const save = () => {
    setValue(draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };
  const startEdit = () => {
    setDraft(value);
    setEditing(true);
  };

  if (editing) {
    return (
      <div className="flex flex-1 items-start gap-2">
        {multiline ? (
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && cancel()}
            rows={4}
            className="flex-1 resize-y rounded-md border border-violet-300 px-2.5 py-1.5 text-sm outline-none focus:border-violet-500"
          />
        ) : (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                save();
              }
              if (e.key === "Escape") cancel();
            }}
            className="flex-1 rounded-md border border-violet-300 px-2.5 py-1 text-sm outline-none focus:border-violet-500"
          />
        )}
        <button onClick={save} title="Save" className="mt-0.5 text-emerald-600 hover:text-emerald-700"><CheckMark /></button>
        <button onClick={cancel} title="Cancel" className="mt-0.5 text-slate-400 hover:text-slate-600"><XMark /></button>
      </div>
    );
  }

  return (
    <span className="flex min-w-0 flex-1 items-start gap-2 text-sm text-slate-600">
      <span
        onClick={startEdit}
        title="Click to edit"
        className={`min-w-0 cursor-text rounded hover:bg-slate-50 ${truncate ? "flex-1 truncate" : "break-words"}`}
      >
        {value}
      </span>
      <button
        onClick={startEdit}
        title="Edit"
        className="shrink-0 text-slate-400 opacity-0 transition-opacity hover:text-violet-600 group-hover:opacity-100"
      >
        <Pencil />
      </button>
    </span>
  );
}

export function MiniAppConfig() {
  const [tab, setTab] = useState<Tab>("home");
  const [testOpen, setTestOpen] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f5f5f5] p-6 text-slate-900">
      <div className="flex w-full max-w-[1000px] overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Sub-nav */}
        <nav className="w-64 shrink-0 border-r border-slate-200 p-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                tab === t.id ? "bg-slate-100 font-medium text-slate-900" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{t.label}</span>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-slate-400">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "home" && <HomeTab onOpenTest={() => setTestOpen(true)} />}
          {tab === "destinations" && <DestinationsTab variant="inline" />}
          {tab === "destinations2" && <DestinationsTab variant="stacked" />}
          {tab === "content1" && <ContentTab variant="inline" />}
          {tab === "content2" && <ContentTab variant="stacked" />}
          {tab === "airtable" && <AirtableTab />}
          {tab === "tablerows" && <GetTableRowsTab />}
        </div>
      </div>

      {testOpen && <TestFlowPanel onClose={() => setTestOpen(false)} />}
    </div>
  );
}

function HomeTab({ onOpenTest }: { onOpenTest?: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
          <Logo src={LOGO.sheets} />
        </span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        <Logo src={LOGO.airtable} />
        <Logo src={LOGO.gmail} />
        <Logo src={LOGO.slack} />
      </div>

      {/* Webhook URL + copy / run icons */}
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
        <button
          type="button"
          onClick={onOpenTest}
          className="flex-1 truncate text-left font-mono text-xs text-slate-700 hover:text-slate-900"
        >
          https://flow.sokt.io/func/scripQGnrZSF
        </button>
        <button
          type="button"
          aria-label="Copy webhook URL"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard?.writeText("https://flow.sokt.io/func/scripQGnrZSF");
          }}
          className="flex size-7 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Run webhook"
          onClick={onOpenTest}
          className="flex size-7 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      <h2 className="mt-4 text-xl font-semibold">Google Sheets lead alerts to Slack, Gmail, and Airtable</h2>
      <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
        <li>Trigger when a row is added or updated in Google Sheets.</li>
        <li>Read the lead details from the sheet.</li>
        <li>Send a Slack notification to the selected channel.</li>
        <li>Send an email notification to <b>ashish@walkover.in</b>.</li>
        <li>Create a generic Airtable record in the selected table.</li>
      </ol>
      <p className="mt-4 text-sm text-slate-600">
        <b>Note:</b> The current Airtable table does not contain dedicated columns for name, phone, email, or row number, so the Airtable step stores a generic record rather than full structured lead data.
      </p>
    </div>
  );
}

/* A "Using Connection *" row. Inline: label left, connection box right.
   Stacked: label on top, connection box below. */
function ConnectionRow({ label, chipLogo, chipValue, variant }: { label: string; chipLogo: string; chipValue: string; variant: "inline" | "stacked" }) {
  const box = (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
      <span className="text-sm text-slate-400">Using Connection <span className="text-red-400">*</span></span>
      <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
        <img src={chipLogo} alt="" className="size-4 object-contain" />
        {chipValue}
      </span>
      <span className="text-xs font-medium tracking-wide text-slate-300">ADD TITLE</span>
    </div>
  );
  if (variant === "stacked") {
    return (
      <div className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Logo src={chipLogo} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="mt-1.5 pl-6">{box}</div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4 px-4 py-4">
      <div className="flex w-40 shrink-0 items-center gap-2">
        <Logo src={chipLogo} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex-1">{box}</div>
    </div>
  );
}

/* A simple label / editable-value row, inline or stacked. */
function ValueRow({ logo, label, value, variant }: { logo: string; label: string; value: string; variant: "inline" | "stacked" }) {
  if (variant === "stacked") {
    return (
      <div className="group px-4 py-4">
        <div className="flex items-center gap-2">
          <Logo src={logo} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="mt-1.5 pl-6">
          <EditableValue initial={value} />
        </div>
      </div>
    );
  }
  return (
    <div className="group flex items-center gap-4 px-4 py-4">
      <div className="flex w-40 shrink-0 items-center gap-2">
        <Logo src={logo} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <EditableValue initial={value} />
    </div>
  );
}

function DestinationsTab({ variant }: { variant: "inline" | "stacked" }) {
  return (
    <div>
      <h2 className="text-xl font-semibold">Destinations {variant === "stacked" ? "2" : ""}</h2>
      <p className="mt-1 text-sm text-slate-500">Choose who receives notifications and where alerts are logged.</p>
      <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
        <ConnectionRow label="Slack Workspace" chipLogo={LOGO.slack} chipValue="flow-viasocket" variant={variant} />
        <ConnectionRow label="Gmail Account" chipLogo={LOGO.gmail} chipValue="ashish@walkover.in" variant={variant} />
        <ConnectionRow label="Airtable Account" chipLogo={LOGO.airtable} chipValue="ashish@walkover.in" variant={variant} />
        <ValueRow logo={LOGO.slack} label="Slack Channel" value="flow-test" variant={variant} />
        <ValueRow logo={LOGO.gmail} label="Email Recipient" value="ashish@walkover.in" variant={variant} />
      </div>
    </div>
  );
}

/* Template row — two layout approaches:
   - inline:  label and value on a single line (value truncated)
   - stacked: label on top, value below the heading */
function TemplateRow({ label, value, variant }: { label: string; value: string; variant: "inline" | "stacked" }) {
  if (variant === "stacked") {
    return (
      <div className="group px-4 py-4">
        <div className="flex items-center gap-2">
          <DragHandle />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="mt-1.5 pl-6">
          <EditableValue initial={value} multiline />
        </div>
      </div>
    );
  }
  return (
    <div className="group flex items-center gap-3 px-4 py-4">
      <DragHandle />
      <span className="w-44 shrink-0 text-sm font-medium">{label}</span>
      <EditableValue initial={value} multiline truncate />
    </div>
  );
}

const TEMPLATE_ROWS = [
  {
    label: "Slack Message Template",
    value: "*New lead added in Google Sheets* *Name:* ${name} *Number:* ${number} *Email:* ${email} *Row:* ${row_number}",
  },
  { label: "Email Subject", value: "New Lead Notification from Google Sheets" },
  {
    label: "Email Body Template",
    value: "<p>A new lead has been added or updated in Google Sheets.</p><p><b>Name:</b> ${name}<br/><b>Phone:</b> ${number}<br/><b>Email:</b> ${email}<br/><b>Row:</b> ${row_number}</p><p>Change type: ${change_type}</p>",
  },
];

function ContentTab({ variant }: { variant: "inline" | "stacked" }) {
  return (
    <div>
      <h2 className="text-xl font-semibold">
        Notification Content {variant === "inline" ? "1" : "2"}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {variant === "inline"
          ? "Single-line view — each template shows its value on one line."
          : "Stacked view — each value appears below its heading."}
      </p>
      <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
        {TEMPLATE_ROWS.map((r) => (
          <TemplateRow key={r.label} label={r.label} value={r.value} variant={variant} />
        ))}
      </div>
    </div>
  );
}

function AirtableTab() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Airtable Logging</h2>
      <p className="mt-1 text-sm text-slate-500">Configure where the new lead alert should be logged in Airtable.</p>
      <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
        <ValueRow logo={LOGO.airtable} label="Airtable Base" value="Untitled App" variant="inline" />
        <div className="group flex items-center gap-4 px-4 py-4">
          <div className="flex w-40 shrink-0 items-center gap-2">
            <DragHandle />
            <span className="text-sm font-medium">Airtable Table</span>
          </div>
          <EditableValue initial="Emplooyee" />
        </div>
      </div>
    </div>
  );
}

/* ── Get Table Rows — a spreadsheet-style grid of the rows fetched from the
   source table, mirroring the DBdash / Airtable data view. ── */
type ColType = "text" | "number" | "date" | "select";

const ColTypeIcon = ({ type }: { type: ColType }) => {
  const common = { viewBox: "0 0 24 24", width: 13, height: 13, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "shrink-0 text-slate-400" };
  if (type === "number") return (<svg {...common}><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></svg>);
  if (type === "date") return (<svg {...common}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>);
  if (type === "select") return (<svg {...common}><polyline points="6 9 12 15 18 9" /></svg>);
  return (<svg {...common}><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg>);
};

const TABLE_COLS: { key: string; label: string; type: ColType; w: number }[] = [
  { key: "name", label: "Name", type: "text", w: 150 },
  { key: "phone", label: "Phone", type: "number", w: 140 },
  { key: "email", label: "Email", type: "text", w: 200 },
  { key: "row", label: "Row", type: "number", w: 64 },
  { key: "change", label: "Change Type", type: "select", w: 120 },
  { key: "status", label: "Status", type: "select", w: 120 },
  { key: "created", label: "Created At", type: "date", w: 140 },
];

type Row = { name: string; phone: string; email: string; row: number; change: "added" | "updated"; status: "Notified" | "Pending" | "Failed"; created: string };
const TABLE_ROWS: Row[] = [
  { name: "Priya Sharma", phone: "+91 98765 43210", email: "priya@acme.com", row: 2, change: "added", status: "Notified", created: "2m ago" },
  { name: "Marcus Lee", phone: "+1 415 555 0132", email: "marcus@brightlabs.io", row: 3, change: "added", status: "Notified", created: "8m ago" },
  { name: "Aïsha Karim", phone: "+44 7700 900432", email: "aisha.k@northwind.co", row: 4, change: "updated", status: "Pending", created: "21m ago" },
  { name: "Diego Fernández", phone: "+34 612 345 678", email: "diego@ventura.es", row: 5, change: "added", status: "Failed", created: "44m ago" },
  { name: "Sana Gupta", phone: "+91 90123 45678", email: "sana@leadflow.in", row: 6, change: "added", status: "Notified", created: "1h ago" },
  { name: "Tom Becker", phone: "+49 151 23456789", email: "tom.becker@kmail.de", row: 7, change: "updated", status: "Notified", created: "2h ago" },
  { name: "Lena Novak", phone: "+420 601 234 567", email: "lena@novaktech.cz", row: 8, change: "added", status: "Pending", created: "3h ago" },
];

const STATUS_STYLE: Record<Row["status"], string> = {
  Notified: "border-emerald-200 text-emerald-700",
  Pending: "border-amber-200 text-amber-700",
  Failed: "border-red-200 text-red-700",
};

function GetTableRowsTab() {
  const [sub, setSub] = useState<"config" | "table">("config");
  return (
    <div>
      <div className="flex items-center gap-2">
        <Logo src={LOGO.sheets} />
        <h2 className="text-xl font-semibold">Get Table Rows</h2>
      </div>

      {/* Sub-tabs: Configuration / Table */}
      <div className="mt-4 inline-flex gap-1 rounded-lg bg-slate-100 p-1">
        {([
          { id: "config", label: "Configuration" },
          { id: "table", label: "Table" },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setSub(t.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              sub === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">{sub === "config" ? <RowsConfig /> : <RowsTable />}</div>
    </div>
  );
}

function RowsConfig() {
  return (
    <div>
      <p className="text-sm text-slate-500">Configure which rows to fetch from the source sheet.</p>
      <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
        <ConnectionRow label="Google Account" chipLogo={LOGO.sheets} chipValue="ashish@walkover.in" variant="inline" />
        <ValueRow logo={LOGO.sheets} label="Spreadsheet" value="Leads 2026" variant="inline" />
        <ValueRow logo={LOGO.sheets} label="Worksheet" value="Sheet1" variant="inline" />
        <ValueRow logo={LOGO.sheets} label="Range" value="A1:G" variant="inline" />
        <ValueRow logo={LOGO.sheets} label="Max Rows" value="100" variant="inline" />
      </div>
    </div>
  );
}

function RowsTable() {
  const totalW = TABLE_COLS.reduce((a, c) => a + c.w, 0) + 48; // + row-number gutter
  return (
    <div>
      <p className="text-sm text-slate-500">
        Rows returned from the source sheet. {TABLE_ROWS.length} rows fetched.
      </p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <div style={{ minWidth: totalW }}>
          {/* Header */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-sm font-medium text-slate-700">
            <div className="flex w-12 shrink-0 items-center justify-center border-r border-slate-200 py-2 text-xs text-slate-400">#</div>
            {TABLE_COLS.map((c) => (
              <div key={c.key} className="flex shrink-0 items-center gap-1.5 border-r border-slate-200 px-3 py-2 last:border-r-0" style={{ width: c.w }}>
                <ColTypeIcon type={c.type} />
                <span className="truncate">{c.label}</span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {TABLE_ROWS.map((r, i) => (
            <div key={r.row} className="flex border-b border-slate-100 text-sm text-slate-700 last:border-b-0 hover:bg-slate-50">
              <div className="flex w-12 shrink-0 items-center justify-center border-r border-slate-100 py-2 text-xs text-slate-400">{i + 1}</div>
              <div className="shrink-0 truncate border-r border-slate-100 px-3 py-2 font-medium text-slate-800" style={{ width: TABLE_COLS[0].w }}>{r.name}</div>
              <div className="shrink-0 truncate border-r border-slate-100 px-3 py-2 tabular-nums" style={{ width: TABLE_COLS[1].w }}>{r.phone}</div>
              <div className="shrink-0 truncate border-r border-slate-100 px-3 py-2 text-slate-600" style={{ width: TABLE_COLS[2].w }}>{r.email}</div>
              <div className="shrink-0 border-r border-slate-100 px-3 py-2 tabular-nums text-slate-500" style={{ width: TABLE_COLS[3].w }}>{r.row}</div>
              <div className="shrink-0 border-r border-slate-100 px-3 py-2" style={{ width: TABLE_COLS[4].w }}>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{r.change}</span>
              </div>
              <div className="shrink-0 border-r border-slate-100 px-3 py-2" style={{ width: TABLE_COLS[5].w }}>
                <span className={`rounded-full border bg-white px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[r.status]}`}>{r.status}</span>
              </div>
              <div className="shrink-0 px-3 py-2 text-slate-500" style={{ width: TABLE_COLS[6].w }}>{r.created}</div>
            </div>
          ))}

          {/* New row */}
          <button type="button" className="flex w-full items-center gap-2 border-t border-slate-200 px-3 py-2 text-sm text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New row
          </button>
        </div>
      </div>
    </div>
  );
}

function TestFlowPanel({ onClose }: { onClose: () => void }) {
  const [body, setBody] = useState<"form-data" | "x-www-form-urlencoded" | "json" | "raw">("form-data");

  return (
    <aside className="absolute inset-y-0 right-0 z-30 flex w-[420px] max-w-full flex-col border-l border-slate-200 bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
        <button
          type="button"
          aria-label="Back"
          onClick={onClose}
          className="mt-0.5 text-slate-500 hover:text-slate-900"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">Test Flow</h3>
          <p className="text-sm text-slate-500">Runs your flow with sample data</p>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-900"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {/* Sample Data */}
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold text-slate-900">Sample Data</h4>
          <button type="button" aria-label="Collapse" className="text-slate-400 hover:text-slate-700">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>

        {/* Method + URL */}
        <div className="mt-4 flex items-stretch gap-2">
          <div className="flex items-center gap-1 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-800">
            POST
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          <input
            defaultValue="https://flow.sokt.io/func/scripQGnrZSF"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
          />
        </div>

        {/* Query params */}
        <div className="mt-5 flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-900">Query params</label>
          <button type="button" className="text-xs font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-700">
            Key-value edit
          </button>
        </div>
        <textarea
          rows={3}
          placeholder={"key1:value1\nkey2:value2"}
          className="mt-2 w-full resize-none rounded-md border border-slate-300 px-3 py-2 font-mono text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
        />

        {/* Body */}
        <div className="mt-5">
          <div className="text-sm font-semibold text-slate-900">Body</div>
          <div className="mt-2 grid grid-cols-2 gap-y-2 text-sm text-slate-700">
            {(["form-data", "x-www-form-urlencoded", "json", "raw"] as const).map((b) => (
              <label key={b} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="body"
                  checked={body === b}
                  onChange={() => setBody(b)}
                  className="size-4 accent-blue-600"
                />
                <span>{b}</span>
              </label>
            ))}
          </div>
        </div>

        {/* form-data editor */}
        <div className="mt-5 flex items-center justify-end">
          <button type="button" className="text-xs font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-700">
            Bulk edit
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            placeholder="key 1"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
          />
          <input
            placeholder="value 1"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
          />
          <button
            type="button"
            aria-label="Remove"
            className="text-slate-400 hover:text-slate-700"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
          </button>
        </div>
        <button type="button" className="mt-2 text-xs font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-700">
          Add
        </button>

        {/* Headers */}
        <div className="mt-6 flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-900">Headers</label>
          <button type="button" className="text-xs font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-700">
            Key-value edit
          </button>
        </div>
        <textarea
          rows={3}
          defaultValue={"Content-Type:multipart/form-data"}
          className="mt-2 w-full resize-none rounded-md border border-slate-300 px-3 py-2 font-mono text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
        />

        {/* Response */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
          <h4 className="text-base font-semibold text-slate-900">Response</h4>
          <button type="button" aria-label="Expand" className="text-slate-400 hover:text-slate-700">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-5 py-3">
        <button
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white hover:bg-blue-700"
        >
          Test Flow
        </button>
        <button
          type="button"
          onClick={() => {
            const curl = `curl -X POST 'https://flow.sokt.io/func/scripQGnrZSF' -H 'Content-Type: multipart/form-data'`;
            navigator.clipboard?.writeText(curl);
          }}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-700 transition-colors hover:bg-slate-50"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy cURL
        </button>
      </div>
    </aside>
  );
}
